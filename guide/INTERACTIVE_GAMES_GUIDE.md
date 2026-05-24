# 🎮 LearnCraft OS — Interactive Game Modes Guide
## Build 8+ Game Types to Pair with Lessons

---

## 📋 GAME ARCHITECTURE OVERVIEW

The platform currently has **1 main game**: BattleArena (MCQ + damage-based combat).

We need to add **8 more distinct game modes**, each teaching the same lesson content but through different mechanics:

```
Current: BattleArena (MCQ + Combat) ─── SINGLE GAME LOOP
Goal:    [Battle] [Quiz] [Match] [Tower] [Puzzle] [Story] [Flash] [Tycoon] ─── VARIETY
```

All games **share**:
- Same `questions` array (from `learningData.js`)
- Same enemy/topic structure
- Same XP/reward engines
- Same Firestore save pipeline
- Same dark LearnCraft OS theme

**Difference**: Game mechanics and UI.

---

## 🎯 THE 8 GAME MODES (Priority + Implementation Order)

### TIER 1 — Must Build First (Core Learning Loops)

#### **1️⃣ QUIZ BLITZ** (Currently QuizBattle, needs polish)
**Mechanic**: Rapid-fire MCQ timer. Fastest answers = most XP.

**Why it works**: Speed + accuracy combo = addiction (Duolingo core).

**Flow**:
```
START (choose difficulty: CASUAL [5s/q] | NORMAL [10s/q] | HARD [15s/q])
  → Question with countdown timer (visual + sound)
  → Answer or timeout (wrong)
  → Next Q instantly
  → Leaderboard: Score = (XP gained) / (avg time per question)
  → Results: Accuracy %, Avg time, Personal best
  → SAVE to Firestore: /users/{uid}/quizBlitz/{topicId}/scores[]
```

**Components needed**:
- `QuizBlitzGame.jsx` (wrapper page)
- `QuizBlitzHUD.jsx` (timer, score, questions-remaining)
- `QuizBlitzQuestion.jsx` (MCQ with 10-15s countdown)
- `QuizBlitzResults.jsx` (leaderboard, personal stats)

**Difficulty modifiers**:
- CASUAL: 5s per Q, easy difficulty multiplier, +10 XP base
- NORMAL: 10s per Q, normal multiplier, +20 XP base
- HARD: 15s per Q, hard multiplier, +40 XP base

---

#### **2️⃣ MATCH PAIRS** (Memory / Concentration Game)
**Mechanic**: Flip tiles to match concepts with definitions.

**Why it works**: Brain-based learning (visual + memory activation).

**Flow**:
```
Render grid: 12 tiles (6 pairs: term ↔ definition)
  → Click tile → flip (anim)
  → Click second → check match
  → MATCH: both stay revealed, +XP, unlock combo
  → MISMATCH: flip back after 1.5s, -1 life
  → Win when all matched or timer runs out
  → Score = (XP) - (mismatches × 5) + (time bonus)
  → SAVE: /users/{uid}/matchPairs/{topicId}/attempts[]
```

**Components needed**:
- `MatchPairsGame.jsx`
- `MatchTile.jsx` (flip animation)
- `MatchHUD.jsx` (lives, matches-remaining, timer)
- `MatchResults.jsx`

**Variations by difficulty**:
- EASY: 6 pairs, 120s, 5 lives
- NORMAL: 8 pairs, 90s, 3 lives
- HARD: 12 pairs, 60s, 1 life

---

#### **3️⃣ TOWER DEFENSE** (Sequence/Ordering Mechanic)
**Mechanic**: Arrange steps/concepts in correct order to "defend" a tower from incoming attacks.

**Why it works**: Forces understanding of relationships & sequences.

**Flow**:
```
Enemy approaches tower (visual: creeping bar from left)
  → Question: "Arrange these steps in correct order"
  → User drags 4-5 unordered items into a stack on right
  → CORRECT: Tower fires laser, enemy dies, +XP
  → INCORRECT: Tower takes damage (-HP), enemy advances
  → Win when all enemies defeated (5-8 waves)
  → Score = Total XP - (damage taken × 2)
  → SAVE: /users/{uid}/towerDefense/{topicId}/runs[]
```

**Components needed**:
- `TowerDefenseGame.jsx` (main container)
- `Tower.jsx` (animated HP bar on right)
- `EnemyWave.jsx` (creeping bar from left)
- `OrderingPrompt.jsx` (drag-drop zone for items)
- `TowerHUD.jsx` (wave counter, tower health)

**Example for "Photosynthesis" (Biology)**:
```
Arrange in order:
[ ] Light energy absorbed
[ ] Water absorbed by roots
[ ] Glucose produced
[ ] CO2 enters leaf
[ ] Oxygen released
```

---

### TIER 2 — Enhanced Engagement (Add After Tier 1)

#### **4️⃣ STORY QUEST** (Narrative-driven Learning)
**Mechanic**: Questions woven into a branching story. Choices matter.

**Why it works**: Narrative motivation (why does this matter?).

**Flow**:
```
Scene 1: NPC introduces problem (e.g., "A kingdom needs math to rebuild...")
  → Dialogue with question embedded
  → Your answer changes story outcome
  → CORRECT ANSWER → story progresses, +50 XP
  → WRONG ANSWER → alternate (harder) path, +20 XP, new challenge
  → Multiple endings based on question accuracy
  → Can replay for different narrative
  → SAVE: /users/{uid}/storyQuest/{topicId}/playthroughs[]
```

**Components needed**:
- `StoryQuestGame.jsx`
- `StoryScene.jsx` (narrative text + NPC art)
- `StoryChoice.jsx` (answer buttons labeled as "choices")
- `StoryResults.jsx` (ending summary, branching paths shown)

**Story structure (JSON)**:
```javascript
{
  "algebra-quest": {
    "title": "The Algebra Heir",
    "scenes": [
      {
        "id": "scene1",
        "text": "An old mage offers you power...",
        "npcName": "Sage Equation",
        "npc_art": "sage.png",
        "question": { /* MCQ */ },
        "nextScenes": {
          "correct": "scene2_victory",
          "wrong": "scene2_alternate"
        }
      },
      // ... more scenes
    ]
  }
}
```

---

#### **5️⃣ PUZZLE MODE** (Logic/Coding Problems)
**Mechanic**: Solve a coding/logic challenge step-by-step. Tests deep understanding.

**Why it works**: Transfer learning (apply concepts, not just recall).

**Flow**:
```
Present a mini "project":
  → "Write a function that does X"
  → Provide code skeleton with blanks [ ]
  → User selects correct code snippet from 4 options
  → CORRECT → next step unlocks, +XP
  → WRONG → hint provided, -XP, or retry
  → Complete puzzle (5-7 steps) = XP * difficulty
  → SAVE: /users/{uid}/puzzleMode/{topicId}/solutions[]
```

**Components needed**:
- `PuzzleGame.jsx`
- `CodeEditor.jsx` (or snippet selector)
- `PuzzleStep.jsx` (step-by-step breakdown)
- `PuzzleResults.jsx`

**Example (Programming — "Arrays")**:
```
Challenge: "Find the largest number in an array"

Step 1: Initialize
  [ ] let max = arr[0];
  [ ] let max = 0;
  [ ] let max = arr.length;

Step 2: Loop
  [ ] for (let i = 0; i < arr.length; i++)
  [ ] for (let i = 1; i <= arr.length; i++)
  [ ] while (max < arr.length)

... and so on
```

---

#### **6️⃣ FLASHCARD DUEL** (Spaced Repetition + Multiplayer feel)
**Mechanic**: 1v1 against an AI opponent. Both answer the same question. Fastest correct wins.

**Why it works**: Real-time competition + spaced rep (Duolingo's secret sauce).

**Flow**:
```
Show question to both you (left) and AI opponent (right)
  → Your answer time vs AI response time
  → BOTH CORRECT → fastest wins round, +points
  → YOU CORRECT, AI wrong → you win +2 points, AI gets 0
  → YOU WRONG, AI correct → you get 0, AI gets 1
  → Best of 5 questions
  → Win = higher score, unlock next difficulty
  → SAVE: /users/{uid}/flashcardDuel/{topicId}/duels[]
```

**Components needed**:
- `FlashcardDuelGame.jsx`
- `DuelOpponent.jsx` (left/right sides)
- `DuelQuestion.jsx` (shared question)
- `DuelResults.jsx` (win/loss, AI personality)

**AI personalities** (for fun):
- Tutor: Always correct, slow (like teaching)
- Student: 70% accuracy, normal speed (friendly)
- Rival: 85% accuracy, fast (competitive)
- Boss: 95% accuracy, instant (challenge mode)

---

### TIER 3 — Deep Engagement (Optional but Powerful)

#### **7️⃣ TIME ODYSSEY** (Tycoon/Resource Management)
**Mechanic**: Build a civilization by answering questions. Each answer = resource → build structure.

**Why it works**: Long-term engagement (build something cool).

**Flow**:
```
You manage a virtual civilization:
  → Each correct answer = +gold, +wood, +stone
  → Difficulty modifier: Easy +10 gold, Hard +50 gold
  → Spend resources to build structures:
    - House (+1 pop) = 10 gold
    - Library (+1 science) = 50 gold, 20 wood
    - Colosseum (+1 happiness) = 100 gold, 50 stone
  → Civilization grows, unlocks new questions/topics
  → Milestone: "10K gold achieved" = badge + XP boost
  → SAVE: /users/{uid}/timeOdyssey/{userId}/civilization
```

**Components needed**:
- `TimeOdysseyGame.jsx`
- `CivilizationMap.jsx` (visual grid showing buildings)
- `ResourcePanel.jsx` (gold, wood, stone, pop, science)
- `BuildingShop.jsx` (purchase menu)
- `TimeOdysseyQuestion.jsx`

---

#### **8️⃣ BOSS GAUNTLET** (Survival / Roguelike)
**Mechanic**: Face 10 progressively harder bosses. Each topic is a boss. Fail once = start over.

**Why it works**: High-stakes, exciting (permadeath engagement).

**Flow**:
```
START with base stats: HP=100, Armor=0, Weapons=0
  → Fight Topic 1 Boss (easy)
  → IF WIN: gain weapon/armor upgrade + 20% more XP from remaining topics
  → IF LOSE: Game Over, restart
  → Fight Topics 2-10 (progressively harder)
  → Final Boss: All Mastery Boss (combines all topics)
  → WIN → Legendary achievement + 500 XP + special cosmetic
  → SAVE: /users/{uid}/bossGauntlet/{gradeId}/runs[]
```

**Components needed**:
- `BossGauntletGame.jsx`
- `GauntletBoss.jsx` (enemy with scaling stats)
- `GauntletHUD.jsx` (run progress: 3/10 bosses)
- `GauntletInventory.jsx` (weapons/armor upgrades)
- `GauntletResults.jsx` (how far you got)

---

## 🛠️ TECHNICAL SETUP (For All Games)

### File Structure
```
frontend/src/games/
├── battle-arena/          (✅ EXISTS)
│   ├── BattleArena.jsx
│   ├── battleData.js
│   ├── QuestionCard.jsx
│   └── ... (all existing files)
│
├── quiz-blitz/            (🆕 NEW)
│   ├── QuizBlitzGame.jsx
│   ├── QuizBlitzHUD.jsx
│   ├── QuizBlitzQuestion.jsx
│   ├── QuizBlitzResults.jsx
│   └── quiz-blitz.css
│
├── match-pairs/           (🆕 NEW)
│   ├── MatchPairsGame.jsx
│   ├── MatchTile.jsx
│   ├── MatchHUD.jsx
│   ├── MatchResults.jsx
│   └── match-pairs.css
│
├── tower-defense/         (🆕 NEW)
│   ├── TowerDefenseGame.jsx
│   ├── Tower.jsx
│   ├── EnemyWave.jsx
│   ├── OrderingPrompt.jsx
│   ├── TowerHUD.jsx
│   └── tower-defense.css
│
├── story-quest/           (🆕 NEW)
│   ├── StoryQuestGame.jsx
│   ├── StoryScene.jsx
│   ├── StoryChoice.jsx
│   ├── StoryResults.jsx
│   ├── story-quest.css
│   └── stories/
│       └── story-data.js
│
├── puzzle-mode/           (🆕 NEW)
│   ├── PuzzleGame.jsx
│   ├── PuzzleStep.jsx
│   ├── CodeEditor.jsx
│   ├── PuzzleResults.jsx
│   ├── puzzle-mode.css
│   └── puzzles/
│       └── puzzle-data.js
│
├── flashcard-duel/        (🆕 NEW)
│   ├── FlashcardDuelGame.jsx
│   ├── DuelOpponent.jsx
│   ├── DuelQuestion.jsx
│   ├── DuelResults.jsx
│   └── flashcard-duel.css
│
├── time-odyssey/          (🆕 NEW)
│   ├── TimeOdysseyGame.jsx
│   ├── CivilizationMap.jsx
│   ├── ResourcePanel.jsx
│   ├── BuildingShop.jsx
│   ├── TimeOdysseyQuestion.jsx
│   ├── time-odyssey.css
│   └── civilizations/
│       └── civ-data.js
│
└── boss-gauntlet/         (🆕 NEW)
    ├── BossGauntletGame.jsx
    ├── GauntletBoss.jsx
    ├── GauntletHUD.jsx
    ├── GauntletInventory.jsx
    ├── GauntletResults.jsx
    └── boss-gauntlet.css
```

### Shared Game Logic (New File)
Create: `frontend/src/game-engine/gameTypeEngine.js`

```javascript
/**
 * gameTypeEngine.js
 * Unified XP/reward calculation across all game types
 */

export const gameTypeEngine = {
  // Map game type → XP multiplier
  getGameTypeMultiplier: (gameType) => {
    const multipliers = {
      'battle-arena': 1.0,      // baseline
      'quiz-blitz': 0.9,        // speed ≠ understanding
      'match-pairs': 0.8,       // lower skill ceiling
      'tower-defense': 1.1,     // requires sequencing
      'story-quest': 1.2,       // high engagement
      'puzzle-mode': 1.3,       // deepest learning
      'flashcard-duel': 1.0,    // competitive/fair
      'time-odyssey': 0.7,      // passive (long-term)
      'boss-gauntlet': 1.4,     // risk/reward
    };
    return multipliers[gameType] || 1.0;
  },

  // Calculate final XP reward
  calculateGameXP: (baseXP, gameType, accuracy, difficulty) => {
    const typeMultiplier = this.getGameTypeMultiplier(gameType);
    const accuracyBonus = accuracy > 0.9 ? 1.3 : accuracy > 0.7 ? 1.1 : 1.0;
    const difficultyBonus = { easy: 0.8, normal: 1.0, hard: 1.5 }[difficulty] || 1.0;
    
    return Math.round(baseXP * typeMultiplier * accuracyBonus * difficultyBonus);
  },

  // Track game completion (used by all games)
  saveGameResult: async (userId, gameType, topicId, result) => {
    // result = { accuracy, score, timeTaken, won, difficulty }
    const db = getFirestore();
    const ref = doc(db, `users/${userId}/gameResults/${gameType}/${topicId}/${Date.now()}`);
    await setDoc(ref, {
      ...result,
      gameType,
      topicId,
      timestamp: serverTimestamp(),
    });
  },
};
```

### Routes to Add (App.jsx)
```javascript
// Add these routes inside the <DashboardLayout> section:

<Route path="/games/quiz-blitz/:topicId" element={<QuizBlitzGame />} />
<Route path="/games/match-pairs/:topicId" element={<MatchPairsGame />} />
<Route path="/games/tower-defense/:topicId" element={<TowerDefenseGame />} />
<Route path="/games/story-quest/:topicId" element={<StoryQuestGame />} />
<Route path="/games/puzzle-mode/:topicId" element={<PuzzleGame />} />
<Route path="/games/flashcard-duel/:topicId" element={<FlashcardDuelGame />} />
<Route path="/games/time-odyssey/:topicId" element={<TimeOdysseyGame />} />
<Route path="/games/boss-gauntlet" element={<BossGauntletGame />} />
```

### Update TopicPage to offer Game Selection
In `TopicPage.jsx`, before starting a battle, show:
```
┌─────────────────────────────┐
│  PICK YOUR GAME MODE        │
├─────────────────────────────┤
│ ⚔️  Battle Arena    [50 XP]  │
│ ⚡ Quiz Blitz      [45 XP]  │
│ 🧠 Match Pairs     [40 XP]  │
│ 🛡️  Tower Defense   [55 XP]  │
│ 📖 Story Quest     [60 XP]  │
│ 🧩 Puzzle Mode     [70 XP]  │
│ 🃏 Flashcard Duel  [50 XP]  │
│ 🏗️  Time Odyssey    [35 XP]  │
└─────────────────────────────┘
```

---

## 📊 FIRESTORE SCHEMA UPDATES

Add these collections for game results:

```
users/{uid}/
  gameResults/
    {gameType}/
      {topicId}/
        {timestamp}/
          gameType: "quiz-blitz"
          topicId: "variables-data-types"
          accuracy: 0.85
          score: 450
          timeTaken: 125  (seconds)
          won: true
          difficulty: "normal"
          xpEarned: 45
          timestamp: <server-time>

  achievements/
    game-master:      { unlockedAt, progress: { completed: ["battle", "quiz", ...] } }
    speed-demon:      { unlockedAt (quiz-blitz: avg < 5s) }
    memory-king:      { unlockedAt (match-pairs: 100% accuracy) }
    tactician:        { unlockedAt (tower-defense: survive 8+ waves) }
    storyteller:      { unlockedAt (story-quest: all endings) }
    code-wizard:      { unlockedAt (puzzle-mode: 3 perfect solutions) }
    undefeated:       { unlockedAt (boss-gauntlet: beat all 10 bosses) }
```

---

## 🎨 DESIGN PATTERNS (Use Across All Games)

### Base Game Container (Template)
```jsx
// Template for all game JSX files
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/UserProgressContext';
import { motion } from 'framer-motion';
import { learningData } from '../data/learningData';

export default function [GameName]Game() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { completeBattle } = useProgress();

  // Get topic & questions from learningData
  const grade = userProfile?.profile?.grade;
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    // Find topic in learningData[grade]
    const foundTopic = Object.values(learningData[grade]?.subjects || {})
      .flatMap(s => Object.values(s.chapters || {}))
      .flatMap(c => c.topics || [])
      .find(t => t.id === topicId);
    
    if (foundTopic) {
      setTopic(foundTopic);
      // Initialize game state
    }
  }, [topicId, grade]);

  // Game loop
  const handleGameComplete = async (result) => {
    // result = { won, xpEarned, accuracy, ... }
    await completeBattle({ topicId, ...result });
    // Show results, then navigate back
  };

  return (
    <div className="game-container">
      {/* Game HUD, canvas, state */}
      {/* Victory/Defeat screen */}
    </div>
  );
}
```

### CSS Variables for Consistency
```css
/* Add to dashboard.css or new games.css */

:root {
  /* Game-specific colors */
  --game-quiz: #6366f1;
  --game-match: #8b5cf6;
  --game-tower: #fbbf24;
  --game-story: #ec4899;
  --game-puzzle: #10b981;
  --game-duel: #3b82f6;
  --game-tycoon: #f59e0b;
  --game-gauntlet: #ef4444;

  /* Game animations */
  --game-duration-fast: 200ms;
  --game-duration-normal: 500ms;
  --game-duration-slow: 1000ms;
}

.game-container {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-overlay) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.game-hud {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  z-index: 100;
}

.game-canvas {
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16 / 9;
  border-radius: 20px;
  background: var(--glass-bg);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.game-result {
  width: 100%;
  max-width: 600px;
  text-align: center;
  padding: 60px 40px;
  border-radius: 20px;
  background: var(--glass-bg);
  border: 1px solid var(--border-color);
}
```

---

## 🚀 IMPLEMENTATION ROADMAP (Week-by-Week)

### Week 1: Quiz Blitz
- [ ] Create `games/quiz-blitz/` directory
- [ ] Build `QuizBlitzGame.jsx` with timer logic
- [ ] Build `QuizBlitzHUD.jsx` (score, remaining, timer display)
- [ ] Build `QuizBlitzQuestion.jsx` (MCQ with countdown)
- [ ] Wire to Firestore save
- [ ] Test difficulty modifiers
- [ ] Add to TopicPage game selector

### Week 2: Match Pairs
- [ ] Create `games/match-pairs/` directory
- [ ] Build `MatchPairsGame.jsx` (grid generation, shuffle)
- [ ] Build `MatchTile.jsx` (flip animation with Framer)
- [ ] Build match detection logic
- [ ] Add lives system
- [ ] Wire results save
- [ ] Add to game selector

### Week 3: Tower Defense & Story Quest
- [ ] Build `tower-defense/` (enemy approach, drag-drop ordering)
- [ ] Build `story-quest/` with story-data.json parser
- [ ] Create 2 sample stories (Math + Programming)
- [ ] Add branching narrative logic
- [ ] Wire both to Firestore

### Week 4: Puzzle, Duel, Tycoon, Gauntlet
- [ ] Puzzle Mode: code skeleton + snippet selection
- [ ] Flashcard Duel: AI opponent logic, real-time feel
- [ ] Time Odyssey: civilization grid + building shop
- [ ] Boss Gauntlet: permadeath + 10-boss progression

### Week 5: Polish
- [ ] Add achievements for each game type
- [ ] Create game-type leaderboards
- [ ] Add sound effects (optional but recommended)
- [ ] Balance XP rewards across all modes
- [ ] Add Easter eggs / secret challenges

---

## 💡 PROMPT TEMPLATES FOR DEVELOPERS

Use these to assign work to other devs / AI:

### Quiz Blitz
> "Build a Quiz Blitz game mode for LearnCraft OS. Players answer MCQs as fast as possible. Each question has a 5/10/15 second timer (user selects difficulty). Correct answer before timeout = +XP. Timeout or wrong = 0 XP, move to next. Show leaderboard: fastest average time per correct answer. Save results to Firestore under `users/{uid}/gameResults/quiz-blitz/`. Use existing dark theme CSS variables. Add animated countdown timer (Framer Motion) and sound effect on timeout."

### Match Pairs
> "Build Match Pairs memory game. Generate 6-12 tiles (terms on one side, definitions on other). User clicks tiles to flip and find matching pairs. Correct pair = +20 XP. Wrong pair = -1 life (users get 3-5 lives). Win when all pairs matched or time runs out. Display with smooth flip animations (Framer Motion). Save accuracy % and completion time to Firestore. Use LearnCraft OS dark theme."

### Tower Defense
> "Build Tower Defense ordering game. Display 5-7 unordered steps/concepts. User drags them into correct sequence on right side. Enemy bar on left slowly advances from left to right (120s duration). On correct answer: tower fires laser (Framer Motion), enemy dies. On wrong: tower takes damage, enemy advances. Complete 5 waves = victory. Save results including wave count and accuracy to Firestore."

---

## 🎯 SUCCESS METRICS

Track engagement by game type:

```javascript
// In Analytics Dashboard (future):
{
  "gameType": "quiz-blitz",
  "avgPlaytime": "8 minutes",
  "completionRate": "87%",
  "dailyActiveUsers": 1250,
  "repeatRate": "65%",  // % of users playing same game 2+ times
  "avgXPEarned": 120,
}
```

**Goal**: Each game mode should have >50% repeat rate (users want to play again).

---

## ⚡ QUICK WINS (Easy First Games to Build)

1. **Quiz Blitz** ← Easiest, most reusable code
2. **Match Pairs** ← Medium, great for animations
3. **Story Quest** ← Medium, pure JSON data-driven
4. **Puzzle Mode** ← Medium, similar to Battle Arena logic

(Build these 4 first → other 4 follow naturally)

---

## 🔗 INTEGRATION CHECKLIST

- [ ] Update `App.jsx` with all 8 game routes
- [ ] Update `TopicPage.jsx` to show game selector
- [ ] Create `gameTypeEngine.js` for unified XP logic
- [ ] Update Firestore schema doc with gameResults collection
- [ ] Add game-type achievements to `achievementsEngine.js`
- [ ] Update user analytics schema to track "favorite game type"
- [ ] Create game selection UI component (reusable across all topics)
- [ ] Add sound effects (optional, but Duolingo-like)
- [ ] Test cross-game progression (XP stacking across types)

---

## 🎮 INSPIRATION REFERENCES

**Quiz Blitz** ← Duolingo, Quizlet Live  
**Match Pairs** ← Concentration, Cognitive training apps  
**Tower Defense** ← Kingdom Rush, Bloons TD  
**Story Quest** ← Choice of Games, Telltale (text-based learning)  
**Puzzle Mode** ← LeetCode, Codewars (but simplified)  
**Flashcard Duel** ← Kahoot, Gimkit  
**Time Odyssey** ← Civilization, merchant tycoon games  
**Boss Gauntlet** ← Dark Souls (roguelike), roguelike learning  

Each game teaches the same content but **through a different lens** → maximizes retention (spacing effect + retrieval practice + variety).
