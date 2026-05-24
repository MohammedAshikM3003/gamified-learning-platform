# LearnCraft Canonical Firestore Schema

This is the canonical data model for LearnCraft progression and unlocks.

## `users/{uid}`

Identity and onboarding only.

Required fields:

- `fullName`
- `email`
- `photoURL`
- `onboardingCompleted`
- `createdAt`
- `updatedAt`

## `userProgress/{uid}`

Overall progression summary for the authenticated user.

Required fields:

- `userId`
- `xpTotal`
- `level`
- `starsTotal`
- `currentGrade`
- `currentWorld`
- `completedTopicsCount`
- `completedBossesCount`
- `lastActiveAt`
- `updatedAt`

## `userProgress/{uid}/topics/{topicId}`

Per-topic learning result and unlock status.

Required fields:

- `topicId`
- `gradeId`
- `subjectId`
- `chapterId`
- `gameType`
- `completed`
- `bestScore`
- `stars`
- `attempts`
- `xpEarned`
- `bossUnlocked`
- `lastPlayedAt`
- `updatedAt`

## `userProgress/{uid}/bosses/{bossId}`

Per-boss completion record.

Required fields:

- `bossId`
- `topicId`
- `gradeId`
- `subjectId`
- `chapterId`
- `completed`
- `bestScore`
- `attempts`
- `xpEarned`
- `completedAt`
- `updatedAt`

## `leaderboards/{season}/entries/{uid}`

Optional computed leaderboard structure.

Suggested fields:

- `uid`
- `name`
- `xpTotal`
- `level`
- `streak`
- `updatedAt`

## Notes

- Use `users/{uid}` for profile and auth-adjacent identity only.
- Use `userProgress/{uid}` for all gameplay progression.
- Keep leaderboard entries computed from progression so the ranking view can be rebuilt safely.
- Do not mix legacy `users/{uid}` progress arrays with the canonical progress model.
