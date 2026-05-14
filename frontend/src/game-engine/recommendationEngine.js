/**
 * Recommendation Engine - Simple AI heuristic for next actions
 */

export const recommendationEngine = {
  getNextAction: (userStats) => {
    if (userStats.streak === 0) {
      return { type: 'URGENT', title: 'Save your streak!', action: '/courses' };
    }
    if (userStats.weakestSubject) {
      return { type: 'PRACTICE', title: `Review ${userStats.weakestSubject}`, action: '/labs' };
    }
    return { type: 'PROGRESSION', title: 'Continue Quest', action: '/quest-map' };
  }
};
