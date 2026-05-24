require('dotenv').config();

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function getCliArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

function loadServiceAccount() {
  const inlineJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const explicitPath = getCliArg('--service-account')
    || process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    || process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (inlineJson) {
    return JSON.parse(inlineJson);
  }

  if (explicitPath) {
    const resolvedPath = path.isAbsolute(explicitPath)
      ? explicitPath
      : path.resolve(process.cwd(), explicitPath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Service account file not found: ${resolvedPath}`);
    }

    return JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    };
  }

  return null;
}

if (admin.apps.length === 0) {
  const serviceAccount = loadServiceAccount();

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

const db = admin.firestore();
const LEVEL_XP = 100;

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function calculateLevel(xpTotal) {
  return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xpTotal) / LEVEL_XP)) + 1);
}

function normalizeProgressDoc(userId, legacyUserDoc = {}, progressDoc = {}) {
  const legacyProgression = legacyUserDoc.progression || {};
  const legacyProfile = legacyUserDoc.profile || {};
  const legacyProgress = legacyUserDoc.progress || {};

  const xpFromLegacy = toNumber(legacyProgression.xp, 0);
  const xpFromProgress = toNumber(progressDoc.xpTotal, 0);
  const xpTotal = Math.max(xpFromLegacy, xpFromProgress);

  const levelFromLegacy = toNumber(legacyProgression.level, calculateLevel(xpTotal));
  const levelFromProgress = toNumber(progressDoc.level, calculateLevel(xpTotal));
  const level = Math.max(levelFromLegacy, levelFromProgress);

  const completedTopics = Array.isArray(legacyProgress.completedTopics)
    ? legacyProgress.completedTopics
    : Array.isArray(progressDoc.completedTopics)
      ? progressDoc.completedTopics
      : [];

  const completedBosses = Array.isArray(legacyProgress.completedBosses)
    ? legacyProgress.completedBosses
    : Array.isArray(progressDoc.completedBosses)
      ? progressDoc.completedBosses
      : [];

  return {
    userId,
    xpTotal,
    level,
    starsTotal: Math.max(toNumber(progressDoc.starsTotal, 0), toNumber(legacyUserDoc.starsTotal, 0)),
    currentGrade: progressDoc.currentGrade || legacyProfile.grade || null,
    currentWorld: progressDoc.currentWorld || null,
    completedTopicsCount: Math.max(
      toNumber(progressDoc.completedTopicsCount, 0),
      completedTopics.length
    ),
    completedBossesCount: Math.max(
      toNumber(progressDoc.completedBossesCount, 0),
      completedBosses.length
    ),
    lastActiveAt: progressDoc.lastActiveAt || legacyUserDoc.lastActiveAt || admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

function normalizeTopicDoc(topicId, source = {}) {
  const bestScore = toNumber(source.bestScore ?? source.score, 0);
  const attempts = Math.max(1, toNumber(source.attempts, source.playedAt ? 1 : 0));
  const completed = source.completed === true || source.bossUnlocked === true || bestScore >= 60;

  return {
    topicId,
    gradeId: source.gradeId || source.grade || null,
    subjectId: source.subjectId || null,
    chapterId: source.chapterId || null,
    gameType: source.gameType || null,
    completed,
    bestScore,
    stars: toNumber(source.stars, 0),
    attempts,
    xpEarned: toNumber(source.xpEarned, source.xp || 0),
    bossUnlocked: source.bossUnlocked === true || completed,
    lastPlayedAt: source.lastPlayedAt || source.playedAt || null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

function normalizeBossDoc(bossId, source = {}) {
  const bestScore = toNumber(source.bestScore ?? source.score, 0);
  const attempts = Math.max(1, toNumber(source.attempts, 0));
  const completed = source.completed === true || source.bossCompleted === true || bestScore >= 60;

  return {
    bossId,
    topicId: source.topicId || null,
    gradeId: source.gradeId || null,
    subjectId: source.subjectId || null,
    chapterId: source.chapterId || null,
    completed,
    bestScore,
    attempts,
    xpEarned: toNumber(source.xpEarned, 0),
    completedAt: source.completedAt || null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

async function run({ dryRun = false } = {}) {
  try {
    await admin.app().options.credential.getAccessToken();
  } catch (error) {
    throw new Error([
      'Missing Firebase Admin credentials for migration.',
      'Set one of the following before running:',
      '1. FIREBASE_SERVICE_ACCOUNT_JSON (full JSON string)',
      '2. FIREBASE_SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON)',
      '3. FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY',
      '4. Application Default Credentials (for example, gcloud auth application-default login)',
      '',
      'Example:',
      '  $env:GOOGLE_APPLICATION_CREDENTIALS="E:\\path\\to\\serviceAccountKey.json"; node scripts/migrateProgress.js --dry-run',
      '',
      `Underlying auth error: ${error.message}`,
    ].join('\n'));
  }

  const usersSnap = await db.collection('users').get();
  const progressSnap = await db.collection('userProgress').get();
  const topicSnap = await db.collectionGroup('topics').get();
  const bossSnap = await db.collectionGroup('bosses').get();

  const progressMap = new Map();
  progressSnap.forEach((docSnap) => {
    progressMap.set(docSnap.id, docSnap.data() || {});
  });

  const topicMap = new Map();
  topicSnap.forEach((docSnap) => {
    const uid = docSnap.ref.parent.parent?.id;
    if (!uid) return;

    if (!topicMap.has(uid)) topicMap.set(uid, new Map());
    topicMap.get(uid).set(docSnap.id, docSnap.data() || {});
  });

  const bossMap = new Map();
  bossSnap.forEach((docSnap) => {
    const uid = docSnap.ref.parent.parent?.id;
    if (!uid) return;

    if (!bossMap.has(uid)) bossMap.set(uid, new Map());
    bossMap.get(uid).set(docSnap.id, docSnap.data() || {});
  });

  let processed = 0;

  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id;
    const legacyUser = userDoc.data() || {};
    const existingProgress = progressMap.get(uid) || {};

    const normalizedProgress = normalizeProgressDoc(uid, legacyUser, existingProgress);
    const topics = new Set([
      ...(Array.isArray(legacyUser?.progress?.completedTopics) ? legacyUser.progress.completedTopics : []),
      ...(Array.isArray(existingProgress?.completedTopics) ? existingProgress.completedTopics : []),
      ...Array.from(topicMap.get(uid)?.keys() || []),
    ]);
    const bosses = new Set([
      ...(Array.isArray(legacyUser?.progress?.completedBosses) ? legacyUser.progress.completedBosses : []),
      ...(Array.isArray(existingProgress?.completedBosses) ? existingProgress.completedBosses : []),
      ...Array.from(bossMap.get(uid)?.keys() || []),
    ]);

    if (dryRun) {
      console.log(`[dry-run] ${uid}`, normalizedProgress);
    } else {
      const progressRef = db.collection('userProgress').doc(uid);
      await progressRef.set(normalizedProgress, { merge: true });

      for (const topicId of topics) {
        const topicSource = topicMap.get(uid)?.get(topicId)
          || existingProgress?.topics?.[topicId]
          || legacyUser?.topics?.[topicId]
          || {};
        await progressRef.collection('topics').doc(topicId).set(
          normalizeTopicDoc(topicId, topicSource),
          { merge: true }
        );
      }

      for (const bossId of bosses) {
        const bossSource = bossMap.get(uid)?.get(bossId)
          || existingProgress?.bosses?.[bossId]
          || legacyUser?.bosses?.[bossId]
          || {};
        await progressRef.collection('bosses').doc(bossId).set(
          normalizeBossDoc(bossId, bossSource),
          { merge: true }
        );
      }
    }

    processed += 1;
  }

  return { processed, dryRun };
}

if (require.main === module) {
  const dryRun = process.argv.includes('--dry-run');

  run({ dryRun })
    .then((result) => {
      console.log(`Migration complete. Processed ${result.processed} users.${dryRun ? ' (dry run)' : ''}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = {
  run,
  normalizeProgressDoc,
  normalizeTopicDoc,
  normalizeBossDoc,
};
