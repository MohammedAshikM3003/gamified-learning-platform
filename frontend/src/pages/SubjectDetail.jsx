import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getChaptersBySubject, learningData } from '../data/learningData';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import './dashboard.css';

export default function SubjectDetail() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const grade = userProfile?.profile?.grade || 'grade10';
  const chapters = getChaptersBySubject(grade, subjectId);
  const subject = learningData[grade]?.subjects?.[subjectId];

  if (!subject) return (
    <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '80px' }}>
      <h2>Subject not found.</h2>
      <button onClick={() => navigate('/subjects')} style={{ marginTop: '20px', color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}>
        Back to Subjects
      </button>
    </div>
  );

  const chapterList = Object.entries(chapters);

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/subjects')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '13px' }}>
          <ChevronLeft size={16} /> Subjects
        </button>
        <span style={{ color: 'var(--text-dim)' }}>/</span>
        <span style={{ fontSize: '13px', color: subject.color || 'var(--primary)' }}>{subject.title}</span>
      </div>

      <div className="premium-card" style={{ marginBottom: '32px', borderColor: `${subject.color}30` }}>
        <h1 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 8px', color: subject.color }}>{subject.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>{subject.description}</p>
        <p style={{ margin: '12px 0 0', fontSize: '12px', color: 'var(--text-dim)' }}>
          {chapterList.length} Chapters • {chapterList.reduce((acc, [, ch]) => acc + (ch.topics?.length || 0), 0)} Topics
        </p>
      </div>

      <h3 style={{ fontSize: '12px', letterSpacing: '2px', color: 'var(--text-dim)', marginBottom: '16px' }}>CHAPTERS</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {chapterList.map(([chapterId, chapter], idx) => (
          <motion.div
            key={chapterId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="premium-card"
            onClick={() => navigate(`/subjects/${subjectId}/${chapterId}`)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px' }}
            whileHover={{ scale: 1.01 }}
          >
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px', flexShrink: 0,
              background: `${subject.color}15`, border: `1px solid ${subject.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', fontWeight: 900, color: subject.color,
            }}>
              {idx + 1}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700 }}>{chapter.title}</h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{chapter.description}</p>
              <p style={{ margin: '6px 0 0', fontSize: '11px', color: 'var(--text-dim)' }}>{chapter.topics?.length || 0} Topics</p>
            </div>
            <ChevronRight size={22} color="var(--text-dim)" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
