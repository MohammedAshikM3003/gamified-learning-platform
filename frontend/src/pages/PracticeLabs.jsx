import React from 'react';
import { FlaskConical, Terminal, Code2, Beaker, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import '../pages/dashboard.css';

export default function PracticeLabs() {
  return (
    <div className="dashboard-content">
      <header className="section-header">
        <FlaskConical className="section-icon" />
        <h2 className="section-title">PRACTICE LABS</h2>
      </header>

      <div className="dashboard-grid-main" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Main Editor Area Mock */}
        <div className="premium-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: 'var(--overlay-20)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--color-border)' }}>
            <Terminal size={16} color="var(--text-dim)" />
            <span className="stat-label">SANDBOX ENVIRONMENT // PYTHON</span>
          </div>
          
          <div style={{ padding: '24px', flex: 1, fontFamily: 'monospace', color: 'var(--secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            <span style={{ color: 'var(--primary)' }}>def</span> <span style={{ color: 'white' }}>calculate_trajectory</span>(velocity, angle):<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: 'var(--text-dim)' }}># Your code here</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: 'var(--primary)' }}>return</span> trajectory<br/>
            <br/>
            <div className="empty-state" style={{ marginTop: '40px', borderStyle: 'dashed' }}>
              Interactive Code Editor Initialization Pending...
            </div>
          </div>
        </div>

        {/* Lab Scenarios */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="premium-card">
            <h3 className="section-title" style={{ fontSize: '16px', marginBottom: '16px' }}>ACTIVE EXPERIMENTS</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="goal-item" style={{ background: 'var(--overlay-20)', borderColor: 'var(--primary)' }}>
                <Code2 size={20} color="var(--primary)" />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Physics Engine Logic</p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-dim)' }}>Python Sandbox</p>
                </div>
                <PlayCircle size={20} />
              </div>

              <div className="goal-item">
                <Beaker size={20} color="var(--secondary)" />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Acid/Base Titration</p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-dim)' }}>Visual Simulation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
