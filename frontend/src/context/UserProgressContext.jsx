import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { firestoreService } from '../services/firestoreService';
import { xpEngine } from '../game-engine/xpEngine';
import { learningData, getTopicById } from '../data/learningData';
import { getSubjectsForGrade } from '../data/gradeSubjects';

const UserProgressContext = createContext(null);

export const UserProgressProvider = ({ children }) => {
  const { user, userProfile } = useAuth();

  // ── Live-synced state from Firestore ─────────────────────
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null); // { type, message }

  // Subscribe to real-time Firestore updates when user logs in
  useEffect(() => {
    if (!user?.uid) { setProfile(null); return; }

    // Seed initial profile from AuthContext (instant display)
    if (userProfile) setProfile(userProfile);

    // Then subscribe for live updates
    const unsubscribe = firestoreService.subscribeToProfile(user.uid, (liveProfile) => {
      setProfile(liveProfile);
    });

    return unsubscribe;
  }, [user?.uid, userProfile]);

  // ── Derived state (computed, never stored) ────────────────
  const grade          = profile?.profile?.grade || 'grade10';
  const selectedSubjects = profile?.selectedSubjects || [];
  const progression    = profile?.progression || { xp: 0, level: 1, streak: 0, coins: 0 };
  const progress       = profile?.progress || { completedTopics: [], unlockedTopics: [], battleHistory: [] };
  const analytics      = profile?.analytics || { weakSubjects: [], strongSubjects: [], totalBattlesWon: 0 };
  const achievements   = profile?.achievements || [];

  // XP/Level breakdown
  const levelInfo = useMemo(() => xpEngine.getLevelProgress(progression.xp), [progression.xp]);

  // My subjects (resolved with full label/color data)
  const mySubjectObjects = useMemo(() => {
    const gradeSubjects = getSubjectsForGrade(grade);
    if (selectedSubjects.length === 0) return gradeSubjects.slice(0, 3);
    return gradeSubjects.filter(s => selectedSubjects.includes(s.id));
  }, [grade, selectedSubjects]);

  // Topics available for this user's grade
  const gradeTopics = useMemo(() => {
    const topics = [];
    const gradeData = learningData[grade];
    if (!gradeData) return topics;
    for (const [subjectId, subject] of Object.entries(gradeData.subjects || {})) {
      for (const [chapterId, chapter] of Object.entries(subject.chapters || {})) {
        for (const topic of (chapter.topics || [])) {
          topics.push({ ...topic, subjectId, chapterId });
        }
      }
    }
    return topics;
  }, [grade]);

  // Is a topic unlocked?
  const isTopicUnlocked = useCallback((topicId) => {
    if (!topicId) return false;
    const topic = getTopicById(topicId);
    if (!topic?.unlockRequirement) return true; // No requirement = always unlocked
    return progress.completedTopics.includes(topic.unlockRequirement);
  }, [progress.completedTopics]);

  // Is a topic completed?
  const isTopicCompleted = useCallback((topicId) => {
    return progress.completedTopics.includes(topicId);
  }, [progress.completedTopics]);

  // Recommended next topics (not completed, unlocked)
  const recommendedTopics = useMemo(() => {
    return gradeTopics
      .filter(t => isTopicUnlocked(t.id) && !isTopicCompleted(t.id))
      .filter(t => selectedSubjects.length === 0 || selectedSubjects.includes(t.subjectId))
      .slice(0, 5);
  }, [gradeTopics, isTopicUnlocked, isTopicCompleted, selectedSubjects]);

  // Weak areas (subjects with most losses)
  const weakAreas = useMemo(() => {
    const lossMap = {};
    for (const battle of (progress.battleHistory || [])) {
      if (!battle.won) {
        const topic = getTopicById(battle.topicId);
        if (topic?.subjectId) {
          lossMap[topic.subjectId] = (lossMap[topic.subjectId] || 0) + 1;
        }
      }
    }
    return Object.entries(lossMap)
      .sort((a, b) => b[1] - a[1])
      .map(([subjectId]) => subjectId);
  }, [progress.battleHistory]);

  // ── Actions ───────────────────────────────────────────────

  /** Call this when a battle ends (win or lose) */
  const completeBattle = useCallback(async ({ topicId, xpGained, comboMax, won }) => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      const currentXp   = progression.xp + (won ? xpGained : Math.floor(xpGained * 0.2));
      const newLevel    = xpEngine.calculateLevel(currentXp);
      const leveledUp   = newLevel > progression.level;

      await firestoreService.completeBattle(user.uid, {
        topicId, xpGained: won ? xpGained : Math.floor(xpGained * 0.2),
        newXp: currentXp, newLevel, comboMax, won,
      });

      // Unlock next topic if requirements are met
      const nextTopics = gradeTopics.filter(t => t.unlockRequirement === topicId);
      for (const next of nextTopics) {
        await firestoreService.unlockTopic(user.uid, next.id);
      }

      // Show notification
      if (won) {
        showNotification('victory', leveledUp
          ? `⚡ Level Up! You are now Level ${newLevel}!`
          : `🏆 Victory! +${xpGained} XP earned`
        );
      }

      // Check achievements
      await checkAndGrantAchievements({ topicId, comboMax, won, totalBattlesWon: (analytics.totalBattlesWon || 0) + (won ? 1 : 0) });

    } catch (err) {
      console.error('completeBattle error:', err);
    } finally {
      setSaving(false);
    }
  }, [user?.uid, progression, gradeTopics, analytics.totalBattlesWon]);

  /** Update streak (call on daily login) */
  const updateStreak = useCallback(async (newStreak) => {
    if (!user?.uid) return;
    await firestoreService.updateStreak(user.uid, newStreak);
  }, [user?.uid]);

  // ── Achievement Engine ────────────────────────────────────
  const checkAndGrantAchievements = useCallback(async ({ topicId, comboMax, won, totalBattlesWon }) => {
    if (!user?.uid || !won) return;
    const earned = achievements.map(a => a.id);

    const toGrant = [];

    if (totalBattlesWon === 1 && !earned.includes('first-victory'))
      toGrant.push({ id: 'first-victory', name: 'First Blood', icon: '⚔️', rarity: 'common' });

    if (comboMax >= 5 && !earned.includes('combo-5'))
      toGrant.push({ id: 'combo-5', name: 'Combo Master', icon: '🔥', rarity: 'rare' });

    if (comboMax >= 10 && !earned.includes('combo-10'))
      toGrant.push({ id: 'combo-10', name: 'Untouchable', icon: '⚡', rarity: 'epic' });

    if (totalBattlesWon >= 10 && !earned.includes('ten-wins'))
      toGrant.push({ id: 'ten-wins', name: 'Veteran', icon: '🏆', rarity: 'rare' });

    if (totalBattlesWon >= 50 && !earned.includes('fifty-wins'))
      toGrant.push({ id: 'fifty-wins', name: 'Legend', icon: '👑', rarity: 'legendary' });

    for (const achievement of toGrant) {
      await firestoreService.grantAchievement(user.uid, achievement);
      showNotification('achievement', `🏅 Achievement Unlocked: ${achievement.name}`);
    }
  }, [user?.uid, achievements]);

  // ── Notification helpers ──────────────────────────────────
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // ── Context value ─────────────────────────────────────────
  const value = {
    // Profile
    profile,
    grade,
    selectedSubjects,
    mySubjectObjects,

    // Progression
    progression,
    levelInfo,
    achievements,
    analytics,

    // Progress tracking
    progress,
    completedTopics: progress.completedTopics,
    battleHistory: progress.battleHistory,
    recommendedTopics,
    weakAreas,

    // Helpers
    isTopicUnlocked,
    isTopicCompleted,

    // Actions
    completeBattle,
    updateStreak,

    // UI state
    saving,
    notification,
    showNotification,

    // Computed
    isLoaded: !!profile,
  };

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
};

export const useProgress = () => {
  const ctx = useContext(UserProgressContext);
  if (!ctx) throw new Error('useProgress must be used within UserProgressProvider');
  return ctx;
};
