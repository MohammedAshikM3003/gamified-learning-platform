import './App.css'
import { Suspense, lazy, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import { Banner } from './components/Banner'
import { AboutUs } from './components/AboutUs.jsx'
import { Projects } from "./components/Projects.jsx";
import { Contact } from './components/Contact.jsx'
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { DashboardLayout } from './components/layout/DashboardLayout.jsx';
import AnimatedDashboardRoutes from './components/layout/AnimatedDashboardRoutes.jsx';

const Login = lazy(() => import('./components/Login.jsx'))
const Signup = lazy(() => import('./components/Signup.jsx'))
const Onboarding = lazy(() => import('./pages/Onboarding.jsx'))
const Sixth = lazy(() => import('./components/Sixth.jsx'))
const Seventh = lazy(() => import('./components/Seventh.jsx'))
const Eight = lazy(() => import('./components/Eight.jsx'))
const Ninth = lazy(() => import('./components/Ninth.jsx'))
const Tenth = lazy(() => import('./components/Tenth.jsx'))
const Eleventh = lazy(() => import('./components/Eleventh.jsx'))
const Twelveth = lazy(() => import('./components/Twelveth.jsx'))

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handler(e) {
      try {
        const from = e && e.detail && e.detail.from ? e.detail.from : null;
        const encoded = from ? `?from=${encodeURIComponent(from)}` : '';
        navigate(`/games/fraction${encoded}`);
      } catch (err) { console.error('navigateToGame handler failed', err); }
    }
    window.addEventListener('learncraft:navigateToGame', handler);
    return () => window.removeEventListener('learncraft:navigateToGame', handler);
  }, [navigate]);

  useEffect(() => {
    // If any code navigated to the legacy .html URL, replace it with the SPA route
    try {
      if (location && location.pathname && location.pathname.indexOf('fractiongame.html') !== -1) {
        navigate(`/games/fraction${location.search || ''}`, { replace: true });
      }
    } catch (e) { /* ignore */ }
  }, [location, navigate]);
  return (
    <div className="App">
      <Suspense fallback={<div className="route-loader">Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <NavBar />
                <div style={{ width: '100%', minHeight: '100vh', display: 'block', overflow: 'hidden' }}>
                  <Banner />
                </div>
                <AboutUs />
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
                  <AnimatedDashboardRoutes />
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
