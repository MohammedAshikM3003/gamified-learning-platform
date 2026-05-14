import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { firestoreService } from '../../services/firestoreService';
import { battleEngine } from '../../game-engine/battleEngine';
import { xpEngine } from '../../game-engine/xpEngine';
import { enemies } from './battleData';
import FighterPlayer from './FighterPlayer';
import FighterEnemy from './FighterEnemy';
import QuestionCard from './QuestionCard';
import ComboSystem from './ComboSystem';
import RewardPopup from './RewardPopup';
import AttackEffects from './AttackEffects';
import DamageText from './DamageText';
import SpecialAbility from './SpecialAbility';
import '../../pages/dashboard.css';

const PLAYER_MAX_HP = 100;

export default function BattleArena({ topic }) {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const enemy = enemies[topic.enemy] || enemies['syntax-phantom'];
  const questions = topic.questions || [];
  const subjectId = topic.subjectId || 'programming';

  // ─── Game State ───────────────────────────────────────────
  const [gamePhase, setGamePhase] = useState('idle');
  const [enemyHp, setEnemyHp] = useState(enemy.health);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [answerLocked, setAnswerLocked] = useState(false);

  // ─── Animation State ──────────────────────────────────────
  const [playerState, setPlayerState] = useState('idle');
  const [enemyState, setEnemyState] = useState('idle');
  const [flashEffect, setFlashEffect] = useState(null);
  const [damageEvents, setDamageEvents] = useState([]);
  const [specialTrigger, setSpecialTrigger] = useState(0);
  const [arenaShake, setArenaShake] = useState(false);

  const damageIdRef = useRef(0);
  const currentQuestion = questions[questionIdx % questions.length];

  // ─── Spawn a floating damage number ───────────────────────
  const spawnDamage = (value, type, side) => {
    const id = ++damageIdRef.current;
    setDamageEvents(prev => [...prev, { id, value, type, side }]);
    setTimeout(() => setDamageEvents(prev => prev.filter(e => e.id !== id)), 1000);
  };

  // ─── Combat Pipeline ──────────────────────────────────────
  const handleAnswer = useCallback(async (isCorrect) => {
    if (answerLocked) return;
    setAnswerLocked(true);

    if (isCorrect) {
      const newCombo = combo + 1;
      const multiplier = xpEngine.getComboMultiplier(newCombo);
      const xpGained = xpEngine.calculateXP(topic.difficulty, multiplier);
      const damage = battleEngine.calculateDamage(topic.difficulty, newCombo);
      const newEnemyHp = Math.max(0, enemyHp - damage);
      const isSpecial = newCombo >= 5;

      // 1. Player attacks
      setPlayerState('attack');
      if (isSpecial) {
        setFlashEffect('special');
        setSpecialTrigger(t => t + 1);
      } else {
        setFlashEffect('player-attack');
      }

      // 2. Enemy takes hit (slight delay for impact feel)
      setTimeout(() => {
        setEnemyState(newEnemyHp <= 0 ? 'dead' : 'damaged');
        spawnDamage(damage, 'damage', 'enemy');
        spawnDamage(xpGained, 'xp', 'player');
      }, 200);

      // 3. Update stats
      setTimeout(() => {
        setCombo(newCombo);
        setMaxCombo(prev => Math.max(prev, newCombo));
        setTotalXp(prev => prev + xpGained);
        setEnemyHp(newEnemyHp);
        setFlashEffect(null);
      }, 300);

      // 4. Reset animation states + advance
      setTimeout(async () => {
        setPlayerState('idle');
        setEnemyState(newEnemyHp <= 0 ? 'dead' : 'idle');

        if (newEnemyHp <= 0) {
          const finalXp = totalXp + xpGained;
          const currentProgression = userProfile?.progression || { xp: 0, level: 1, streak: 0, coins: 0 };
          const newXp = (currentProgression.xp || 0) + finalXp;
          await firestoreService.updateUserStats(user.uid, {
            ...currentProgression,
            xp: newXp,
            level: xpEngine.calculateLevel(newXp),
          });
          setTimeout(() => setGamePhase('victory'), 400);
          return;
        }

        setQuestionIdx(prev => prev + 1);
        setAnswerLocked(false);
      }, 900);

    } else {
      // Wrong answer — enemy attacks player
      const damage = battleEngine.calculatePlayerDamage(topic.difficulty);
      const newPlayerHp = Math.max(0, playerHp - damage);

      // 1. Enemy attacks
      setEnemyState('attack');
      setFlashEffect('enemy-attack');
      setArenaShake(true);
      setTimeout(() => setArenaShake(false), 400);

      // 2. Player takes hit
      setTimeout(() => {
        setPlayerState('damaged');
        spawnDamage(damage, 'damage', 'player');
      }, 200);

      // 3. Update stats
      setTimeout(() => {
        setCombo(0);
        setPlayerHp(newPlayerHp);
        setFlashEffect(null);
      }, 300);

      // 4. Reset + advance
      setTimeout(() => {
        setPlayerState('idle');
        setEnemyState('idle');

        if (newPlayerHp <= 0) {
          setGamePhase('defeat');
          return;
        }

        setQuestionIdx(prev => prev + 1);
        setAnswerLocked(false);
      }, 900);
    }
  }, [answerLocked, combo, enemyHp, playerHp, topic, totalXp, user, userProfile]);

  const handleRetry = () => {
    setGamePhase('idle');
    setEnemyHp(enemy.health);
    setPlayerHp(PLAYER_MAX_HP);
    setCombo(0);
    setMaxCombo(0);
    setTotalXp(0);
    setQuestionIdx(0);
    setPlayerState('idle');
    setEnemyState('idle');
    setAnswerLocked(false);
    setDamageEvents([]);
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
        style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', position: 'relative' }}
      >
        {/* ── FIGHTER STAGE ─────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '16px',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '28px',
          background: 'rgba(10,10,14,0.7)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '200px',
        }}>
          {/* Background scan line effect */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.01) 20px, rgba(255,255,255,0.01) 21px)',
            pointerEvents: 'none',
          }} />

          {/* Player Fighter */}
          <div style={{ zIndex: 2 }}>
            <FighterPlayer
              playerHp={playerHp}
              maxHp={PLAYER_MAX_HP}
              name={userProfile?.fullName?.split(' ')[0] || 'Learner'}
              state={playerState}
              subjectId={subjectId}
            />
          </div>

          {/* VS + Combo Center */}
          <div style={{ textAlign: 'center', zIndex: 2, minWidth: '120px' }}>
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-dim)', margin: '0 0 12px' }}
            >
              VS
            </motion.p>
            <ComboSystem combo={combo} />
          </div>

          {/* Enemy Fighter */}
          <div style={{ zIndex: 2 }}>
            <FighterEnemy enemy={enemy} enemyHp={enemyHp} maxHp={enemy.health} state={enemyState} />
          </div>

          {/* Floating damage texts */}
          {damageEvents.map(e => (
            <DamageText key={e.id} value={e.value} type={e.type} side={e.side} />
          ))}

          {/* Special ability overlay */}
          <SpecialAbility subjectId={subjectId} combo={combo} trigger={specialTrigger} />
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
            Q {(questionIdx % questions.length) + 1} / {questions.length}
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
