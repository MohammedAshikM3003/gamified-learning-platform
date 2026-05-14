import React from 'react';
import { GraduationCap, Clock, Award, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import '../pages/dashboard.css';

const COURSES = [
  { id: 'c1', title: 'Full-Stack Web Development', progress: 75, timeEst: '12h left', cert: true },
  { id: 'c2', title: 'Data Structures in Python', progress: 20, timeEst: '24h left', cert: false },
  { id: 'c3', title: 'Machine Learning Basics', progress: 0, timeEst: '40h left', cert: true }
];

export default function Courses() {
  return (
    <div className="dashboard-content">
      <header className="section-header">
        <GraduationCap className="section-icon" />
        <h2 className="section-title">COURSE MANAGEMENT</h2>
      </header>

      <div className="dashboard-grid-main" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
        {COURSES.map((course, idx) => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="premium-card"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, maxWidth: '80%' }}>{course.title}</h3>
              {course.cert && <Award color="var(--secondary)" size={24} />}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)' }}>
                <Clock size={14} />
                <span className="stat-label">{course.timeEst}</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="stat-label">COMPLETION</span>
                <span className="stat-label" style={{ color: 'var(--text-primary)' }}>{course.progress}%</span>
              </div>
              <div className="progress-bar-full" style={{ height: '6px', marginBottom: '24px' }}>
                <div className="progress-bar-fill" style={{ width: `${course.progress}%`, background: 'var(--gradient-gold)' }}></div>
              </div>

              <button className="btn-ai-action" style={{ width: '100%', padding: '12px', fontSize: '12px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <Play size={16} />
                {course.progress > 0 ? 'RESUME COURSE' : 'START COURSE'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
