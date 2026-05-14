// ============================================================
// LearnCraft OS — Central Learning Data Engine
// Single source of truth: imports all grade modules and assembles
// Future: migrate to Firestore + AI-generated content
// ============================================================

import { grade6 }  from './grades/grade6.js';
import { grade7 }  from './grades/grade7.js';
import { grade8 }  from './grades/grade8.js';
import { grade9 }  from './grades/grade9.js';
import { grade11 } from './grades/grade11.js';
import { grade12 } from './grades/grade12.js';

// Grade 10 is defined inline — it was the original vertical slice and has richer content
const grade10 = {
  title: 'Grade 10',
  subjects: {
    programming: {
      title: 'Programming', color: '#8b5cf6',
      description: 'Master modern programming concepts and build real projects.',
      chapters: {
        javascript: {
          title: 'JavaScript Basics',
          description: "Learn the fundamentals of the world's most popular language.",
          topics: [
            {
              id: 'variables', title: 'Variables & Data Types',
              difficulty: 'easy', xp: 20, game: 'Code Runner',
              enemy: 'syntax-phantom', estimatedTime: '10 min',
              recommendedLevel: 5, unlockRequirement: null,
              rewards: { xp: 20, coins: 10 },
              description: 'Understand how to store and manipulate data in JavaScript.',
              questions: [
                { id: 'g10_var_q1', question: 'Which keyword declares a block-scoped variable in modern JS?', options: ['var', 'let', 'int', 'declare'], answer: 'let', explanation: "'let' is block-scoped and preferred over 'var' in modern JS.", difficulty: 'easy', xp: 5 },
                { id: 'g10_var_q2', question: 'What does typeof null return?', options: ["'null'", "'undefined'", "'object'", "'string'"], answer: "'object'", explanation: "A historical JS bug — typeof null returns 'object'.", difficulty: 'easy', xp: 5 },
                { id: 'g10_var_q3', question: 'Which is NOT a primitive type in JavaScript?', options: ['string', 'boolean', 'array', 'undefined'], answer: 'array', explanation: 'Arrays are objects in JS, not primitive types.', difficulty: 'easy', xp: 5 },
                { id: 'g10_var_q4', question: 'What does const prevent?', options: ['Reassigning the variable', 'Reading the variable', 'Using in functions', 'Changing object properties'], answer: 'Reassigning the variable', explanation: "'const' blocks reassignment, but object properties can still be mutated.", difficulty: 'easy', xp: 5 },
                { id: 'g10_var_q5', question: 'Template literals use?', options: ["'single quotes'", '"double quotes"', '`backticks`', '#hash#'], answer: '`backticks`', explanation: 'Template literals use backticks and support ${}  expressions.', difficulty: 'easy', xp: 5 },
              ],
            },
            {
              id: 'loops', title: 'Loops & Iteration',
              difficulty: 'medium', xp: 40, game: 'Loop Battle',
              enemy: 'infinite-loop', estimatedTime: '15 min',
              recommendedLevel: 5, unlockRequirement: 'variables',
              rewards: { xp: 40, coins: 18 },
              description: 'Conquer repetition with for, while, and do-while loops.',
              questions: [
                { id: 'g10_loop_q1', question: 'Which loop always executes at least once?', options: ['for', 'while', 'do...while', 'forEach'], answer: 'do...while', explanation: 'do...while checks the condition AFTER executing the body.', difficulty: 'medium', xp: 8 },
                { id: 'g10_loop_q2', question: 'Which keyword immediately exits a loop?', options: ['continue', 'return', 'break', 'exit'], answer: 'break', explanation: "'break' terminates the loop immediately.", difficulty: 'easy', xp: 7 },
                { id: 'g10_loop_q3', question: "What does 'continue' do inside a loop?", options: ['Exits the loop', 'Skips to next iteration', 'Restarts from beginning', 'Pauses execution'], answer: 'Skips to next iteration', explanation: "'continue' skips remaining code in the current iteration.", difficulty: 'medium', xp: 8 },
                { id: 'g10_loop_q4', question: 'Output of: for(let i=0; i<3; i++) console.log(i)', options: ['0 1 2', '1 2 3', '0 1 2 3', '1 2'], answer: '0 1 2', explanation: 'Starts at 0, runs while i<3: prints 0, 1, 2.', difficulty: 'medium', xp: 8 },
              ],
            },
          ],
        },
        'python-basics': {
          title: 'Python Basics',
          description: 'Learn Python — the language of AI, data, and automation.',
          topics: [
            {
              id: 'python-variables', title: 'Python Variables & Types',
              difficulty: 'easy', xp: 25, game: 'Code Runner',
              enemy: 'syntax-phantom', estimatedTime: '12 min',
              recommendedLevel: 5, unlockRequirement: null,
              rewards: { xp: 25, coins: 12 },
              description: 'Learn Python\'s dynamic typing and basic data types.',
              questions: [
                { id: 'g10_py_q1', question: 'Python is a ___ typed language.', options: ['Statically', 'Dynamically', 'Strongly & Statically', 'Weakly'], answer: 'Dynamically', explanation: 'Python determines types at runtime — no type declarations needed.', difficulty: 'easy', xp: 6 },
                { id: 'g10_py_q2', question: 'How do you print "Hello" in Python?', options: ['console.log("Hello")', 'print("Hello")', 'echo "Hello"', 'puts "Hello"'], answer: 'print("Hello")', explanation: 'Python uses the built-in print() function.', difficulty: 'easy', xp: 5 },
                { id: 'g10_py_q3', question: 'What is the type of 3.14 in Python?', options: ['int', 'str', 'float', 'decimal'], answer: 'float', explanation: 'Numbers with decimal points are floats in Python.', difficulty: 'easy', xp: 6 },
                { id: 'g10_py_q4', question: 'Python uses ___ for comments.', options: ['//', '/* */', '#', '--'], answer: '#', explanation: 'Python single-line comments start with #.', difficulty: 'easy', xp: 5 },
              ],
            },
            {
              id: 'python-functions', title: 'Python Functions',
              difficulty: 'medium', xp: 40, game: 'Code Runner',
              enemy: 'null-pointer', estimatedTime: '15 min',
              recommendedLevel: 5, unlockRequirement: 'python-variables',
              rewards: { xp: 40, coins: 18 },
              description: 'Define and call functions, understand scope and return values.',
              questions: [
                { id: 'g10_pyfn_q1', question: 'How do you define a function in Python?', options: ['function name():', 'def name():', 'func name():', 'define name():'], answer: 'def name():', explanation: "Python uses the 'def' keyword to define functions.", difficulty: 'easy', xp: 8 },
                { id: 'g10_pyfn_q2', question: "What does 'return' do in a function?", options: ['Prints the result', 'Sends a value back to the caller', 'Ends the program', 'Loops the function'], answer: 'Sends a value back to the caller', explanation: 'return sends a value back and exits the function.', difficulty: 'easy', xp: 8 },
                { id: 'g10_pyfn_q3', question: 'A function that calls itself is called?', options: ['Iteration', 'Recursion', 'Lambda', 'Closure'], answer: 'Recursion', explanation: 'A recursive function calls itself with a modified argument until a base case.', difficulty: 'medium', xp: 10 },
                { id: 'g10_pyfn_q4', question: "What is a Python lambda?", options: ['A loop', 'A class method', 'An anonymous single-expression function', 'A module'], answer: 'An anonymous single-expression function', explanation: 'lambda x: x*2 is equivalent to a small function with no name.', difficulty: 'medium', xp: 10 },
              ],
            },
          ],
        },
      },
    },
    mathematics: {
      title: 'Mathematics', color: '#e2b857',
      description: 'Build strong mathematical foundations for real-world problem solving.',
      chapters: {
        algebra: {
          title: 'Algebra',
          description: 'Solve equations and explore the language of variables.',
          topics: [
            {
              id: 'equations', title: 'Linear Equations',
              difficulty: 'medium', xp: 40, game: 'Algebra Titan Battle',
              enemy: 'algebra-titan', estimatedTime: '15 min',
              recommendedLevel: 5, unlockRequirement: null,
              rewards: { xp: 40, coins: 18 },
              description: 'Solve single-variable linear equations step by step.',
              questions: [
                { id: 'g10_alg_q1', question: 'Solve: 2x + 4 = 10', options: ['x = 2', 'x = 3', 'x = 4', 'x = 7'], answer: 'x = 3', explanation: '2x = 6, x = 3.', difficulty: 'medium', xp: 9 },
                { id: 'g10_alg_q2', question: 'Slope of y = 3x + 5?', options: ['5', '3', '1/3', '3x'], answer: '3', explanation: 'In y = mx + b, m is the slope. m = 3.', difficulty: 'medium', xp: 9 },
                { id: 'g10_alg_q3', question: 'Solve: 5x - 10 = 0', options: ['x = 10', 'x = 5', 'x = 2', 'x = 0'], answer: 'x = 2', explanation: '5x = 10, x = 2.', difficulty: 'medium', xp: 9 },
                { id: 'g10_alg_q4', question: 'If 3x = 21, x = ?', options: ['3', '7', '9', '18'], answer: '7', explanation: 'x = 21/3 = 7.', difficulty: 'easy', xp: 7 },
                { id: 'g10_alg_q5', question: 'If a = b, then b = a. This is the ___ property.', options: ['Distributive', 'Symmetric', 'Reflexive', 'Transitive'], answer: 'Symmetric', explanation: "Symmetric property of equality.", difficulty: 'medium', xp: 9 },
              ],
            },
          ],
        },
        statistics: {
          title: 'Statistics & Probability',
          description: 'Analyze data using mean, median, mode, and probability.',
          topics: [
            {
              id: 'mean-median-mode', title: 'Mean, Median & Mode',
              difficulty: 'medium', xp: 35, game: 'Stats Arena',
              enemy: 'stats-specter', estimatedTime: '15 min',
              recommendedLevel: 5, unlockRequirement: null,
              rewards: { xp: 35, coins: 15 },
              description: 'Calculate measures of central tendency for data sets.',
              questions: [
                { id: 'g10_stat_q1', question: 'Mean of [2, 4, 6, 8, 10]?', options: ['5', '6', '7', '8'], answer: '6', explanation: 'Sum = 30, Count = 5. Mean = 30/5 = 6.', difficulty: 'easy', xp: 8 },
                { id: 'g10_stat_q2', question: 'Median of [3, 1, 4, 1, 5, 9, 2]?', options: ['1', '3', '4', '5'], answer: '3', explanation: 'Sorted: 1,1,2,3,4,5,9. Middle value = 3.', difficulty: 'medium', xp: 9 },
                { id: 'g10_stat_q3', question: 'Mode of [2, 3, 3, 4, 5, 3, 2]?', options: ['2', '3', '4', '5'], answer: '3', explanation: '3 appears 3 times — most frequent.', difficulty: 'easy', xp: 8 },
                { id: 'g10_stat_q4', question: 'If all values are unique, the dataset has?', options: ['One mode', 'Two modes', 'No mode', 'Mean as mode'], answer: 'No mode', explanation: 'Mode requires a value to repeat. All unique → no mode.', difficulty: 'medium', xp: 9 },
              ],
            },
          ],
        },
      },
    },
    physics: {
      title: 'Physics', color: '#38bdf8',
      description: 'Understand the fundamental laws that govern our universe.',
      chapters: {
        motion: {
          title: 'Force & Motion',
          description: "Explore Newton's laws and the physics of movement.",
          topics: [
            {
              id: 'newton-laws', title: "Newton's Laws of Motion",
              difficulty: 'medium', xp: 40, game: 'Physics Arena',
              enemy: 'gravity-guardian', estimatedTime: '15 min',
              recommendedLevel: 5, unlockRequirement: null,
              rewards: { xp: 40, coins: 18 },
              description: "Master the three laws that revolutionized our understanding of motion.",
              questions: [
                { id: 'g10_newt_q1', question: "Newton's First Law is the Law of ___?", options: ['Gravity', 'Acceleration', 'Inertia', 'Motion'], answer: 'Inertia', explanation: 'An object at rest stays at rest unless acted upon by an external force.', difficulty: 'easy', xp: 7 },
                { id: 'g10_newt_q2', question: 'F = ma represents?', options: ["1st Law", "2nd Law", "3rd Law", 'Law of Gravity'], answer: "2nd Law", explanation: 'Force = mass × acceleration is the Second Law.', difficulty: 'medium', xp: 9 },
                { id: 'g10_newt_q3', question: 'For every action there is an equal and opposite ___?', options: ['Force', 'Reaction', 'Acceleration', 'Mass'], answer: 'Reaction', explanation: "Newton's Third Law of motion.", difficulty: 'easy', xp: 7 },
                { id: 'g10_newt_q4', question: '10kg object, acceleration 2 m/s². Net force?', options: ['5 N', '20 N', '12 N', '8 N'], answer: '20 N', explanation: 'F = ma = 10 × 2 = 20 N.', difficulty: 'medium', xp: 9 },
                { id: 'g10_newt_q5', question: 'Force is measured in?', options: ['Kg', 'Joules', 'Newtons', 'Watts'], answer: 'Newtons', explanation: 'Force is measured in Newtons (N).', difficulty: 'easy', xp: 7 },
              ],
            },
          ],
        },
        waves: {
          title: 'Waves & Sound',
          description: 'Understand wave properties, sound, and electromagnetic spectrum.',
          topics: [
            {
              id: 'wave-properties', title: 'Wave Properties',
              difficulty: 'medium', xp: 40, game: 'Wave Rider',
              enemy: 'wave-rider', estimatedTime: '15 min',
              recommendedLevel: 5, unlockRequirement: null,
              rewards: { xp: 40, coins: 18 },
              description: 'Understand amplitude, frequency, wavelength, and wave speed.',
              questions: [
                { id: 'g10_wave_q1', question: 'Number of waves per second is called?', options: ['Amplitude', 'Wavelength', 'Frequency', 'Period'], answer: 'Frequency', explanation: 'Frequency (Hz) = number of complete waves passing a point per second.', difficulty: 'easy', xp: 8 },
                { id: 'g10_wave_q2', question: 'Wave speed = frequency × ___?', options: ['Amplitude', 'Period', 'Wavelength', 'Intensity'], answer: 'Wavelength', explanation: 'v = fλ (speed = frequency × wavelength).', difficulty: 'medium', xp: 10 },
                { id: 'g10_wave_q3', question: 'Sound CANNOT travel through?', options: ['Air', 'Water', 'Steel', 'Vacuum'], answer: 'Vacuum', explanation: 'Sound needs a medium — it cannot travel through vacuum.', difficulty: 'medium', xp: 10 },
                { id: 'g10_wave_q4', question: 'Higher frequency sound has?', options: ['Lower pitch', 'Higher pitch', 'Louder volume', 'Longer wavelength'], answer: 'Higher pitch', explanation: 'Pitch is determined by frequency — higher frequency = higher pitch.', difficulty: 'easy', xp: 8 },
              ],
            },
          ],
        },
      },
    },
  },
};

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
