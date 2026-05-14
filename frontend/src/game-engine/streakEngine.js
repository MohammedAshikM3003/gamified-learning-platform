/**
 * Streak Engine - Manages daily logins and streak freezes
 */

export const streakEngine = {
  calculateStreak: (lastLoginDate, currentStreak, streakFreezes) => {
    const today = new Date();
    const lastLogin = new Date(lastLoginDate);
    const diffTime = Math.abs(today - lastLogin);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Already logged in today
      return { streak: currentStreak, freezesUsed: 0, status: 'active' };
    }

    if (diffDays === 1) {
      // Consecutive day
      return { streak: currentStreak + 1, freezesUsed: 0, status: 'active' };
    }

    if (diffDays > 1 && streakFreezes > 0) {
      // Missed a day but has freezes
      const freezesNeeded = diffDays - 1;
      if (streakFreezes >= freezesNeeded) {
        return { 
          streak: currentStreak + 1, 
          freezesUsed: freezesNeeded, 
          status: 'frozen' 
        };
      }
    }

    // Streak lost
    return { streak: 1, freezesUsed: 0, status: 'lost' };
  }
};
