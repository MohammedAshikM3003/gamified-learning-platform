import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getChaptersBySubject, learningData } from '../data/learningData';
import { ChevronLeft, ChevronRight, BookOpen, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import './dashboard.css';

const DIFFICULTY_CONFIG = {
  easy:   { label: 'EASY',   color: 'var(--success)' },
  medium: { label: 'MEDIUM', color: 'var(--secondary)' },
  hard:   { label: 'HARD',   color: 'var(--error)' },
};

export default function ChapterDetail() {
  const { subjectId, chapterId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const grade = userProfile?.profile?.grade || 'grade10';
  const chapters = getChaptersBySubject(grade, subjectId);
  const chapter = chapters[chapterId];
  const subject = learningData[grade]?.subjects?.[subjectId];

  if (!chapter) {
    return (
      <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <h2>Chapter not found.</h2>
        <button onClick={() => navigate(`/subjects/${subjectId}`)} style={{ marginTop: '20px', color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}>
          ← Back to Subject
        </button>
      </div>
    );
  }

  const topics = chapter.topics || [];

  return (
    <div className="dashboard-content">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        <button onClick={() => navigate(`/subjects/${subjectId}`)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '13px' }}>
          <ChevronLeft size={16} /> {subject?.title}
        </button>
        <span style={{ color: 'var(--text-dim)' }}>/</span>
        <span style={{ fontSize: '13px', color: 'var(--primary)' }}>{chapter.title}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 8px' }}>{chapter.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{chapter.description}</p>
      </div>

      {/* Topics List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '12px', letterSpacing: '2px', color: 'var(--text-dim)', marginBottom: '4px' }}>
          TOPICS — {topics.length} AVAILABLE
        </h3>
        {topics.map((topic, idx) => {
          const diff = DIFFICULTY_CONFIG[topic.difficulty] || DIFFICULTY_CONFIG.medium;
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="premium-card"
              onClick={() => navigate(`/topics/${topic.id}`)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                transition: 'border-color 0.2s',
              }}
              whileHover={{ scale: 1.01 }}
            >
              {/* Index */}
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', fontWeight: 900, color: 'var(--primary)',
              }}>
                {idx + 1}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{topic.title}</h4>
                  <span style={{ fontSize: '10px', padding: '2px 10px', borderRadius: '999px', color: diff.color, border: `1px solid ${diff.color}40`, letterSpacing: '1px', fontWeight: 700 }}>
                    {diff.label}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-dim)' }}>
                  {topic.questions?.length || 0} questions • {topic.game}
                </p>
              </div>

              {/* XP */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  <Star size={14} color="var(--secondary)" />
                  <span style={{ fontWeight: 800, color: 'var(--secondary)' }}>+{topic.xp}</span>
                </div>
                <p style={{ fontSize: '10px', color: 'var(--text-dim)', margin: 0, letterSpacing: '1px' }}>XP</p>
              </div>

              <ChevronRight size={20} color="var(--text-dim)" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
