/**
 * Achievements Engine - Validates unlock conditions for badges
 */

export const BADGE_DEFINITIONS = {
  FIRST_BLOOD: { id: 'fb', title: 'First Blood', description: 'Complete your first lesson.', type: 'learning' },
  STREAK_WEEK: { id: 'sw', title: '7-Day Warrior', description: 'Maintain a 7-day streak.', type: 'consistency' },
  BOSS_SLAYER: { id: 'bs', title: 'Boss Slayer', description: 'Defeat your first arena boss.', type: 'mastery' },
  NIGHT_OWL: { id: 'no', title: 'Night Owl', description: 'Complete a lesson after midnight.', type: 'exploration' },
};

export const achievementsEngine = {
  checkUnlocks: (userStats, currentAchievements) => {
    const newUnlocks = [];

    // Check First Blood
    if (!currentAchievements.includes(BADGE_DEFINITIONS.FIRST_BLOOD.id) && userStats.lessonsCompleted > 0) {
      newUnlocks.push(BADGE_DEFINITIONS.FIRST_BLOOD);
    }

    // Check Streak
    if (!currentAchievements.includes(BADGE_DEFINITIONS.STREAK_WEEK.id) && userStats.streak >= 7) {
      newUnlocks.push(BADGE_DEFINITIONS.STREAK_WEEK);
    }

    // Check Boss Slayer
    if (!currentAchievements.includes(BADGE_DEFINITIONS.BOSS_SLAYER.id) && userStats.bossesDefeated > 0) {
      newUnlocks.push(BADGE_DEFINITIONS.BOSS_SLAYER);
    }

    return newUnlocks;
  }
};
