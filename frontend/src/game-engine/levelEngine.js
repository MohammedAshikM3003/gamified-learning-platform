/**
 * Level Engine - Handles XP to Level conversion and Tier logic
 */

const BASE_XP_REQUIREMENT = 1000;
const SCALING_FACTOR = 1.2;

export const levelEngine = {
  calculateLevel: (totalXP) => {
    let level = 1;
    let xpRequired = BASE_XP_REQUIREMENT;
    let currentXP = totalXP;

    while (currentXP >= xpRequired) {
      currentXP -= xpRequired;
      level++;
      xpRequired = Math.round(xpRequired * SCALING_FACTOR);
    }

    return {
      level,
      currentLevelXP: currentXP,
      xpToNextLevel: xpRequired,
      progressPercentage: (currentXP / xpRequired) * 100
    };
  },

  getTierName: (level) => {
    if (level >= 50) return 'Grandmaster';
    if (level >= 40) return 'Master';
    if (level >= 30) return 'Diamond';
    if (level >= 20) return 'Platinum';
    if (level >= 10) return 'Gold';
    if (level >= 5) return 'Silver';
    return 'Bronze';
  }
};
