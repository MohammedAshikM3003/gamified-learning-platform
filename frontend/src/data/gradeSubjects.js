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
];

// ── Subject definitions (id maps to learningData.js keys) ────────────────────
export const ALL_SUBJECTS = {
  mathematics:   { id: 'mathematics',   label: 'Mathematics',          color: '#e2b857' },
  science:       { id: 'science',       label: 'Science',              color: '#10b981' },
  english:       { id: 'english',       label: 'English',              color: '#38bdf8' },
  physics:       { id: 'physics',       label: 'Physics',              color: '#38bdf8' },
  chemistry:     { id: 'chemistry',     label: 'Chemistry',            color: '#f97316' },
  biology:       { id: 'biology',       label: 'Biology',              color: '#22c55e' },
  programming:   { id: 'programming',   label: 'Programming',          color: '#8b5cf6' },
  'computer-science': { id: 'computer-science', label: 'Computer Science', color: '#a78bfa' },
  'ai-ml':       { id: 'ai-ml',         label: 'AI & ML',              color: '#06b6d4' },
  aptitude:      { id: 'aptitude',      label: 'Aptitude',             color: '#f59e0b' },
  placement:     { id: 'placement',     label: 'Placement Preparation', color: '#ef4444' },
};

// ── Grade → Available subjects ────────────────────────────────────────────────
export const GRADE_SUBJECTS = {
  grade6:  ['mathematics', 'science', 'english'],
  grade7:  ['mathematics', 'science', 'english', 'programming'],
  grade8:  ['mathematics', 'physics', 'chemistry', 'programming'],
  grade9:  ['mathematics', 'physics', 'chemistry', 'biology', 'programming'],
  grade10: ['mathematics', 'physics', 'chemistry', 'biology', 'programming', 'computer-science'],
  grade11: ['mathematics', 'physics', 'chemistry', 'computer-science', 'ai-ml'],
  grade12: ['mathematics', 'physics', 'chemistry', 'computer-science', 'ai-ml', 'aptitude', 'placement'],
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
