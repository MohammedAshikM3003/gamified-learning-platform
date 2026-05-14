// ============================================================
// LearnCraft OS — Central Learning Data Engine
// Single source of truth for: grades, subjects, chapters, topics, questions
// Later: migrate to Firestore + AI-generated content
// ============================================================

export const learningData = {
  grade10: {
    title: 'Grade 10',
    subjects: {
      programming: {
        title: 'Programming',
        icon: 'code',
        color: '#8b5cf6',
        description: 'Master modern programming concepts and build real projects.',
        chapters: {
          javascript: {
            title: 'JavaScript Basics',
            description: "Learn the fundamentals of the world's most popular language.",
            topics: [
              {
                id: 'variables',
                title: 'Variables & Data Types',
                difficulty: 'easy',
                xp: 20,
                game: 'Code Runner',
                enemy: 'syntax-phantom',
                description: 'Understand how to store and manipulate data in JavaScript.',
                questions: [
                  {
                    id: 1,
                    question: 'Which keyword declares a block-scoped variable in modern JavaScript?',
                    options: ['var', 'let', 'int', 'declare'],
                    answer: 'let',
                    explanation: "'let' is block-scoped and preferred over 'var' in modern JS.",
                  },
                  {
                    id: 2,
                    question: 'What does `typeof null` return in JavaScript?',
                    options: ["'null'", "'undefined'", "'object'", "'string'"],
                    answer: "'object'",
                    explanation: "A historical JS bug — typeof null returns 'object'.",
                  },
                  {
                    id: 3,
                    question: 'Which of these is NOT a primitive data type in JavaScript?',
                    options: ['string', 'boolean', 'array', 'undefined'],
                    answer: 'array',
                    explanation: 'Arrays are objects in JS, not primitive types.',
                  },
                  {
                    id: 4,
                    question: 'What does `const` prevent you from doing?',
                    options: [
                      'Reassigning the variable',
                      'Reading the variable',
                      'Using the variable in functions',
                      'Changing object properties',
                    ],
                    answer: 'Reassigning the variable',
                    explanation: "'const' blocks reassignment, but object properties can still be mutated.",
                  },
                  {
                    id: 5,
                    question: 'Which symbol is used for template literals in JS?',
                    options: ["'single quotes'", '"double quotes"', '`backticks`', '#hash#'],
                    answer: '`backticks`',
                    explanation: 'Template literals use backticks and support embedded expressions with ${}.',
                  },
                ],
              },
              {
                id: 'loops',
                title: 'Loops & Iteration',
                difficulty: 'medium',
                xp: 40,
                game: 'Loop Battle',
                enemy: 'infinite-loop',
                description: 'Conquer repetition with for, while, and do-while loops.',
                questions: [
                  {
                    id: 1,
                    question: 'Which loop always executes its body at least once?',
                    options: ['for', 'while', 'do...while', 'forEach'],
                    answer: 'do...while',
                    explanation: 'do...while checks the condition AFTER executing the loop body.',
                  },
                  {
                    id: 2,
                    question: 'Which keyword immediately exits a loop?',
                    options: ['continue', 'return', 'break', 'exit'],
                    answer: 'break',
                    explanation: "'break' terminates the loop immediately and continues after it.",
                  },
                  {
                    id: 3,
                    question: 'What does `continue` do inside a loop?',
                    options: [
                      'Exits the loop',
                      'Skips to the next iteration',
                      'Restarts the loop from the beginning',
                      'Pauses execution',
                    ],
                    answer: 'Skips to the next iteration',
                    explanation: "'continue' skips the remaining code in the current iteration.",
                  },
                  {
                    id: 4,
                    question: 'What is the output of: for(let i=0; i<3; i++) console.log(i)',
                    options: ['0 1 2', '1 2 3', '0 1 2 3', '1 2'],
                    answer: '0 1 2',
                    explanation: 'The loop starts at 0 and runs while i < 3, printing 0, 1, 2.',
                  },
                ],
              },
            ],
          },
        },
      },

      mathematics: {
        title: 'Mathematics',
        icon: 'calculator',
        color: '#e2b857',
        description: 'Build strong mathematical foundations for real-world problem solving.',
        chapters: {
          algebra: {
            title: 'Algebra',
            description: 'Solve equations and explore the language of variables.',
            topics: [
              {
                id: 'equations',
                title: 'Linear Equations',
                difficulty: 'medium',
                xp: 40,
                game: 'Algebra Titan Battle',
                enemy: 'algebra-titan',
                description: 'Learn to solve single-variable linear equations step by step.',
                questions: [
                  {
                    id: 1,
                    question: 'Solve for x: 2x + 4 = 10',
                    options: ['x = 2', 'x = 3', 'x = 4', 'x = 7'],
                    answer: 'x = 3',
                    explanation: '2x = 10 - 4 = 6, so x = 6/2 = 3.',
                  },
                  {
                    id: 2,
                    question: 'What is the slope of the line y = 3x + 5?',
                    options: ['5', '3', '1/3', '3x'],
                    answer: '3',
                    explanation: 'In y = mx + b, m is the slope. Here m = 3.',
                  },
                  {
                    id: 3,
                    question: 'Solve: 5x - 10 = 0',
                    options: ['x = 10', 'x = 5', 'x = 2', 'x = 0'],
                    answer: 'x = 2',
                    explanation: '5x = 10, dividing both sides by 5 gives x = 2.',
                  },
                  {
                    id: 4,
                    question: 'If 3x = 21, what is x?',
                    options: ['3', '7', '9', '18'],
                    answer: '7',
                    explanation: 'Divide both sides by 3: x = 21/3 = 7.',
                  },
                  {
                    id: 5,
                    question: 'Which property says: if a = b, then b = a?',
                    options: ['Distributive', 'Symmetric', 'Reflexive', 'Transitive'],
                    answer: 'Symmetric',
                    explanation: "The symmetric property of equality allows flipping both sides.",
                  },
                ],
              },
            ],
          },
        },
      },

      physics: {
        title: 'Physics',
        icon: 'zap',
        color: '#38bdf8',
        description: 'Understand the fundamental laws that govern our universe.',
        chapters: {
          motion: {
            title: 'Force & Motion',
            description: "Explore Newton's laws and the physics of movement.",
            topics: [
              {
                id: 'newton-laws',
                title: "Newton's Laws of Motion",
                difficulty: 'medium',
                xp: 40,
                game: 'Physics Arena',
                enemy: 'gravity-guardian',
                description: "Master the three laws that revolutionized our understanding of motion.",
                questions: [
                  {
                    id: 1,
                    question: "Newton's First Law is also known as the Law of ___?",
                    options: ['Gravity', 'Acceleration', 'Inertia', 'Motion'],
                    answer: 'Inertia',
                    explanation: 'An object at rest stays at rest unless acted upon by an external force.',
                  },
                  {
                    id: 2,
                    question: 'What does F = ma represent?',
                    options: ["Newton's 1st Law", "Newton's 2nd Law", "Newton's 3rd Law", 'Law of Gravity'],
                    answer: "Newton's 2nd Law",
                    explanation: 'Force = mass × acceleration is Newton\'s Second Law.',
                  },
                  {
                    id: 3,
                    question: 'For every action, there is an equal and opposite ___?',
                    options: ['Force', 'Reaction', 'Acceleration', 'Mass'],
                    answer: 'Reaction',
                    explanation: "Newton's Third Law: every action force has an equal and opposite reaction force.",
                  },
                  {
                    id: 4,
                    question: 'A 10kg object accelerates at 2 m/s². What is the net force?',
                    options: ['5 N', '20 N', '12 N', '8 N'],
                    answer: '20 N',
                    explanation: 'F = ma = 10 × 2 = 20 Newtons.',
                  },
                  {
                    id: 5,
                    question: 'Which of these is measured in Newtons (N)?',
                    options: ['Mass', 'Acceleration', 'Force', 'Velocity'],
                    answer: 'Force',
                    explanation: 'Force is the SI unit measured in Newtons, named after Isaac Newton.',
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
};

// ============================================================
// Helper Utilities
// ============================================================

/** Get a specific topic by its ID, scanning all grades */
export const getTopicById = (topicId) => {
  for (const [gradeId, grade] of Object.entries(learningData)) {
    for (const [subjectId, subject] of Object.entries(grade.subjects)) {
      for (const [chapterId, chapter] of Object.entries(subject.chapters)) {
        for (const topic of chapter.topics) {
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
