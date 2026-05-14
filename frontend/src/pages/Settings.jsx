import React from 'react';
import { Settings } from 'lucide-react';
import '../pages/dashboard.css';

export default function SettingsPage() {
  return (
    <div className="dashboard-content">
      <header className="section-header">
        <Settings className="section-icon" />
        <h2 className="section-title">System Settings</h2>
      </header>
      <div className="premium-card">
        <div className="empty-state">Personalization options coming soon...</div>
      </div>
    </div>
  );
}
