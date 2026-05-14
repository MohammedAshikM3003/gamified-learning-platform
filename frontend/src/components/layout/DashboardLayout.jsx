import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import ProgressNotification from '../common/ProgressNotification';

export const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <Sidebar />
      <main style={{ flex: 1, height: '100vh', overflowY: 'auto', position: 'relative' }}>
        {/* Global progress notifications (victories, achievements, level-ups) */}
        <ProgressNotification />
        {children ? children : <Outlet />}
      </main>
    </div>
  );
};
