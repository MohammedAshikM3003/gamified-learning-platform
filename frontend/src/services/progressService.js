import {
  doc,
  setDoc,
  getDoc,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const PASS_SCORE = 60;

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function coalesce(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return null;
}

export function calculateLevel(xpTotal) {
  return Math.max(1, Math.floor(Math.sqrt(Math.max(0, toNumber(xpTotal)) / 100)) + 1);
}

export function computeBestScore(previousScore = 0, nextScore = 0) {
  return Math.max(toNumber(previousScore), toNumber(nextScore));
}

export async function ensureUserProgressDoc(userId, defaults = {}) {
  if (!userId) throw new Error('userId required');

  const ref = doc(db, 'userProgress', userId);
  await setDoc(
    ref,
    {
      userId,
      ...defaults,
      createdAt: defaults.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  return ref;
}

export async function initializeUserProgress(userId) {
  return ensureUserProgressDoc(userId, {
    xpTotal: 0,
    coinsTotal: 0,
    level: 1,
    streak: 0,
    starsTotal: 0,
    completedTopicsCount: 0,
    completedBossesCount: 0,
    currentGrade: null,
    currentWorld: null
  });
}

export function mapTopicsById(topicDocs = []) {
  const map = new Map();

  for (const item of topicDocs) {
    if (!item) continue;
    const topicId = item.topicId || item.id;
    if (!topicId) continue;
    map.set(topicId, item);
  }

  return map;
}

export function deriveCompletedTopics(topicMap = new Map()) {
  const completed = [];

  for (const [topicId, topic] of topicMap.entries()) {
    if (topic?.completed === true) completed.push(topicId);
  }

  return completed;
}

export function deriveWeakAreas(topicMap = new Map()) {
  const weakCounts = new Map();

  for (const topic of topicMap.values()) {
    if (!topic) continue;
    const bestScore = computeBestScore(topic.bestScore, topic.score);
    if (bestScore >= PASS_SCORE) continue;

    const subjectId = topic.subjectId || topic.subject || null;
    if (!subjectId) continue;

    weakCounts.set(subjectId, (weakCounts.get(subjectId) || 0) + 1);
  }

  return Array.from(weakCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([subjectId]) => subjectId);
}

export async function getUserProgress(userId) {
  if (!userId) return null;
  const ref = doc(db, 'userProgress', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function getTopicProgress(userId, topicId) {
  if (!userId || !topicId) return null;
  const ref = doc(db, 'userProgress', userId, 'topics', topicId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function getBossProgress(userId, bossId) {
  if (!userId || !bossId) return null;
  const ref = doc(db, 'userProgress', userId, 'bosses', bossId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export function isBossUnlocked(progress, passScore = PASS_SCORE) {
  if (!progress) return false;
  const bestScore = computeBestScore(progress.bestScore, progress.score);
  return progress.completed === true || progress.bossUnlocked === true || bestScore >= passScore;
}

export async function saveGameResult(userId, payload = {}) {
  if (!userId) throw new Error('userId required');

  const progressRef = doc(db, 'userProgress', userId);
  const topicId = payload.topicId || null;
  const passScore = toNumber(payload.passScore, PASS_SCORE);
  const earnedXp = Math.max(0, toNumber(payload.xpEarned, 0));
  const earnedCoins = Math.max(0, toNumber(payload.coinsEarned, 0));
  const incomingScore = Math.max(0, toNumber(payload.score, 0));
  const incomingStars = Math.max(0, toNumber(payload.stars, 0));

  await ensureUserProgressDoc(userId, {
    xpTotal: 0,
    coinsTotal: 0,
    level: 1,
    streak: 0,
    starsTotal: 0,
    completedTopicsCount: 0,
    completedBossesCount: 0,
    currentGrade: coalesce(payload.gradeId, payload.grade, null),
    currentWorld: coalesce(payload.worldId, payload.currentWorld, null),
    lastPlayedAt: serverTimestamp()
  });

  await runTransaction(db, async (transaction) => {
    const summarySnap = await transaction.get(progressRef);
    const summary = summarySnap.exists() ? summarySnap.data() : {};

    const topicRef = topicId ? doc(db, 'userProgress', userId, 'topics', topicId) : null;
    const topicSnap = topicRef ? await transaction.get(topicRef) : null;
    const existingTopic = topicSnap?.exists() ? topicSnap.data() : {};

    const previousBestScore = computeBestScore(existingTopic.bestScore, existingTopic.score);
    const nextBestScore = computeBestScore(previousBestScore, incomingScore);
    const previousStars = Math.max(0, toNumber(existingTopic.stars, 0));
    const nextStars = Math.max(previousStars, incomingStars);
    const nextAttempts = Math.max(0, toNumber(existingTopic.attempts, 0)) + 1;
    const completedPreviously = existingTopic.completed === true;
    const completedNow = payload.completed === true || nextBestScore >= passScore || completedPreviously;
    const bossUnlocked = payload.bossUnlocked === true || completedNow || nextBestScore >= passScore;
    const bossCompleted = payload.bossCompleted === true || existingTopic.bossCompleted === true;
    const nextTopicXp = Math.max(0, toNumber(existingTopic.xpEarned, 0)) + earnedXp;
    const nextTopicCoins = Math.max(0, toNumber(existingTopic.coinsEarned, 0)) + earnedCoins;
    const starsDelta = Math.max(0, nextStars - previousStars);

    const topicPatch = topicId
      ? {
          topicId,
          gradeId: coalesce(payload.gradeId, payload.grade, existingTopic.gradeId, null),
          subjectId: coalesce(payload.subjectId, existingTopic.subjectId, null),
          chapterId: coalesce(payload.chapterId, existingTopic.chapterId, null),
          gameType: coalesce(payload.gameType, existingTopic.gameType, null),
          score: incomingScore,
          bestScore: nextBestScore,
          stars: nextStars,
          attempts: nextAttempts,
          xpEarned: nextTopicXp,
          coinsEarned: nextTopicCoins,
          completed: completedNow,
          bossUnlocked,
          bossCompleted,
          playedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      : null;

    if (topicRef && topicPatch) {
      transaction.set(topicRef, topicPatch, { merge: true });
    }

    const nextXpTotal = Math.max(0, toNumber(summary.xpTotal, 0)) + earnedXp;
    const nextCoinsTotal = Math.max(0, toNumber(summary.coinsTotal, 0)) + earnedCoins;
    const nextStarsTotal = Math.max(0, toNumber(summary.starsTotal, 0)) + starsDelta;
    const nextCompletedTopicsCount = Math.max(0, toNumber(summary.completedTopicsCount, 0)) + (completedNow && !completedPreviously ? 1 : 0);

    transaction.set(
      progressRef,
      {
        userId,
        xpTotal: nextXpTotal,
        coinsTotal: nextCoinsTotal,
        level: calculateLevel(nextXpTotal),
        streak: toNumber(summary.streak, 0),
        starsTotal: nextStarsTotal,
        completedTopicsCount: nextCompletedTopicsCount,
        completedBossesCount: Math.max(0, toNumber(summary.completedBossesCount, 0)),
        currentGrade: coalesce(payload.gradeId, payload.grade, summary.currentGrade, null),
        currentWorld: coalesce(payload.worldId, payload.currentWorld, summary.currentWorld, null),
        lastPlayedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  });

  return getUserProgress(userId);
}

export async function saveBossCompletion(userId, bossId, payload = {}) {
  if (!userId || !bossId) throw new Error('userId and bossId required');

  const progressRef = doc(db, 'userProgress', userId);
  const bossRef = doc(db, 'userProgress', userId, 'bosses', bossId);
  const topicId = payload.topicId || null;
  const topicRef = topicId ? doc(db, 'userProgress', userId, 'topics', topicId) : null;
  const earnedXp = Math.max(0, toNumber(payload.xpEarned, 0));
  const earnedCoins = Math.max(0, toNumber(payload.coinsEarned, 0));
  const incomingScore = Math.max(0, toNumber(payload.score, 0));
  const incomingStars = Math.max(0, toNumber(payload.stars, 0));

  await ensureUserProgressDoc(userId, {
    xpTotal: 0,
    coinsTotal: 0,
    level: 1,
    streak: 0,
    starsTotal: 0,
    completedTopicsCount: 0,
    completedBossesCount: 0,
    lastPlayedAt: serverTimestamp()
  });

  await runTransaction(db, async (transaction) => {
    const summarySnap = await transaction.get(progressRef);
    const summary = summarySnap.exists() ? summarySnap.data() : {};

    const bossSnap = await transaction.get(bossRef);
    const existingBoss = bossSnap.exists() ? bossSnap.data() : {};
    const previousBestScore = computeBestScore(existingBoss.bestScore, existingBoss.score);
    const nextBestScore = computeBestScore(previousBestScore, incomingScore);
    const previousStars = Math.max(0, toNumber(existingBoss.stars, 0));
    const nextStars = Math.max(previousStars, incomingStars);
    const nextAttempts = Math.max(0, toNumber(existingBoss.attempts, 0)) + 1;
    const completedPreviously = existingBoss.completed === true;
    const starsDelta = Math.max(0, nextStars - previousStars);

    transaction.set(
      bossRef,
      {
        bossId,
        topicId: coalesce(topicId, existingBoss.topicId, null),
        gradeId: coalesce(payload.gradeId, payload.grade, existingBoss.gradeId, null),
        subjectId: coalesce(payload.subjectId, existingBoss.subjectId, null),
        chapterId: coalesce(payload.chapterId, existingBoss.chapterId, null),
        score: incomingScore,
        bestScore: nextBestScore,
        stars: nextStars,
        attempts: nextAttempts,
        xpEarned: Math.max(0, toNumber(existingBoss.xpEarned, 0)) + earnedXp,
        completed: true,
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    if (topicRef) {
      transaction.set(
        topicRef,
        {
          topicId,
          bossCompleted: true,
          bossUnlocked: true,
          completed: true,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    }

    const nextXpTotal = Math.max(0, toNumber(summary.xpTotal, 0)) + earnedXp;
    const nextCoinsTotal = Math.max(0, toNumber(summary.coinsTotal, 0)) + earnedCoins;
    const nextStarsTotal = Math.max(0, toNumber(summary.starsTotal, 0)) + starsDelta;
    const nextCompletedBossesCount = Math.max(0, toNumber(summary.completedBossesCount, 0)) + (completedPreviously ? 0 : 1);

    transaction.set(
      progressRef,
      {
        userId,
        xpTotal: nextXpTotal,
        coinsTotal: nextCoinsTotal,
        level: calculateLevel(nextXpTotal),
        starsTotal: nextStarsTotal,
        completedTopicsCount: Math.max(0, toNumber(summary.completedTopicsCount, 0)),
        completedBossesCount: nextCompletedBossesCount,
        currentGrade: coalesce(payload.gradeId, payload.grade, summary.currentGrade, null),
        currentWorld: coalesce(payload.worldId, payload.currentWorld, summary.currentWorld, null),
        lastPlayedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  });

  return true;
}

export async function incrementXP(userId, amount = 0) {
  if (!userId) throw new Error('userId required');

  const progressRef = doc(db, 'userProgress', userId);
  await ensureUserProgressDoc(userId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(progressRef);
    const current = snap.exists() ? snap.data() : {};
    const nextXpTotal = Math.max(0, toNumber(current.xpTotal, 0)) + Math.max(0, toNumber(amount, 0));

    transaction.set(
      progressRef,
      {
        userId,
        xpTotal: nextXpTotal,
        level: calculateLevel(nextXpTotal),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  });
}

export default {
  calculateLevel,
  computeBestScore,
  ensureUserProgressDoc,
  initializeUserProgress,
  mapTopicsById,
  deriveCompletedTopics,
  deriveWeakAreas,
  saveGameResult,
  getUserProgress,
  getTopicProgress,
  getBossProgress,
  isBossUnlocked,
  saveBossCompletion,
  incrementXP
};
