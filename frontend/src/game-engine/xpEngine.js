/**
 * XP Engine — Calculates XP rewards based on difficulty and combo
 * Formula: Level = Math.floor(Math.sqrt(xp / 100))
 */

export const xpEngine = {
  /** Calculate XP for answering a question correctly */
  calculateXP: (difficulty, comboMultiplier = 1) => {
    let base;
    switch (difficulty) {
      case 'easy':   base = 20; break;
      case 'medium': base = 40; break;
      case 'hard':   base = 70; break;
      default:       base = 10;
    }
    return Math.round(base * comboMultiplier);
  },

  /** Level formula from roadmap spec */
  calculateLevel: (xp) => Math.floor(Math.sqrt(xp / 100)),

  /** XP required to reach a given level */
  xpForLevel: (level) => level * level * 100,

  /** XP progress within the current level */
  getLevelProgress: (xp) => {
    const level = Math.floor(Math.sqrt((xp || 0) / 100));
    const currentLevelXp = level * level * 100;
    const nextLevelXp    = (level + 1) * (level + 1) * 100;
    return {
      level,
      currentLevelXP: xp - currentLevelXp,  // XP earned in this level
      xpToNextLevel:  nextLevelXp - xp,
      progressPercentage: Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100),
    };
  },

  /** Tier name based on level */
  getTierName: (level) => {
    if (level >= 20) return 'GRAND MASTER';
    if (level >= 15) return 'LEGEND';
    if (level >= 10) return 'ELITE';
    if (level >= 7)  return 'ADVANCED';
    if (level >= 4)  return 'SCHOLAR';
    if (level >= 2)  return 'APPRENTICE';
    return 'NOVICE';
  },

  /** Combo multiplier for streaks of correct answers */
  getComboMultiplier: (combo) => {
    if (combo >= 5) return 2.0;
    if (combo >= 3) return 1.5;
    if (combo >= 2) return 1.25;
    return 1.0;
  },

  // Legacy method kept for compatibility
  calculateReward: (actionType, streakMultiplier = 1, performanceBonus = 0) => {
    const BASE_REWARDS = {
      LESSON_COMPLETE: 50,
      QUIZ_CORRECT: 10,
      BATTLE_WIN: 100,
      DAILY_LOGIN: 20,
      QUEST_COMPLETE: 200,
    };
    const baseXP = BASE_REWARDS[actionType] || 0;
    return Math.round(baseXP * streakMultiplier + performanceBonus);
  },

  getMultiplierForStreak: (streakDays) => {
    if (streakDays >= 30) return 2.0;
    if (streakDays >= 14) return 1.5;
    if (streakDays >= 7) return 1.2;
    return 1.0;
  },
};
