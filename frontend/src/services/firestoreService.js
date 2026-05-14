import {
  getFirestore, doc, setDoc, getDoc, updateDoc,
  arrayUnion, increment, onSnapshot, serverTimestamp,
  collection, query, orderBy, limit, getDocs
} from 'firebase/firestore';
import { app } from '../firebase.js';

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
        progression: { level: 1, xp: 0, streak: 0, coins: 0, rank: 'Bronze' },
        progress: {
          completedTopics: [],
          completedChapters: [],
          unlockedTopics: [],
          battleHistory: [],
        },
        analytics: {
          weakSubjects: [],
          strongSubjects: [],
          totalBattlesWon: 0,
          totalBattlesPlayed: 0,
          totalLessonsCompleted: 0,
        },
        achievements: [],
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
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { progression: newProgression }, { merge: true });
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
      const userRef = doc(db, 'users', uid);
      const battleEntry = {
        topicId,
        xpGained,
        comboMax,
        won,
        playedAt: new Date().toISOString(),
      };

      await setDoc(userRef, {
        progression: { xp: newXp, level: newLevel },
        progress: {
          completedTopics: arrayUnion(topicId),
          battleHistory: arrayUnion(battleEntry),
        },
        analytics: {
          totalBattlesPlayed: increment(1),
          ...(won ? { totalBattlesWon: increment(1) } : {}),
          totalLessonsCompleted: increment(won ? 1 : 0),
        },
      }, { merge: true });
    } catch (error) {
      console.error('Error saving battle result:', error);
      throw error;
    }
  },

  // ── Topic unlock ─────────────────────────────────────────
  unlockTopic: async (uid, topicId) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        progress: { unlockedTopics: arrayUnion(topicId) },
      }, { merge: true });
    } catch (error) {
      console.error('Error unlocking topic:', error);
      throw error;
    }
  },

  // ── Streak update ─────────────────────────────────────────
  updateStreak: async (uid, streak) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        progression: { streak },
        lastActiveAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  },

  // ── Achievement grant ────────────────────────────────────
  grantAchievement: async (uid, achievement) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        achievements: arrayUnion({ ...achievement, earnedAt: new Date().toISOString() }),
      }, { merge: true });
    } catch (error) {
      console.error('Error granting achievement:', error);
      throw error;
    }
  },
  // ── Leaderboard ──────────────────────────────────────────
  getTopUsers: async (limitCount = 50) => {
    try {
      const usersRef = collection(db, 'users');
      // Order by XP descending
      const q = query(usersRef, orderBy('progression.xp', 'desc'), limit(limitCount));
      const querySnapshot = await getDocs(q);
      const topUsers = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        topUsers.push({
          id: doc.id,
          name: data.fullName || 'Anonymous',
          xp: data.progression?.xp || 0,
          level: data.progression?.level || 1,
          streak: data.progression?.streak || 0,
        });
      });
      return topUsers;
    } catch (error) {
      console.error('Error getting top users:', error);
      throw error;
    }
  },
};
