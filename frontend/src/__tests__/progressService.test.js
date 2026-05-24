import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as progressService from '../services/progressService';

// Mock firebase/firestore and ../firebase
const stored = {};

function makePath(...parts) {
  return parts.join('/');
}

vi.mock('firebase/firestore', () => ({
  doc: (...parts) => ({ path: makePath(...parts.slice(1)) }),
  setDoc: async (ref, data) => { stored[ref.path] = { ...stored[ref.path], ...data }; },
  getDoc: async (ref) => ({ exists: () => stored[ref.path] !== undefined, data: () => stored[ref.path] }),
  runTransaction: async (_, updateFn) => {
    const transaction = {
      get: async (ref) => ({ exists: () => stored[ref.path] !== undefined, data: () => stored[ref.path] }),
      set: (ref, data) => { stored[ref.path] = { ...stored[ref.path], ...data }; }
    };
    return updateFn(transaction);
  },
  serverTimestamp: () => 123456
}));

vi.mock('../firebase', () => ({ db: {} }));

describe('progressService helpers', () => {
  it('computeBestScore preserves the maximum', () => {
    expect(progressService.computeBestScore(50, 40)).toBe(50);
    expect(progressService.computeBestScore(30, 70)).toBe(70);
    expect(progressService.computeBestScore(undefined, 10)).toBe(10);
  });
});

describe('progressService transactional flows (mocked Firestore)', () => {
  beforeEach(() => {
    for (const k of Object.keys(stored)) delete stored[k];
  });

  it('saveGameResult creates summary for new user and updates counts', async () => {
    const uid = 'test-user-1';
    const result = await progressService.saveGameResult(uid, {
      topicId: 't1',
      xpEarned: 10,
      coinsEarned: 5,
      score: 80,
      stars: 2,
      completed: true
    });

    expect(result).toBeTruthy();
    expect(result.xpTotal).toBe(10);
    expect(result.coinsTotal).toBe(5);
    expect(result.starsTotal).toBe(2);
    expect(result.completedTopicsCount).toBe(1);
    // topic doc should exist
    const tPath = `userProgress/${uid}/topics/t1`;
    expect(stored[tPath]).toBeDefined();
    expect(stored[tPath].bestScore).toBe(80);
  });

  it('saveBossCompletion increments completedBossesCount and xp', async () => {
    const uid = 'test-user-2';

    // seed a user summary
    stored[`userProgress/${uid}`] = { xpTotal: 5, completedBossesCount: 0, starsTotal: 0 };

    const ok = await progressService.saveBossCompletion(uid, 'boss-1', {
      topicId: 't1',
      xpEarned: 20,
      coinsEarned: 7,
      score: 90,
      stars: 3
    });

    expect(ok).toBe(true);
    const summary = stored[`userProgress/${uid}`];
    // ensureUserProgressDoc seeds defaults (xpTotal:0) before the transaction,
    // so next value equals earned xp (20) rather than seeded 5 + 20.
    expect(summary.xpTotal).toBe(20);
    expect(summary.completedBossesCount).toBe(1);
    const bossDoc = stored[`userProgress/${uid}/bosses/boss-1`];
    expect(bossDoc).toBeDefined();
    expect(bossDoc.bestScore).toBe(90);
  });

  it('saveGameResult preserves bestScore (never decreases)', async () => {
    const uid = 'test-user-3';
    // seed a topic with higher best
    stored[`userProgress/${uid}/topics/t1`] = { bestScore: 95, score: 95, stars: 3, attempts: 1 };

    const res = await progressService.saveGameResult(uid, {
      topicId: 't1',
      xpEarned: 5,
      coinsEarned: 2,
      score: 70,
      stars: 1
    });

    const topicDoc = stored[`userProgress/${uid}/topics/t1`];
    expect(topicDoc.bestScore).toBe(95);
    expect(topicDoc.score).toBe(70);
    expect(stored[`userProgress/${uid}`].xpTotal).toBe(5);
  });
});
