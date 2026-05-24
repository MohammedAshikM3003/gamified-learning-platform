import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { firestoreService } from '../services/firestoreService';
import * as progressService from '../services/progressService';
import { xpEngine } from '../game-engine/xpEngine';
import { learningData, getTopicById } from '../data/learningData';
import { getSubjectsForGrade } from '../data/gradeSubjects';

const UserProgressContext = createContext(null);

function mapCollectionSnapshot(snapshot) {
  return snapshot.docs.map((snapshotDoc) => ({ id: snapshotDoc.id, ...snapshotDoc.data() }));
}

export const UserProgressProvider = ({ children }) => {
  const { user, userProfile } = useAuth();

  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [topicDocs, setTopicDocs] = useState([]);
  const [bossDocs, setBossDocs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!user?.uid || !db) {
      setProfile(null);
      setSummary(null);
      setTopicDocs([]);
      setBossDocs([]);
      return undefined;
    }

    if (userProfile) setProfile(userProfile);

    const unsubscribeProfile = firestoreService.subscribeToProfile(user.uid, (liveProfile) => {
      setProfile(liveProfile);
    });

    const summaryRef = doc(db, 'userProgress', user.uid);
    const unsubscribeSummary = onSnapshot(summaryRef, (snapshot) => {
      setSummary(snapshot.exists() ? snapshot.data() : null);
    });

    const topicsRef = collection(db, 'userProgress', user.uid, 'topics');
    const unsubscribeTopics = onSnapshot(topicsRef, (snapshot) => {
      setTopicDocs(mapCollectionSnapshot(snapshot));
    });

    const bossesRef = collection(db, 'userProgress', user.uid, 'bosses');
    const unsubscribeBosses = onSnapshot(bossesRef, (snapshot) => {
      setBossDocs(mapCollectionSnapshot(snapshot));
    });

    return () => {
      unsubscribeProfile?.();
      unsubscribeSummary?.();
      unsubscribeTopics?.();
      unsubscribeBosses?.();
    };
  }, [user?.uid, userProfile]);

  const grade = profile?.profile?.grade || summary?.currentGrade || 'grade10';
  const selectedSubjects = profile?.selectedSubjects || [];
  const completedTopicsCount = summary?.completedTopicsCount || 0;
  const completedBossesCount = summary?.completedBossesCount || 0;
  const xpTotal = summary?.xpTotal || 0;
  const coinsTotal = summary?.coinsTotal || 0;
  const streak = summary?.streak || 0;
  const starsTotal = summary?.starsTotal || 0;
  const currentWorld = summary?.currentWorld || null;
  const currentGrade = summary?.currentGrade || grade;
  const achievements = summary?.achievements || [];

  const levelInfo = useMemo(() => xpEngine.getLevelProgress(xpTotal), [xpTotal]);

  const mySubjectObjects = useMemo(() => {
    const gradeSubjects = getSubjectsForGrade(grade);
    if (selectedSubjects.length === 0) return gradeSubjects.slice(0, 3);
    return gradeSubjects.filter((subject) => selectedSubjects.includes(subject.id));
  }, [grade, selectedSubjects]);

  const gradeTopics = useMemo(() => {
    const topics = [];
    const gradeData = learningData[grade];
    if (!gradeData) return topics;

    for (const [subjectId, subject] of Object.entries(gradeData.subjects || {})) {
      for (const [chapterId, chapter] of Object.entries(subject.chapters || {})) {
        for (const topic of chapter.topics || []) {
          topics.push({ ...topic, subjectId, chapterId });
        }
      }
    }

    return topics;
  }, [grade]);

  const topicProgressById = useMemo(() => progressService.mapTopicsById(topicDocs), [topicDocs]);
  const bossProgressById = useMemo(() => progressService.mapTopicsById(bossDocs), [bossDocs]);

  const completedTopics = useMemo(
    () => progressService.deriveCompletedTopics(topicProgressById),
    [topicProgressById]
  );

  const completedBosses = useMemo(
    () => Array.from(bossProgressById.entries())
      .filter(([, boss]) => boss?.completed === true)
      .map(([bossId]) => bossId),
    [bossProgressById]
  );

  const battleHistory = useMemo(() => {
    return topicDocs
      .map((topic) => ({
        topicId: topic.topicId || topic.id,
        xpGained: topic.xpEarned || 0,
        score: topic.score || 0,
        won: topic.completed === true,
        playedAt: topic.playedAt || null,
      }))
      .reverse();
  }, [topicDocs]);

  const isTopicUnlocked = useCallback((topicId) => {
    if (!topicId) return false;
    const topic = getTopicById(topicId);
    if (!topic) return false;
    if (!topic.unlockRequirement) return true;

    const prerequisite = topicProgressById.get(topic.unlockRequirement);
    return prerequisite?.completed === true || progressService.computeBestScore(prerequisite?.bestScore, prerequisite?.score) >= 60;
  }, [topicProgressById]);

  const isTopicCompleted = useCallback((topicId) => {
    if (!topicId) return false;
    return topicProgressById.get(topicId)?.completed === true;
  }, [topicProgressById]);

  const recommendedTopics = useMemo(() => {
    return gradeTopics
      .filter((topic) => isTopicUnlocked(topic.id) && !isTopicCompleted(topic.id))
      .filter((topic) => selectedSubjects.length === 0 || selectedSubjects.includes(topic.subjectId))
      .slice(0, 5);
  }, [gradeTopics, isTopicUnlocked, isTopicCompleted, selectedSubjects]);

  const weakAreas = useMemo(
    () => progressService.deriveWeakAreas(topicProgressById),
    [topicProgressById]
  );

  const progress = useMemo(() => ({
    ...summary,
    xpTotal,
    coinsTotal,
    level: summary?.level || levelInfo.level,
    streak,
    starsTotal,
    completedTopics,
    completedBosses,
    completedTopicsCount,
    completedBossesCount,
    currentGrade,
    currentWorld
  }), [summary, xpTotal, coinsTotal, streak, starsTotal, completedTopics, completedBosses, completedTopicsCount, completedBossesCount, currentGrade, currentWorld, levelInfo.level]);

  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    window.setTimeout(() => setNotification(null), 4000);
  }, []);

  const checkAndGrantAchievements = useCallback(async ({ comboMax, won, totalBattlesWon }) => {
    if (!user?.uid || !won) return;
    const earned = new Set(achievements.map((achievement) => achievement.id));
    const toGrant = [];

    if (totalBattlesWon === 1 && !earned.has('first-victory')) {
      toGrant.push({ id: 'first-victory', name: 'First Blood', icon: '⚔️', rarity: 'common' });
    }

    if (comboMax >= 5 && !earned.has('combo-5')) {
      toGrant.push({ id: 'combo-5', name: 'Combo Master', icon: '🔥', rarity: 'rare' });
    }

    if (comboMax >= 10 && !earned.has('combo-10')) {
      toGrant.push({ id: 'combo-10', name: 'Untouchable', icon: '⚡', rarity: 'epic' });
    }

    if (totalBattlesWon >= 10 && !earned.has('ten-wins')) {
      toGrant.push({ id: 'ten-wins', name: 'Veteran', icon: '🏆', rarity: 'rare' });
    }

    if (totalBattlesWon >= 50 && !earned.has('fifty-wins')) {
      toGrant.push({ id: 'fifty-wins', name: 'Legend', icon: '👑', rarity: 'legendary' });
    }

    for (const achievement of toGrant) {
      await firestoreService.grantAchievement(user.uid, achievement);
      showNotification('achievement', `🏅 Achievement Unlocked: ${achievement.name}`);
    }
  }, [user?.uid, achievements, showNotification]);

  const completeBattle = useCallback(async ({ topicId, xpGained = 0, comboMax = 0, won = false }) => {
    if (!user?.uid) return;
    setSaving(true);

    try {
      const topic = topicId ? getTopicById(topicId) : null;
      const earnedXp = won ? xpGained : Math.floor(xpGained * 0.2);
      const stars = won ? 3 : 0;
      const currentLevel = summary?.level || levelInfo.level;
      const predictedLevel = xpEngine.calculateLevel(xpTotal + earnedXp);
      const leveledUp = predictedLevel > currentLevel;

      const latestProgress = await progressService.saveGameResult(user.uid, {
        topicId,
        gradeId: topic?.gradeId || topic?.grade || grade,
        subjectId: topic?.subjectId || null,
        chapterId: topic?.chapterId || null,
        xpEarned: earnedXp,
        score: won ? 100 : 0,
        stars,
        gameType: 'battle-arena',
        completed: won,
        passScore: 60
      });

      if (won) {
        showNotification('victory', leveledUp
          ? `⚡ Level Up! You are now Level ${predictedLevel}!`
          : `🏆 Victory! +${earnedXp} XP earned`
        );
      }

      await checkAndGrantAchievements({
        comboMax,
        won,
        totalBattlesWon: latestProgress?.completedTopicsCount || completedTopicsCount + (won ? 1 : 0)
      });
    } catch (error) {
      console.error('completeBattle error:', error);
    } finally {
      setSaving(false);
    }
  }, [user?.uid, grade, summary?.level, levelInfo.level, xpTotal, completedTopicsCount, checkAndGrantAchievements, showNotification]);

  const updateStreak = useCallback(async (newStreak) => {
    if (!user?.uid) return;
    await firestoreService.updateStreak(user.uid, newStreak);
  }, [user?.uid]);

  const analytics = useMemo(() => ({
    totalBattlesWon: completedTopicsCount,
    totalBattlesPlayed: topicDocs.length,
    totalLessonsCompleted: completedTopicsCount,
    totalBossesCompleted: completedBossesCount
  }), [completedTopicsCount, completedBossesCount, topicDocs.length]);

  const value = {
    profile,
    summary,
    grade,
    currentGrade,
    currentWorld,
    selectedSubjects,
    mySubjectObjects,
    progression: {
      xp: xpTotal,
      level: summary?.level || levelInfo.level,
      streak,
      coins: coinsTotal,
      stars: starsTotal,
      currentGrade,
      currentWorld,
    },
    levelInfo,
    achievements,
    analytics,
    progress,
    completedTopics,
    completedBosses,
    battleHistory,
    topicProgressById,
    bossProgressById,
    recommendedTopics,
    weakAreas,
    isTopicUnlocked,
    isTopicCompleted,
    completeBattle,
    updateStreak,
    saving,
    notification,
    showNotification,
    isLoaded: !!profile || !!summary
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
