import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Skull, Star, Zap, ArrowRight } from 'lucide-react';

export default function RewardPopup({ result, xpGained, combo, topic, onExit, onRetry }) {
  const isVictory = result === 'victory';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(5,5,5,0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ scale: 0.7, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          background: 'rgba(10, 10, 14, 0.95)',
          border: `1px solid ${isVictory ? 'rgba(226,184,87,0.3)' : 'rgba(239,68,68,0.3)'}`,
          borderRadius: '28px',
          padding: '60px 48px',
          textAlign: 'center',
          maxWidth: '460px',
          width: '90vw',
          boxShadow: isVictory ? '0 0 80px rgba(226,184,87,0.15)' : '0 0 80px rgba(239,68,68,0.15)',
        }}
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: isVictory ? [0, -10, 10, 0] : 0, scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ marginBottom: '24px' }}
        >
          {isVictory
            ? <Trophy size={72} color="var(--secondary)" style={{ filter: 'drop-shadow(0 0 20px #e2b857)' }} />
            : <Skull size={72} color="var(--error)" style={{ filter: 'drop-shadow(0 0 20px #ef4444)' }} />
          }
        </motion.div>

        <p style={{ fontSize: '11px', letterSpacing: '3px', color: isVictory ? 'var(--secondary)' : 'var(--error)', marginBottom: '8px' }}>
          {isVictory ? 'BOSS DEFEATED' : 'SYSTEM FAILURE'}
        </p>
        <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>
          {isVictory ? 'VICTORY!' : 'DEFEATED'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>
          {isVictory
            ? `You mastered "${topic.title}" and defeated the boss!`
            : 'You ran out of HP. Study up and try again!'}
        </p>

        {/* Stats */}
        {isVictory && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <Star size={16} color="var(--secondary)" />
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--secondary)' }}>+{xpGained}</span>
              </div>
              <p style={{ fontSize: '10px', letterSpacing: '1px', color: 'var(--text-dim)', marginTop: '4px' }}>XP EARNED</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <Zap size={16} color="var(--primary)" />
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>{combo}x</span>
              </div>
              <p style={{ fontSize: '10px', letterSpacing: '1px', color: 'var(--text-dim)', marginTop: '4px' }}>MAX COMBO</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {!isVictory && (
            <button
              onClick={onRetry}
              style={{
                padding: '14px 28px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: 'white',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
              }}
            >
              Retry Battle
            </button>
          )}
          <button
            onClick={onExit}
            style={{
              padding: '14px 28px',
              background: isVictory ? 'linear-gradient(135deg, #e2b857, #d97706)' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
            }}
          >
            {isVictory ? 'Continue' : 'Back to Topic'} <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
