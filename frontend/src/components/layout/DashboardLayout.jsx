import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import ProgressNotification from '../common/ProgressNotification';
import { Menu, X } from 'lucide-react';

export const DashboardLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="dashboard-shell" style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <Sidebar isMobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
      {mobileSidebarOpen && (
        <button
          type="button"
          className="dashboard-sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <main className="dashboard-main" style={{ flex: 1, height: '100vh', overflowY: 'auto', position: 'relative' }}>
        <header className="dashboard-mobile-header">
          <button
            type="button"
            className="dashboard-mobile-toggle"
            aria-label={mobileSidebarOpen ? 'Close dashboard menu' : 'Open dashboard menu'}
            aria-expanded={mobileSidebarOpen}
            onClick={() => setMobileSidebarOpen((open) => !open)}
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="dashboard-mobile-brand">
            <span className="dashboard-mobile-eyebrow">LearnCraft OS</span>
            <strong>Learning dashboard</strong>
          </div>
        </header>
        {/* Global progress notifications (victories, achievements, level-ups) */}
        <ProgressNotification />
        {children ? children : <Outlet />}
      </main>
    </div>
  );
};
