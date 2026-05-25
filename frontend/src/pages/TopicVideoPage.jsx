import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTopicById, learningData } from '../data/learningData';
import { ChevronLeft } from 'lucide-react';

export default function TopicVideoPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const videoRef = useRef(null);
  

  const grade = userProfile?.profile?.grade || 'grade10';
  const topic = getTopicById(topicId) || {};
  const subjectId = topic.subjectId || null;
  const subject = subjectId ? (learningData[grade]?.subjects?.[subjectId] || {}) : {};

  const videoPath = topic.videoPath || '/videos/fractions_intro.mp4';
  const continueToGame = () => {
    const gamePath = topic.gameRoute || '/games/fraction';
    navigate(`${gamePath}?from=${encodeURIComponent(`/topics/${topicId}`)}`);
  };

  useEffect(() => {
    // try autoplay muted
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => { v.controls = true; });
  }, [topicId]);

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <button onClick={() => navigate(subjectId ? `/subjects/${subjectId}` : '/subjects')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '13px' }}>
          <ChevronLeft size={16} /> Subjects
        </button>
        <span style={{ color: 'var(--text-dim)' }}>/</span>
        <span style={{ fontSize: '13px', color: subject.color || 'var(--primary)' }}>{subject.title || 'Subjects'}</span>
        <span style={{ color: 'var(--text-dim)' }}>/</span>
        <span style={{ fontSize: '13px' }}>{topic.title || topicId}</span>
      </div>

      <h1 style={{ fontSize: '38px', fontWeight: 800, margin: '6px 0 20px' }}>{topic.title || 'LearnCraft'}</h1>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 920 }}>
          <video
            id="topic-video-player"
            ref={videoRef}
            controls
            playsInline
            style={{ width: '100%', borderRadius: 12, boxShadow: '0 8px 30px rgba(2,6,23,0.6)' }}
          >
            <source src={videoPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="button"
              onClick={continueToGame}
              style={{
                padding: '14px 22px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '16px',
                boxShadow: '0 10px 24px rgba(109, 40, 217, 0.35)',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
