import React, { useState } from 'react';
import { motion } from 'framer-motion';
import progressService from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';

export default function BossGate({ boss, onUnlocked }) {
  const { user, userProfile } = useAuth?.() || {};
  const [loading, setLoading] = useState(false);

  async function handleUnlock() {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const bossId = boss?.topicId || boss?.id || 'boss';
      await progressService.saveBossCompletion(user.uid, bossId, {
        topicId: boss?.topicId || boss?.id || null,
        gradeId: boss?.gradeId || boss?.grade || null,
        subjectId: boss?.subjectId || null,
        chapterId: boss?.chapterId || null,
        score: boss?.score || 0,
        stars: boss?.stars || 0,
        xpEarned: boss?.xp || 0
      });
      onUnlocked?.(boss);
    } catch (err) {
      // swallow — caller can show UI
      console.error('unlock failed', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="boss-gate">
      <div className="boss-name">{boss?.bossName || 'Boss'}</div>
      <motion.button
        onClick={handleUnlock}
        disabled={loading || !user?.uid}
        whileHover={user?.uid ? { scale: 1.03 } : {}}
        whileTap={user?.uid ? { scale: 0.98 } : {}}
        animate={user?.uid ? { boxShadow: ['0 0 0px rgba(255, 213, 74, 0.0)', '0 0 20px rgba(255, 213, 74, 0.45)', '0 0 0px rgba(255, 213, 74, 0.0)'] } : { x: [0, -3, 3, -2, 2, 0] }}
        transition={user?.uid ? { repeat: Infinity, duration: 1.8 } : { duration: 0.35 }}
      >
        {loading ? 'Unlocking...' : 'Complete Boss'}
      </motion.button>
    </div>
  );
}
