import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import PageTransition from '../common/PageTransition';

import Dashboard from '../../pages/Dashboard.jsx';
import AITutor from '../../pages/AITutor.jsx';
import QuestMap from '../../pages/QuestMap.jsx';
import BattleArena from '../../pages/BattleArena.jsx';
import Subjects from '../../pages/Subjects.jsx';
import Courses from '../../pages/Courses.jsx';
import PracticeLabs from '../../pages/PracticeLabs.jsx';
import MockTests from '../../pages/MockTests.jsx';
import Achievements from '../../pages/Achievements.jsx';
import Leaderboard from '../../pages/Leaderboard.jsx';
import Challenges from '../../pages/Challenges.jsx';
import SettingsPage from '../../pages/Settings.jsx';
import SkillAnalysis from '../../pages/SkillAnalysis.jsx';
import SubjectDetail from '../../pages/SubjectDetail.jsx';
import ChapterDetail from '../../pages/ChapterDetail.jsx';
import TopicPage from '../../pages/TopicPage.jsx';
import WorldPage from '../../pages/WorldPage.jsx';
import GradeDetailPage from '../../pages/GradeDetailPage.jsx';
import SubjectPage from '../../pages/SubjectPage.jsx';
import BossBattlePage from '../../pages/BossBattlePage.jsx';

export default function AnimatedDashboardRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/ai-tutor" element={<PageTransition><AITutor /></PageTransition>} />
        <Route path="/quest-map" element={<PageTransition><QuestMap /></PageTransition>} />
        <Route path="/arena" element={<PageTransition><BattleArena /></PageTransition>} />
        <Route path="/subjects" element={<PageTransition><Subjects /></PageTransition>} />
        <Route path="/subjects/:subjectId" element={<PageTransition><SubjectDetail /></PageTransition>} />
        <Route path="/subjects/:subjectId/:chapterId" element={<PageTransition><ChapterDetail /></PageTransition>} />
        <Route path="/topics/:topicId" element={<PageTransition><TopicPage /></PageTransition>} />
        <Route path="/worlds" element={<PageTransition><WorldPage /></PageTransition>} />
        <Route path="/worlds/:gradeId" element={<PageTransition><GradeDetailPage /></PageTransition>} />
        <Route path="/worlds/:gradeId/:subjectId" element={<PageTransition><SubjectPage /></PageTransition>} />
        <Route path="/worlds/:gradeId/:subjectId/:chapterId" element={<PageTransition><ChapterDetail /></PageTransition>} />
        <Route path="/boss/:topicId" element={<PageTransition><BossBattlePage /></PageTransition>} />
        <Route path="/courses" element={<PageTransition><Courses /></PageTransition>} />
        <Route path="/labs" element={<PageTransition><PracticeLabs /></PageTransition>} />
        <Route path="/mocks" element={<PageTransition><MockTests /></PageTransition>} />
        <Route path="/achievements" element={<PageTransition><Achievements /></PageTransition>} />
        <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
        <Route path="/challenges" element={<PageTransition><Challenges /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
        <Route path="/analysis" element={<PageTransition><SkillAnalysis /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
