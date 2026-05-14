import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, userProfile } = useAuth();
  
  // Read progression from nested Firestore schema
  const progression = userProfile?.progression || {};
  const level = progression.level || xpEngine.calculateLevel(progression.xp || 0);
  const xp = progression.xp || 0;
  const progressPercentage = xpEngine.getLevelProgress(xp).progressPercentage;

  return (
    <motion.aside 
      className="os-sidebar"
      initial={false}
      animate={{ width: isCollapsed ? 90 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon-mini">
            <GraduationCap size={20} />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                className="brand-text"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                LEARNCRAFT OS
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button 
          className="btn-toggle" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className="nav-group">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  className="nav-group-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {group.label}
                </motion.div>
              )}
            </AnimatePresence>
            
            {group.items.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
              const Icon = item.icon;
              
              return (
                <NavLink 
                  key={item.id} 
                  to={item.path} 
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="nav-item-content">
                    <Icon size={20} className="nav-icon" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span 
                          className="nav-item-text"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
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
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                className="profile-info"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
              >
                <p className="profile-name">{user?.displayName || 'Learner'}</p>
                <p className="profile-level">Tier {level} • {xp} XP</p>
                <div className="footer-progress-bar">
                  <div 
                    className="footer-progress-fill" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};
