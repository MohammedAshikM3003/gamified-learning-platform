import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/UserProgressContext';
import { xpEngine } from '../../game-engine/xpEngine';
import { enemies } from './battleData';
import StreetFighterEmbed from './StreetFighterEmbed';
import QuestionCard from './QuestionCard';
import ComboSystem from './ComboSystem';
import RewardPopup from './RewardPopup';
import AttackEffects from './AttackEffects';
import '../../pages/dashboard.css';

const TURN_SECONDS = 5;
const BACKEND_PORTS = ['8766', '8765'];

export default function BattleArena({ topic }) {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { completeBattle } = useProgress();
  const enemy = enemies[topic.enemy] || enemies['syntax-phantom'];
  const questions = topic.questions || [];
  const subjectId = topic.subjectId || 'programming';

  // ─── Game State ───────────────────────────────────────────
  const [gamePhase, setGamePhase] = useState('idle');
  const [questionIdx, setQuestionIdx] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TURN_SECONDS);

  // ─── Animation State ──────────────────────────────────────
  const [playerState, setPlayerState] = useState('idle');
  const [enemyState, setEnemyState] = useState('idle');
  const [flashEffect, setFlashEffect] = useState(null);
  const [arenaShake, setArenaShake] = useState(false);
  const currentQuestion = questions[questionIdx] || null;
  // ─── Combat Pipeline ──────────────────────────────────────
  const handleAnswer = useCallback(async (isCorrect) => {
    if (answerLocked) return;
    setAnswerLocked(true);
    setTimeLeft(0);
    const isLastQuestion = questionIdx >= questions.length - 1;

    if (isCorrect) {
      const newCombo = combo + 1;
      const multiplier = xpEngine.getComboMultiplier(newCombo);
      const xpGained = xpEngine.calculateXP(topic.difficulty, multiplier);
      const isSpecial = newCombo >= 5;

      // 1. Player attacks
      setPlayerState('attack');
      // Inform external Street Fighter process (if running)
      sendControl('player_attack');
      if (isSpecial) {
        setFlashEffect('special');
      } else {
        setFlashEffect('player-attack');
      }

      // 2. Enemy takes hit (slight delay for impact feel)
      setTimeout(() => {
        setEnemyState('damaged');
      }, 200);

      // 3. Update stats
      setTimeout(() => {
        setCombo(newCombo);
        setMaxCombo(prev => Math.max(prev, newCombo));
        setTotalXp(prev => prev + xpGained);
        setFlashEffect(null);
      }, 300);

      // 4. Reset animation states + advance
      setTimeout(async () => {
        setPlayerState('idle');
        setEnemyState('idle');

        if (isLastQuestion) {
          const finalXp = totalXp + xpGained;
          // ✅ Context handles: XP save, topic unlock, achievement check
          await completeBattle({
            topicId: topic.id,
            xpGained: finalXp,
            comboMax: Math.max(maxCombo, newCombo),
            won: true,
          });
          setTimeout(() => setGamePhase('victory'), 400);
          return;
        }

        setQuestionIdx(prev => prev + 1);
        setAnswerLocked(false);
        setTimeLeft(TURN_SECONDS);
      }, 900);

    } else {
      // Wrong answer — enemy attacks player
      // 1. Enemy attacks
      setEnemyState('attack');
      setFlashEffect('enemy-attack');
      // Inform external Street Fighter process (if running)
      sendControl('enemy_attack');
      setArenaShake(true);
      setTimeout(() => setArenaShake(false), 400);

      // 2. Player takes hit
      setTimeout(() => {
        setPlayerState('damaged');
      }, 200);

      // 3. Update stats
      setTimeout(() => {
        setCombo(0);
        setFlashEffect(null);
      }, 300);

      // 4. Reset + advance
      setTimeout(async () => {
        setPlayerState('idle');
        setEnemyState('idle');

        if (isLastQuestion) {
          const finalXp = totalXp;
          await completeBattle({
            topicId: topic.id,
            xpGained: finalXp,
            comboMax: maxCombo,
            won: true,
          });
          setTimeout(() => setGamePhase('victory'), 400);
          return;
        }

        setQuestionIdx(prev => prev + 1);
        setAnswerLocked(false);
        setTimeLeft(TURN_SECONDS);
      }, 900);
    }
  }, [answerLocked, combo, maxCombo, questionIdx, questions.length, topic, totalXp, completeBattle]);

  React.useEffect(() => {
    if (gamePhase !== 'fighting' || answerLocked) return undefined;

    if (timeLeft <= 0) {
      handleAnswer(false);
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [answerLocked, gamePhase, handleAnswer, timeLeft]);

  // Send control commands to the local Python control server (if available).
  const sendControl = async (cmd) => {
    try {
      for (const port of BACKEND_PORTS) {
        try {
          const res = await fetch(`http://127.0.0.1:${port}/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cmd }),
          });
          if (!res.ok) continue;
          const payload = await res.json();
          if (payload?.ok) return;
        } catch (error) {
          // try the next backend port
        }
      }
    } catch (e) {
      // silent — server may not be running
      // console.debug('control server error', e);
    }
  };

  const handleRetry = () => {
    setGamePhase('idle');
    setCombo(0);
    setMaxCombo(0);
    setTotalXp(0);
    setQuestionIdx(0);
    setPlayerState('idle');
    setEnemyState('idle');
    setAnswerLocked(false);
    setTimeLeft(TURN_SECONDS);
  };

  // ─── PRE-BATTLE SCREEN ────────────────────────────────────
  if (gamePhase === 'idle') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '560px', margin: '0 auto' }}
      >
        <motion.div
          animate={{ y: [0, -12, 0], boxShadow: [`0 0 40px ${enemy.color}30`, `0 0 80px ${enemy.color}60`, `0 0 40px ${enemy.color}30`] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '130px', height: '130px', margin: '0 auto 28px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${enemy.color}40, transparent)`,
            border: `2px solid ${enemy.color}60`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '56px',
          }}
        >
          ⚡
        </motion.div>

        <p style={{ fontSize: '11px', letterSpacing: '3px', color: enemy.color, marginBottom: '8px' }}>
          BOSS ENCOUNTER
        </p>
        <h2 style={{ fontSize: '38px', fontWeight: 900, marginBottom: '6px' }}>{enemy.name}</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{enemy.description}</p>
        <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '40px' }}>
          {topic.title} • {questions.length} Questions • {topic.difficulty.toUpperCase()}
        </p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(139,92,246,0.6)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setGamePhase('fighting')}
          style={{
            padding: '18px 64px', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            border: 'none', borderRadius: '14px', color: 'white', fontSize: '17px',
            fontWeight: 900, cursor: 'pointer', letterSpacing: '2px',
            boxShadow: '0 0 30px rgba(139,92,246,0.4)', fontFamily: 'Poppins, sans-serif',
          }}
        >
          INITIATE BATTLE
        </motion.button>
      </motion.div>
    );
  }

  // ─── COMBAT ARENA ─────────────────────────────────────────
  return (
    <>
      {/* Screen flash overlay */}
      <AnimatePresence>{flashEffect && <AttackEffects key={flashEffect + Date.now()} type={flashEffect} />}</AnimatePresence>

      <motion.div
        animate={arenaShake ? { x: [-6, 6, -5, 5, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px', position: 'relative' }}
      >
        {/* ── FIGHTER STAGE ─────────────────────────────── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          alignItems: 'stretch',
          marginBottom: '24px',
          padding: '20px',
          background: 'rgba(10,10,14,0.68)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(18px)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '560px',
        }}>
          <div style={{ textAlign: 'center', zIndex: 2, width: '100%', flex: 1 }}>
            <StreetFighterEmbed />
            <div style={{ marginTop: '10px' }}>
              <ComboSystem combo={combo} />
            </div>
          </div>
        </div>

        {/* ── QUESTION CARD ─────────────────────────────── */}
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={questionIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                disabled={answerLocked}
                timeLeft={timeLeft}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: i < questionIdx % questions.length + 1
                  ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '8px', letterSpacing: '1px' }}>
            Q {Math.min(questionIdx + 1, questions.length)} / {questions.length}
          </p>
        </div>
      </motion.div>

      {/* Victory / Defeat */}
      <AnimatePresence>
        {(gamePhase === 'victory' || gamePhase === 'defeat') && (
          <RewardPopup
            result={gamePhase}
            xpGained={totalXp}
            combo={maxCombo}
            topic={topic}
            onExit={() => navigate(-1)}
            onRetry={handleRetry}
          />
        )}
      </AnimatePresence>
    </>
  );
}
