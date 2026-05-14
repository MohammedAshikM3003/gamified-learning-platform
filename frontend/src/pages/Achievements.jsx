import React, { useState } from 'react';
import { Trophy, Star, Zap, Flame, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { BADGE_DEFINITIONS } from '../game-engine/achievementsEngine';
import '../pages/dashboard.css';

export default function Achievements() {
  // Mock unlocked badges for demonstration
  const [unlockedBadges] = useState(['fb', 'sw']);

  const categories = [
    { id: 'all', label: 'All Badges' },
    { id: 'learning', label: 'Learning' },
    { id: 'consistency', label: 'Consistency' },
    { id: 'mastery', label: 'Mastery' }
  ];
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="dashboard-content">
      <header className="section-header" style={{ marginBottom: '16px' }}>
        <Trophy className="section-icon" />
        <h2 className="section-title">TROPHY CENTER</h2>
      </header>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="btn-logout"
            style={{ 
              background: activeCategory === cat.id ? 'var(--gradient-primary)' : 'var(--overlay-10)',
              color: activeCategory === cat.id ? 'white' : 'var(--text-dim)',
              border: `1px solid ${activeCategory === cat.id ? 'transparent' : 'var(--color-border)'}`
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="dashboard-grid-main" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {Object.values(BADGE_DEFINITIONS)
          .filter(badge => activeCategory === 'all' || badge.type === activeCategory)
          .map((badge, idx) => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            return (
              <motion.div 
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="premium-card" 
                style={{ 
                  display: 'flex', gap: '20px', alignItems: 'center', 
                  opacity: isUnlocked ? 1 : 0.6,
                  filter: isUnlocked ? 'none' : 'grayscale(100%)'
                }}
              >
                <div style={{ 
                  width: '64px', height: '64px', borderRadius: '16px',
                  background: isUnlocked ? 'var(--gradient-gold)' : 'var(--overlay-20)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isUnlocked ? 'var(--shadow-glow-gold)' : 'none',
                  flexShrink: 0
                }}>
                  {badge.type === 'learning' && <Star size={28} color={isUnlocked ? '#000' : 'var(--text-dim)'} />}
                  {badge.type === 'consistency' && <Flame size={28} color={isUnlocked ? '#000' : 'var(--text-dim)'} />}
                  {badge.type === 'mastery' && <ShieldCheck size={28} color={isUnlocked ? '#000' : 'var(--text-dim)'} />}
                  {badge.type === 'exploration' && <Zap size={28} color={isUnlocked ? '#000' : 'var(--text-dim)'} />}
                </div>

                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0', color: isUnlocked ? 'var(--secondary)' : 'var(--text-primary)' }}>
                    {badge.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {badge.description}
                  </p>
                  <span className="stat-label" style={{ marginTop: '8px', display: 'block', color: isUnlocked ? 'var(--success)' : 'var(--text-dim)' }}>
                    {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
              </motion.div>
            );
        })}
      </div>
    </div>
  );
}
