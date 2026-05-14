import React from 'react';
import { Target, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import '../pages/dashboard.css';

const DAILY_QUESTS = [
  { id: 1, title: 'Complete 3 Practice Labs', progress: 3, target: 3, reward: 150, done: true },
  { id: 2, title: 'Defeat 1 Arena Boss', progress: 0, target: 1, reward: 500, done: false },
  { id: 3, title: 'Maintain 100% Accuracy in a Mock Test', progress: 0, target: 1, reward: 300, done: false }
];

export default function Challenges() {
  return (
    <div className="dashboard-content">
      <header className="section-header">
        <Target className="section-icon" />
        <h2 className="section-title">DAILY CHALLENGES</h2>
      </header>

      <div className="premium-card" style={{ marginBottom: '30px', textAlign: 'center', background: 'var(--gradient-hero)' }}>
        <p className="stat-label">RESETS IN</p>
        <h3 style={{ fontSize: '48px', fontFamily: 'var(--font-display)', margin: '8px 0', color: 'var(--secondary)' }}>14:22:05</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {DAILY_QUESTS.map((quest, idx) => (
          <motion.div 
            key={quest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="premium-card" 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '20px',
              border: quest.done ? '1px solid var(--success)' : '1px solid var(--color-border)',
              background: quest.done ? 'var(--overlay-10)' : 'var(--glass-bg)'
            }}
          >
            {quest.done ? <CheckCircle2 size={32} color="var(--success)" /> : <Circle size={32} color="var(--text-dim)" />}
            
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '18px', margin: '0 0 8px 0', color: quest.done ? 'var(--text-secondary)' : 'white', textDecoration: quest.done ? 'line-through' : 'none' }}>
                {quest.title}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="progress-bar-full" style={{ margin: 0, flex: 1, height: '6px' }}>
                  <div className="progress-bar-fill" style={{ width: `${(quest.progress / quest.target) * 100}%`, background: quest.done ? 'var(--success)' : 'var(--gradient-primary)' }}></div>
                </div>
                <span className="stat-label">{quest.progress} / {quest.target}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right', minWidth: '100px' }}>
              <p className="stat-label" style={{ color: quest.done ? 'var(--success)' : 'var(--secondary)' }}>REWARD</p>
              <p style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>+{quest.reward} XP</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
