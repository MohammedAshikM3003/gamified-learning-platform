import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '../firebase.js';

// Initialize Firestore with the shared Firebase app instance
const db = getFirestore(app);

export const firestoreService = {
  // Create or update user profile
  createUserProfile: async (uid, userData) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date(),
        onboardingCompleted: false,
        profile: {
          grade: "College",
          studyGoal: "Placement Preparation",
          learningStyle: "Interactive",
        },
        subjects: ["Programming", "Mathematics"], // Default
        progression: {
          level: 1,
          xp: 0,
          streak: 0,
          rank: "Bronze",
          streakFreezes: 0
        },
        analytics: {
          weakSubjects: ["Mathematics"],
          strongSubjects: ["Programming"],
          totalLessonsCompleted: 0
        },
        achievements: []
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (uid, userData) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, userData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Mark onboarding as completed
  completeOnboarding: async (uid, onboardingData) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        onboardingCompleted: true,
        subjects: onboardingData.selectedSubjects || ["Programming"],
        profile: {
          grade: onboardingData.grade || "College",
          studyGoal: onboardingData.learningGoals?.[0] || "Learning",
          learningStyle: onboardingData.learningStyle || "Interactive"
        },
        completedAt: new Date(),
      }, { merge: true });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  },

  // Update user XP and streak (Deep merge progression object)
  updateUserStats: async (uid, newProgression) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        progression: newProgression
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  },
};
