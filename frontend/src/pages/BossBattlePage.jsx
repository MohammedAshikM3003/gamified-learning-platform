import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import worldMap from '../data/worldMap';
import BossGate from '../components/world/BossGate';
import progressService from '../services/progressService';

export default function BossBattlePage() {
  const { topicId } = useParams();
  const { user } = useAuth();
  const [status, setStatus] = useState('loading');
  const [topicProgress, setTopicProgress] = useState(null);
  const [bossProgress, setBossProgress] = useState(null);

  // find topic in worldMap
  const topic = useMemo(
    () => worldMap
      .flatMap((w) => w.subjects || [])
      .flatMap((s) => s.chapters || [])
      .flatMap((c) => c.topics || [])
      .find((t) => t.id === topicId),
    [topicId]
  );

  useEffect(() => {
    let active = true;

    async function checkUnlock() {
      if (!user?.uid || !topicId) {
        if (active) setStatus('locked');
        return;
      }

      if (active) setStatus('loading');
      const [progress, bossDoc] = await Promise.all([
        progressService.getTopicProgress(user.uid, topicId),
        progressService.getBossProgress(user.uid, topicId)
      ]);

      if (!active) return;

      setTopicProgress(progress);
      setBossProgress(bossDoc);

      if (bossDoc?.completed === true) {
        setStatus('completed');
      } else if (progressService.isBossUnlocked(progress, 60)) {
        setStatus('unlocked');
      } else if (progress) {
        setStatus('replay');
      } else {
        setStatus('locked');
      }
    }

    checkUnlock().catch(() => {
      if (active) setStatus('locked');
    });

    return () => {
      active = false;
    };
  }, [topicId, user?.uid]);

  if (!topic) return <div style={{ padding: 20 }}>Boss topic not found.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Boss: {topic.bossName}</h1>
      <AnimatePresence mode="wait">
        {status === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ marginTop: 16 }}
          >
            Checking unlock status...
          </motion.div>
        )}

        {status === 'locked' && (
          <motion.div
            key="locked"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1, x: [0, -3, 3, -2, 2, 0] }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            style={{ marginTop: 16 }}
          >
            <h3>Boss Locked</h3>
            <p>Complete the topic dungeon first to unlock this boss.</p>
            <Link to={`/topics/${topic.id}`}>Go to Topic</Link>
          </motion.div>
        )}

        {status === 'replay' && (
          <motion.div
            key="replay"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{ marginTop: 16 }}
          >
            <h3>Replay Required</h3>
            <p>Your best score is {topicProgress?.bestScore || topicProgress?.score || 0}. Reach 60 or higher to unlock this boss.</p>
            <Link to={`/topics/${topic.id}`}>Replay Topic</Link>
          </motion.div>
        )}

        {status === 'unlocked' && (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{ marginTop: 16 }}
          >
            <h3>Boss Unlocked</h3>
            <p>You completed the topic. Enter the boss battle now.</p>
            <BossGate boss={{ ...topic, id: topic.id, topicId: topic.id, gradeId: topic.gradeId || 6, subjectId: topic.subjectId || 'math', chapterId: topic.chapterId || null }} onUnlocked={() => { alert('Boss completed!'); }} />
          </motion.div>
        )}

        {status === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{ marginTop: 16 }}
          >
            <h3>Boss Completed</h3>
            <p>Your canonical boss record already shows this boss as cleared.</p>
            <p>Best score: {bossProgress?.bestScore || bossProgress?.score || 0}</p>
            <Link to={`/topics/${topic.id}`}>Back to Topic</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
