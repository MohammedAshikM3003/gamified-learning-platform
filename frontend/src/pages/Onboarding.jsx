import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  GRADES,
  DIFFICULTY_LEVELS,
  LEARNING_GOALS,
  getSubjectsForGrade,
} from '../data/gradeSubjects';
import starsImg from '../assets/img/stars2.png';
import Snowfall from '../components/Snowfall.jsx';
import './onboarding.css';

const TOTAL_STEPS = 5;

// ── Step Components ────────────────────────────────────────────────────────────

function StepGrade({ formData, setFormData }) {
  return (
    <div className="onboarding-content">
      <h2>What grade are you in?</h2>
      <p>We'll build your personalized learning path based on your level.</p>
      <div className="options-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginTop: '24px' }}>
        {GRADES.map(grade => (
          <button
            key={grade.id}
            className={`option-btn ${formData.grade === grade.id ? 'active' : ''}`}
            onClick={() => setFormData(d => ({ ...d, grade: grade.id, selectedSubjects: [] }))}
            style={{ flexDirection: 'column', gap: '4px', padding: '20px 12px' }}
          >
            <span style={{ fontSize: '18px', fontWeight: 900 }}>{grade.label}</span>
            <span style={{ fontSize: '10px', opacity: 0.6, letterSpacing: '1px' }}>{grade.tag.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepSubjects({ formData, setFormData }) {
  const subjects = getSubjectsForGrade(formData.grade);
  const selected = formData.selectedSubjects;

  const toggle = (id) => {
    setFormData(d => ({
      ...d,
      selectedSubjects: d.selectedSubjects.includes(id)
        ? d.selectedSubjects.filter(s => s !== id)
        : [...d.selectedSubjects, id],
    }));
  };

  return (
    <div className="onboarding-content">
      <h2>Choose your subjects</h2>
      <p>Pick the subjects you want to master. You can add more later.</p>
      {formData.grade && (
        <p style={{ fontSize: '12px', opacity: 0.5, marginTop: '4px' }}>
          Showing subjects for {GRADES.find(g => g.id === formData.grade)?.label}
        </p>
      )}
      <div className="options-grid subjects-grid" style={{ marginTop: '24px' }}>
        {subjects.map(subject => (
          <button
            key={subject.id}
            className={`option-btn subject-btn ${selected.includes(subject.id) ? 'active' : ''}`}
            onClick={() => toggle(subject.id)}
            style={{
              borderColor: selected.includes(subject.id) ? subject.color : undefined,
              boxShadow: selected.includes(subject.id) ? `0 0 16px ${subject.color}40` : undefined,
            }}
          >
            <span style={{
              display: 'inline-block', width: '8px', height: '8px',
              borderRadius: '50%', background: subject.color, marginRight: '8px', flexShrink: 0,
            }} />
            {subject.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepDifficulty({ formData, setFormData }) {
  return (
    <div className="onboarding-content">
      <h2>Your current level?</h2>
      <p>We'll adjust the challenge level to match where you are right now.</p>
      <div className="options-grid" style={{ gridTemplateColumns: '1fr', gap: '12px', marginTop: '24px' }}>
        {DIFFICULTY_LEVELS.map(level => (
          <button
            key={level.id}
            className={`option-btn ${formData.difficulty === level.id ? 'active' : ''}`}
            onClick={() => setFormData(d => ({ ...d, difficulty: level.id }))}
            style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px', padding: '16px 20px' }}
          >
            <span style={{ fontWeight: 800, fontSize: '15px' }}>{level.label}</span>
            <span style={{ fontSize: '12px', opacity: 0.6, fontWeight: 400 }}>{level.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepGoals({ formData, setFormData }) {
  const toggle = (id) => {
    setFormData(d => ({
      ...d,
      learningGoals: d.learningGoals.includes(id)
        ? d.learningGoals.filter(g => g !== id)
        : [...d.learningGoals, id],
    }));
  };

  return (
    <div className="onboarding-content">
      <h2>What are your goals?</h2>
      <p>Select all that apply. We'll prioritize your learning path accordingly.</p>
      <div className="options-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '24px' }}>
        {LEARNING_GOALS.map(goal => (
          <button
            key={goal.id}
            className={`option-btn ${formData.learningGoals.includes(goal.id) ? 'active' : ''}`}
            onClick={() => toggle(goal.id)}
            style={{ flexDirection: 'column', gap: '8px', padding: '20px 12px' }}
          >
            <span style={{ fontSize: '24px' }}>{goal.icon}</span>
            <span style={{ fontWeight: 700, fontSize: '13px' }}>{goal.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepSummary({ formData }) {
  const gradeLabel = GRADES.find(g => g.id === formData.grade)?.label || formData.grade;
  const subjects = getSubjectsForGrade(formData.grade).filter(s => formData.selectedSubjects.includes(s.id));

  return (
    <div className="onboarding-content">
      <h2>Your Learning Profile</h2>
      <p>Everything's set. Your personalized OS is ready to launch.</p>
      <div className="summary-card" style={{ marginTop: '28px' }}>
        <p><strong>Grade:</strong> {gradeLabel}</p>
        <p>
          <strong>Subjects:</strong>{' '}
          {subjects.length > 0 ? subjects.map(s => s.label).join(', ') : '—'}
        </p>
        <p>
          <strong>Level:</strong>{' '}
          {DIFFICULTY_LEVELS.find(d => d.id === formData.difficulty)?.label || '—'}
        </p>
        <p>
          <strong>Goals:</strong>{' '}
          {formData.learningGoals.length > 0
            ? formData.learningGoals.map(id => LEARNING_GOALS.find(g => g.id === id)?.label).join(', ')
            : '—'}
        </p>
      </div>
      <p style={{ marginTop: '20px', opacity: 0.6, fontSize: '13px' }}>
        Your dashboard, battles, and AI tutor will all adapt to this profile.
      </p>
    </div>
  );
}

// ── Main Onboarding Component ──────────────────────────────────────────────────

function Onboarding() {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    grade: '',
    selectedSubjects: [],
    difficulty: '',
    learningGoals: [],
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const isStepValid = () => {
    if (step === 0) return !!formData.grade;
    if (step === 1) return formData.selectedSubjects.length > 0;
    if (step === 2) return !!formData.difficulty;
    return true;
  };

  const handleNext = async () => {
    if (step === TOTAL_STEPS - 1) {
      try {
        setLoading(true);
        await completeOnboarding(formData);
        navigate('/dashboard');
      } catch (err) {
        console.error('Onboarding error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setStep(s => s + 1);
    }
  };

  const steps = [
    <StepGrade formData={formData} setFormData={setFormData} />,
    <StepSubjects formData={formData} setFormData={setFormData} />,
    <StepDifficulty formData={formData} setFormData={setFormData} />,
    <StepGoals formData={formData} setFormData={setFormData} />,
    <StepSummary formData={formData} />,
  ];

  const stepLabels = ['Grade', 'Subjects', 'Level', 'Goals', 'Launch'];

  return (
    <div className="onboarding-container">
      <Snowfall />
      <img src={starsImg} alt="Stars" className="stars2-bg" />

      <div className="onboarding-card">
        {/* Progress bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
        </div>

        {/* Step labels */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', padding: '16px 24px 0' }}>
          {stepLabels.map((label, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '10px', letterSpacing: '1px', fontWeight: 700,
              color: i === step ? 'var(--primary, #8b5cf6)' : i < step ? 'var(--success, #10b981)' : 'rgba(255,255,255,0.2)',
              transition: 'color 0.3s',
            }}>
              {i < step ? '✓' : (i + 1)} {label}
              {i < stepLabels.length - 1 && (
                <span style={{ color: 'rgba(255,255,255,0.1)', margin: '0 2px' }}>›</span>
              )}
            </div>
          ))}
        </div>

        {/* Step content with animation */}
        <div className="onboarding-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="onboarding-controls">
          <button
            className="btn-secondary"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0 || loading}
          >
            Back
          </button>
          <div className="step-indicator">{step + 1} / {TOTAL_STEPS}</div>
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={!isStepValid() || loading}
          >
            {loading ? 'Launching...' : step === TOTAL_STEPS - 1 ? 'Launch LearnCraft' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
