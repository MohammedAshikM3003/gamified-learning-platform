import React from 'react';
import { FileEdit, Timer, Target, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import '../pages/dashboard.css';

export default function MockTests() {
  return (
    <div className="dashboard-content">
      <header className="section-header">
        <FileEdit className="section-icon" />
        <h2 className="section-title">EXAM SIMULATIONS</h2>
      </header>

      <div className="dashboard-grid-main" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '30px' }}>
        <div className="premium-card" style={{ textAlign: 'center' }}>
          <Timer size={32} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '32px', margin: 0, fontWeight: 800 }}>4</h3>
          <p className="stat-label">TESTS COMPLETED</p>
        </div>
        <div className="premium-card" style={{ textAlign: 'center' }}>
          <Target size={32} color="var(--success)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '32px', margin: 0, fontWeight: 800 }}>82%</h3>
          <p className="stat-label">AVERAGE ACCURACY</p>
        </div>
        <div className="premium-card" style={{ textAlign: 'center' }}>
          <BarChart2 size={32} color="var(--secondary)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '32px', margin: 0, fontWeight: 800 }}>Top 15%</h3>
          <p className="stat-label">GLOBAL PERCENTILE</p>
        </div>
      </div>

      <h3 className="section-title" style={{ fontSize: '20px', marginBottom: '24px' }}>AVAILABLE SIMULATIONS</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <motion.div className="premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700 }}>Computer Science Fundamentals: Final</h4>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span className="stat-label">120 MINUTES</span>
              <span className="stat-label" style={{ color: 'var(--error)' }}>EXPERT DIFFICULTY</span>
            </div>
          </div>
          <button className="btn-ai-action" style={{ width: 'auto', padding: '12px 32px' }}>START SIMULATION</button>
        </motion.div>

        <motion.div className="premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7 }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700 }}>Mathematics Midterm (Completed)</h4>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span className="stat-label">SCORE: 88%</span>
              <span className="stat-label" style={{ color: 'var(--success)' }}>AI REVIEW READY</span>
            </div>
          </div>
          <button className="btn-logout" style={{ width: 'auto', padding: '12px 32px' }}>VIEW REPORT</button>
        </motion.div>
      </div>
    </div>
  );
}
