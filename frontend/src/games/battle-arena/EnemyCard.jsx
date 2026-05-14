import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import HealthBar from './HealthBar';

export default function EnemyCard({ enemy, hp, maxHp, isAttacking }) {
  return (
    <motion.div
      animate={{ x: isAttacking ? [-8, 0] : 0 }}
      transition={{ duration: 0.15, repeat: isAttacking ? 2 : 0 }}
      style={{
        background: 'rgba(10, 10, 12, 0.8)',
        border: `1px solid ${enemy.color}30`,
        borderRadius: '20px',
        padding: '24px',
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
        boxShadow: `0 0 40px ${enemy.color}20`,
      }}
    >
      {/* Enemy Avatar */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '90px',
          height: '90px',
          margin: '0 auto 16px',
          background: `radial-gradient(circle, ${enemy.color}30, transparent)`,
          border: `2px solid ${enemy.color}60`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 30px ${enemy.color}40`,
        }}
      >
        <Shield size={40} color={enemy.color} />
      </motion.div>

      <p style={{ fontSize: '10px', letterSpacing: '2px', color: enemy.color, marginBottom: '4px' }}>
        {enemy.title}
      </p>
      <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px' }}>{enemy.name}</h3>
      <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '16px' }}>
        {enemy.description}
      </p>

      <HealthBar current={hp} max={maxHp} color={enemy.color} label="ENEMY HP" />
    </motion.div>
  );
}
