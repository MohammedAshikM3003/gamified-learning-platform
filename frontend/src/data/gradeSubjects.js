/**
 * gradeSubjects.js — Single source of truth for grade → subject mapping
 * Used by: Onboarding.jsx (filter), Subjects.jsx (display), Dashboard.jsx (personalization)
 */

// ── Grade definitions ──────────────────────────────────────────────────────────
export const GRADES = [
  { id: 'grade6',  label: 'Grade 6',  level: 6,  tag: 'Foundation'     },
  { id: 'grade7',  label: 'Grade 7',  level: 7,  tag: 'Explorer'       },
  { id: 'grade8',  label: 'Grade 8',  level: 8,  tag: 'Intermediate'   },
  { id: 'grade9',  label: 'Grade 9',  level: 9,  tag: 'Advanced Prep'  },
  { id: 'grade10', label: 'Grade 10', level: 10, tag: 'Board Level'    },
  { id: 'grade11', label: 'Grade 11', level: 11, tag: 'Pre-University'  },
  { id: 'grade12', label: 'Grade 12', level: 12, tag: 'Final Stretch'  },
  { id: 'college', label: 'College',  level: 13, tag: 'Career Launch'  },
];

// ── Subject definitions (id maps to learningData.js keys) ────────────────────
export const ALL_SUBJECTS = {
  mathematics: { id: 'mathematics', label: 'Math',        color: '#e2b857' },
  english:     { id: 'english',     label: 'English',     color: '#38bdf8' },
  science:     { id: 'science',     label: 'Science',     color: '#10b981' },
  social:      { id: 'social',      label: 'Social',      color: '#f59e0b' },
  biology:     { id: 'biology',     label: 'Biology',     color: '#22c55e' },
  chemistry:   { id: 'chemistry',   label: 'Chemistry',   color: '#f97316' },
  physics:     { id: 'physics',     label: 'Physics',     color: '#38bdf8' },
  history:     { id: 'history',     label: 'History',     color: '#ef4444' },
  geography:   { id: 'geography',   label: 'Geography',   color: '#14b8a6' },
  economics:   { id: 'economics',   label: 'Economics',   color: '#f43f5e' },
  commerce:    { id: 'commerce',    label: 'Commerce',    color: '#a855f7' },
  python:      { id: 'python',      label: 'Python',      color: '#3b82f6' },
  java:        { id: 'java',        label: 'Java',        color: '#f97316' },
  html:        { id: 'html',        label: 'HTML',        color: '#fb923c' },
};

// ── Grade → Available subjects ────────────────────────────────────────────────
export const GRADE_SUBJECTS = {
  grade6:  ['english', 'mathematics', 'science', 'social'],
  grade7:  ['english', 'mathematics', 'science', 'social'],
  grade8:  ['english', 'mathematics', 'science', 'social'],
  grade9:  ['english', 'mathematics', 'science', 'social'],
  grade10: ['english', 'mathematics', 'science', 'social'],
  grade11: ['biology', 'chemistry', 'physics', 'history', 'geography', 'economics', 'commerce', 'python', 'java'],
  grade12: ['biology', 'chemistry', 'physics', 'history', 'geography', 'economics', 'commerce', 'python', 'java'],
  college: ['java', 'python', 'html'],
};

// ── Helper: get subject objects for a grade ───────────────────────────────────
export const getSubjectsForGrade = (gradeId) => {
  const ids = GRADE_SUBJECTS[gradeId] || [];
  return ids.map(id => ALL_SUBJECTS[id]).filter(Boolean);
};

// ── Difficulty levels ─────────────────────────────────────────────────────────
export const DIFFICULTY_LEVELS = [
  { id: 'beginner',     label: 'Beginner',     desc: 'Start from the basics, build strong foundations.' },
  { id: 'intermediate', label: 'Intermediate', desc: 'You know the basics — let\'s go deeper.' },
  { id: 'advanced',     label: 'Advanced',     desc: 'Push your limits with challenging content.' },
];

// ── Learning goals ────────────────────────────────────────────────────────────
export const LEARNING_GOALS = [
  { id: 'school-exams',   label: 'School Exams',       icon: '📚' },
  { id: 'competitive',    label: 'Competitive Exams',  icon: '🏆' },
  { id: 'placements',     label: 'Placement Prep',     icon: '💼' },
  { id: 'coding-skills',  label: 'Coding Skills',      icon: '⌨️' },
];
