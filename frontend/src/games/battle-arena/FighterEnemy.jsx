import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import HealthBar from './HealthBar';

const enemyVariants = {
  idle:    { y: [0, -8, 0], transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } },
  attack:  { x: [0, -70, 0], rotate: [0, -5, 0], filter: ['brightness(1)', 'brightness(2)', 'brightness(1)'], transition: { duration: 0.4, ease: 'easeOut' } },
  damaged: { x: [0, 14, -10, 6, 0], rotate: [0, 3, -3, 2, 0], filter: ['brightness(1)', 'brightness(2.5)', 'brightness(1)'], transition: { duration: 0.35 } },
  dead:    { scale: [1, 1.1, 0], opacity: [1, 1, 0], rotate: [0, -10, 20], y: [0, -10, 60], transition: { duration: 0.7 } },
};

export default function FighterEnemy({ enemy, enemyHp, maxHp, state = 'idle' }) {
  if (!enemy) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      {/* Enemy Visual */}
      <motion.div
        variants={enemyVariants}
        animate={state}
        style={{
          width: '110px',
          height: '110px',
          borderRadius: '50%',
          background: `radial-gradient(circle at 65% 35%, ${enemy.color}60, ${enemy.color}15)`,
          border: `2px solid ${enemy.color}80`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: state === 'damaged'
            ? `0 0 60px ${enemy.color}, 0 0 120px ${enemy.color}50`
            : `0 0 25px ${enemy.color}40`,
          position: 'relative',
        }}
      >
        <Shield size={44} color={enemy.color} />

        {/* Damage cracks on low HP */}
        {enemyHp < maxHp * 0.3 && (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `3px solid ${enemy.color}`,
              boxShadow: `inset 0 0 30px ${enemy.color}40`,
            }}
          />
        )}
      </motion.div>

      {/* Name + HP */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <p style={{ fontSize: '9px', letterSpacing: '2px', color: enemy.color, marginBottom: '2px' }}>
          {enemy.title?.toUpperCase()}
        </p>
        <p style={{ fontSize: '10px', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '8px' }}>
          {enemy.name.toUpperCase()}
        </p>
        <HealthBar current={enemyHp} max={maxHp} color={enemy.color} showNumbers={false} />
        <p style={{ fontSize: '12px', fontWeight: 700, marginTop: '6px', color: enemy.color }}>
          {enemyHp} / {maxHp}
        </p>
      </div>
    </div>
  );
}
