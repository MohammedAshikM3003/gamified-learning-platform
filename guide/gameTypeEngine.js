/**
 * gameTypeEngine.js
 * 
 * Unified XP and reward system across all game types
 * Each game type has different mechanics but same progression system
 */

export const gameTypeEngine = {
  /**
   * Get the XP multiplier for a game type
   * Different games teach in different ways, so different XP values
   */
  getGameTypeMultiplier: (gameType) => {
    const multipliers = {
      'battle-arena': 1.0,        // baseline combat, balanced difficulty
      'quiz-blitz': 0.9,          // speed reward, less deep learning
      'match-pairs': 0.8,         // lower cognitive load, lower XP
      'tower-defense': 1.1,       // requires strategic ordering, more value
      'story-quest': 1.2,         // narrative engagement, high retention
      'puzzle-mode': 1.3,         // deepest learning, transfer learning
      'flashcard-duel': 1.0,      // competitive fairness
      'time-odyssey': 0.7,        // passive gameplay, lower XP
      'boss-gauntlet': 1.4,       // high risk/reward, hardest mode
    };
    return multipliers[gameType] || 1.0;
  },

  /**
   * Calculate final XP reward for a completed game
   * 
   * @param baseXP {number} - starting XP value
   * @param gameType {string} - type of game played
   * @param accuracy {number} - 0-1, accuracy/correctness percentage
   * @param difficulty {string} - 'easy' | 'normal' | 'hard'
   * @returns {number} - final XP to award
   */
  calculateGameXP: (baseXP, gameType, accuracy, difficulty) => {
    const typeMultiplier = gameTypeEngine.getGameTypeMultiplier(gameType);
    
    // Accuracy bonus: reward correctness
    let accuracyBonus = 1.0;
    if (accuracy > 0.95) accuracyBonus = 1.4;      // flawless
    else if (accuracy > 0.9) accuracyBonus = 1.3;  // excellent
    else if (accuracy > 0.8) accuracyBonus = 1.2;  // very good
    else if (accuracy > 0.7) accuracyBonus = 1.1;  // good
    else if (accuracy > 0.5) accuracyBonus = 1.0;  // passing
    else accuracyBonus = 0.7;                      // needs work

    // Difficulty bonus: reward harder choices
    const difficultyBonus = {\n      easy: 0.7,\n      normal: 1.0,\n      hard: 1.5,\n      expert: 2.0,\n    }[difficulty] || 1.0;\n    
n    const finalXP = Math.round(baseXP * typeMultiplier * accuracyBonus * difficultyBonus);\n    return Math.max(10, finalXP); // minimum 10 XP\n  },\n\n  /**\n   * Award coins based on performance\n   * Used for the gem/coin economy\n   */\n  calculateCoinsEarned: (gameType, accuracy, difficulty, timeTaken) => {\n    const difficultyCoins = { easy: 5, normal: 10, hard: 15, expert: 25 }[difficulty] || 10;\n    const accuracyBonus = accuracy > 0.8 ? 1.2 : 1.0;\n    const speedBonus = timeTaken < 60 ? 1.1 : timeTaken < 120 ? 1.0 : 0.9;\n    \n    return Math.round(difficultyCoins * accuracyBonus * speedBonus);\n  },\n\n  /**\n   * Determine if a \"perfect game\" achievement should unlock\n   */\n  isPerfectGame: (accuracy, gameType) => {\n    // Different thresholds for different game types\n    const thresholds = {\n      'match-pairs': 0.95,       // tougher for memory game\n      'puzzle-mode': 0.98,       // toughest, requires perfection\n      'story-quest': 0.9,        // story is forgiving\n      'quiz-blitz': 0.92,        // must be fast AND accurate\n      'default': 0.9,\n    };\n    const threshold = thresholds[gameType] || thresholds.default;\n    return accuracy >= threshold;\n  },\n\n  /**\n   * Calculate combo/streak bonus for back-to-back games\n   * If user plays 3 games in a row, bonus XP\n   */\n  getConsecutiveGameBonus: (consecutiveGamesPlayed) => {\n    if (consecutiveGamesPlayed < 3) return 1.0;         // no bonus\n    if (consecutiveGamesPlayed < 5) return 1.1;         // +10%\n    if (consecutiveGamesPlayed < 7) return 1.2;         // +20%\n    return 1.3;                                         // +30% for 7+\n  },\n\n  /**\n   * Determine if user unlocked a \"mastery\" achievement\n   * After completing 10 games on same topic, user masters it\n   */\n  checkMasteryUnlock: (topicGameCount, accuracy, difficulty) => {\n    // Need 10 plays at normal+ difficulty with avg 75%+ accuracy\n    return topicGameCount >= 10 && accuracy > 0.75 && difficulty !== 'easy';\n  },\n\n  /**\n   * Save game result to Firestore\n   * Called after ANY game completes\n   */\n  saveGameResult: async (userId, gameType, topicId, result, firestoreService) => {\n    // result = {\n    //   accuracy,           // 0-1\n    //   score,              // points\n    //   timeTaken,          // seconds\n    //   won,                // boolean\n    //   difficulty,         // 'easy' | 'normal' | 'hard'\n    //   xpEarned,           // final XP\n    //   questionsTotal,     // for MCQ games\n    //   correctCount,       // for MCQ games\n    // }\n\n    try {\n      const gameResultData = {\n        gameType,\n        topicId,\n        ...result,\n        timestamp: new Date().toISOString(),\n        userId, // redundant but useful for queries\n      };\n\n      // Save to: users/{uid}/gameResults/{gameType}/{topicId}/{id}\n      const resultPath = `users/${userId}/gameResults/${gameType}/${topicId}`;\n      \n      // Using firestoreService (passed in)\n      if (firestoreService && firestoreService.addDocument) {\n        await firestoreService.addDocument(resultPath, gameResultData);\n      } else {\n        console.error('firestoreService not provided to gameTypeEngine.saveGameResult');\n      }\n\n      return gameResultData;\n    } catch (error) {\n      console.error('Failed to save game result:', error);\n      throw error;\n    }\n  },\n\n  /**\n   * Get game type statistics (for analytics)\n   * Shows which game types user plays most\n   */\n  getGameTypeStats: (gameResults) => {\n    // gameResults = array of all game results\n    const stats = {};\n\n    gameResults.forEach(result => {\n      const type = result.gameType;\n      if (!stats[type]) {\n        stats[type] = {\n          gamesPlayed: 0,\n          totalXP: 0,\n          avgAccuracy: 0,\n          avgTime: 0,\n          winsCount: 0,\n        };\n      }\n\n      stats[type].gamesPlayed += 1;\n      stats[type].totalXP += result.xpEarned || 0;\n      stats[type].avgAccuracy += result.accuracy || 0;\n      stats[type].avgTime += result.timeTaken || 0;\n      if (result.won) stats[type].winsCount += 1;\n    });\n\n    // Calculate averages\n    Object.keys(stats).forEach(type => {\n      const count = stats[type].gamesPlayed;\n      stats[type].avgAccuracy = (stats[type].avgAccuracy / count).toFixed(2);\n      stats[type].avgTime = (stats[type].avgTime / count).toFixed(1);\n    });\n\n    return stats;\n  },\n\n  /**\n   * Check if user qualifies for \"Game Master\" achievement\n   * Must play at least 3 different game types\n   */\n  checkGameMasterUnlock: (gameResults) => {\n    const gameTypes = new Set(gameResults.map(r => r.gameType));\n    return gameTypes.size >= 3;\n  },\n\n  /**\n   * Speed bonus for games with time component\n   * Used by QuizBlitz and similar speed-based games\n   */\n  getSpeedBonus: (timeTaken, baseTime) => {\n    // baseTime = time allotted for the game\n    const ratio = timeTaken / baseTime;\n    \n    if (ratio < 0.25) return 1.5;      // 50%+ faster = huge bonus\n    if (ratio < 0.5) return 1.3;       // 2x faster = big bonus\n    if (ratio < 0.75) return 1.1;      // 33% faster = small bonus\n    if (ratio < 1.0) return 1.0;       // on time = normal\n    return Math.max(0.7, 1 - (ratio - 1) * 0.3); // slower = small penalty\n  },\n};\n\nexport default gameTypeEngine;\n