import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/UserProgressContext';
import {
  LightningFill, TrophyFill, StarFill, ClockFill,
  BookFill, CpuFill, ChatRightQuoteFill
} from 'react-bootstrap-icons';
import { Activity, Target, Zap, Lock } from 'lucide-react';
import { xpEngine } from '../game-engine/xpEngine';
import './dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    profile, progression, levelInfo,
    mySubjectObjects, completedTopics,
    recommendedTopics, weakAreas,
    battleHistory, achievements, analytics,
    isLoaded,
  } = useProgress();

  if (!user || !isLoaded) {
    return (
      <div className="dashboard-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-dim)', fontFamily: 'Poppins, sans-serif' }}>LOADING SYSTEMS...</p>
        </div>
      </div>
    );
  }

  const xpProgress = xpEngine.getLevelProgress ? xpEngine.getLevelProgress(progression.xp) : levelInfo;
  const tierName   = xpEngine.getTierName ? xpEngine.getTierName(progression.level) : `Level ${progression.level}`;
  const weakLabel  = weakAreas.length > 0 ? weakAreas[0] : (mySubjectObjects[0]?.label || 'Mathematics');

  // Recent battle history (last 3)
  const recentBattles = [...(battleHistory || [])].reverse().slice(0, 3);

  return (
    <div className="dashboard-content">
      {/* ── Welcome Header ─────────────────────────────────── */}
      <div className="section-header" style={{ marginBottom: '40px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '28px', color: 'var(--primary)' }}>
            Welcome back, {user.displayName?.split(' ')[0] || profile?.fullName?.split(' ')[0] || 'Learner'}
          </h1>
          <p className="stat-label">SYSTEMS ONLINE // TIER: {tierName} // GRADE: {profile?.profile?.grade?.toUpperCase().replace('GRADE', 'GRADE ')}</p>
        </div>
      </div>

      {/* ── Top Stats Grid ────────────────────────────────── */}
      <div className="stats-grid">
        <div className="stat-card streak-card">
          <div className="stat-icon-wrapper"><LightningFill className="stat-icon" /></div>
          <div className="stat-info">
            <p className="stat-label">Active Streak</p>
            <p className="stat-value">{progression.streak || 0} <span className="stat-unit">DAYS</span></p>
          </div>
        </div>

        <div className="stat-card level-card-stat">
          <div className="stat-icon-wrapper"><TrophyFill className="stat-icon" /></div>
          <div className="stat-info">
            <p className="stat-label">Current Level</p>
            <p className="stat-value">Lvl {progression.level || 1}</p>
          </div>
        </div>

        <div className="stat-card xp-card">
          <div className="stat-icon-wrapper"><StarFill className="stat-icon" /></div>
          <div className="stat-info">
            <p className="stat-label">Total XP</p>
            <p className="stat-value">{progression.xp || 0} <span className="stat-unit">XP</span></p>
          </div>
        </div>

        <div className="stat-card time-card">
          <div className="stat-icon-wrapper"><ClockFill className="stat-icon" /></div>
          <div className="stat-info">
            <p className="stat-label">Battles Won</p>
            <p className="stat-value">{analytics.totalBattlesWon || 0}</p>
          </div>
        </div>
      </div>

      {/* ── XP Progress Bar ───────────────────────────────── */}
      <div className="premium-card progress-section">
        <div className="level-header">
          <h3 className="section-title">TIER {progression.level || 1} PROGRESSION</h3>
          <span className="level-badge">{tierName}</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar-full">
            <div className="progress-bar-fill" style={{ width: `${xpProgress?.progressPercentage ?? 0}%` }} />
          </div>
          <div className="progress-stats">
            <span className="progress-text">
              <StarFill size={14} style={{ color: 'var(--secondary)', marginRight: '8px' }} />
              {xpProgress?.currentLevelXP ?? progression.xp} XP
            </span>
            <span className="progress-text" style={{ color: 'var(--text-dim)' }}>
              {xpProgress?.xpToNextLevel ?? '—'} XP TO NEXT TIER
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Grid ─────────────────────────────────────── */}
      <div className="dashboard-grid-main">

        {/* Left Column */}
        <div className="dashboard-col-left">

          {/* Active Subjects */}
          <div className="premium-card">
            <div className="section-header">
              <BookFill className="section-icon" />
              <h3 className="section-title">ACTIVE MODULES</h3>
            </div>
            {mySubjectObjects.length === 0 ? (
              <p className="stat-label" style={{ padding: '8px 0' }}>Complete onboarding to unlock your subjects.</p>
            ) : (
              mySubjectObjects.map((subject, idx) => (
                <div
                  key={idx}
                  className="subject-card"
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                  style={{ marginBottom: '12px', borderLeft: `3px solid ${subject.color}`, cursor: 'pointer' }}
                >
                  <h4 style={{ color: subject.color, margin: 0 }}>{subject.label}</h4>
                  <p className="stat-label" style={{ marginTop: '4px' }}>CLICK TO EXPLORE CHAPTERS →</p>
                </div>
              ))
            )}
          </div>

          {/* Recommended Next Topics */}
          {recommendedTopics.length > 0 && (
            <div className="premium-card">
              <div className="section-header">
                <Zap className="section-icon" style={{ color: 'var(--secondary)' }} />
                <h3 className="section-title">RECOMMENDED QUESTS</h3>
              </div>
              <div className="goals-list">
                {recommendedTopics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="goal-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/topics/${topic.id}`)}
                  >
                    <Target size={18} color="var(--primary)" />
                    <span className="goal-text">{topic.title}</span>
                    <span className="stat-label" style={{ marginLeft: 'auto', color: 'var(--secondary)' }}>+{topic.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Battle History */}
          <div className="premium-card">
            <div className="section-header">
              <Activity className="section-icon" />
              <h3 className="section-title">BATTLE HISTORY</h3>
            </div>
            <div className="goals-list">
              {recentBattles.length === 0 ? (
                <p className="stat-label" style={{ padding: '8px 0' }}>No battles yet. Enter the Arena to begin!</p>
              ) : (
                recentBattles.map((battle, idx) => (
                  <div key={idx} className="goal-item">
                    {battle.won
                      ? <TrophyFill size={16} color="var(--secondary)" />
                      : <Lock size={16} color="var(--error, #ef4444)" />}
                    <span className="goal-text">{battle.topicId}</span>
                    <span className="stat-label" style={{ marginLeft: 'auto', color: battle.won ? 'var(--secondary)' : 'var(--error, #ef4444)' }}>
                      {battle.won ? `+${battle.xpGained} XP` : 'DEFEAT'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="premium-card">
              <div className="section-header">
                <StarFill className="section-icon" style={{ color: 'var(--secondary)' }} />
                <h3 className="section-title">ACHIEVEMENTS</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {achievements.map((a, idx) => (
                  <div key={idx} title={a.name} style={{
                    background: 'var(--overlay-10)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span>{a.icon}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif' }}>{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column — AI Mentor */}
        <div className="dashboard-col-right">
          <div className="premium-card ai-mentor-card">
            <div className="ai-avatar"><CpuFill /></div>
            <h3 className="section-title" style={{ marginBottom: '8px', textAlign: 'center' }}>CRAFTON MENTOR</h3>
            <p className="stat-label" style={{ marginBottom: '24px' }}>AI SYSTEMS ONLINE</p>

            <div className="ai-message">
              <ChatRightQuoteFill size={20} style={{ color: 'var(--secondary)', marginBottom: '12px', display: 'block' }} />
              {weakAreas.length > 0
                ? `Your <strong>${weakLabel}</strong> performance needs attention. I recommend a targeted drill before your next major quest.`
                : recommendedTopics.length > 0
                  ? `Ready to push forward? Your next quest is <strong>${recommendedTopics[0]?.title}</strong>. Let's go!`
                  : `Systems initialized. Complete your first battle to unlock personalized guidance.`
              }
            </div>

            <button className="btn-ai-action" onClick={() => navigate('/ai-tutor')}>
              OPEN AI TUTOR
            </button>
            <button
              className="btn-ai-action"
              style={{ marginTop: '10px', background: 'var(--overlay-10)', color: 'var(--text-secondary)' }}
              onClick={() => navigate('/arena')}
            >
              ENTER BATTLE ARENA
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
