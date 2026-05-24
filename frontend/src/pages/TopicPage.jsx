import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTopicById } from '../data/learningData';
import BattleArena from '../games/battle-arena/BattleArena';
import PuzzleMatchGame from '../games/puzzle-match/PuzzleMatchGame';
import worldMap from '../data/worldMap';
import { ChevronLeft, Swords, Star, Zap, BookOpen } from 'lucide-react';
import './dashboard.css';

const DIFFICULTY_CONFIG = {
  easy:   { label: 'EASY',   color: 'var(--success)',   bg: 'rgba(16,185,129,0.1)' },
  medium: { label: 'MEDIUM', color: 'var(--secondary)', bg: 'rgba(226,184,87,0.1)' },
  hard:   { label: 'HARD',   color: 'var(--error)',     bg: 'rgba(239,68,68,0.1)'  },
};

export default function TopicPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const topic = getTopicById(topicId);

  // fallback to worldMap config when learningData doesn't include the topic
  const fallbackTopic = !topic
    ? worldMap
        .flatMap((w) => w.subjects || [])
        .flatMap((s) => s.chapters || [])
        .flatMap((c) => c.topics || [])
        .find((t) => t.id === topicId)
    : null;

  const resolvedTopic = topic || fallbackTopic;

  if (!resolvedTopic) {
    return (
      <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <h2>Topic not found.</h2>
        <button onClick={() => navigate('/subjects')} style={{ marginTop: '20px', color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}>
          ← Back to Subjects
        </button>
      </div>
    );
  }

  const diff = DIFFICULTY_CONFIG[resolvedTopic.difficulty] || DIFFICULTY_CONFIG.medium;

  return (
    <div className="dashboard-content">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '13px' }}
        >
          <ChevronLeft size={16} /> Back
        </button>
        <span style={{ color: 'var(--text-dim)' }}>/</span>
        <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>{resolvedTopic.subjectId}</span>
        <span style={{ color: 'var(--text-dim)' }}>/</span>
        <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>{resolvedTopic.chapterId}</span>
        <span style={{ color: 'var(--text-dim)' }}>/</span>
        <span style={{ fontSize: '13px', color: 'var(--primary)' }}>{resolvedTopic.title}</span>
      </div>

      {/* Topic Header */}
      <div className="premium-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', padding: '4px 12px', borderRadius: '999px', background: diff.bg, color: diff.color, border: `1px solid ${diff.color}40`, letterSpacing: '1.5px', fontWeight: 700 }}>
                {diff.label}
              </span>
              <span style={{ fontSize: '10px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.08)', letterSpacing: '1px' }}>
                {resolvedTopic.game}
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 8px' }}>{resolvedTopic.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>{resolvedTopic.description}</p>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={18} color="var(--secondary)" />
                <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--secondary)' }}>+{resolvedTopic.xp}</span>
              </div>
              <p style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1px', margin: 0 }}>XP REWARD</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={18} color="var(--primary)" />
                <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)' }}>{resolvedTopic.questions?.length || 0}</span>
              </div>
              <p style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '1px', margin: 0 }}>QUESTIONS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Arena Game */}
      {resolvedTopic.game === 'puzzle-match' ? (
        <PuzzleMatchGame topic={{ ...resolvedTopic, id: topicId }} />
      ) : (
        <BattleArena topic={resolvedTopic} />
      )}
    </div>
  );
}
