import React from 'react';
import { motion } from 'framer-motion';

export default function HealthBar({ current, max, color = 'var(--success)', label, showNumbers = true }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const dangerColor = pct < 25 ? 'var(--error)' : pct < 50 ? 'var(--warning)' : color;

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <p style={{ fontSize: '10px', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '6px' }}>
          {label}
        </p>
      )}
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '6px',
        height: '10px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: dangerColor,
            borderRadius: '6px',
            boxShadow: `0 0 10px ${dangerColor}`,
          }}
        />
      </div>
      {showNumbers && (
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'right' }}>
          {Math.round(current)} / {max} HP
        </p>
      )}
    </div>
  );
}
