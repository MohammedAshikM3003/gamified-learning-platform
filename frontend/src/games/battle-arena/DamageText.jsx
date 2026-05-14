import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Floating damage/heal numbers that pop up and fade out
 * Usage: <DamageText key={trigger} value={20} type="damage|heal|xp" />
 */
export default function DamageText({ value, type = 'damage', side = 'enemy' }) {
  const config = {
    damage:   { color: '#ef4444', prefix: '-', size: '28px' },
    heal:     { color: '#10b981', prefix: '+', size: '22px' },
    xp:       { color: '#e2b857', prefix: '+', size: '18px', suffix: ' XP' },
    miss:     { color: '#71717a', prefix: '',  size: '18px', suffix: 'MISS' },
  }[type] || { color: '#fff', prefix: '', size: '22px' };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.8, x: side === 'enemy' ? 20 : -20 }}
      animate={{ opacity: 0, y: -70, scale: 1.2, x: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: '20%',
        left: side === 'enemy' ? '60%' : '20%',
        zIndex: 50,
        pointerEvents: 'none',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 900,
        fontSize: config.size,
        color: config.color,
        textShadow: `0 0 20px ${config.color}`,
        letterSpacing: '-0.5px',
        whiteSpace: 'nowrap',
      }}
    >
      {config.prefix}{value}{config.suffix}
    </motion.div>
  );
}
