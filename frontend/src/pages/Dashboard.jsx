import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LightningFill, TrophyFill, StarFill, ClockFill, 
  BookFill, CpuFill, ChatRightQuoteFill 
} from 'react-bootstrap-icons';
import { Activity, Target } from 'lucide-react';
import { levelEngine } from '../game-engine/levelEngine';
import { streakEngine } from '../game-engine/streakEngine';
import { getSubjectsForGrade, ALL_SUBJECTS } from '../data/gradeSubjects';
import './dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  
  // Wait for userProfile to load before rendering the dashboard data
  if (!user || !userProfile) return <div className="dashboard-content"><p>Loading profile...</p></div>;

  const progression = userProfile.progression || { level: 1, xp: 0, streak: 0 };
  const selectedSubjectIds = userProfile.selectedSubjects || userProfile.subjects || ['programming'];
  const grade = userProfile.profile?.grade || 'grade10';
  const weakSubjects = userProfile.analytics?.weakSubjects || [selectedSubjectIds[0]];

  // Resolve full subject objects (label + color) from gradeSubjects
  const gradeSubjectList = getSubjectsForGrade(grade);
  const mySubjects = selectedSubjectIds.map(id =>
    gradeSubjectList.find(s => s.id === id) || ALL_SUBJECTS[id] || { id, label: id, color: 'var(--primary)' }
  );

  const levelInfo = levelEngine.calculateLevel(progression.xp);
  const tierName = levelEngine.getTierName(levelInfo.level);

  return (
    <div className="dashboard-content">
      {/* Header Info is now part of the layout, so we just have a welcome section */}
      <div className="section-header" style={{ marginBottom: '40px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '28px', color: 'var(--primary)' }}>
            Welcome back, {user.displayName?.split(' ')[0] || 'Learner'}
          </h1>
          <p className="stat-label">SYSTEMS ONLINE // TIER: {tierName}</p>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card streak-card">
          <div className="stat-icon-wrapper">
            <LightningFill className="stat-icon" />
          </div>
          <div className="stat-info">
            <p className="stat-label">Active Streak</p>
            <p className="stat-value">{progression.streak} <span className="stat-unit">DAYS</span></p>
          </div>
        </div>

        <div className="stat-card level-card-stat">
          <div className="stat-icon-wrapper">
            <TrophyFill className="stat-icon" />
          </div>
          <div className="stat-info">
            <p className="stat-label">Current Rank</p>
            <p className="stat-value">Lvl {levelInfo.level}</p>
          </div>
        </div>

        <div className="stat-card xp-card">
          <div className="stat-icon-wrapper">
            <StarFill className="stat-icon" />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Experience</p>
            <p className="stat-value">{progression.xp} <span className="stat-unit">XP</span></p>
          </div>
        </div>

        <div className="stat-card time-card">
          <div className="stat-icon-wrapper">
            <ClockFill className="stat-icon" />
          </div>
          <div className="stat-info">
            <p className="stat-label">Lessons Completed</p>
            <p className="stat-value">{userProfile.analytics?.totalLessonsCompleted || 0}</p>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="premium-card progress-section">
        <div className="level-header">
          <h3 className="section-title">TIER {levelInfo.level} PROGRESSION</h3>
          <span className="level-badge">{tierName}</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar-full">
            <div className="progress-bar-fill" style={{ width: `${levelInfo.progressPercentage}%` }}></div>
          </div>
          <div className="progress-stats">
            <span className="progress-text">
              <StarFill size={14} style={{ color: 'var(--secondary)', marginRight: '8px' }} /> 
              {levelInfo.currentLevelXP} XP
            </span>
            <span className="progress-text" style={{ color: 'var(--text-dim)' }}>
              {levelInfo.xpToNextLevel} XP TO NEXT TIER
            </span>
          </div>
        </div>
      </div>

      {/* 70/30 Grid Layout */}
      <div className="dashboard-grid-main">
        
        {/* Left Column (70%) */}
        <div className="dashboard-col-left">
          {/* Active Modules Map */}
          <div className="premium-card">
            <div className="section-header">
              <BookFill className="section-icon" />
              <h3 className="section-title">ACTIVE MODULES</h3>
            </div>
            {mySubjects.map((subject, idx) => (
              <div
                key={idx}
                className="subject-card"
                onClick={() => navigate('/arena')}
                style={{ marginBottom: '16px', borderLeft: `3px solid ${subject.color}` }}
              >
                <h4 style={{ color: subject.color }}>{subject.label}</h4>
                <p className="stat-label">ONGOING QUEST — CLICK TO BATTLE</p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="premium-card">
            <div className="section-header">
              <Activity className="section-icon" />
              <h3 className="section-title">RECENT ACTIVITY</h3>
            </div>
            <div className="goals-list">
              <div className="goal-item">
                <Target size={18} color="var(--primary)" />
                <span className="goal-text">Defeated Syntax Phantom in Battle Arena</span>
                <span className="stat-label" style={{ marginLeft: 'auto' }}>+150 XP</span>
              </div>
              <div className="goal-item">
                <BookFill size={18} color="var(--secondary)" />
                <span className="goal-text">Completed "Intro to AI" Module</span>
                <span className="stat-label" style={{ marginLeft: 'auto' }}>+50 XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (30%) - AI Mentor Sidebar */}
        <div className="dashboard-col-right">
          <div className="premium-card ai-mentor-card">
            <div className="ai-avatar">
              <CpuFill />
            </div>
            <h3 className="section-title" style={{ marginBottom: '8px', textAlign: 'center' }}>ONYX MENTOR</h3>
            <p className="stat-label" style={{ marginBottom: '24px' }}>AI SYSTEMS ONLINE</p>
            
            <div className="ai-message">
              <ChatRightQuoteFill size={20} style={{ color: 'var(--secondary)', marginBottom: '12px', display: 'block' }} />
              "Welcome back. Your <strong>{weakSubjects[0]}</strong> performance is dropping slightly. I recommend running a Quiz Battle drill before your next major quest."
            </div>

            <button className="btn-ai-action" onClick={() => navigate('/ai-tutor')}>
              INITIATE OVERRIDE
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
