/**
 * Quest Engine - Manages active quests and progression
 */

export const questEngine = {
  generateDailyQuests: (userLevel) => {
    return [
      { id: 'q1', type: 'LESSONS', target: 3, progress: 0, reward: 100, title: 'Complete 3 Lessons' },
      { id: 'q2', type: 'ARENA', target: 1, progress: 0, reward: 150, title: 'Win an Arena Battle' },
      { id: 'q3', type: 'PERFECT_QUIZ', target: 1, progress: 0, reward: 200, title: 'Get 100% on a Quiz' }
    ];
  },

  updateQuestProgress: (quests, actionType, amount = 1) => {
    return quests.map(q => {
      if (q.type === actionType && q.progress < q.target) {
        return { ...q, progress: Math.min(q.target, q.progress + amount) };
      }
      return q;
    });
  }
};
