import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function ComboSystem({ combo }) {
  if (combo < 2) return null;

  const multiplier = combo >= 5 ? 2.0 : combo >= 3 ? 1.5 : 1.25;
  const color = combo >= 5 ? 'var(--error)' : combo >= 3 ? 'var(--secondary)' : 'var(--primary)';
  const label = combo >= 5 ? 'MEGA COMBO' : combo >= 3 ? 'SUPER COMBO' : 'COMBO';

  return (
    <AnimatePresence>
      <motion.div
        key={combo}
        initial={{ scale: 0.5, opacity: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '8px 20px',
          background: `${color}15`,
          border: `1px solid ${color}40`,
          borderRadius: '999px',
          boxShadow: `0 0 20px ${color}30`,
        }}
      >
        <Zap size={16} color={color} />
        <span style={{ fontSize: '13px', fontWeight: 800, color, letterSpacing: '1px' }}>
          {combo}x {label}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {multiplier}x XP
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
