export const grade7 = {
  title: 'Grade 7',
  subjects: {
    mathematics: {
      title: 'Mathematics', color: '#e2b857',
      description: 'Explore algebra, ratios, and proportional reasoning.',
      chapters: {
        'intro-algebra': {
          title: 'Introduction to Algebra',
          description: 'Learn variables, expressions, and simple equations.',
          topics: [
            {
              id: 'variables-expressions', title: 'Variables & Expressions',
              difficulty: 'easy', xp: 25, game: 'Algebra Clash',
              enemy: 'algebra-titan', estimatedTime: '12 min',
              recommendedLevel: 2, unlockRequirement: null,
              rewards: { xp: 25, coins: 12 },
              description: 'Understand what variables are and how to write expressions.',
              questions: [
                { id: 'g7_var_q1', question: 'If x = 5, what is 3x + 2?', options: ['17', '15', '12', '20'], answer: '17', explanation: '3(5) + 2 = 15 + 2 = 17.', difficulty: 'easy', xp: 6 },
                { id: 'g7_var_q2', question: 'Which is an expression (not an equation)?', options: ['x + 3 = 7', '2y = 8', '4n + 1', 'a - 2 = 0'], answer: '4n + 1', explanation: 'An expression has no equals sign; an equation does.', difficulty: 'easy', xp: 6 },
                { id: 'g7_var_q3', question: 'Simplify: 3a + 2a', options: ['5a', '6a', '3a²', '5'], answer: '5a', explanation: 'Like terms are added: 3a + 2a = 5a.', difficulty: 'easy', xp: 6 },
                { id: 'g7_var_q4', question: 'Evaluate 2x - y when x=4, y=3.', options: ['5', '7', '6', '8'], answer: '5', explanation: '2(4) - 3 = 8 - 3 = 5.', difficulty: 'easy', xp: 6 },
              ],
            },
            {
              id: 'simple-equations', title: 'Solving Simple Equations',
              difficulty: 'medium', xp: 35, game: 'Algebra Clash',
              enemy: 'algebra-titan', estimatedTime: '15 min',
              recommendedLevel: 2, unlockRequirement: 'variables-expressions',
              rewards: { xp: 35, coins: 15 },
              description: 'Solve one-step and two-step linear equations.',
              questions: [
                { id: 'g7_eq_q1', question: 'Solve: x + 7 = 12', options: ['x = 4', 'x = 5', 'x = 6', 'x = 19'], answer: 'x = 5', explanation: 'x = 12 - 7 = 5.', difficulty: 'medium', xp: 8 },
                { id: 'g7_eq_q2', question: 'Solve: 3y = 18', options: ['y = 6', 'y = 5', 'y = 54', 'y = 15'], answer: 'y = 6', explanation: 'y = 18 ÷ 3 = 6.', difficulty: 'medium', xp: 8 },
                { id: 'g7_eq_q3', question: 'Solve: 2x - 1 = 9', options: ['x = 4', 'x = 5', 'x = 8', 'x = 10'], answer: 'x = 5', explanation: '2x = 10, so x = 5.', difficulty: 'medium', xp: 8 },
                { id: 'g7_eq_q4', question: 'What operation undoes multiplication?', options: ['Addition', 'Subtraction', 'Division', 'Squaring'], answer: 'Division', explanation: 'Division is the inverse of multiplication.', difficulty: 'easy', xp: 6 },
              ],
            },
          ],
        },
        'ratios-percents': {
          title: 'Ratios & Percentages',
          description: 'Master proportional thinking and percentage calculations.',
          topics: [
            {
              id: 'ratios-basics', title: 'Understanding Ratios',
              difficulty: 'easy', xp: 25, game: 'Ratio Rumble',
              enemy: 'fraction-king', estimatedTime: '12 min',
              recommendedLevel: 2, unlockRequirement: null,
              rewards: { xp: 25, coins: 12 },
              description: 'Compare quantities using ratios.',
              questions: [
                { id: 'g7_rat_q1', question: 'In a class of 30, 18 are girls. What is the ratio of girls to boys?', options: ['3:2', '2:3', '3:5', '2:5'], answer: '3:2', explanation: 'Girls=18, Boys=12. 18:12 = 3:2.', difficulty: 'easy', xp: 6 },
                { id: 'g7_rat_q2', question: 'Simplify the ratio 24:36.', options: ['4:6', '2:3', '3:4', '6:9'], answer: '2:3', explanation: 'GCD of 24 and 36 is 12. 24÷12 : 36÷12 = 2:3.', difficulty: 'easy', xp: 6 },
                { id: 'g7_rat_q3', question: 'If ratio of sugar to flour is 1:3 and you use 2 cups sugar, how much flour?', options: ['3 cups', '4 cups', '6 cups', '8 cups'], answer: '6 cups', explanation: '1:3 scaled by 2 gives 2:6, so 6 cups of flour.', difficulty: 'medium', xp: 8 },
                { id: 'g7_rat_q4', question: 'Which ratio is equivalent to 5:10?', options: ['1:3', '1:2', '2:5', '3:6'], answer: '1:2', explanation: '5:10 = 1:2 (divide both by 5).', difficulty: 'easy', xp: 6 },
              ],
            },
            {
              id: 'percentages', title: 'Percentages',
              difficulty: 'medium', xp: 35, game: 'Ratio Rumble',
              enemy: 'stats-specter', estimatedTime: '15 min',
              recommendedLevel: 2, unlockRequirement: 'ratios-basics',
              rewards: { xp: 35, coins: 15 },
              description: 'Calculate percentages of quantities and percentage change.',
              questions: [
                { id: 'g7_pct_q1', question: 'What is 25% of 80?', options: ['15', '20', '25', '30'], answer: '20', explanation: '25% = 1/4. 80 ÷ 4 = 20.', difficulty: 'easy', xp: 7 },
                { id: 'g7_pct_q2', question: 'Express 0.75 as a percentage.', options: ['7.5%', '75%', '0.75%', '750%'], answer: '75%', explanation: 'Multiply by 100: 0.75 × 100 = 75%.', difficulty: 'easy', xp: 7 },
                { id: 'g7_pct_q3', question: 'A shirt costs ₹200. After 10% discount, what do you pay?', options: ['₹180', '₹190', '₹210', '₹160'], answer: '₹180', explanation: '10% of 200 = 20. 200 - 20 = ₹180.', difficulty: 'medium', xp: 8 },
                { id: 'g7_pct_q4', question: 'What percentage is 40 out of 200?', options: ['10%', '15%', '20%', '25%'], answer: '20%', explanation: '40/200 × 100 = 20%.', difficulty: 'medium', xp: 8 },
              ],
            },
          ],
        },
      },
    },
    science: {
      title: 'Science', color: '#10b981',
      description: 'Explore ecosystems, chemistry, and the natural world.',
      chapters: {
        ecosystems: {
          title: 'Ecosystems',
          description: 'Understand food chains, energy flow, and biodiversity.',
          topics: [
            {
              id: 'food-chains', title: 'Food Chains & Webs',
              difficulty: 'easy', xp: 25, game: 'Eco Battle',
              enemy: 'eco-phantom', estimatedTime: '12 min',
              recommendedLevel: 2, unlockRequirement: null,
              rewards: { xp: 25, coins: 12 },
              description: 'Trace energy flow through ecosystems.',
              questions: [
                { id: 'g7_eco_q1', question: 'What do producers make their food from?', options: ['Other animals', 'Sunlight and nutrients', 'Dead matter', 'Water only'], answer: 'Sunlight and nutrients', explanation: 'Producers (plants) make food via photosynthesis using sunlight.', difficulty: 'easy', xp: 6 },
                { id: 'g7_eco_q2', question: 'What is an organism that eats only plants called?', options: ['Carnivore', 'Omnivore', 'Herbivore', 'Decomposer'], answer: 'Herbivore', explanation: 'Herbivores eat only plant matter.', difficulty: 'easy', xp: 6 },
                { id: 'g7_eco_q3', question: 'What happens to energy as it moves up a food chain?', options: ['It increases', 'It stays the same', 'It decreases', 'It doubles'], answer: 'It decreases', explanation: 'Energy is lost as heat at each trophic level (~90% is lost).', difficulty: 'medium', xp: 8 },
                { id: 'g7_eco_q4', question: 'Decomposers break down dead matter into?', options: ['Sunlight', 'Nutrients', 'Oxygen', 'Water'], answer: 'Nutrients', explanation: 'Decomposers recycle nutrients back into the soil.', difficulty: 'easy', xp: 6 },
              ],
            },
          ],
        },
      },
    },
    programming: {
      title: 'Programming', color: '#8b5cf6',
      description: 'Take your first steps into the world of coding.',
      chapters: {
        'intro-computing': {
          title: 'Introduction to Computing',
          description: 'Understand what computers are and how programs work.',
          topics: [
            {
              id: 'what-is-code', title: 'What is Programming?',
              difficulty: 'easy', xp: 20, game: 'Code Runner',
              enemy: 'syntax-phantom', estimatedTime: '10 min',
              recommendedLevel: 2, unlockRequirement: null,
              rewards: { xp: 20, coins: 10 },
              description: 'Discover what programming is and why it matters.',
              questions: [
                { id: 'g7_code_q1', question: 'What is a computer program?', options: ['A physical device', 'A set of instructions for a computer', 'A type of hardware', 'A screen display'], answer: 'A set of instructions for a computer', explanation: 'Programs are sequences of instructions that tell computers what to do.', difficulty: 'easy', xp: 5 },
                { id: 'g7_code_q2', question: 'What does a compiler do?', options: ['Stores data', 'Translates code into machine language', 'Displays graphics', 'Manages memory'], answer: 'Translates code into machine language', explanation: 'A compiler converts human-readable code into binary instructions.', difficulty: 'easy', xp: 5 },
                { id: 'g7_code_q3', question: 'Which of these is a programming language?', options: ['HTML styling', 'Python', 'Microsoft Word', 'Google Chrome'], answer: 'Python', explanation: 'Python is a popular programming language used for many applications.', difficulty: 'easy', xp: 5 },
                { id: 'g7_code_q4', question: 'What is a bug in programming?', options: ['An insect in the computer', 'An error in the code', 'A type of variable', 'A keyboard shortcut'], answer: 'An error in the code', explanation: 'A bug is a mistake in the program that causes unexpected behavior.', difficulty: 'easy', xp: 5 },
              ],
            },
            {
              id: 'algorithms', title: 'Algorithms & Flowcharts',
              difficulty: 'easy', xp: 25, game: 'Code Runner',
              enemy: 'logic-lord', estimatedTime: '12 min',
              recommendedLevel: 2, unlockRequirement: 'what-is-code',
              rewards: { xp: 25, coins: 12 },
              description: 'Design step-by-step solutions using algorithms.',
              questions: [
                { id: 'g7_alg_q1', question: 'What is an algorithm?', options: ['A type of computer', 'Step-by-step instructions to solve a problem', 'A programming language', 'A type of loop'], answer: 'Step-by-step instructions to solve a problem', explanation: 'An algorithm is a defined sequence of steps to solve a problem.', difficulty: 'easy', xp: 6 },
                { id: 'g7_alg_q2', question: 'Which symbol in a flowchart represents a decision?', options: ['Rectangle', 'Oval', 'Diamond', 'Arrow'], answer: 'Diamond', explanation: 'Diamond shapes show decision points (yes/no branches) in flowcharts.', difficulty: 'easy', xp: 6 },
                { id: 'g7_alg_q3', question: 'What is the correct order to make tea? (boil water → add tea bag → pour water → drink)', options: ['Random order is fine', 'The given order', 'Drink first, then boil', 'Add tea bag first'], answer: 'The given order', explanation: 'Algorithms must follow a specific order — each step depends on the previous.', difficulty: 'easy', xp: 6 },
                { id: 'g7_alg_q4', question: 'What does "input" mean in programming?', options: ['Data stored permanently', 'Data entered into a program', 'A type of loop', 'The final answer'], answer: 'Data entered into a program', explanation: 'Input is any data provided to the program (keyboard, mouse, file).', difficulty: 'easy', xp: 6 },
              ],
            },
          ],
        },
      },
    },
  },
};
