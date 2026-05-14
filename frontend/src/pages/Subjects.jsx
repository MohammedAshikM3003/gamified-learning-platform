import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSubjectsByGrade, learningData } from '../data/learningData';
import { ALL_SUBJECTS, getSubjectsForGrade } from '../data/gradeSubjects';
import { Library, ChevronRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import './dashboard.css';

export default function Subjects() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const grade = userProfile?.profile?.grade || 'grade10';
  const selectedSubjects = userProfile?.selectedSubjects || userProfile?.subjects || [];

  // Get grade-subject display info from gradeSubjects.js (labels, colors)
  const gradeSubjectList = getSubjectsForGrade(grade);

  // Filter to user's selected subjects; if none saved yet, show all for grade
  const mySubjects = gradeSubjectList.filter(
    s => selectedSubjects.length === 0 || selectedSubjects.includes(s.id)
  );

  // Augment with chapter/topic count from learningData (if that grade exists)
  const learningSubjects = learningData[grade]?.subjects || {};

  return (
    <div className="dashboard-content">
      <header className="section-header" style={{ marginBottom: '32px' }}>
        <Library className="section-icon" />
        <div>
          <h2 className="section-title">MY SUBJECTS</h2>
          <p className="stat-label" style={{ marginTop: '4px' }}>{grade.toUpperCase().replace('GRADE', 'GRADE ')} — {mySubjects.length} ACTIVE</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {mySubjects.map((subject, idx) => {
          const subjectId = subject.id;
          // Get learningData entry if it exists for this grade
          const learningSubject = learningSubjects[subjectId];
          const chapterCount = Object.keys(learningSubject?.chapters || {}).length;
          const topicCount = Object.values(learningSubject?.chapters || {}).reduce((acc, ch) => acc + (ch.topics?.length || 0), 0);

          return (
            <motion.div
              key={subjectId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="premium-card"
              onClick={() => navigate(`/subjects/${subjectId}`)}
              style={{ cursor: 'pointer', borderColor: `${subject.color}30`, position: 'relative', overflow: 'hidden' }}
              whileHover={{ scale: 1.02, borderColor: subject.color + '60' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: subject.color }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px', marginBottom: '16px',
                  background: `${subject.color}20`, border: `1px solid ${subject.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <BookOpen size={22} color={subject.color} />
                </div>
                <ChevronRight size={20} color="var(--text-dim)" />
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px', color: subject.color }}>
                {subject.label}
              </h3>

              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                {learningSubject ? (
                  <>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{chapterCount} Chapters</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{topicCount} Topics</span>
                  </>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontStyle: 'italic' }}>Content coming soon</span>
                )}
              </div>
            </motion.div>
          );
        })}

        {mySubjects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', color: 'var(--text-dim)' }}>
            <Library size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
            <p>No subjects found. Complete onboarding to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
