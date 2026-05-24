# 🎮 LearnCraft OS — Master Build Prompt
**Duolingo-Style Gamified Learning Platform | Full Transformation Guide**

---

## 🧭 PROJECT CONTEXT

You are building **LearnCraft OS** — a Duolingo-style gamified learning platform for Indian students (Grades 6–12). The project is a **React + Vite frontend** (Firebase auth, Firestore data) and a lightweight **Express backend**. The codebase is 60–70% complete. Your job is to fill all gaps, wire up all data flows, and make every page feel alive — like Duolingo but for Tamil Nadu school curriculum.

**Repo:** `https://github.com/MohammedAshikM3003/gamified-learning-platform`

**Stack:**
- Frontend: React 18, Vite, React Router v6, Framer Motion, Bootstrap icons, Lucide React
- Auth & DB: Firebase Auth + Firestore
- AI: Gemini 2.0 Flash (VITE_GEMINI_API_KEY)
- Backend: Express.js (contact form, health route)
- i18n: English + Tamil (TranslationContext)
- Game Engines: `xpEngine`, `battleEngine`, `questEngine`, `streakEngine`, `achievementsEngine`, `levelEngine`, `recommendationEngine`

---

## 🔴 WHAT IS MISSING (Priority Order)

### CRITICAL — App is broken without these

**1. Grade 10 data file is missing**
- `src/data/grades/grade10.js` does not exist — grade 10 data is inline in `learningData.js`
- Extract it into `src/data/grades/grade10.js` and import it like other grades

**2. MockTests page — fully hardcoded / fake**
- Page shows static "4 tests, 82%, Top 15%" — none of it is real
- No timer logic, no test runner, no question flow, no result saving
- **Build:** Timed test runner component with real questions from `learningData.js`, countdown timer, result screen, score saved to Firestore under `users/{uid}/mockTests`

**3. PracticeLabs page — placeholder only**
- Shows "Interactive Code Editor Initialization Pending..." — nothing works
- **Build:** Integrate Monaco Editor (via CDN) or a simple textarea-based code runner. For non-CS subjects, show a flashcard drill mode. Save lab completions to Firestore.

**4. Challenges page — static fake data**
- `DAILY_QUESTS` is hardcoded array with no real state
- Timer shows static "14:22:05" — not a real countdown
- **Build:** Real daily challenge system: generate challenges dynamically from user's weak areas, persist completion in Firestore under `users/{uid}/dailyChallenges/{YYYY-MM-DD}`, real countdown to midnight reset

**5. SkillAnalysis page — fully mocked**
- Learning velocity chart uses `Math.random()` — not real data
- Subject mastery bars are hardcoded percentages
- **Build:** Pull real data from Firestore (`battleHistory`, `completedTopics`, `weakSubjects`), render real bar charts with Recharts or D3, calculate actual mastery % per subject

**6. Achievements page — uses mock `unlockedBadges = ['fb', 'sw']`**
- Does not connect to `UserProgressContext.achievements`
- **Build:** Wire `achievements` from context, show locked/unlocked state, animate unlock on first view

**7. BattleArena default topic is hardcoded**
- `BattleArena.jsx` (page wrapper) always shows "Variables & Data Types" as demo topic
- **Build:** Let user pick subject → chapter → topic before entering battle, or redirect to last incomplete topic

**8. QuestMap — worlds render but nodes are not clickable**
- Node click should navigate to `/topics/:topicId` — confirm this is wired
- Locked nodes should show lock icon + tooltip "Complete previous topic to unlock"
- Boss node should appear at end of each subject world

**9. Firestore security rules — not in repo**
- Add `firestore.rules` with proper per-user read/write restrictions
- Users should only read/write their own `users/{uid}` document

---

### HIGH — Core Duolingo-style features missing

**10. ❤️ Lives / Hearts System (Duolingo Core)**
- Add 5 lives per day. Wrong answer = -1 life. 0 lives = locked out until midnight or "use gems to refill"
- Lives tracked in Firestore under `users/{uid}/progression.lives`
- Lives refill at midnight (use streak engine's day-change logic)
- Show hearts in Dashboard header and inside BattleArena

**11. 🔥 Streak System — engine exists but not displayed**
- `streakEngine.js` exists but streak is never updated on daily login
- **Wire up:** On auth login, call `streakEngine.checkAndUpdateStreak(uid)` → update Firestore → show "🔥 X day streak" toast
- Show streak freeze item in Settings (spend 50 gems to protect streak for 1 day)

**12. 🏆 Lesson Completion Screen (Duolingo "You crushed it!" moment)**
- After every BattleArena win, show a fullscreen animated result screen:
  - XP gained (animated counter), combo achieved, stars earned (1–3 based on accuracy)
  - "Continue" → next topic, "Practice Again" → same topic, "Share" → copy result text
- Currently `RewardPopup.jsx` exists but is minimal — expand it dramatically

**13. 📚 Learn Mode before Battle**
- Before each battle, offer a "Study First" screen showing topic summary, key concepts, examples
- AI-generated via Gemini (call with topic title + grade) — cache result in Firestore
- User can skip directly to battle or read first

**14. 🎯 Onboarding — Step 5 (Avatar/Name) is missing**
- Onboarding has 5 steps in `TOTAL_STEPS = 5` but only 4 step components exist (Grade, Subjects, Difficulty, Goals)
- **Add Step 5:** Avatar selection (choose from 8 emoji/pixel avatars) + display name entry

**15. 🌍 Tamil language toggle is wired but locale files are minimal**
- `en.json` and `ta.json` exist but likely have very few keys
- **Audit:** Check all UI strings, add Tamil translations for all dashboard labels, menu items, common actions

**16. 💎 Gems / Coins Economy**
- `progression.coins` exists in Firestore schema but nothing spends or earns coins visibly
- **Build:** Show coin balance in sidebar/header. Award coins on topic completion. Spend coins on: streak freeze, extra lives, hint in battle

---

### MEDIUM — Polish and completeness

**17. Courses page — check if it's a placeholder**
- `Courses.jsx` exists — verify it has real content or build it as a curated learning path view (sequence of topics per subject, like Duolingo's skill tree)

**18. Settings page — verify all toggles work**
- Language toggle should call `setLanguage` from `TranslationContext`
- Notifications, theme (dark/light) — save preferences to Firestore under `users/{uid}/settings`

**19. Leaderboard — real but needs weekly/monthly tabs**
- Currently shows all-time XP ranking
- Add tabs: Daily / Weekly / Monthly / All-Time (filter by `updatedAt` timestamp)
- Highlight current user's row with a glow effect

**20. SubjectDetail and ChapterDetail pages**
- Verify chapter cards show real progress (completed topics count)
- Add a "Start Chapter" button that navigates to first incomplete topic

**21. Sidebar active state**
- Sidebar should highlight the current route
- Add XP mini-bar and streak counter to the sidebar footer

**22. NavBar (public landing) language toggle**
- Wire the language button in `NavBar.jsx` to `TranslationContext.setLanguage`

**23. Grade components (Sixth through Twelveth)**
- `Sixth.jsx`, `Seventh.jsx`, etc. — verify these are game launchers for `/games/6th` routes
- If they're just stubs, they should show the grade's available mini-games with thumbnails

---

### LOWER — Backend and infrastructure

**24. Backend contact form**
- Already has rate limiter, validation, CORS — good
- Wire `emailService.js` to actually send email (use Nodemailer + Gmail SMTP or Resend API)
- Add Firestore persistence of contact messages

**25. Missing `grade10.js` standalone file**
- Move grade 10 inline data from `learningData.js` to `src/data/grades/grade10.js`

**26. Missing `locales/en.json` and `locales/ta.json` coverage**
- Add keys for all route names, button labels, error messages, toast messages

**27. Error boundaries — already have `ErrorBoundary.jsx`**
- Wrap each page-level Route with a scoped error boundary showing a "Something went wrong, go back" card

**28. SEO / Meta — `index.html` likely has no Open Graph tags**
- Add basic OG tags: title "LearnCraft OS — Gamified Learning for Grades 6-12", description, favicon

---

## 🎨 DESIGN DIRECTION — Make it feel like Duolingo

The existing theme is a dark sci-fi "LearnCraft OS" aesthetic with CSS variables (`--primary`, `--secondary`, `--glass-bg`, etc.). **Keep this dark aesthetic** but inject Duolingo's core UX patterns:

### Must-have Duolingo UX patterns to add:

1. **Progress bar at top of every lesson/battle** — shows how many questions remain
2. **Animated correct/wrong feedback** — green flash + sound cue on correct, red shake on wrong
3. **XP burst animation** — "+20 XP" floats up after each correct answer (already partially done in `DamageText.jsx` — extend this to all XP gains)
4. **Streak celebration** — when user hits a milestone streak (7, 30, 100 days), show a full-screen confetti moment
5. **Lesson path (linear progress)** — in QuestMap, topics should be arranged as a vertical scrolling path with circles connected by dotted lines (exactly like Duolingo's home screen), not a grid
6. **Daily goal ring** — circular progress ring on Dashboard showing today's XP goal (set in onboarding)
7. **"You're on fire!" combo feedback** — at 3x combo: show flame animation, at 5x: screen flash + special move
8. **End-of-lesson podium** — after battle: show XP, accuracy %, time taken, stars (⭐⭐⭐), league progress
9. **Notification dot** — show red dot on Achievements when a new badge was unlocked

### Color additions (add to `theme.css`):
```css
--duolingo-green: #58cc02;
--duolingo-red: #ff4b4b;
--heart-red: #ff4b4b;
--gem-blue: #1cb0f6;
--combo-gold: #ffd700;
--streak-orange: #ff9600;
```

---

## 🗄️ FIRESTORE DATA SCHEMA (reference)

```
users/{uid}/
  profile: { fullName, grade, avatar, displayName }
  selectedSubjects: string[]
  progression: { xp, level, streak, coins, lives, lastActiveDate }
  progress: { completedTopics[], unlockedTopics[], battleHistory[] }
  analytics: { weakSubjects[], strongSubjects[], totalBattlesWon, totalBattlesPlayed }
  achievements: [{ id, name, icon, unlockedAt }]
  settings: { language, theme, notificationsEnabled, dailyGoalXP }
  dailyChallenges/{YYYY-MM-DD}: { challenges[], completedIds[], generatedAt }
  mockTests/{testId}: { topicIds[], score, accuracy, timeTaken, completedAt }
  studyCache/{topicId}: { summary, keyPoints, generatedAt }  ← Gemini cache
```

---

## 🧩 COMPONENT GAPS TO CREATE

These files are imported in `App.jsx` or pages but may be stubs:

| File | Status | Action |
|------|--------|--------|
| `pages/Courses.jsx` | Unknown | Verify/build as skill-tree path view |
| `pages/MockTests.jsx` | Placeholder | Build timed test runner |
| `pages/PracticeLabs.jsx` | Placeholder | Build code editor or flashcard mode |
| `pages/Challenges.jsx` | Hardcoded | Wire to Firestore + real countdown |
| `pages/SkillAnalysis.jsx` | Mocked charts | Wire to real Firestore data + Recharts |
| `pages/Achievements.jsx` | Mock unlocks | Wire to UserProgressContext |
| `components/common/ProgressNotification.jsx` | Exists | Verify it triggers on XP gain |
| `games/quiz-battle/QuizBattle.jsx` | Exists but unused | Wire as alternative battle mode |

---

## 📋 IMPLEMENTATION CHECKLIST (in order)

### Week 1 — Core Loops Working
- [ ] Extract `grade10.js` file
- [ ] Fix Achievements page (wire real data)
- [ ] Wire streak update on login
- [ ] Add Lives/Hearts system to Firestore + UI
- [ ] Add Lesson Completion Screen (expand RewardPopup)
- [ ] Fix QuestMap node clicks + linear path layout
- [ ] Add Study Mode screen before battle

### Week 2 — Duolingo Patterns
- [ ] Daily goal XP ring on Dashboard
- [ ] Combo animations (fire at 3x, special at 5x)
- [ ] Streak milestone celebrations
- [ ] Gems/Coins spending UI
- [ ] Daily Challenges with real Firestore
- [ ] Onboarding Step 5 (avatar)
- [ ] Tamil locale coverage

### Week 3 — Complete Missing Pages
- [ ] MockTests with real test runner
- [ ] PracticeLabs with code editor
- [ ] SkillAnalysis with real charts
- [ ] Courses as skill-tree
- [ ] Leaderboard weekly/monthly tabs
- [ ] Settings page fully wired

### Week 4 — Polish + Backend
- [ ] Firestore security rules
- [ ] Email sending in backend
- [ ] SEO/OG tags
- [ ] Error boundaries on all routes
- [ ] Performance audit (lazy loading already done — good)
- [ ] Tamil translation complete audit

---

## 💡 PROMPT TEMPLATES FOR EACH FEATURE

Use these as individual task prompts when building:

### For MockTests:
> "Build a `MockTests.jsx` page for LearnCraft OS (dark sci-fi React app). Fetch questions from `learningData.js` for the user's grade and selected subjects. Show a timed test (user sets duration: 10/20/30 min). Display one question at a time with 4 MCQ options. On submit, show results: score, accuracy %, wrong answers with explanations. Save result to Firestore under `users/{uid}/mockTests/{testId}`. Use the existing `dashboard.css` theme variables (`--primary`, `--glass-bg`, etc.) and Framer Motion for transitions."

### For Daily Challenges:
> "Build a real daily challenges system for `Challenges.jsx` in LearnCraft OS. Generate 3 daily challenges from the user's weak areas (from `UserProgressContext.weakAreas`). Challenges: 'Complete 2 battles', 'Get 5-combo streak', 'Study 1 new topic'. Persist completion in Firestore `users/{uid}/dailyChallenges/YYYY-MM-DD`. Show a real countdown timer to midnight using `useEffect` + `setInterval`. Award XP and coins on completion. Use existing dark theme CSS variables."

### For QuestMap Duolingo Layout:
> "Redesign `QuestMap.jsx` to display topics as a vertical scrolling linear path like Duolingo's home screen. Each topic is a circle node connected by a dotted vertical line. Completed = filled green circle with checkmark. Unlocked = glowing primary-color circle. Locked = grey with lock icon. Boss topic = skull icon, larger node, gold border. Clicking an unlocked node navigates to `/topics/:topicId`. Use Framer Motion for staggered reveal on mount. The path scrolls vertically. Use LearnCraft OS CSS variables."

### For SkillAnalysis with Real Data:
> "Build `SkillAnalysis.jsx` using real data from `UserProgressContext`. Pull `battleHistory` to calculate accuracy per subject. Pull `completedTopics` to calculate mastery % per subject. Render: (1) A bar chart (use Recharts `BarChart`) showing XP gained per day for last 30 days — derive from `battleHistory[].completedAt` timestamps. (2) Subject mastery as horizontal progress bars with real percentages. (3) Weak areas list from `analytics.weakSubjects`. Use existing dashboard CSS theme."

### For Lives/Hearts System:
> "Add a Lives/Hearts system to LearnCraft OS. Add `lives: 5` to `users/{uid}/progression` in Firestore. In `UserProgressContext`, expose `lives`, `spendLife()`, `refillLives()`. In `BattleArena.jsx`, call `spendLife()` on wrong answer. When `lives === 0`, show a 'No lives remaining' modal with countdown to midnight refill (or 'Spend 30 gems to refill'). Display heart icons in Dashboard stat grid and inside BattleArena header. Lives refill to 5 at midnight (check `lastActiveDate` vs today on login)."

### For Study Mode:
> "Add a Study Mode screen to `TopicPage.jsx`. Before the BattleArena renders, show a 'Study First' card with: topic title, difficulty badge, a 3-5 bullet summary of key concepts (fetched from Gemini using topic title + grade, cached in Firestore `studyCache/{topicId}`). Two buttons: 'Start Battle' and 'Study First'. 'Study First' expands the card showing the full AI explanation. After reading, 'I'm Ready — Start Battle!' begins the game. Loading state shows skeleton cards."

---

## ⚡ QUICK WINS (do these first, <30 min each)

1. **Wire Achievements to real data** — replace `useState(['fb', 'sw'])` with `achievements` from `useProgress()`
2. **Sidebar active route highlight** — add `useLocation()` check, apply active class
3. **Add XP/streak to Sidebar footer** — pull from `UserProgressContext`
4. **Fix NavBar language toggle** — call `setLanguage` from `useTranslation()`
5. **QuestMap node click navigation** — confirm `onClick={() => navigate('/topics/' + node.id)}` is on unlocked nodes
6. **Extract grade10.js** — simple file move, fixes potential import inconsistency
7. **Add OG tags to `index.html`** — 5 lines of HTML
8. **Streak update on login** — in `AuthContext`, after user signs in, call `streakEngine.checkAndUpdateStreak`

---

## 🚫 DO NOT CHANGE

- Firebase config pattern (uses `VITE_` env variables — correct)
- Overall dark sci-fi CSS variable system (`--primary`, `--glass-bg`, etc.) — this is the brand
- Route structure in `App.jsx` — it's well organized
- Game engine files (`xpEngine`, `battleEngine`, etc.) — they're well built, just wire them up
- `BattleArena` game logic — the combat pipeline is solid

---

## 🎯 NORTH STAR

When complete, LearnCraft OS should feel like:
**Duolingo's addictive lesson loop** + **a dark RPG battle game** + **an AI tutor in your pocket**.

Every user action should give immediate feedback: XP floats up, combo fires glow, streaks celebrate, badges unlock with fanfare. Learning should feel like playing a game — not doing homework.
