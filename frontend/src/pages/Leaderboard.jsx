import React, { useState, useEffect } from 'react';
import { Medal, Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { firestoreService } from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';
import { xpEngine } from '../../game-engine/xpEngine';
import '../pages/dashboard.css';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const topUsers = await firestoreService.getTopUsers(50);
        // Map data to ensure safe defaults
        const formattedUsers = topUsers.map((u, idx) => ({
          ...u,
          rank: idx + 1,
          tier: xpEngine.getTierName ? xpEngine.getTierName(u.level) : `Level ${u.level}`,
          isCurrent: u.id === user?.uid,
        }));
        setLeaderboard(formattedUsers);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="dashboard-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-dim)', fontFamily: 'Poppins, sans-serif' }}>LOADING RANKINGS...</p>
        </div>
      </div>
    );
  }

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
          {leaderboard.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
              No data available on the global network yet. Be the first to rank!
            </div>
          ) : (
            leaderboard.map((u, idx) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  padding: '24px',
                  display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr 1fr', gap: '16px', alignItems: 'center',
                  borderBottom: '1px solid var(--overlay-10)',
                  background: u.isCurrent ? 'var(--overlay-20)' : 'transparent',
                  position: 'relative'
                }}
              >
                {u.isCurrent && (
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--primary)', boxShadow: 'var(--shadow-glow)' }} />
                )}

                {/* Rank */}
                <div style={{
                  fontSize: '20px', fontWeight: 800,
                  color: u.rank === 1 ? 'var(--secondary)' : u.rank <= 3 ? 'var(--text-primary)' : 'var(--text-dim)'
                }}>
                  #{u.rank}
                </div>

                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trophy size={16} color="white" />
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: u.isCurrent ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {u.name} {u.isCurrent && '(You)'}
                  </span>
                </div>

                {/* Tier */}
                <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                  {u.tier}
                </div>

                {/* Streak */}
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                  <Flame size={14} color="var(--secondary)" />
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>{u.streak}</span>
                </div>

                {/* XP */}
                <div style={{ textAlign: 'right', fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  {u.xp.toLocaleString()}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
