/**
 * Firestore Schema Definitions
 * 
 * users/{userId}:
 *   displayName: string
 *   email: string
 *   createdAt: timestamp
 *   onboardingCompleted: boolean
 * 
 * users/{userId}/stats/main:
 *   level: number
 *   xp: number
 *   streak: number
 *   streakFreezes: number
 *   lastLoginDate: timestamp
 *   lessonsCompleted: number
 *   bossesDefeated: number
 *   weakestSubject: string
 * 
 * users/{userId}/achievements:
 *   unlocked: array<string> (e.g. ['fb', 'sw'])
 * 
 * users/{userId}/quests:
 *   active: array<object>
 * 
 * users/{userId}/battles:
 *   history: array<object>
 */

export const FIRESTORE_SCHEMAS = {
  USERS: 'users',
  USER_STATS: 'stats',
  USER_ACHIEVEMENTS: 'achievements',
  USER_QUESTS: 'quests',
  USER_BATTLES: 'battles'
};
