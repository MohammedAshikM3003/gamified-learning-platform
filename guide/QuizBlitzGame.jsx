/**
 * QuizBlitzGame.jsx
 * 
 * Speed-based MCQ game mode for LearnCraft OS
 * Players answer questions as fast as possible
 * Fastest correct answers = highest XP
 * 
 * Routes: /games/quiz-blitz/:topicId
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/UserProgressContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, TrophyFill, ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import { learningData } from '../data/learningData';
import { gameTypeEngine } from '../game-engine/gameTypeEngine';
import { xpEngine } from '../game-engine/xpEngine';
import '../pages/dashboard.css';
import './quiz-blitz/quiz-blitz.css';

export default function QuizBlitzGame() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { completeBattle } = useProgress();

  // ─── Game State ───────────────────────────────────────────
  const [gamePhase, setGamePhase] = useState('setup'); // setup | playing | results
  const [difficulty, setDifficulty] = useState('normal'); // easy | normal | hard
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Difficulty config
  const difficultyConfig = {
    easy: { timePerQ: 5, baseXP: 10, label: 'CASUAL' },
    normal: { timePerQ: 10, baseXP: 20, label: 'NORMAL' },
    hard: { timePerQ: 15, baseXP: 40, label: 'HARD' },
  };

  // ─── Game Progress ────────────────────────────────────────
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timings, setTimings] = useState([]); // track time per question
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);

  // ─── Timer State ──────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState(difficultyConfig[difficulty].timePerQ);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // ─── Load Topic ───────────────────────────────────────────
  useEffect(() => {
    const grade = userProfile?.profile?.grade || 'grade10';
    let foundTopic = null;

    // Search through all subjects and chapters for the topic
    Object.values(learningData[grade]?.subjects || {}).forEach(subject => {
      Object.values(subject.chapters || {}).forEach(chapter => {
        const t = chapter.topics?.find(topic => topic.id === topicId);
        if (t) {
          foundTopic = { ...t, subject: subject.id, grade };
        }
      });
    });

    if (foundTopic) {
      setTopic(foundTopic);
      setQuestions(foundTopic.questions || []);
    }
  }, [topicId, userProfile]);

  // ─── Timer Logic ──────────────────────────────────────────
  useEffect(() => {
    if (gamePhase !== 'playing' || answered) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up — auto-wrong
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase, answered]);

  // ─── Start Game ───────────────────────────────────────────
  const startGame = useCallback(() => {
    setGamePhase('playing');
    setCurrentQ(0);
    setScore(0);
    setTotalXP(0);
    setCorrectAnswers(0);
    setTimings([]);
    setQuestionStartTime(Date.now());
    setTimeLeft(difficultyConfig[difficulty].timePerQ);
  }, [difficulty]);

  // ─── Handle Answer ────────────────────────────────────────
  const handleAnswer = useCallback((selectedOpt) => {
    if (answered) return;

    const isCorrect = selectedOpt === questions[currentQ]?.answer;
    const timeTaken = (Date.now() - questionStartTime) / 1000;

    // Calculate XP based on difficulty and speed
    let xpGained = 0;
    if (isCorrect) {
      const baseXP = difficultyConfig[difficulty].baseXP;
      const speedBonus = timeTaken < 2 ? 1.5 : timeTaken < 5 ? 1.2 : 1.0;
      xpGained = Math.round(baseXP * speedBonus);
      
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + 10); // 10 points per correct
      setTotalXP(prev => prev + xpGained);
    }

    setSelectedAnswer(selectedOpt);
    setAnswered(true);
    setTimings(prev => [...prev, { timeTaken, isCorrect, xpGained }]);

    // Auto-advance after 1 second
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
        setSelectedAnswer(null);
        setAnswered(false);
        setTimeLeft(difficultyConfig[difficulty].timePerQ);
        setQuestionStartTime(Date.now());
      } else {
        // Game complete
        endGame();
      }
    }, 1000);
  }, [currentQ, questions, answered, difficulty, questionStartTime]);

  // ─── Handle Timeout ───────────────────────────────────────
  const handleTimeout = useCallback(() => {
    if (answered) return;

    const timeTaken = (Date.now() - questionStartTime) / 1000;
    setSelectedAnswer('TIMEOUT');
    setAnswered(true);
    setTimings(prev => [...prev, { timeTaken, isCorrect: false, xpGained: 0 }]);

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
        setSelectedAnswer(null);
        setAnswered(false);
        setTimeLeft(difficultyConfig[difficulty].timePerQ);
        setQuestionStartTime(Date.now());
      } else {
        endGame();
      }
    }, 1000);
  }, [currentQ, questions, answered, questionStartTime]);

  // ─── End Game & Save Results ──────────────────────────────
  const endGame = useCallback(async () => {
    const accuracy = correctAnswers / questions.length;
    const avgTime = timings.reduce((acc, t) => acc + t.timeTaken, 0) / timings.length;

    // Calculate final XP with game-type multiplier
    const finalXP = gameTypeEngine.calculateGameXP(
      totalXP,
      'quiz-blitz',
      accuracy,
      difficulty
    );

    // Save to Firestore via completeBattle
    await completeBattle({
      topicId,
      xpGained: finalXP,
      comboMax: 1,
      won: correctAnswers > questions.length / 2, // win if >50% correct
      gameType: 'quiz-blitz',
      metadata: {
        accuracy,
        avgTime,
        difficulty,
        questionsTotal: questions.length,
        correctCount: correctAnswers,
      },
    });

    setGamePhase('results');
  }, [correctAnswers, questions.length, timings, totalXP, difficulty, topicId, completeBattle]);

  // ─── Loading State ────────────────────────────────────────
  if (!topic || questions.length === 0) {
    return (
      <div className="game-container">
        <div className="premium-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <h2 className="section-title">Loading Quiz...</h2>
          <button
            onClick={() => navigate('/subjects')}
            style={{
              marginTop: '20px',
              padding: '12px 32px',
              background: 'var(--primary)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ─── SETUP PHASE (Choose Difficulty) ──────────────────────
  if (gamePhase === 'setup') {
    return (
      <div className="game-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card"
          style={{ maxWidth: '500px', padding: '40px', textAlign: 'center' }}
        >
          <Zap size={48} style={{ color: 'var(--primary)', marginBottom: '20px' }} />
          <h1 className="section-title" style={{ fontSize: '28px', marginBottom: '8px' }}>
            {topic.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Quiz Blitz — Answer {questions.length} questions as fast as possible!
          </p>

          {/* Difficulty Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
            {Object.entries(difficultyConfig).map(([key, config]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDifficulty(key)}
                style={{
                  padding: '16px 12px',
                  borderRadius: '12px',
                  border: `2px solid ${difficulty === key ? 'var(--primary)' : 'var(--border-color)'}`,
                  background: difficulty === key ? 'var(--primary)20' : 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '12px', opacity: 0.7 }}>{config.label}</div>
                <div style={{ fontSize: '13px', marginTop: '4px' }}>{config.timePerQ}s/Q</div>
              </motion.button>
            ))}
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startGame}\n            style={{\n              width: '100%',\n              padding: '16px',\n              background: 'var(--primary)',\n              border: 'none',\n              borderRadius: '12px',\n              color: 'white',\n              fontSize: '16px',\n              fontWeight: 700,\n              cursor: 'pointer',\n              fontFamily: 'Poppins, sans-serif',\n            }}\n          >\n            START QUIZ\n          </motion.button>\n\n          {/* Back Button */}\n          <button\n            onClick={() => navigate(-1)}\n            style={{\n              marginTop: '12px',\n              background: 'none',\n              border: 'none',\n              color: 'var(--text-secondary)',\n              cursor: 'pointer',\n              fontFamily: 'Poppins, sans-serif',\n              fontSize: '14px',\n            }}\n          >\n            ← Cancel\n          </button>\n        </motion.div>\n      </div>\n    );\n  }\n\n  // ─── PLAYING PHASE ────────────────────────────────────────\n  if (gamePhase === 'playing') {\n    const question = questions[currentQ];\n    const timePercent = (timeLeft / difficultyConfig[difficulty].timePerQ) * 100;\n\n    return (\n      <div className=\"game-container\">\n        {/* HUD */}\n        <div className=\"quiz-blitz-hud\">\n          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>\n            <button\n              onClick={() => navigate(-1)}\n              style={{\n                background: 'var(--overlay-10)',\n                border: 'none',\n                borderRadius: '8px',\n                padding: '8px 12px',\n                color: 'white',\n                cursor: 'pointer',\n              }}\n            >\n              <ChevronLeft size={20} />\n            </button>\n            <div>\n              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>QUIZ BLITZ</div>\n              <div style={{ fontSize: '14px', fontWeight: 700 }}>{topic.title}</div>\n            </div>\n          </div>\n\n          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>\n            {/* Accuracy */}\n            <div style={{ textAlign: 'center' }}>\n              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Accuracy</div>\n              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>\n                {Math.round((correctAnswers / (currentQ + 1)) * 100)}%\n              </div>\n            </div>\n\n            {/* Score */}\n            <div style={{ textAlign: 'center' }}>\n              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Score</div>\n              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--secondary)' }}>\n                {score}\n              </div>\n            </div>\n\n            {/* Progress */}\n            <div style={{ textAlign: 'center' }}>\n              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Progress</div>\n              <div style={{ fontSize: '18px', fontWeight: 700 }}>\n                {currentQ + 1}/{questions.length}\n              </div>\n            </div>\n          </div>\n        </div>\n\n        {/* Main Question Card */}\n        <motion.div\n          key={currentQ}\n          initial={{ opacity: 0, scale: 0.95 }}\n          animate={{ opacity: 1, scale: 1 }}\n          exit={{ opacity: 0, scale: 0.95 }}\n          className=\"quiz-blitz-question-card\"\n        >\n          {/* Timer Bar */}\n          <div style={{ marginBottom: '24px' }}>\n            <motion.div\n              className=\"quiz-blitz-timer-bar\"\n              animate={{\n                backgroundColor: timeLeft > 5 ? 'var(--primary)' : 'var(--error)',\n              }}\n              style={{ width: `${timePercent}%` }}\n            />\n            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>\n              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>TIME</span>\n              <span\n                style={{\n                  fontSize: '16px',\n                  fontWeight: 700,\n                  color: timeLeft > 5 ? 'var(--primary)' : 'var(--error)',\n                }}\n              >\n                {timeLeft}s\n              </span>\n            </div>\n          </div>\n\n          {/* Question */}\n          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', lineHeight: 1.4 }}>\n            {question.question}\n          </h3>\n\n          {/* Options Grid */}\n          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>\n            {question.options.map((option, idx) => {\n              const isSelected = selectedAnswer === option;\n              const isCorrect = option === question.answer;\n              const wasAnswered = answered && isSelected;\n              const showCorrect = answered && isCorrect && selectedAnswer !== 'TIMEOUT';\n\n              let bgColor = 'var(--overlay-10)';\n              let borderColor = 'var(--border-color)';\n\n              if (wasAnswered && isCorrect) {\n                bgColor = 'var(--success)20';\n                borderColor = 'var(--success)';\n              } else if (wasAnswered && !isCorrect) {\n                bgColor = 'var(--error)20';\n                borderColor = 'var(--error)';\n              } else if (showCorrect) {\n                bgColor = 'var(--success)15';\n                borderColor = 'var(--success)';\n              }\n\n              return (\n                <motion.button\n                  key={idx}\n                  whileHover={!answered ? { scale: 1.02 } : {}}\n                  whileTap={!answered ? { scale: 0.98 } : {}}\n                  onClick={() => handleAnswer(option)}\n                  disabled={answered}\n                  style={{\n                    padding: '16px',\n                    borderRadius: '12px',\n                    background: bgColor,\n                    border: `1px solid ${borderColor}`,\n                    color: 'white',\n                    cursor: answered ? 'default' : 'pointer',\n                    fontSize: '14px',\n                    fontWeight: 600,\n                    fontFamily: 'Poppins, sans-serif',\n                    display: 'flex',\n                    alignItems: 'center',\n                    gap: '8px',\n                    transition: 'all 0.2s ease',\n                  }}\n                >\n                  <span style={{\n                    width: '24px',\n                    height: '24px',\n                    borderRadius: '50%',\n                    background: 'rgba(255,255,255,0.1)',\n                    display: 'flex',\n                    alignItems: 'center',\n                    justifyContent: 'center',\n                    fontSize: '12px',\n                    fontWeight: 700,\n                  }}>\n                    {['A', 'B', 'C', 'D'][idx]}\n                  </span>\n                  <span style={{ flex: 1, textAlign: 'left' }}>{option}</span>\n                  {wasAnswered && isCorrect && <CheckCircle size={16} />}\n                  {wasAnswered && !isCorrect && <XCircle size={16} />}\n                </motion.button>\n              );\n            })}\n          </div>\n\n          {/* Explanation */}\n          <AnimatePresence>\n            {answered && question.explanation && (\n              <motion.div\n                initial={{ opacity: 0, height: 0 }}\n                animate={{ opacity: 1, height: 'auto' }}\n                exit={{ opacity: 0, height: 0 }}\n                style={{\n                  marginTop: '16px',\n                  padding: '12px 16px',\n                  background: 'var(--overlay-10)',\n                  borderRadius: '8px',\n                  fontSize: '13px',\n                  color: 'var(--text-secondary)',\n                  borderLeft: `3px solid var(--primary)`,\n                }}\n              >\n                <strong>Why:</strong> {question.explanation}\n              </motion.div>\n            )}\n          </AnimatePresence>\n        </motion.div>\n      </div>\n    );\n  }\n\n  // ─── RESULTS PHASE ────────────────────────────────────────\n  if (gamePhase === 'results') {\n    const accuracy = (correctAnswers / questions.length * 100).toFixed(1);\n    const avgTime = (timings.reduce((acc, t) => acc + t.timeTaken, 0) / timings.length).toFixed(1);\n    const finalXP = totalXP;\n\n    return (\n      <div className=\"game-container\">\n        <motion.div\n          initial={{ scale: 0.8, opacity: 0 }}\n          animate={{ scale: 1, opacity: 1 }}\n          className=\"premium-card\"\n          style={{ maxWidth: '500px', padding: '40px', textAlign: 'center' }}\n        >\n          {correctAnswers > questions.length / 2 ? (\n            <>\n              <TrophyFill size={48} style={{ color: 'var(--secondary)', marginBottom: '20px' }} />\n              <h1 className=\"section-title\" style={{ color: 'var(--secondary)', marginBottom: '8px' }}>\n                GREAT JOB!\n              </h1>\n            </>\n          ) : (\n            <>\n              <Zap size={48} style={{ color: 'var(--text-dim)', marginBottom: '20px' }} />\n              <h1 className=\"section-title\" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>\n                TRY AGAIN\n              </h1>\n            </>\n          )}\n\n          {/* Stats Grid */}\n          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '32px 0' }}>\n            <div className=\"premium-card\" style={{ padding: '20px', background: 'var(--overlay-10)' }}>\n              <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '6px' }}>ACCURACY</div>\n              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>{accuracy}%</div>\n            </div>\n            <div className=\"premium-card\" style={{ padding: '20px', background: 'var(--overlay-10)' }}>\n              <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '6px' }}>AVG TIME</div>\n              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>{avgTime}s</div>\n            </div>\n            <div className=\"premium-card\" style={{ padding: '20px', background: 'var(--overlay-10)' }}>\n              <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '6px' }}>SCORE</div>\n              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>{score}</div>\n            </div>\n            <div className=\"premium-card\" style={{ padding: '20px', background: 'var(--overlay-10)' }}>\n              <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '6px' }}>XP EARNED</div>\n              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--secondary)' }}>{finalXP}</div>\n            </div>\n          </div>\n\n          {/* Breakdown */}\n          <div style={{\n            padding: '16px',\n            background: 'var(--overlay-10)',\n            borderRadius: '8px',\n            marginBottom: '24px',\n            fontSize: '13px',\n            color: 'var(--text-secondary)',\n          }}>\n            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>\n              <span>Correct Answers</span>\n              <strong>{correctAnswers}/{questions.length}</strong>\n            </div>\n            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>\n              <span>Difficulty</span>\n              <strong>{difficultyConfig[difficulty].label}</strong>\n            </div>\n            <div style={{ display: 'flex', justifyContent: 'space-between' }}>\n              <span>Total Time</span>\n              <strong>{(timings.reduce((acc, t) => acc + t.timeTaken, 0)).toFixed(1)}s</strong>\n            </div>\n          </div>\n\n          {/* Action Buttons */}\n          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>\n            <motion.button\n              whileHover={{ scale: 1.05 }}\n              whileTap={{ scale: 0.95 }}\n              onClick={startGame}\n              style={{\n                padding: '12px',\n                background: 'var(--primary)',\n                border: 'none',\n                borderRadius: '8px',\n                color: 'white',\n                cursor: 'pointer',\n                fontFamily: 'Poppins, sans-serif',\n                fontWeight: 700,\n              }}\n            >\n              RETRY\n            </motion.button>\n            <motion.button\n              whileHover={{ scale: 1.05 }}\n              whileTap={{ scale: 0.95 }}\n              onClick={() => navigate('/dashboard')}\n              style={{\n                padding: '12px',\n                background: 'var(--overlay-20)',\n                border: '1px solid var(--border-color)',\n                borderRadius: '8px',\n                color: 'white',\n                cursor: 'pointer',\n                fontFamily: 'Poppins, sans-serif',\n                fontWeight: 700,\n              }}\n            >\n              DASHBOARD\n            </motion.button>\n          </div>\n        </motion.div>\n      </div>\n    );\n  }\n}\n