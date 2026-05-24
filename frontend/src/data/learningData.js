// ============================================================
// LearnCraft OS — Central Learning Data Engine
// Single source of truth: imports all grade modules and assembles
// Future: migrate to Firestore + AI-generated content
// ============================================================

import { grade6 } from './grades/grade6.js';
import { grade7 } from './grades/grade7.js';
import { grade8 } from './grades/grade8.js';
import { grade9 } from './grades/grade9.js';
import { grade10 } from './grades/grade10.js';
import { grade11 } from './grades/grade11.js';
import { grade12 } from './grades/grade12.js';

// ============================================================
// Assembled Learning Data — All Grades
// ============================================================
export const learningData = {
  grade6,
  grade7,
  grade8,
  grade9,
  grade10,
  grade11,
  grade12,
};

// ============================================================
// Helper Utilities
// ============================================================

/** Get a specific topic by its ID, scanning all grades */
export const getTopicById = (topicId) => {
  for (const [gradeId, grade] of Object.entries(learningData)) {
    for (const [subjectId, subject] of Object.entries(grade.subjects || {})) {
      for (const [chapterId, chapter] of Object.entries(subject.chapters || {})) {
        for (const topic of (chapter.topics || [])) {
          if (topic.id === topicId) {
            return { ...topic, subjectId, chapterId, gradeId };
          }
        }
      }
    }
  }
  return null;
};

/** Get all subjects for a given grade */
export const getSubjectsByGrade = (grade) => {
  return learningData[grade]?.subjects || {};
};

/** Get all chapters for a grade + subject */
export const getChaptersBySubject = (grade, subjectId) => {
  return learningData[grade]?.subjects?.[subjectId]?.chapters || {};
};

/** Get all topics for a grade + subject + chapter */
export const getTopicsByChapter = (grade, subjectId, chapterId) => {
  return learningData[grade]?.subjects?.[subjectId]?.chapters?.[chapterId]?.topics || [];
};

/** Total question count across all grades */
export const getTotalQuestionCount = () => {
  let count = 0;
  for (const grade of Object.values(learningData)) {
    for (const subject of Object.values(grade.subjects || {})) {
      for (const chapter of Object.values(subject.chapters || {})) {
        for (const topic of (chapter.topics || [])) {
          count += (topic.questions || []).length;
        }
      }
    }
  }
  return count;
};
