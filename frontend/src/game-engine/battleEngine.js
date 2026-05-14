/**
 * Battle Engine — Calculates damage, XP, and battle outcomes
 * Based on Phase 1 roadmap spec
 */

export const battleEngine = {
  /** Damage dealt to enemy on correct answer */
  calculateDamage: (difficulty, combo = 0) => {
    let base;
    switch (difficulty) {
      case 'easy':   base = 10; break;
      case 'medium': base = 20; break;
      case 'hard':   base = 35; break;
      default:       base = 5;
    }
    const comboBonus = combo >= 3 ? 1.5 : combo >= 2 ? 1.25 : 1.0;
    return Math.round(base * comboBonus);
  },

  /** Damage dealt to player on wrong answer */
  calculatePlayerDamage: (difficulty) => {
    switch (difficulty) {
      case 'easy':   return 10;
      case 'medium': return 20;
      case 'hard':   return 30;
      default:       return 10;
    }
  },

  /** Check if battle is over */
  isBattleOver: (enemyHp, playerHp) => ({
    victory: enemyHp <= 0,
    defeat: playerHp <= 0,
  }),
};
