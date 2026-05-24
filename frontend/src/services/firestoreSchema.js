/**
 * LearnCraft canonical Firestore schema.
 *
 * users/{uid}
 *   fullName: string
 *   email: string
 *   photoURL: string | null
 *   onboardingCompleted: boolean
 *   createdAt: timestamp
 *   updatedAt: timestamp
 *
 * userProgress/{uid}
 *   userId: string
 *   xpTotal: number
 *   level: number
 *   starsTotal: number
 *   currentGrade: string | null
 *   currentWorld: string | null
 *   completedTopicsCount: number
 *   completedBossesCount: number
 *   lastActiveAt: timestamp | null
 *   updatedAt: timestamp
 *
 * userProgress/{uid}/topics/{topicId}
 *   topicId: string
 *   gradeId: string | null
 *   subjectId: string | null
 *   chapterId: string | null
 *   gameType: string | null
 *   completed: boolean
 *   bestScore: number
 *   stars: number
 *   attempts: number
 *   xpEarned: number
 *   bossUnlocked: boolean
 *   lastPlayedAt: timestamp | null
 *   updatedAt: timestamp
 *
 * userProgress/{uid}/bosses/{bossId}
 *   bossId: string
 *   topicId: string | null
 *   gradeId: string | null
 *   subjectId: string | null
 *   chapterId: string | null
 *   completed: boolean
 *   bestScore: number
 *   attempts: number
 *   xpEarned: number
 *   completedAt: timestamp | null
 *   updatedAt: timestamp
 *
 * leaderboards/{season}/entries/{uid}
 *   uid: string
 *   name: string
 *   xpTotal: number
 *   level: number
 *   streak: number
 *   updatedAt: timestamp
 */

export const FIRESTORE_SCHEMAS = {
  USERS: 'users',
  USER_PROGRESS: 'userProgress',
  TOPICS: 'topics',
  BOSSES: 'bosses',
  LEADERBOARDS: 'leaderboards',
};

export const CANONICAL_PROGRESS_SCHEMA = {
  userProgress: {
    userId: 'string',
    xpTotal: 'number',
    level: 'number',
    starsTotal: 'number',
    currentGrade: 'string | null',
    currentWorld: 'string | null',
    completedTopicsCount: 'number',
    completedBossesCount: 'number',
    lastActiveAt: 'timestamp | null',
    updatedAt: 'timestamp',
  },
  topicResult: {
    topicId: 'string',
    gradeId: 'string | null',
    subjectId: 'string | null',
    chapterId: 'string | null',
    gameType: 'string | null',
    completed: 'boolean',
    bestScore: 'number',
    stars: 'number',
    attempts: 'number',
    xpEarned: 'number',
    bossUnlocked: 'boolean',
    lastPlayedAt: 'timestamp | null',
    updatedAt: 'timestamp',
  },
  bossResult: {
    bossId: 'string',
    topicId: 'string | null',
    gradeId: 'string | null',
    subjectId: 'string | null',
    chapterId: 'string | null',
    completed: 'boolean',
    bestScore: 'number',
    attempts: 'number',
    xpEarned: 'number',
    completedAt: 'timestamp | null',
    updatedAt: 'timestamp',
  },
};
