import {
  getFirestore, doc, setDoc, getDoc, updateDoc,
  onSnapshot, serverTimestamp,
  collection, query, orderBy, limit, getDocs
} from 'firebase/firestore';
import { app } from '../firebase.js';
import * as progressService from './progressService';

const db = getFirestore(app);

export const firestoreService = {

  // ── Profile ─────────────────────────────────────────────
  createUserProfile: async (uid, userData) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        onboardingCompleted: false,
        selectedSubjects: [],
        profile: { grade: '', difficulty: '', learningGoals: [] },
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  getUserProfile: async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // ── Real-time profile listener ────────────────────────────
  subscribeToProfile: (uid, callback) => {
    const userRef = doc(db, 'users', uid);
    return onSnapshot(userRef, (snap) => {
      if (snap.exists()) callback(snap.data());
    });
  },

  updateUserProfile: async (uid, userData) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, userData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // ── Onboarding ───────────────────────────────────────────
  completeOnboarding: async (uid, onboardingData) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        onboardingCompleted: true,
        selectedSubjects: onboardingData.selectedSubjects || [],
        profile: {
          grade: onboardingData.grade || 'grade10',
          difficulty: onboardingData.difficulty || 'intermediate',
          learningGoals: onboardingData.learningGoals || [],
        },
        completedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  },

  // ── XP & Progression ─────────────────────────────────────
  updateUserStats: async (uid, newProgression) => {
    try {
      // Persist high-level progression into canonical `userProgress` document
      await progressService.initializeUserProgress(uid);
      const progressRef = doc(db, 'userProgress', uid);
      await setDoc(progressRef, {
        xpTotal: newProgression.xpTotal ?? newProgression.xp ?? 0,
        coinsTotal: newProgression.coinsTotal ?? newProgression.coins ?? 0,
        level: newProgression.level ?? 1,
        streak: newProgression.streak ?? 0,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  },

  // ── Battle Completion ─────────────────────────────────────
  /**
   * Called when a player wins a battle.
   * Saves: XP gained, topic completed, battle history entry, analytics update.
   */
  completeBattle: async (uid, { topicId, xpGained, newXp, newLevel, comboMax, won }) => {
    try {
      // Write topic-level result and increment canonical XP totals
      await progressService.saveGameResult(uid, {
        topicId,
        xpEarned: xpGained,
        score: won ? 100 : 0,
        stars: won ? 3 : 0,
        gameType: 'battle',
      });
    } catch (error) {
      console.error('Error saving battle result:', error);
      throw error;
    }
  },

  // ── Topic unlock ─────────────────────────────────────────
  unlockTopic: async (uid, topicId) => {
    try {
      // Topic unlocking is derived from curriculum prerequisites and completed topics.
      // This helper is retained for backwards compatibility but no longer mutates progress.
      return { uid, topicId, skipped: true };
    } catch (error) {
      console.error('Error unlocking topic:', error);
      throw error;
    }
  },

  // ── Streak update ─────────────────────────────────────────
  updateStreak: async (uid, streak) => {
    try {
      // persist streak in canonical userProgress doc
      const progressRef = doc(db, 'userProgress', uid);
      await setDoc(progressRef, { streak, lastActiveAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  },

  // ── Achievement grant ────────────────────────────────────
  grantAchievement: async (uid, achievement) => {
    try {
      // add achievement into canonical userProgress achievements array
      const progressRef = doc(db, 'userProgress', uid);
      await setDoc(progressRef, {
        achievements: arrayUnion({ ...achievement, earnedAt: new Date().toISOString() }),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Error granting achievement:', error);
      throw error;
    }
  },
  // ── Leaderboard ──────────────────────────────────────────
  getTopUsers: async (limitCount = 50) => {
    try {
      // Query canonical `userProgress` documents for leaderboard
      const usersRef = collection(db, 'userProgress');
      const q = query(usersRef, orderBy('xpTotal', 'desc'), limit(limitCount));
      const querySnapshot = await getDocs(q);
      const topUsers = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        topUsers.push({
          id: docSnap.id,
          name: data.fullName || 'Anonymous',
          xp: data.xpTotal || 0,
          level: data.level || 1,
          streak: data.streak || 0,
        });
      });
      return topUsers;
    } catch (error) {
      console.error('Error getting top users:', error);
      throw error;
    }
  },
};
