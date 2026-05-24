import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { doc, getDoc, setDoc, updateDoc } from '../frontend/node_modules/firebase/firestore/dist/index.mjs';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} from '../frontend/node_modules/@firebase/rules-unit-testing/dist/esm/index.esm.js';

const projectId = 'demo-gamified-learning';
const testFilePath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(testFilePath), '..');
const rulesPath = path.join(repoRoot, 'firestore.rules');

let testEnv;

async function loadRules() {
  return fs.readFile(rulesPath, 'utf8');
}

async function getTestEnv() {
  if (!testEnv) {
    testEnv = await initializeTestEnvironment({
      projectId,
      firestore: {
        rules: await loadRules()
      }
    });
  }

  return testEnv;
}

function userFirestore(uid) {
  return testEnv.authenticatedContext(uid).firestore();
}

function unauthFirestore() {
  return testEnv.unauthenticatedContext().firestore();
}

describe('Firestore security rules', () => {
  before(async () => {
    await getTestEnv();
  });

  after(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  it('allows the owner to read and write userProgress/{uid}', async () => {
    const db = userFirestore('alice');
    const ref = doc(db, 'userProgress/alice');

    await assertSucceeds(setDoc(ref, { xpTotal: 100, level: 2, userId: 'alice' }));
    await assertSucceeds(getDoc(ref));
    await assertSucceeds(updateDoc(ref, { xpTotal: 125 }));

    const snap = await getDoc(ref);
    assert.equal(snap.data().xpTotal, 125);
  });

  it('allows the owner to read and write userProgress/{uid}/topics/{topicId}', async () => {
    const db = userFirestore('alice');
    const ref = doc(db, 'userProgress/alice/topics/topic-1');

    await assertSucceeds(setDoc(ref, { topicId: 'topic-1', bestScore: 88, completed: true }));
    await assertSucceeds(getDoc(ref));
    await assertSucceeds(updateDoc(ref, { bestScore: 92 }));

    const snap = await getDoc(ref);
    assert.equal(snap.data().bestScore, 92);
  });

  it('allows the owner to read and write userProgress/{uid}/bosses/{bossId}', async () => {
    const db = userFirestore('alice');
    const ref = doc(db, 'userProgress/alice/bosses/boss-1');

    await assertSucceeds(setDoc(ref, { bossId: 'boss-1', bestScore: 77, completed: true }));
    await assertSucceeds(getDoc(ref));
    await assertSucceeds(updateDoc(ref, { bestScore: 83 }));

    const snap = await getDoc(ref);
    assert.equal(snap.data().bestScore, 83);
  });

  it('blocks a different authenticated user from another user progress data', async () => {
    const aliceDb = userFirestore('alice');
    const bobDb = userFirestore('bob');

    await assertSucceeds(setDoc(doc(aliceDb, 'userProgress/alice'), { xpTotal: 10 }));
    await assertSucceeds(setDoc(doc(aliceDb, 'userProgress/alice/topics/topic-1'), { bestScore: 61 }));
    await assertSucceeds(setDoc(doc(aliceDb, 'userProgress/alice/bosses/boss-1'), { bestScore: 61 }));

    await assertFails(getDoc(doc(bobDb, 'userProgress/alice')));
    await assertFails(updateDoc(doc(bobDb, 'userProgress/alice'), { xpTotal: 999 }));
    await assertFails(getDoc(doc(bobDb, 'userProgress/alice/topics/topic-1')));
    await assertFails(updateDoc(doc(bobDb, 'userProgress/alice/topics/topic-1'), { bestScore: 100 }));
    await assertFails(getDoc(doc(bobDb, 'userProgress/alice/bosses/boss-1')));
    await assertFails(updateDoc(doc(bobDb, 'userProgress/alice/bosses/boss-1'), { bestScore: 100 }));
  });

  it('blocks unauthenticated access to protected progress data', async () => {
    const db = unauthFirestore();

    await assertFails(setDoc(doc(db, 'userProgress/alice'), { xpTotal: 10 }));
    await assertFails(getDoc(doc(db, 'userProgress/alice')));
    await assertFails(setDoc(doc(db, 'userProgress/alice/topics/topic-1'), { bestScore: 55 }));
    await assertFails(getDoc(doc(db, 'userProgress/alice/topics/topic-1')));
    await assertFails(setDoc(doc(db, 'userProgress/alice/bosses/boss-1'), { bestScore: 55 }));
    await assertFails(getDoc(doc(db, 'userProgress/alice/bosses/boss-1')));
  });
});