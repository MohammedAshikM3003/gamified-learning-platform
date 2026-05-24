// worldMap.js
export const worldMap = [
  {
    grade: 6,
    worldName: 'Foundation Realm',
    theme: 'Bright beginner fantasy world',
    subjects: [
      {
        id: 'math',
        kingdomName: 'Number Valley',
        gameType: 'puzzle-match',
        chapters: [
          {
            id: 'fractions',
            regionName: 'Fractions River',
            topics: [
              {
                id: 'addition-of-fractions',
                dungeonName: 'Addition Cave',
                title: 'Addition of Fractions',
                description: 'Practice adding simple fractions with like denominators.',
                bossName: 'Fraction Ogre',
                gameComponent: 'PuzzleMatchGame',
                game: 'puzzle-match',
                subjectId: 'math',
                chapterId: 'fractions',
                xp: 25,
                questions: [
                  {
                    id: 'q1',
                    question: 'What is 1/4 + 1/4?',
                    options: ['1/2', '1/4', '2/4', '3/4'],
                    answer: '1/2'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'science',
        kingdomName: 'Discovery Forest',
        gameType: 'space-shooter',
        chapters: []
      },
      {
        id: 'english',
        kingdomName: 'Word Harbor',
        gameType: 'word-catcher',
        chapters: []
      }
    ]
  },
  // Compact examples for Grades 7-12. Extend as needed.
  { grade: 7, worldName: 'Explorer Realm', theme: 'Adventure + experimentation', subjects: [] },
  { grade: 8, worldName: 'Innovation Realm', theme: 'Sci-fi learning universe', subjects: [] },
  { grade: 9, worldName: 'Mastery Realm', theme: 'Competitive academy world', subjects: [] },
  { grade: 10, worldName: 'Cyber Dominion', theme: 'Cyberpunk RPG universe', subjects: [] },
  { grade: 11, worldName: 'AI Nexus Realm', theme: 'Advanced futuristic systems', subjects: [] },
  { grade: 12, worldName: 'Elite Ascension Realm', theme: 'Competitive esports academy', subjects: [] }
];

export default worldMap;
