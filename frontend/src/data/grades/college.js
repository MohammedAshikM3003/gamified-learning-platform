export const college = {
  title: 'College',
  subjects: {
    python: {
      title: 'Python', color: '#3b82f6',
      description: 'Python for college: data, scripting, and AI foundations.',
      chapters: {
        'python-basics': {
          title: 'Python Basics',
          description: 'Core syntax, types, and functions.',
          topics: [
            {
              id: 'college_py_vars', title: 'Variables & Types',
              difficulty: 'easy', xp: 30,
              description: 'Learn Python variables, built-in types and simple operations.',
              questions: []
            },
            {
              id: 'college_py_functions', title: 'Functions & Modules',
              difficulty: 'medium', xp: 40,
              description: 'Define functions, use modules and organize code.',
              questions: []
            }
          ]
        }
      }
    },
    java: {
      title: 'Java', color: '#f97316',
      description: 'Java programming for applications and backend systems.',
      chapters: {}
    },
    html: {
      title: 'HTML', color: '#fb923c',
      description: 'Web fundamentals and markup basics.',
      chapters: {}
    }
  }
};
