import React from 'react';
import { motion } from 'framer-motion';
import { User, Zap } from 'lucide-react';
import HealthBar from './HealthBar';

// Combat state animation variants
const playerVariants = {
  idle:    { x: 0, rotate: 0, filter: 'brightness(1)' },
  attack:  { x: [0, 70, 0], rotate: [0, 5, 0], filter: ['brightness(1)', 'brightness(1.8)', 'brightness(1)'], transition: { duration: 0.4, ease: 'easeOut' } },
  damaged: { x: [0, -15, 10, -8, 0], rotate: [0, -3, 3, -2, 0], filter: ['brightness(1)', 'brightness(2)', 'brightness(1)'], transition: { duration: 0.4 } },
  victory: { y: [0, -20, 0], rotate: [0, 10, -10, 0], transition: { duration: 0.6, repeat: 2 } },
};

export default function FighterPlayer({ playerHp, maxHp, name, state = 'idle', subjectId }) {
  const subjectColors = {
    programming: '#8b5cf6',
    mathematics:  '#e2b857',
    physics:      '#38bdf8',
    default:      '#8b5cf6',
  };
  const color = subjectColors[subjectId] || subjectColors.default;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      {/* Fighter Visual */}
      <motion.div
        variants={playerVariants}
        animate={state}
        style={{
          width: '110px',
          height: '110px',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${color}60, ${color}20)`,
          border: `2px solid ${color}80`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: state === 'attack'
            ? `0 0 50px ${color}, 0 0 100px ${color}60`
            : `0 0 25px ${color}40`,
          position: 'relative',
          cursor: 'default',
        }}
      >
        <User size={44} color={color} />
        {/* Attack trail */}
        {state === 'attack' && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0.6 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              right: '-60px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '60px',
              height: '4px',
              background: `linear-gradient(90deg, ${color}, transparent)`,
              borderRadius: '4px',
              transformOrigin: 'left',
            }}
          />
        )}
      </motion.div>

      {/* Name + HP */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <p style={{ fontSize: '10px', letterSpacing: '2px', color: 'var(--text-dim)', marginBottom: '8px' }}>
          {name?.toUpperCase() || 'LEARNER'}
        </p>
        <HealthBar current={playerHp} max={maxHp} color={color} showNumbers={false} />
        <p style={{ fontSize: '12px', fontWeight: 700, marginTop: '6px', color }}>
          {playerHp} / {maxHp}
        </p>
      </div>
    </div>
  );
}
