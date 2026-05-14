import React from 'react';
import { Activity, Target, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import '../pages/dashboard.css';

export default function SkillAnalysis() {
  return (
    <div className="dashboard-content">
      <header className="section-header">
        <Activity className="section-icon" />
        <h2 className="section-title">AI PERFORMANCE ANALYTICS</h2>
      </header>

      <div className="dashboard-grid-main" style={{ gridTemplateColumns: '2fr 1fr' }}>
        
        {/* Heatmap / Trends (Mocked visuals using CSS) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="premium-card">
            <h3 className="section-title" style={{ fontSize: '18px', marginBottom: '24px' }}>LEARNING VELOCITY (30 DAYS)</h3>
            
            {/* Mock Graph using flex bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', paddingBottom: '20px', borderBottom: '1px solid var(--overlay-20)' }}>
              {Array.from({ length: 30 }).map((_, i) => {
                const height = Math.random() * 80 + 20;
                return (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.05 }}
                    style={{ flex: 1, background: height > 70 ? 'var(--gradient-gold)' : 'var(--gradient-primary)', borderRadius: '4px 4px 0 0', opacity: height < 40 ? 0.4 : 1 }}
                  />
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
              <span className="stat-label">30 DAYS AGO</span>
              <span className="stat-label">TODAY</span>
            </div>
          </div>

          <div className="premium-card">
            <h3 className="section-title" style={{ fontSize: '18px', marginBottom: '24px' }}>SUBJECT MASTERY DISTRIBUTION</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <span className="stat-label">COMPUTER SCIENCE</span>
                <div className="progress-bar-full" style={{ marginTop: '8px' }}><div className="progress-bar-fill" style={{ width: '85%' }}></div></div>
              </div>
              <div>
                <span className="stat-label">MATHEMATICS</span>
                <div className="progress-bar-full" style={{ marginTop: '8px' }}><div className="progress-bar-fill" style={{ width: '65%' }}></div></div>
              </div>
              <div>
                <span className="stat-label">PHYSICS (WEAK)</span>
                <div className="progress-bar-full" style={{ marginTop: '8px' }}><div className="progress-bar-fill" style={{ width: '30%', background: 'var(--error)' }}></div></div>
              </div>
              <div>
                <span className="stat-label">ARTIFICIAL INTELLIGENCE</span>
                <div className="progress-bar-full" style={{ marginTop: '8px' }}><div className="progress-bar-fill" style={{ width: '10%' }}></div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="premium-card" style={{ background: 'var(--overlay-10)' }}>
            <div className="section-header" style={{ marginBottom: '16px' }}>
              <Brain className="section-icon" style={{ color: 'var(--secondary)' }} />
              <h3 className="section-title" style={{ fontSize: '16px' }}>ONYX INSIGHTS</h3>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              Your learning velocity has increased by <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>24%</span> this week. However, Physics retention is lagging. I recommend allocating 20 minutes to Physics Mock Tests tomorrow.
            </p>
          </div>

          <div className="premium-card">
            <div className="section-header" style={{ marginBottom: '16px' }}>
              <Target className="section-icon" />
              <h3 className="section-title" style={{ fontSize: '16px' }}>PREDICTED GROWTH</h3>
            </div>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
                Lvl 6
              </div>
              <p className="stat-label" style={{ marginTop: '8px' }}>PROJECTED BY END OF WEEK</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
