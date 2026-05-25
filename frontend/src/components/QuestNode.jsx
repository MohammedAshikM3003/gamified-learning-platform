import React from 'react';
import { motion } from 'framer-motion';

export default function QuestNode({ node, status = 'locked', onStart, onComplete }) {
  const isLocked = status === 'locked';
  const isInProgress = status === 'in-progress';
  const isCompleted = status === 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card"
      style={{
        padding: '18px',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        background: isCompleted ? 'linear-gradient(90deg, rgba(255,215,0,0.06), rgba(255,215,0,0.02))' : undefined,
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: isCompleted ? 'var(--primary)' : isLocked ? 'var(--overlay-10)' : 'var(--overlay-20)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800
        }}>{node.index || '•'}</div>
        <div>
          <div style={{ fontWeight: 700 }}>{node.title}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{node.subtitle || ''}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {isLocked && <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>Locked</div>}
        {isInProgress && <div style={{ color: 'var(--primary)', fontSize: 13 }}>In progress</div>}
        {isCompleted && <div style={{ color: 'var(--secondary)', fontSize: 13 }}>Completed</div>}

        <div>
          <button
            onClick={() => onStart && onStart(node)}
            disabled={isLocked || isCompleted}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: 'none',
              background: isLocked || isCompleted ? 'var(--overlay-10)' : 'var(--primary)',
              color: 'white',
              cursor: isLocked || isCompleted ? 'default' : 'pointer'
            }}
          >
            {isInProgress ? 'Resume' : isCompleted ? 'View' : 'Start'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
