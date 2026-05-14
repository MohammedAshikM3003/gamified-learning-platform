import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUBJECT_ABILITIES } from './battleData';

/**
 * Special ability flash that appears at 5+ combo
 */
export default function SpecialAbility({ subjectId, combo, trigger }) {
  const ability = SUBJECT_ABILITIES[subjectId] || SUBJECT_ABILITIES.default;
  const show = combo >= 5 && trigger;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={trigger}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.1, 1.0, 0.8], y: [20, 0, 0, -20] }}
          transition={{ duration: 1.2, times: [0, 0.2, 0.7, 1] }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 48,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            fontSize: '48px',
            marginBottom: '8px',
            filter: `drop-shadow(0 0 20px ${ability.color})`,
          }}>
            {ability.icon}
          </div>
          <div style={{
            fontSize: '22px',
            fontWeight: 900,
            color: ability.color,
            letterSpacing: '4px',
            fontFamily: 'Poppins, sans-serif',
            textShadow: `0 0 30px ${ability.color}, 0 0 60px ${ability.color}`,
          }}>
            {ability.name}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
