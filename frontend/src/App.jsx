import './App.css'
import { Suspense, lazy } from 'react'
import NavBar from './components/NavBar.jsx'
import { Banner } from './components/Banner'
import { AboutUs } from './components/AboutUs.jsx'
import { Projects } from "./components/Projects.jsx";
import { Contact } from './components/Contact.jsx'
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { DashboardLayout } from './components/layout/DashboardLayout.jsx';

const Login = lazy(() => import('./components/Login.jsx'))
const Signup = lazy(() => import('./components/Signup.jsx'))
const Onboarding = lazy(() => import('./pages/Onboarding.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const AITutor = lazy(() => import('./pages/AITutor.jsx'))
const QuestMap = lazy(() => import('./pages/QuestMap.jsx'))
const BattleArena = lazy(() => import('./pages/BattleArena.jsx'))
const Subjects = lazy(() => import('./pages/Subjects.jsx'))
const Courses = lazy(() => import('./pages/Courses.jsx'))
const PracticeLabs = lazy(() => import('./pages/PracticeLabs.jsx'))
const MockTests = lazy(() => import('./pages/MockTests.jsx'))
const Achievements = lazy(() => import('./pages/Achievements.jsx'))
const Leaderboard = lazy(() => import('./pages/Leaderboard.jsx'))
const Challenges = lazy(() => import('./pages/Challenges.jsx'))
const SettingsPage = lazy(() => import('./pages/Settings.jsx'))
const SkillAnalysis = lazy(() => import('./pages/SkillAnalysis.jsx'))
const SubjectDetail = lazy(() => import('./pages/SubjectDetail.jsx'))
const ChapterDetail = lazy(() => import('./pages/ChapterDetail.jsx'))
const TopicPage = lazy(() => import('./pages/TopicPage.jsx'))
const Sixth = lazy(() => import('./components/Sixth.jsx'))
const Seventh = lazy(() => import('./components/Seventh.jsx'))
const Eight = lazy(() => import('./components/Eight.jsx'))
const Ninth = lazy(() => import('./components/Ninth.jsx'))
const Tenth = lazy(() => import('./components/Tenth.jsx'))
const Eleventh = lazy(() => import('./components/Eleventh.jsx'))
const Twelveth = lazy(() => import('./components/Twelveth.jsx'))

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div className="route-loader">Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <NavBar />
                <Banner />
                <AboutUs />
                <Projects />
                <Contact />
              </>
            }
          />
          <Route path="/login" element={<><NavBar /><Login /></>} />
          <Route path="/signup" element={<><NavBar /><Signup /></>} />
                    <Route
                      path="/onboarding"
                      element={
                        <ProtectedRoute>
                          <Onboarding />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/*"
                      element={
                        <ProtectedRoute requireOnboarding={true}>
                          <DashboardLayout>
                            <Routes>
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/ai-tutor" element={<AITutor />} />
                              <Route path="/quest-map" element={<QuestMap />} />
                              <Route path="/arena" element={<BattleArena />} />
                              <Route path="/subjects" element={<Subjects />} />
                              <Route path="/subjects/:subjectId" element={<SubjectDetail />} />
                              <Route path="/subjects/:subjectId/:chapterId" element={<ChapterDetail />} />
                              <Route path="/topics/:topicId" element={<TopicPage />} />
                              <Route path="/courses" element={<Courses />} />
                              <Route path="/labs" element={<PracticeLabs />} />
                              <Route path="/mocks" element={<MockTests />} />
                              <Route path="/achievements" element={<Achievements />} />
                              <Route path="/leaderboard" element={<Leaderboard />} />
                              <Route path="/challenges" element={<Challenges />} />
                              <Route path="/settings" element={<SettingsPage />} />
                              <Route path="/analysis" element={<SkillAnalysis />} />
                            </Routes>
                          </DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
          <Route path="/games/6th" element={<Sixth />} />
          <Route path="/games/7th" element={<Seventh />} />
          <Route path="/games/8th" element={<Eight />} />
          <Route path="/games/9th" element={<Ninth />} />
          <Route path="/games/10th" element={<Tenth />} />
          <Route path="/games/11th" element={<Eleventh />} />
          <Route path="/games/12th" element={<Twelveth />} />
          <Route
            path="/read"
            element={
              <iframe
                src="/Read.html"
                style={{ width: "100%", height: "100vh", border: "none" }}
                title="Read Page"
                loading="lazy"
              />
            }
          />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
