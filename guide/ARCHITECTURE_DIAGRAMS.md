# 🎮 LearnCraft OS — Game Architecture & Flow Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         LearnCraft OS                            │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      Frontend (React)                       │ │
│  │                                                              │ │
│  │  App.jsx (Routes)                                           │ │
│  │  ├── /subjects → Subjects.jsx                              │ │
│  │  ├── /topics/:topicId → TopicPage.jsx ⭐ GAME SELECTOR  │ │
│  │  │   └── Renders 8 game buttons                            │ │
│  │  │                                                           │ │
│  │  ├── /games/quiz-blitz/:topicId ───→ QuizBlitzGame.jsx    │ │
│  │  ├── /games/match-pairs/:topicId ──→ MatchPairsGame.jsx   │ │
│  │  ├── /games/tower-defense/:topicId → TowerDefenseGame.jsx │ │
│  │  ├── /games/story-quest/:topicId ──→ StoryQuestGame.jsx   │ │
│  │  ├── /games/puzzle-mode/:topicId ──→ PuzzleGame.jsx       │ │
│  │  ├── /games/flashcard-duel/:topicId → FlashcardDuelGame   │ │
│  │  ├── /games/time-odyssey/:topicId ─→ TimeOdysseyGame.jsx  │ │
│  │  └── /games/boss-gauntlet ────────→ BossGauntletGame.jsx  │ │
│  │                                                              │ │
│  │  ┌────────────────────────────────────────────────┐        │ │
│  │  │     Shared Game Logic                          │        │ │
│  │  │                                                │        │ │
│  │  │  gameTypeEngine.js                             │        │ │
│  │  │  ├── calculateGameXP()                         │        │ │
│  │  │  ├── saveGameResult()                          │        │ │
│  │  │  ├── getGameTypeMultiplier()                   │        │ │
│  │  │  ├── isPerfectGame()                           │        │ │
│  │  │  └── checkMasteryUnlock()                      │        │ │
│  │  │                                                │        │ │
│  │  │  UserProgressContext                           │        │ │
│  │  │  └── completeBattle() → calls gameTypeEngine  │        │ │
│  │  └────────────────────────────────────────────────┘        │ │
│  │                                                              │ │
│  │  Data Sources:                                              │ │
│  │  ├── learningData.js (topic questions, definitions)        │ │
│  │  ├── AuthContext (user profile)                            │ │
│  │  └── UserProgressContext (XP, level, progress)             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Backend & Database                             │ │
│  │                                                              │ │
│  │  Firebase Auth          Firebase Firestore                 │ │
│  │  ├── Sign up            Database Collections:              │ │
│  │  ├── Sign in            ├── users/{uid}/                  │ │
│  │  └── Sign out           │   ├── profile                   │ │
│  │                          │   ├── progression               │ │
│  │                          │   ├── gameResults/ ⭐ NEW      │ │
│  │                          │   │   ├── quiz-blitz/          │ │
│  │                          │   │   ├── match-pairs/         │ │
│  │                          │   │   └── [other games]/       │ │
│  │                          │   └── achievements             │ │
│  │                          │                                 │ │
│  │                          └── shared collections           │ │
│  │                              └── leaderboards/            │ │
│  │                                  ├── all-time             │ │
│  │                                  ├── weekly               │ │
│  │                                  └── game-specific ⭐ NEW │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎮 Game Flow Diagram

```
User on TopicPage
       ↓
    ┌──────────────────────────────────────────┐
    │  GAME SELECTOR (New UI)                  │
    ├──────────────────────────────────────────┤
    │  ⚔️  Battle Arena   [50 XP] ← existing  │
    │  ⚡ Quiz Blitz      [45 XP] ← NEW      │
    │  🧠 Match Pairs     [40 XP] ← NEW      │
    │  🛡️  Tower Defense   [55 XP] ← NEW      │
    │  📖 Story Quest     [60 XP] ← NEW      │
    │  🧩 Puzzle Mode     [70 XP] ← NEW      │
    │  🃏 Flashcard Duel  [50 XP] ← NEW      │
    │  🏗️  Time Odyssey    [35 XP] ← NEW      │
    │  ☠️  Boss Gauntlet   [80 XP] ← NEW      │
    └──────────────────────────────────────────┘
       ↓ (User clicks one)\n       ↓\n    Route to /games/{type}/{topicId}\n       ↓\n    Game Component Loads\n    ├── Setup Phase (choose difficulty)\n    ├── Playing Phase (game loop)\n    └── Results Phase\n       ↓\n    gameTypeEngine.calculateGameXP()\n       ↓\n    UserProgressContext.completeBattle()\n       ↓\n    Save to: users/{uid}/gameResults/{type}/{topicId}/\n       ↓\n    Update Dashboard XP display\n       ↓\n    Check achievements (gameTypeEngine.isPerfectGame())\n       ↓\n    Return to Dashboard / Retry / Next Topic\n```

---

## 🧮 XP Calculation Flow

```\nAny Game Completion:\n  ↓\n  baseXP from game\n  (e.g., 50 for Quiz Blitz)\n  ↓\n  × gameTypeEngine.getGameTypeMultiplier(gameType)\n  │  ├─ 'battle-arena': 1.0\n  │  ├─ 'quiz-blitz': 0.9\n  │  ├─ 'match-pairs': 0.8\n  │  ├─ 'story-quest': 1.2\n  │  ├─ 'puzzle-mode': 1.3 (deepest learning)\n  │  └─ 'boss-gauntlet': 1.4 (hardest)\n  ↓\n  × accuracyBonus\n  │  ├─ > 95% accuracy: 1.4 (flawless)\n  │  ├─ > 90%: 1.3\n  │  ├─ > 80%: 1.2\n  │  ├─ > 70%: 1.1\n  │  ├─ > 50%: 1.0\n  │  └─ < 50%: 0.7 (needs practice)\n  ↓\n  × difficultyBonus\n  │  ├─ 'easy': 0.7\n  │  ├─ 'normal': 1.0\n  │  └─ 'hard': 1.5\n  ↓\n  = FINAL XP\n  (e.g., 50 × 0.9 × 1.3 × 1.0 = 58 XP)\n  ↓\n  Awarded to user.progression.xp\n  ↓\n  levelEngine checks for level-up\n```\n\n---\n\n## 📊 Game Type Distribution (Recommended)\n\nTo maximize learning & engagement, recommend users play:\n\n```\nWeek 1 (Onboarding):\n  Day 1-2: Battle Arena (familiar, MCQ-based)\n  Day 3-4: Quiz Blitz (speed, instant feedback)\n  Day 5-7: Match Pairs (memory, fun factor)\n\nWeek 2-4 (Progression):\n  ├── 30% Battle Arena (core learning)\n  ├── 25% Quiz Blitz (spaced repetition)\n  ├── 20% Match Pairs (memory reinforcement)\n  ├── 15% Story Quest (context + narrative)\n  ├── 10% Puzzle Mode (transfer learning)\n  └── (After mastery) Tower Defense, Duel, Tycoon, Gauntlet\n```\n\n---\n\n## 🔄 Game State Machine (Example: Quiz Blitz)\n\n```\n┌─────────┐\n│  START  │\n└────┬────┘\n     ↓\n┌──────────────────┐\n│  SETUP PHASE     │  (Choose difficulty: easy/normal/hard)\n│                  │\n│ Display buttons: │\n│ - 5s per question│\n│ - 10s per question\n│ - 15s per question\n│                  │\n│ [START QUIZ] button\n└────────┬─────────┘\n         ↓\n  ┌──────────────────────────────┐\n  │  PLAYING PHASE (Loop)        │\n  │                              │\n  │  Question 1 of 10            │\n  │  ┌────────────────────────┐  │\n  │  │ Timer: 10s → 9 → 8...  │  │\n  │  │ [A] [B] [C] [D]        │  │\n  │  └────────────────────────┘  │\n  │                              │\n  │  User clicks → onAnswer()    │\n  │      ├─ Correct:            │\n  │      │  + XP                │\n  │      │  + Score             │\n  │      │  Advance question    │\n  │      │                      │\n  │      └─ Wrong/Timeout:      │\n  │         0 XP                │\n  │         Advance question    │\n  │                              │\n  │  Loop until Q10 complete     │\n  └────────┬─────────────────────┘\n           ↓\n  ┌──────────────────────────────┐\n  │  RESULTS PHASE               │\n  │                              │\n  │  Accuracy: 80%               │\n  │  Score: 450                  │\n  │  Avg Time: 8.2s              │\n  │  XP Earned: 56               │\n  │                              │\n  │  [RETRY] [DASHBOARD]         │\n  └────────┬─────────────────────┘\n           ↓\n  ┌──────────────────────────────┐\n  │  SAVE TO FIRESTORE           │\n  │                              │\n  │  users/{uid}/gameResults/    │\n  │    quiz-blitz/               │\n  │      {topicId}/              │\n  │        {timestamp}/          │\n  │          gameType: \"quiz...\" │\n  │          accuracy: 0.8       │\n  │          xpEarned: 56        │\n  │          won: true           │\n  └────────┬─────────────────────┘\n           ↓\n  ┌──────────────────────────────┐\n  │  UPDATE USER STATS           │\n  │                              │\n  │  progression.xp += 56        │\n  │  Check: levelEngine.getLv()  │\n  │  Save: UserProgressContext   │\n  │                              │\n  │  Update Dashboard display    │\n  └────────┬─────────────────────┘\n           ↓\n  ┌──────────────────────────────┐\n  │  CHECK ACHIEVEMENTS          │\n  │                              │\n  │  achievementEngine.check()   │\n  │  ├─ isPerfectGame()?         │\n  │  ├─ speedDemon (avg < 5s)?   │\n  │  ├─ dayOne?                  │\n  │  └─ gameMaster (3 types)?    │\n  └────────┬─────────────────────┘\n           ↓\n         [END]\n```\n\n---\n\n## 🗂️ File Organization (After Implementation)\n\n```\nfrontend/src/\n├── games/\n│   ├── battle-arena/ ✅ (exists)\n│   │   ├── BattleArena.jsx\n│   │   ├── QuestionCard.jsx\n│   │   ├── RewardPopup.jsx\n│   │   ├── DamageText.jsx\n│   │   ├── ComboSystem.jsx\n│   │   ├── SpecialAbility.jsx\n│   │   ├── HealthBar.jsx\n│   │   ├── battleData.js\n│   │   ├── AttackEffects.jsx\n│   │   ├── EnemyCard.jsx\n│   │   ├── FighterEnemy.jsx\n│   │   └── FighterPlayer.jsx\n│   │\n│   ├── quiz-blitz/ 🆕\n│   │   ├── QuizBlitzGame.jsx ← PROVIDED\n│   │   └── quiz-blitz.css ← PROVIDED\n│   │\n│   ├── match-pairs/ 🆕\n│   │   ├── MatchPairsGame.jsx ← PROVIDED\n│   │   └── match-pairs.css ← TO CREATE\n│   │\n│   ├── tower-defense/ 🆕\n│   │   ├── TowerDefenseGame.jsx\n│   │   ├── Tower.jsx\n│   │   ├── EnemyWave.jsx\n│   │   ├── OrderingPrompt.jsx\n│   │   ├── TowerHUD.jsx\n│   │   └── tower-defense.css\n│   │\n│   ├── story-quest/ 🆕\n│   │   ├── StoryQuestGame.jsx\n│   │   ├── StoryScene.jsx\n│   │   ├── StoryChoice.jsx\n│   │   ├── StoryResults.jsx\n│   │   ├── story-quest.css\n│   │   └── stories/\n│   │       └── story-data.js\n│   │\n│   ├── puzzle-mode/ 🆕\n│   │   ├── PuzzleGame.jsx\n│   │   ├── PuzzleStep.jsx\n│   │   ├── CodeEditor.jsx\n│   │   ├── PuzzleResults.jsx\n│   │   ├── puzzle-mode.css\n│   │   └── puzzles/\n│   │       └── puzzle-data.js\n│   │\n│   ├── flashcard-duel/ 🆕\n│   │   ├── FlashcardDuelGame.jsx\n│   │   ├── DuelOpponent.jsx\n│   │   ├── DuelQuestion.jsx\n│   │   ├── DuelResults.jsx\n│   │   └── flashcard-duel.css\n│   │\n│   ├── time-odyssey/ 🆕\n│   │   ├── TimeOdysseyGame.jsx\n│   │   ├── CivilizationMap.jsx\n│   │   ├── ResourcePanel.jsx\n│   │   ├── BuildingShop.jsx\n│   │   ├── TimeOdysseyQuestion.jsx\n│   │   ├── time-odyssey.css\n│   │   └── civilizations/\n│   │       └── civ-data.js\n│   │\n│   └── boss-gauntlet/ 🆕\n│       ├── BossGauntletGame.jsx\n│       ├── GauntletBoss.jsx\n│       ├── GauntletHUD.jsx\n│       ├── GauntletInventory.jsx\n│       ├── GauntletResults.jsx\n│       └── boss-gauntlet.css\n│\n├── game-engine/\n│   ├── battleEngine.js ✅ (exists)\n│   ├── xpEngine.js ✅ (exists)\n│   ├── streakEngine.js ✅ (exists)\n│   ├── questEngine.js ✅ (exists)\n│   ├── levelEngine.js ✅ (exists)\n│   ├── achievementsEngine.js ✅ (exists)\n│   ├── recommendationEngine.js ✅ (exists)\n│   └── gameTypeEngine.js 🆕 ← PROVIDED\n│\n├── pages/\n│   ├── TopicPage.jsx ✏️ (update: add game selector)\n│   ├── Dashboard.jsx ✏️ (update: game stats)\n│   └── [others]\n│\n└── [other directories]\n```\n\n---\n\n## 📈 User Journey (With 8 Games)\n\n```\nDay 1:\n  9am  Onboarding → Selects Grade 10, Math\n  9:30 Dashboard   → Sees \"Start Learning\"\n  9:35 Topic: \"Algebra\"\n       Sees 8 game options for first time\n       → Chooses \"Battle Arena\" (familiar)\n       → Completes 50 XP earned\n  10:00 Dashboard → XP bar updates\n\nDay 2:\n  3pm  Topic: \"Geometry\"\n       → Tries \"Quiz Blitz\" (different mood)\n       → Scores 47 XP (faster feedback)\n  \nDay 3:\n  5pm  Topic: \"Statistics\"\n       → Tries \"Match Pairs\" (relaxing)\n       → Gets achievement \"Memory Master\"\n  \nDay 5:\n  7pm  Topic: \"Trigonometry\"\n       → Tries \"Story Quest\" (immersive)\n       → Unlocks narrative achievement\n       → Completes 60 XP (story bonus)\n  \nWeek 2:\n  Continues trying different games\n  Builds a favorite game type (e.g., Quiz Blitz)\n  Joins leaderboard\n  Unlocks \"Game Master\" (played 3+ types)\n\nWeek 4:\n  Has completed 50+ game sessions\n  Tried all 8 game types\n  Mastered 5 topics (via replay + different games)\n  Maintains 7-day streak\n```\n\n---\n\n## 🎯 Competitive Leaderboards (New)\n\n```\nPer-Game-Type Leaderboards:\n\nQuiz Blitz Leaderboard\n────────────────────────────────────────\nRank │ Player      │ Score  │ Avg Time\n─────┼─────────────┼────────┼──────────\n  1  │ 🥇 Ravi     │  4850  │  6.2s\n  2  │ 🥈 Priya    │  4420  │  6.8s\n  3  │ 🥉 Arun     │  4100  │  7.1s\n  4  │  Sneha      │  3980  │  7.4s\n  5  │  (You)      │  2450  │  8.3s ← current\n────────────────────────────────────────\n\nMatch Pairs Leaderboard\n────────────────────────────────────────\nRank │ Player      │ Score  │ Accuracy\n─────┼─────────────┼────────┼──────────\n  1  │ 🥇 Maya     │  5200  │  98%\n  2  │ 🥈 Vikram   │  4950  │  96%\n  3  │ 🥉 Neha     │  4620  │  94%\n  4  │  (You)      │  3100  │  87% ← current\n────────────────────────────────────────\n\nGlobal Leaderboard (All Games Combined)\n────────────────────────────────────────\nRank │ Player      │ Total XP │ Games Played\n─────┼─────────────┼──────────┼──────────────\n  1  │ 🥇 Aditya   │ 124,500  │ 450+\n  2  │ 🥈 Divya    │ 118,200  │ 420+\n  3  │ 🥉 Harish   │ 112,800  │ 400+\n  4  │  (You)      │  28,700  │  85 ← current\n────────────────────────────────────────\n```\n\n---\n\n## 🏅 Achievement Progression Examples\n\n```\nFor Quiz Blitz:\n  🥉 Bronze: Play 1 game\n  🥈 Silver: Avg accuracy > 80%\n  🥇 Gold: Avg time < 5s per question\n  💎 Platinum: Perfect game (100% accuracy)\n  👑 Legendary: 10 perfect games\n\nFor Match Pairs:\n  🥉 Bronze: Complete 1 game\n  🥈 Silver: 90%+ accuracy\n  🥇 Gold: Complete in < 60s\n  💎 Platinum: 100% accuracy\n  👑 Legendary: 5 perfect games in a row\n\nCross-Game:\n  🎮 Game Master: Play 3 different game types\n  🔥 Speedster: Average game time < 10min\n  🧠 Scholar: 100 games completed\n  👑 Grandmaster: 1000 games completed\n  🌟 Legendary: Mastered all topics\n```\n\n---\n\nThis visual architecture shows:\n✅ How games connect to the main platform\n✅ Data flows through gameTypeEngine\n✅ Storage in Firestore\n✅ User progression tracking\n✅ Competitive elements (leaderboards)\n✅ Achievement system integration\n