import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Full-screen flash effect for attack impacts and screen shake
 */
export default function AttackEffects({ type }) {
  // type: 'player-attack' | 'enemy-attack' | 'special' | null
  if (!type) return null;

  const config = {
    'player-attack': { color: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)' },
    'enemy-attack':  { color: 'rgba(239,68,68,0.18)',  border: 'rgba(239,68,68,0.5)'  },
    'special':       { color: 'rgba(226,184,87,0.2)',  border: 'rgba(226,184,87,0.6)' },
  }[type] || { color: 'rgba(255,255,255,0.05)', border: 'transparent' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        background: config.color,
        border: `2px solid ${config.border}`,
        pointerEvents: 'none',
      }}
    />
  );
}

/**
 * Horizontal scan line that sweeps across on special attack
 */
export function ScanLine({ active }) {
  if (!active) return null;
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: 1, opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #8b5cf6, #e2b857, transparent)',
        transformOrigin: 'left',
        zIndex: 45,
        pointerEvents: 'none',
      }}
    />
  );
}
