import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  Map, 
  Swords, 
  Library, 
  GraduationCap, 
  FlaskConical, 
  FileEdit, 
  Trophy, 
  Medal, 
  Target, 
  Activity, 
  Settings,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { xpEngine } from '../../game-engine/xpEngine';
import './Sidebar.css';

const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { id: 'ai-tutor', label: 'AI Tutor', icon: Cpu, path: '/ai-tutor', pip: '3' },
      { id: 'quest-map', label: 'Quest Map', icon: Map, path: '/quest-map' },
      { id: 'arena', label: 'Battle Arena', icon: Swords, path: '/arena' },
    ]
  },
  {
    label: 'Learning',
    items: [
      { id: 'subjects', label: 'Subjects', icon: Library, path: '/subjects' },
      { id: 'courses', label: 'Courses', icon: GraduationCap, path: '/courses' },
      { id: 'labs', label: 'Practice Labs', icon: FlaskConical, path: '/labs' },
      { id: 'mocks', label: 'Mock Tests', icon: FileEdit, path: '/mocks' },
    ]
  },
  {
    label: 'Gamification',
    items: [
      { id: 'achievements', label: 'Achievements', icon: Trophy, path: '/achievements' },
      { id: 'leaderboard', label: 'Leaderboard', icon: Medal, path: '/leaderboard' },
      { id: 'challenges', label: 'Daily Challenges', icon: Target, path: '/challenges' },
    ]
  },
  {
    label: 'System',
    items: [
      { id: 'analysis', label: 'Skill Analysis', icon: Activity, path: '/analysis' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    ]
  }
];

export const Sidebar = ({ isMobileOpen = false, onMobileClose = () => {} }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, userProfile } = useAuth();
  
  // Read progression from nested Firestore schema
  const progression = userProfile?.progression || {};
  const level = progression.level || xpEngine.calculateLevel(progression.xp || 0);
  const xp = progression.xp || 0;
  const progressPercentage = xpEngine.getLevelProgress(xp).progressPercentage;

  return (
    <aside 
      className={`os-sidebar ${isMobileOpen ? 'is-mobile-open' : ''}`}
      style={{ width: isCollapsed ? 90 : 280 }}
    >
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon-mini">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
              <path d="M0 0h16v16H0z" fill="none" />
              <path fill="currentColor" d="m6 10l2-1l7-7l-1-1l-7 7zm-1.48 3.548c-.494-1.043-1.026-1.574-2.069-2.069l1.548-4.262l2-1.217l6-6h-3l-6 6l-3 10l10-3l6-6V4l-6 6l-1.217 2z" />
            </svg>
          </div>
          {!isCollapsed && (
            <span className="brand-text">
              LEARNCRAFT OS
            </span>
          )}
        </div>
        <button 
          className="btn-toggle" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className="nav-group">
            {!isCollapsed && (
              <div className="nav-group-label">
                {group.label}
              </div>
            )}
            
            {group.items.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
              const Icon = item.icon;
              
              return (
                <NavLink 
                  key={item.id} 
                  to={item.path} 
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={onMobileClose}
                >
                  <div className="nav-item-content">
                    <Icon size={20} className="nav-icon" />
                    {!isCollapsed && (
                      <span className="nav-item-text">
                        {item.label}
                      </span>
                    )}
                  </div>
                  
                  {!isCollapsed && item.pip && (
                    <span className="nav-pip">{item.pip}</span>
                  )}
                  {isCollapsed && item.pip && (
                    <span className="pip-dot"></span>
                  )}

                  {isCollapsed && (
                    <div className="sidebar-tooltip">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer XP Card */}
      <div className="sidebar-footer">
        <div className="footer-profile">
          <div className="profile-avatar">
            <User size={20} color="var(--text-secondary)" />
            <div className="online-indicator"></div>
          </div>
          {!isCollapsed && (
            <div className="profile-info">
              <p className="profile-name">{user?.displayName || 'Learner'}</p>
              <p className="profile-level">Tier {level} • {xp} XP</p>
              <div className="footer-progress-bar">
                <div 
                  className="footer-progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
