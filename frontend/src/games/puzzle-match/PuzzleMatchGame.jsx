import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import progressService from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';

export default function PuzzleMatchGame({ topic }) {
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const [reward, setReward] = useState(null);
  const { userProfile } = useAuth?.() || {};
  const navigate = useNavigate();

  if (!topic) return null;

  const q = topic.questions?.[0];

  async function handleSubmit() {
    const correct = q && selected === q.answer;
    setDone(true);
    try {
      if (userProfile?.uid) {
        const score = correct ? 100 : 0;
        const xpEarned = correct ? (topic.xp || 10) : Math.floor((topic.xp || 10) / 4);
        const stars = correct ? 3 : 0;

        await progressService.saveGameResult(userProfile.uid, {
          topicId: topic.id,
          grade: topic.grade || 6,
          subjectId: topic.subjectId || 'math',
          chapterId: topic.chapterId || 'fractions',
          xpEarned,
          score,
          stars,
          gameType: 'puzzle-match'
        });

        setReward({
          correct,
          score,
          xpEarned,
          stars,
          bossUnlocked: score >= 60
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!reward) return undefined;
    const timer = window.setTimeout(() => setReward(null), 2800);
    return () => window.clearTimeout(timer);
  }, [reward]);

  return (
    <div style={{ padding: 12 }}>
      {q ? (
        <div>
          <h3>{q.question}</h3>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {q.options.map((o) => (
              <button key={o} onClick={() => setSelected(o)} style={{ padding: 8, background: selected === o ? '#def' : '#fff' }}>
                {o}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={handleSubmit} disabled={!selected || done}>{done ? 'Done' : 'Submit'}</button>
          </div>
          {done && (
            <div style={{ marginTop: 12 }}>
              <div>{selected === q.answer ? 'Correct! XP awarded.' : 'Incorrect. Try again later.'}</div>
              <div style={{ marginTop: 8 }}>
                <button onClick={() => navigate(`/boss/${topic.id}`)}>Go to Boss</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>No questions for this topic yet.</div>
      )}

      <AnimatePresence>
        {reward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              background: 'rgba(0,0,0,0.45)',
              zIndex: 60,
              padding: 16
            }}
          >
            <motion.div
              initial={{ rotate: -1 }}
              animate={{ rotate: 0 }}
              style={{
                background: '#10182a',
                color: '#fff',
                borderRadius: 18,
                padding: '20px 22px',
                width: 'min(360px, 100%)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
                textAlign: 'center'
              }}
            >
              <h3 style={{ marginTop: 0 }}>{reward.correct ? 'Victory!' : 'Try Again'}</h3>
              <p style={{ margin: '8px 0' }}>+{reward.xpEarned} XP</p>
              <p style={{ margin: '8px 0' }}>{reward.stars} Stars earned</p>
              <p style={{ margin: '8px 0' }}>{reward.bossUnlocked ? 'Boss unlocked' : 'Boss still locked'}</p>
              <button onClick={() => setReward(null)} style={{ marginTop: 8 }}>Continue</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
