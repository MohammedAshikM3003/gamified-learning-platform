import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../../context/UserProgressContext';

/**
 * Global notification toast that listens to UserProgressContext.
 * Shows victory, level-up, and achievement banners.
 * Mount this once inside DashboardLayout.
 */
export default function ProgressNotification() {
  const { notification } = useProgress();

  const config = {
    victory:     { bg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', icon: '🏆' },
    achievement: { bg: 'linear-gradient(135deg, #e2b857, #b45309)', icon: '🏅' },
    levelup:     { bg: 'linear-gradient(135deg, #10b981, #065f46)', icon: '⚡' },
    info:        { bg: 'linear-gradient(135deg, #38bdf8, #0369a1)', icon: 'ℹ️' },
  };

  const style = config[notification?.type] || config.info;

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key={notification.message}
          initial={{ opacity: 0, y: -60, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -60, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: style.bg,
            color: '#fff',
            padding: '14px 28px',
            borderRadius: '14px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '15px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: '20px' }}>{style.icon}</span>
          {notification.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
