import './App.css'
import { Suspense, lazy } from 'react'
import NavBar from './components/NavBar.jsx'
import { Banner } from './components/Banner'
import { AboutUs } from './components/AboutUs.jsx'
import { Projects } from "./components/Projects.jsx";
import { Contact } from './components/Contact.jsx'
import { Routes, Route } from "react-router-dom";

const Login = lazy(() => import('./components/Login.jsx'))
const Signup = lazy(() => import('./components/Signup.jsx'))
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
      <NavBar />
      <Suspense fallback={<div className="route-loader">Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner />
                <AboutUs />
                <Projects />
                <Contact />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
