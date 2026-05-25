import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  BarChart2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileEdit,
  Flag,
  PlayCircle,
  RefreshCw,
  Target,
  Timer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/UserProgressContext';
import { db } from '../firebase';
import { learningData } from '../data/learningData';
import '../pages/dashboard.css';

const TEST_TEMPLATES = [
  {
    id: 'comprehensive',
    title: 'Comprehensive Mastery Test',
    description: 'A balanced paper that samples across your curriculum.',
    durationMinutes: 30,
    questionCount: 12,
    mode: 'balanced'
  },
  {
    id: 'weak-areas',
    title: 'Weak Area Recovery Test',
    description: 'Focused practice built from your weaker subjects.',
    durationMinutes: 22,
    questionCount: 10,
    mode: 'weak-areas'
  },
  {
    id: 'speed-drill',
    title: 'Speed Drill',
    description: 'Short, fast-paced recall to sharpen accuracy under time pressure.',
    durationMinutes: 15,
    questionCount: 8,
    mode: 'speed'
  }
];

const DEFAULT_TEMPLATE_ID = 'comprehensive';

function createAttemptId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `mock-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function shuffle(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function flattenGradeQuestions(gradeData, gradeKey) {
  const questions = [];

  Object.entries(gradeData?.subjects || {}).forEach(([subjectId, subject]) => {
    Object.entries(subject?.chapters || {}).forEach(([chapterId, chapter]) => {
      (chapter?.topics || []).forEach((topic) => {
        (topic?.questions || []).forEach((question, questionIndex) => {
          questions.push({
            id: question.id || `${topic.id}-${questionIndex}`,
            question: question.question,
            options: question.options || [],
            answer: question.answer,
            explanation: question.explanation || '',
            difficulty: question.difficulty || topic.difficulty || 'medium',
            xp: question.xp || topic.xp || 0,
            gradeId: gradeKey,
            subjectId,
            subjectTitle: subject.title,
            chapterId,
            chapterTitle: chapter.title,
            topicId: topic.id,
            topicTitle: topic.title,
          });
        });
      });
    });
  });

  return questions;
}

function scoreByTemplateMode(question, mode, weakSubjectSet, recentTopicSet) {
  const difficultyRank = { easy: 1, medium: 2, hard: 3, expert: 4 };
  const difficultyScore = difficultyRank[question.difficulty] || 2;
  const weakScore = weakSubjectSet.has(question.subjectId) ? 3 : 0;
  const recentScore = recentTopicSet.has(question.topicId) ? 2 : 0;

  if (mode === 'speed') {
    return -(difficultyScore + (question.question?.length || 0) / 100);
  }

  if (mode === 'weak-areas') {
    return weakScore * 5 + recentScore * 2 + difficultyScore;
  }

  return difficultyScore + weakScore + recentScore;
}

function buildTestBlueprint({ gradeKey, template, weakAreas, battleHistory, attendedTopics = [], selectedSubjects = [] }) {
  const gradeData = learningData[gradeKey] || learningData.grade10;
  const allQuestions = flattenGradeQuestions(gradeData, gradeKey);
  const weakSubjectSet = new Set((weakAreas || []).map((value) => String(value)));
  const recentTopicSet = new Set(
    (battleHistory || [])
      .filter((entry) => entry?.topicId)
      .slice(0, 8)
      .map((entry) => entry.topicId)
  );

  const attendedTopicSet = new Set((attendedTopics || []).map((t) => String(t)));
  const selectedSubjectSet = new Set((selectedSubjects || []).map((s) => String(s)));

  // Prefer questions from attended topics; fallback to selected subjects; otherwise use full pool
  let candidateQuestions = allQuestions;
  if (attendedTopicSet.size > 0) {
    candidateQuestions = allQuestions.filter((q) => attendedTopicSet.has(String(q.topicId)));
  } else if (selectedSubjectSet.size > 0) {
    candidateQuestions = allQuestions.filter((q) => selectedSubjectSet.has(String(q.subjectId)));
  }

  const ranked = [...candidateQuestions].sort((left, right) => {
    const rightScore = scoreByTemplateMode(right, template.mode, weakSubjectSet, recentTopicSet);
    const leftScore = scoreByTemplateMode(left, template.mode, weakSubjectSet, recentTopicSet);

    if (rightScore !== leftScore) return rightScore - leftScore;
    return (right.topicTitle || '').localeCompare(left.topicTitle || '');
  });

  const selected = ranked.slice(0, template.questionCount);
  const subjectIds = Array.from(new Set(selected.map((question) => question.subjectId).filter(Boolean)));

  return {
    templateId: template.id,
    title: template.title,
    description: template.description,
    mode: template.mode,
    durationSeconds: template.durationMinutes * 60,
    questionCount: selected.length,
    gradeId: gradeKey,
    questions: shuffle(selected),
    subjectIds,
  };
}

async function loadLatestAttempt(userId) {
  if (!userId || !db) return null;

  const attemptsRef = collection(db, 'users', userId, 'mockTests');
  const q = query(attemptsRef, orderBy('updatedAt', 'desc'), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const latest = snapshot.docs[0];
  return { id: latest.id, ...latest.data() };
}

function getQuestionKey(question, index) {
  return question?.id || `question-${index}`;
}

export default function MockTests() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { profile, summary, grade, weakAreas, battleHistory, analytics, completedTopics, selectedSubjects } = useProgress();
  const [selectedTemplateId, setSelectedTemplateId] = useState(DEFAULT_TEMPLATE_ID);
  const [testState, setTestState] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [phase, setPhase] = useState('setup');
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resumeAttempt, setResumeAttempt] = useState(null);
  const heartbeatRef = useRef(null);
  const latestSnapshotRef = useRef(null);
  const draftLoadedRef = useRef(false);

  const currentGrade = useMemo(() => profile?.profile?.grade || userProfile?.profile?.grade || summary?.currentGrade || grade || 'grade10', [profile, userProfile, summary, grade]);
  const templates = TEST_TEMPLATES;

  const activeTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) || templates[0],
    [selectedTemplateId]
  );

  const questionCount = testState?.questions?.length || activeTemplate.questionCount;
  const answeredCount = Object.keys(selectedAnswers).filter((key) => selectedAnswers[key]?.selectedOption !== undefined).length;
  const correctCount = Object.values(selectedAnswers).filter((answer) => answer?.isCorrect).length;
  const skippedCount = Math.max(0, questionCount - Object.keys(selectedAnswers).length);
  const accuracy = questionCount > 0 ? Math.round((correctCount / questionCount) * 100) : 0;
  const progressPercent = questionCount > 0 ? Math.round(((currentIndex + 1) / questionCount) * 100) : 0;

  const progressStats = useMemo(() => {
    const completedTests = Array.isArray(analytics?.battleHistory) ? analytics.battleHistory.length : (battleHistory?.length || 0);
    const weakAreaCount = weakAreas?.length || 0;
    const recentFocus = battleHistory?.[0]?.topicId || 'Curriculum-wide';

    return {
      completedTests,
      weakAreaCount,
      recentFocus
    };
  }, [analytics, battleHistory, weakAreas]);

  const saveAttempt = useCallback(async (payload) => {
    if (!user?.uid || !db || !payload?.id) return;

    setSaving(true);
    try {
      const attemptRef = doc(db, 'users', user.uid, 'mockTests', payload.id);
      await setDoc(
        attemptRef,
        {
          userId: user.uid,
          displayName: userProfile?.fullName || profile?.fullName || user.displayName || null,
          gradeId: currentGrade,
          templateId: payload.templateId,
          title: payload.title,
          mode: payload.mode,
          status: payload.status,
          durationSeconds: payload.durationSeconds,
          remainingSeconds: payload.remainingSeconds,
          currentIndex: payload.currentIndex,
          selectedAnswers: payload.selectedAnswers,
          flaggedQuestions: payload.flaggedQuestions,
          questions: payload.questions,
          subjectIds: payload.subjectIds,
          analyticsSnapshot: {
            weakAreas: weakAreas || [],
            completedTests: progressStats.completedTests,
            recentFocus: progressStats.recentFocus,
          },
          startedAt: payload.startedAt || serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save mock test state.');
    } finally {
      setSaving(false);
    }
  }, [currentGrade, profile?.fullName, progressStats.completedTests, progressStats.recentFocus, user?.displayName, user?.uid, userProfile?.fullName, weakAreas]);

  const createTest = useCallback((templateId = selectedTemplateId) => {
    const template = templates.find((item) => item.id === templateId) || templates[0];
    const blueprint = buildTestBlueprint({
      gradeKey: currentGrade,
      template,
      weakAreas,
      battleHistory,
      attendedTopics: completedTopics,
      selectedSubjects: selectedSubjects,
    });

    const attemptId = createAttemptId();
    const startedAt = Date.now();

    const state = {
      id: attemptId,
      startedAt,
      ...blueprint,
      status: 'in_progress',
    };

    setTestState(state);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setRemainingSeconds(blueprint.durationSeconds);
    setPhase('running');
    setErrorMessage('');
    setResumeAttempt(null);

    void saveAttempt({
      ...state,
      remainingSeconds: blueprint.durationSeconds,
      currentIndex: 0,
      selectedAnswers: {},
      flaggedQuestions: {},
      questions: blueprint.questions,
      subjectIds: blueprint.subjectIds,
      startedAt,
      status: 'in_progress'
    });
  }, [battleHistory, completedTopics, currentGrade, saveAttempt, selectedTemplateId, selectedSubjects, templates, weakAreas]);

  useEffect(() => {
    if (!user?.uid || draftLoadedRef.current) return;

    let mounted = true;
    setLoadingDraft(true);

    loadLatestAttempt(user.uid)
      .then((attempt) => {
        if (!mounted || !attempt || attempt.status !== 'in_progress' || !Array.isArray(attempt.questions) || attempt.questions.length === 0) {
          return;
        }

        setResumeAttempt(attempt);
      })
      .catch((error) => {
        if (mounted) setErrorMessage(error.message || 'Unable to load saved mock test.');
      })
      .finally(() => {
        if (mounted) {
          setLoadingDraft(false);
          draftLoadedRef.current = true;
        }
      });

    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!resumeAttempt) return;

    const resumedState = {
      id: resumeAttempt.id,
      templateId: resumeAttempt.templateId || DEFAULT_TEMPLATE_ID,
      title: resumeAttempt.title || 'Saved Mock Test',
      description: resumeAttempt.description || 'Resumed from your last session.',
      mode: resumeAttempt.mode || 'balanced',
      durationSeconds: resumeAttempt.durationSeconds || 0,
      questions: resumeAttempt.questions || [],
      questionCount: resumeAttempt.questions?.length || 0,
      gradeId: resumeAttempt.gradeId || currentGrade,
      subjectIds: resumeAttempt.subjectIds || [],
      startedAt: resumeAttempt.startedAt || Date.now(),
      status: 'in_progress'
    };

    setTestState(resumedState);
    setCurrentIndex(Math.min(resumeAttempt.currentIndex || 0, resumedState.questions.length - 1));
    setSelectedAnswers(resumeAttempt.selectedAnswers || {});
    setFlaggedQuestions(resumeAttempt.flaggedQuestions || {});
    setRemainingSeconds(resumeAttempt.remainingSeconds || resumedState.durationSeconds);
    setPhase('running');
  }, [currentGrade, resumeAttempt]);

  useEffect(() => {
    if (phase !== 'running') return;

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          void submitTest('time-up');
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'running' || !testState?.id) return;

    if (heartbeatRef.current) {
      window.clearInterval(heartbeatRef.current);
    }

    heartbeatRef.current = window.setInterval(() => {
      const snapshot = latestSnapshotRef.current;
      if (!snapshot?.testState?.id) return;

      void saveAttempt({
        ...snapshot.testState,
        remainingSeconds: snapshot.remainingSeconds,
        currentIndex: snapshot.currentIndex,
        selectedAnswers: snapshot.selectedAnswers,
        flaggedQuestions: snapshot.flaggedQuestions,
        status: 'in_progress'
      });
    }, 30000);

    return () => {
      if (heartbeatRef.current) {
        window.clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, [phase, saveAttempt, testState?.id]);

  useEffect(() => {
    if (phase !== 'running' || !testState?.id) return;

    const autosaveTimer = window.setTimeout(() => {
      const snapshot = latestSnapshotRef.current;
      if (!snapshot?.testState?.id) return;

      void saveAttempt({
        ...snapshot.testState,
        remainingSeconds: snapshot.remainingSeconds,
        currentIndex: snapshot.currentIndex,
        selectedAnswers: snapshot.selectedAnswers,
        flaggedQuestions: snapshot.flaggedQuestions,
        status: 'in_progress'
      });
    }, 500);

    return () => window.clearTimeout(autosaveTimer);
  }, [currentIndex, flaggedQuestions, phase, saveAttempt, selectedAnswers, testState?.id]);

  const currentQuestion = testState?.questions?.[currentIndex] || null;

  useEffect(() => {
    latestSnapshotRef.current = {
      testState,
      currentIndex,
      selectedAnswers,
      flaggedQuestions,
      remainingSeconds,
      phase,
    };
  }, [currentIndex, flaggedQuestions, phase, remainingSeconds, selectedAnswers, testState]);

  const handleSelectAnswer = useCallback((option) => {
    if (!currentQuestion) return;

    setSelectedAnswers((previous) => ({
      ...previous,
      [getQuestionKey(currentQuestion, currentIndex)]: {
        selectedOption: option,
        isCorrect: option === currentQuestion.answer,
        answeredAt: Date.now(),
      }
    }));
  }, [currentIndex, currentQuestion]);

  const handleToggleFlag = useCallback(() => {
    if (!currentQuestion) return;

    const questionKey = getQuestionKey(currentQuestion, currentIndex);
    setFlaggedQuestions((previous) => ({
      ...previous,
      [questionKey]: !previous[questionKey]
    }));
  }, [currentIndex, currentQuestion]);

  const goToQuestion = useCallback((index) => {
    if (!testState?.questions?.length) return;
    const boundedIndex = Math.max(0, Math.min(index, testState.questions.length - 1));
    setCurrentIndex(boundedIndex);
  }, [testState?.questions?.length]);

  const submitTest = useCallback(async (reason = 'manual') => {
    if (!testState?.id) return;

    const totalQuestions = testState.questions.length;
    const answeredEntries = testState.questions.map((question, index) => ({
      question,
      answer: selectedAnswers[getQuestionKey(question, index)] || null,
      flagged: Boolean(flaggedQuestions[getQuestionKey(question, index)])
    }));

    const correct = answeredEntries.filter((entry) => entry.answer?.isCorrect).length;
    const answered = answeredEntries.filter((entry) => entry.answer?.selectedOption !== undefined).length;
    const skipped = totalQuestions - answered;
    const accuracyPercent = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    const durationSpent = Math.max(0, testState.durationSeconds - remainingSeconds);
    const minutesSpent = Math.max(1, Math.ceil(durationSpent / 60));
    const xpEarned = Math.max(15, Math.round(correct * 12 + accuracyPercent * 0.8 + Math.max(0, 10 - minutesSpent)));
    const starsEarned = accuracyPercent >= 90 ? 3 : accuracyPercent >= 75 ? 2 : accuracyPercent >= 60 ? 1 : 0;
    const passed = accuracyPercent >= 60;

    setPhase('summary');

    try {
      await saveAttempt({
        ...testState,
        status: 'completed',
        selectedAnswers,
        flaggedQuestions,
        currentIndex,
        remainingSeconds,
        completedAt: Date.now(),
        results: {
          reason,
          totalQuestions,
          correct,
          answered,
          skipped,
          accuracyPercent,
          xpEarned,
          starsEarned,
          passed,
          durationSpent,
        }
      });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save test result.');
    }
  }, [currentIndex, flaggedQuestions, remainingSeconds, saveAttempt, selectedAnswers, testState]);

  useEffect(() => {
    if (phase !== 'running' || !testState?.id) return;

    if (currentIndex >= testState.questions.length && testState.questions.length > 0) {
      void submitTest('completed-all');
    }
  }, [currentIndex, phase, submitTest, testState]);

  const resumeSavedTest = useCallback(() => {
    if (!resumeAttempt) return;

    setSelectedTemplateId(resumeAttempt.templateId || DEFAULT_TEMPLATE_ID);
    setPhase('running');
  }, [resumeAttempt]);

  const renderSetup = () => (
    <div className="dashboard-content">
      <header className="section-header">
        <FileEdit className="section-icon" />
        <h2 className="section-title">EXAM SIMULATIONS</h2>
      </header>

      <div className="dashboard-grid-main" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', marginBottom: '30px' }}>
        <div className="premium-card" style={{ textAlign: 'center' }}>
          <Timer size={32} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '32px', margin: 0, fontWeight: 800 }}>{progressStats.completedTests}</h3>
          <p className="stat-label">TESTS COMPLETED</p>
        </div>
        <div className="premium-card" style={{ textAlign: 'center' }}>
          <Target size={32} color="var(--success)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '32px', margin: 0, fontWeight: 800 }}>{accuracy}%</h3>
          <p className="stat-label">CURRENT ACCURACY</p>
        </div>
        <div className="premium-card" style={{ textAlign: 'center' }}>
          <BarChart2 size={32} color="var(--secondary)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '32px', margin: 0, fontWeight: 800 }}>{progressStats.weakAreaCount}</h3>
          <p className="stat-label">WEAK AREAS FLAGGED</p>
        </div>
      </div>

      <div className="premium-card" style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '12px', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '6px' }}>RECOMMENDED FOCUS</div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{progressStats.recentFocus}</div>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Saved to <span style={{ color: 'var(--primary)' }}>users / {user?.uid || 'guest'} / mockTests</span>
        </div>
      </div>

      {resumeAttempt ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card"
          style={{ marginBottom: '24px', border: '1px solid rgba(88, 204, 2, 0.2)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '12px', letterSpacing: '1.5px', color: 'var(--success)', marginBottom: '6px' }}>RESUME AVAILABLE</div>
              <h3 style={{ margin: 0, fontSize: '20px' }}>{resumeAttempt.title || 'Saved Mock Test'}</h3>
              <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>Continue from question {Math.min((resumeAttempt.currentIndex || 0) + 1, resumeAttempt.questions?.length || 1)} of {resumeAttempt.questions?.length || 0}.</p>
            </div>
            <button className="btn-ai-action" onClick={resumeSavedTest} style={{ width: 'auto', padding: '12px 24px' }}>
              <PlayCircle size={18} /> Resume Test
            </button>
          </div>
        </motion.div>
      ) : null}

      <h3 className="section-title" style={{ fontSize: '20px', marginBottom: '24px' }}>AVAILABLE SIMULATIONS</h3>
      <div style={{ display: 'grid', gap: '16px' }}>
        {templates.map((template) => {
          const isActive = template.id === selectedTemplateId;
          return (
            <motion.button
              key={template.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedTemplateId(template.id)}
              className="premium-card"
              style={{
                width: '100%',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-color)'}`,
                background: isActive ? 'rgba(139, 92, 246, 0.08)' : 'var(--glass-bg)',
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <span style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', letterSpacing: '1px', color: 'var(--text-secondary)' }}>{template.durationMinutes} MINUTES</span>
                  <span style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(16,185,129,0.08)', letterSpacing: '1px', color: 'var(--success)' }}>{template.questionCount} QUESTIONS</span>
                  <span style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '999px', background: 'rgba(245,158,11,0.08)', letterSpacing: '1px', color: 'var(--secondary)' }}>{template.mode.toUpperCase()}</span>
                </div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 800 }}>{template.title}</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{template.description}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isActive ? <CheckCircle2 size={20} color="var(--success)" /> : <ChevronRight size={20} color="var(--text-dim)" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
        <button className="btn-logout" onClick={() => navigate('/dashboard')} style={{ width: 'auto', padding: '12px 24px' }}>
          Back to Dashboard
        </button>
        <button
          className="btn-ai-action"
          onClick={() => createTest(selectedTemplateId)}
          style={{ width: 'auto', padding: '12px 28px' }}
          disabled={loadingDraft}
        >
          <PlayCircle size={18} /> Start Simulation
        </button>
      </div>
    </div>
  );

  const renderQuestionNav = () => {
    if (!testState?.questions?.length) return null;

    return (
      <div className="premium-card" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', letterSpacing: '1.4px', color: 'var(--text-dim)', marginBottom: '4px' }}>QUESTION MAP</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{answeredCount} answered, {skippedCount} skipped, {flaggedQuestions ? Object.values(flaggedQuestions).filter(Boolean).length : 0} flagged</div>
          </div>
          <button className="btn-logout" onClick={handleToggleFlag} style={{ width: 'auto', padding: '10px 16px' }}>
            <Flag size={16} /> {currentQuestion && flaggedQuestions[getQuestionKey(currentQuestion, currentIndex)] ? 'Unflag' : 'Flag for review'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(48px, 1fr))', gap: '8px' }}>
          {testState.questions.map((question, index) => {
            const key = getQuestionKey(question, index);
            const isSelected = index === currentIndex;
            const answer = selectedAnswers[key];
            const isCorrect = answer?.isCorrect;
            const isFlagged = flaggedQuestions[key];
            const background = isSelected
              ? 'rgba(139, 92, 246, 0.15)'
              : isCorrect
                ? 'rgba(16, 185, 129, 0.12)'
                : answer
                  ? 'rgba(245, 158, 11, 0.12)'
                  : 'rgba(255, 255, 255, 0.04)';

            return (
              <button
                key={key}
                onClick={() => goToQuestion(index)}
                style={{
                  height: '48px',
                  borderRadius: '12px',
                  border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                  background,
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 700,
                  position: 'relative'
                }}
              >
                {index + 1}
                {isFlagged ? <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', borderRadius: '999px', background: 'var(--secondary)' }} /> : null}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRunning = () => {
    if (!testState?.questions?.length || !currentQuestion) {
      return (
        <div className="dashboard-content">
          <div className="premium-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <AlertTriangle size={40} color="var(--secondary)" style={{ marginBottom: '16px' }} />
            <h2 className="section-title">Preparing test...</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Your question set is being assembled from the current curriculum.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="dashboard-content">
        <div className="premium-card" style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '12px', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '6px' }}>LIVE MOCK TEST</div>
            <h2 style={{ margin: 0, fontSize: '24px' }}>{testState.title}</h2>
            <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)' }}>{testState.description}</p>
          </div>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>TIME LEFT</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: remainingSeconds <= 300 ? 'var(--error)' : 'var(--primary)' }}>{formatDuration(remainingSeconds)}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>QUESTION</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--secondary)' }}>{currentIndex + 1}/{questionCount}</div>
            </div>
          </div>
        </div>

        <div className="premium-card" style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="stat-label">{currentQuestion.subjectTitle}</span>
              <span className="stat-label">{currentQuestion.chapterTitle}</span>
              <span className="stat-label" style={{ color: 'var(--secondary)' }}>{currentQuestion.difficulty.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '180px', height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{progressPercent}%</span>
            </div>
          </div>

          <h3 style={{ margin: '0 0 18px 0', fontSize: '22px', lineHeight: 1.4 }}>{currentQuestion.question}</h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            {currentQuestion.options.map((option) => {
              const currentAnswer = selectedAnswers[getQuestionKey(currentQuestion, currentIndex)]?.selectedOption;
              const isSelected = currentAnswer === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSelectAnswer(option)}
                  style={{
                    textAlign: 'left',
                    borderRadius: '14px',
                    padding: '16px 18px',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: isSelected ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255,255,255,0.03)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 600
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedAnswers[getQuestionKey(currentQuestion, currentIndex)] ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ marginTop: '18px', padding: '14px 16px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: selectedAnswers[getQuestionKey(currentQuestion, currentIndex)]?.isCorrect ? 'var(--success)' : 'var(--error)' }}>
                  {selectedAnswers[getQuestionKey(currentQuestion, currentIndex)]?.isCorrect ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                  <strong>{selectedAnswers[getQuestionKey(currentQuestion, currentIndex)]?.isCorrect ? 'Correct answer locked in' : 'Answer recorded'}</strong>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{currentQuestion.explanation || `Correct answer: ${currentQuestion.answer}`}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button className="btn-logout" onClick={() => goToQuestion(currentIndex - 1)} disabled={currentIndex === 0} style={{ width: 'auto', padding: '12px 18px' }}>
              <ChevronLeft size={16} /> Previous
            </button>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-logout" onClick={handleToggleFlag} style={{ width: 'auto', padding: '12px 18px' }}>
                <Flag size={16} /> {flaggedQuestions[getQuestionKey(currentQuestion, currentIndex)] ? 'Unflag' : 'Flag'}
              </button>
              <button
                className="btn-ai-action"
                onClick={() => goToQuestion(currentIndex + 1)}
                style={{ width: 'auto', padding: '12px 18px' }}
                disabled={currentIndex >= questionCount - 1}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {renderQuestionNav()}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '18px', flexWrap: 'wrap' }}>
          <button className="btn-logout" onClick={() => navigate('/mocks')} style={{ width: 'auto', padding: '12px 18px' }}>
            Back to Tests
          </button>
          <button className="btn-ai-action" onClick={() => void submitTest('manual')} style={{ width: 'auto', padding: '12px 22px' }}>
            Submit Test
          </button>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!testState?.questions?.length) {
      return null;
    }

    const totalQuestions = testState.questions.length;
    const answeredEntries = testState.questions.map((question, index) => ({
      question,
      answer: selectedAnswers[getQuestionKey(question, index)] || null,
      flagged: Boolean(flaggedQuestions[getQuestionKey(question, index)])
    }));
    const correct = answeredEntries.filter((entry) => entry.answer?.isCorrect).length;
    const accuracyPercent = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    const xpEarned = Math.max(15, Math.round(correct * 12 + accuracyPercent * 0.8));
    const passed = accuracyPercent >= 60;

    return (
      <div className="dashboard-content">
        <div className="premium-card" style={{ textAlign: 'center', padding: '42px 28px' }}>
          <div style={{ fontSize: '48px', marginBottom: '14px' }}>{passed ? '🏆' : '📘'}</div>
          <h2 className="section-title" style={{ marginBottom: '8px' }}>{passed ? 'Simulation Complete' : 'Keep Practicing'}</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 0 }}>{testState.title}</p>

          <div className="dashboard-grid-main" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', marginTop: '28px' }}>
            <div className="premium-card" style={{ textAlign: 'center' }}>
              <div className="stat-label">CORRECT</div>
              <h3 style={{ fontSize: '30px', margin: '10px 0 0', fontWeight: 800, color: 'var(--success)' }}>{correct}</h3>
            </div>
            <div className="premium-card" style={{ textAlign: 'center' }}>
              <div className="stat-label">ACCURACY</div>
              <h3 style={{ fontSize: '30px', margin: '10px 0 0', fontWeight: 800, color: 'var(--primary)' }}>{accuracyPercent}%</h3>
            </div>
            <div className="premium-card" style={{ textAlign: 'center' }}>
              <div className="stat-label">XP EARNED</div>
              <h3 style={{ fontSize: '30px', margin: '10px 0 0', fontWeight: 800, color: 'var(--secondary)' }}>{xpEarned}</h3>
            </div>
            <div className="premium-card" style={{ textAlign: 'center' }}>
              <div className="stat-label">SKIPPED</div>
              <h3 style={{ fontSize: '30px', margin: '10px 0 0', fontWeight: 800, color: 'var(--error)' }}>{skippedCount}</h3>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
            <button className="btn-ai-action" onClick={() => createTest(selectedTemplateId)} style={{ width: 'auto', padding: '12px 22px' }}>
              <RefreshCw size={16} /> Retry Test
            </button>
            <button className="btn-logout" onClick={() => navigate('/dashboard')} style={{ width: 'auto', padding: '12px 22px' }}>
              Dashboard
            </button>
          </div>
        </div>

        <div className="premium-card" style={{ marginTop: '20px' }}>
          <h3 className="section-title" style={{ fontSize: '20px', marginBottom: '14px' }}>REVIEW</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {answeredEntries.map((entry, index) => {
              const answer = entry.answer;
              const statusColor = answer?.isCorrect ? 'var(--success)' : answer ? 'var(--error)' : 'var(--secondary)';
              const statusLabel = answer?.isCorrect ? 'Correct' : answer ? 'Incorrect' : 'Skipped';

              return (
                <div
                  key={getQuestionKey(entry.question, index)}
                  style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <strong style={{ lineHeight: 1.5 }}>{index + 1}. {entry.question.question}</strong>
                    <span style={{ color: statusColor, fontWeight: 700 }}>{statusLabel}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Your answer: {answer?.selectedOption || 'No answer'}
                    <br />
                    Correct answer: {entry.question.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="premium-card" style={{ marginTop: '20px' }}>
          <h3 className="section-title" style={{ fontSize: '20px', marginBottom: '14px' }}>NEXT FOCUS</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {(weakAreas || []).slice(0, 6).map((subjectId) => (
              <span key={subjectId} className="stat-label" style={{ background: 'rgba(245,158,11,0.08)', color: 'var(--secondary)' }}>{subjectId}</span>
            ))}
            {(weakAreas || []).length === 0 ? (
              <span className="stat-label">No weak areas detected yet</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {errorMessage ? (
        <div style={{ margin: '0 0 16px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--error)' }}>
          {errorMessage}
        </div>
      ) : null}
      {saving ? (
        <div style={{ margin: '0 0 16px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
          Saving mock test state...
        </div>
      ) : null}

      {phase === 'setup' && renderSetup()}
      {phase === 'running' && renderRunning()}
      {phase === 'summary' && renderSummary()}
    </>
  );
}
