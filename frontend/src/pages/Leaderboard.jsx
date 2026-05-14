import React from 'react';
import { Medal, Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import '../pages/dashboard.css';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'AlexChen_Dev', xp: 12450, tier: 'Grandmaster', streak: 45 },
  { rank: 2, name: 'Sarah_Codes', xp: 11200, tier: 'Master', streak: 30 },
  { rank: 3, name: 'Learner_01', xp: 9800, tier: 'Diamond', streak: 12, isCurrent: true },
  { rank: 4, name: 'QuantumJump', xp: 9500, tier: 'Diamond', streak: 14 },
  { rank: 5, name: 'BetaTester', xp: 8200, tier: 'Platinum', streak: 5 },
];

export default function Leaderboard() {
  return (
    <div className="dashboard-content">
      <header className="section-header">
        <Medal className="section-icon" />
        <h2 className="section-title">GLOBAL RANKINGS</h2>
      </header>

      <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px', background: 'var(--overlay-10)', display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr 1fr', gap: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <span className="stat-label">RANK</span>
          <span className="stat-label">LEARNER</span>
          <span className="stat-label">TIER</span>
          <span className="stat-label" style={{ textAlign: 'right' }}>STREAK</span>
          <span className="stat-label" style={{ textAlign: 'right' }}>XP SCORE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {MOCK_LEADERBOARD.map((user, idx) => (
            <motion.div 
              key={user.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ 
                padding: '24px', 
                display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr 1fr', gap: '16px', alignItems: 'center',
                borderBottom: '1px solid var(--overlay-10)',
                background: user.isCurrent ? 'var(--overlay-20)' : 'transparent',
                position: 'relative'
              }}
            >
              {user.isCurrent && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--primary)', boxShadow: 'var(--shadow-glow)' }} />
              )}
              
              {/* Rank */}
              <div style={{ 
                fontSize: '20px', fontWeight: 800, 
                color: user.rank === 1 ? 'var(--secondary)' : user.rank <= 3 ? 'var(--text-primary)' : 'var(--text-dim)' 
              }}>
                #{user.rank}
              </div>

              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trophy size={16} color="white" />
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: user.isCurrent ? 'var(--primary)' : 'var(--text-primary)' }}>
                  {user.name} {user.isCurrent && '(You)'}
                </span>
              </div>

              {/* Tier */}
              <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                {user.tier}
              </div>

              {/* Streak */}
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                <Flame size={14} color="var(--secondary)" />
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{user.streak}</span>
              </div>

              {/* XP */}
              <div style={{ textAlign: 'right', fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {user.xp.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
