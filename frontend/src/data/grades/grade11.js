export const grade11 = {
  title: 'Grade 11',
  subjects: {
    mathematics: {
      title: 'Mathematics', color: '#e2b857',
      description: 'Dive into calculus, statistics, and advanced algebra.',
      chapters: {
        'calculus-intro': {
          title: 'Introduction to Calculus',
          description: 'Understand limits and the foundations of differentiation.',
          topics: [
            {
              id: 'limits', title: 'Limits & Continuity',
              difficulty: 'hard', xp: 55, game: 'Calculus Crusher',
              enemy: 'calculus-colossus', estimatedTime: '22 min',
              recommendedLevel: 6, unlockRequirement: null,
              rewards: { xp: 55, coins: 25 },
              description: 'Evaluate limits and determine continuity of functions.',
              questions: [
                { id: 'g11_lim_q1', question: 'What is lim(x→2) of (x² - 4)/(x - 2)?', options: ['0', '4', '2', 'Undefined'], answer: '4', explanation: 'Factor: (x-2)(x+2)/(x-2) = x+2. At x=2: 2+2 = 4.', difficulty: 'hard', xp: 14 },
                { id: 'g11_lim_q2', question: 'A function is continuous if?', options: ['It has no fractions', 'lim exists, f(a) exists, and lim = f(a)', 'It is a polynomial', 'It has no negative values'], answer: 'lim exists, f(a) exists, and lim = f(a)', explanation: 'Continuity requires: limit exists, function is defined, and they match.', difficulty: 'hard', xp: 14 },
                { id: 'g11_lim_q3', question: 'What is lim(x→∞) of 1/x?', options: ['1', 'Infinity', '0', 'Undefined'], answer: '0', explanation: 'As x grows infinitely large, 1/x approaches 0.', difficulty: 'medium', xp: 11 },
                { id: 'g11_lim_q4', question: 'Which is not a form of indeterminate limit?', options: ['0/0', '∞/∞', '0·∞', '5/2'], answer: '5/2', explanation: '5/2 is a determined value. 0/0, ∞/∞, and 0·∞ are indeterminate forms.', difficulty: 'medium', xp: 11 },
              ],
            },
            {
              id: 'derivatives', title: 'Derivatives & Differentiation',
              difficulty: 'hard', xp: 60, game: 'Calculus Crusher',
              enemy: 'calculus-colossus', estimatedTime: '25 min',
              recommendedLevel: 6, unlockRequirement: 'limits',
              rewards: { xp: 60, coins: 28 },
              description: 'Differentiate polynomial and simple functions using power rule.',
              questions: [
                { id: 'g11_deriv_q1', question: 'Derivative of x³?', options: ['3x', '3x²', 'x²', '2x³'], answer: '3x²', explanation: 'Power rule: d/dx(xⁿ) = nxⁿ⁻¹. So d/dx(x³) = 3x².', difficulty: 'hard', xp: 14 },
                { id: 'g11_deriv_q2', question: 'Derivative of a constant (e.g., 7) is?', options: ['7', '1', '0', '7x'], answer: '0', explanation: 'Constants don\'t change — their derivative is always 0.', difficulty: 'medium', xp: 11 },
                { id: 'g11_deriv_q3', question: 'What does the derivative represent geometrically?', options: ['Area under curve', 'Slope of tangent line', 'Length of curve', 'Y-intercept'], answer: 'Slope of tangent line', explanation: 'f\'(x) gives the instantaneous slope (tangent) at any point.', difficulty: 'medium', xp: 11 },
                { id: 'g11_deriv_q4', question: 'Derivative of sin(x)?', options: ['-sin(x)', 'cos(x)', '-cos(x)', 'tan(x)'], answer: 'cos(x)', explanation: 'd/dx(sin x) = cos x. This is a standard derivative to memorize.', difficulty: 'hard', xp: 14 },
              ],
            },
          ],
        },
      },
    },
    physics: {
      title: 'Physics', color: '#38bdf8',
      description: 'Explore thermodynamics, waves, and electromagnetic phenomena.',
      chapters: {
        thermodynamics: {
          title: 'Thermodynamics',
          description: 'Understand heat, energy, and the laws of thermodynamics.',
          topics: [
            {
              id: 'laws-of-thermodynamics', title: 'Laws of Thermodynamics',
              difficulty: 'hard', xp: 55, game: 'Physics Arena',
              enemy: 'thermal-titan', estimatedTime: '20 min',
              recommendedLevel: 6, unlockRequirement: null,
              rewards: { xp: 55, coins: 25 },
              description: 'Understand the four laws governing heat and energy.',
              questions: [
                { id: 'g11_thermo_q1', question: 'The First Law of Thermodynamics is essentially?', options: ['Entropy always increases', 'Conservation of energy', 'Absolute zero is unreachable', 'Heat flows hot to cold'], answer: 'Conservation of energy', explanation: 'First Law: Energy cannot be created or destroyed, only converted (ΔU = Q - W).', difficulty: 'hard', xp: 13 },
                { id: 'g11_thermo_q2', question: 'Entropy is a measure of?', options: ['Energy', 'Temperature', 'Disorder/randomness', 'Pressure'], answer: 'Disorder/randomness', explanation: 'Entropy (S) measures the degree of disorder in a system.', difficulty: 'hard', xp: 13 },
                { id: 'g11_thermo_q3', question: 'The Second Law states that natural processes?', options: ['Decrease entropy', 'Increase entropy', 'Keep entropy constant', 'Reverse entropy'], answer: 'Increase entropy', explanation: 'In isolated systems, entropy always increases over time.', difficulty: 'hard', xp: 13 },
                { id: 'g11_thermo_q4', question: 'Absolute zero is?', options: ['0°C', '-100°C', '0 K (-273.15°C)', '100 K'], answer: '0 K (-273.15°C)', explanation: 'Absolute zero (0 Kelvin) is the lowest possible temperature — no thermal motion.', difficulty: 'medium', xp: 11 },
              ],
            },
          ],
        },
      },
    },
    'computer-science': {
      title: 'Computer Science', color: '#6366f1',
      description: 'Master data structures, algorithms, and computational thinking.',
      chapters: {
        'data-structures': {
          title: 'Data Structures',
          description: 'Learn arrays, lists, stacks, queues, and trees.',
          topics: [
            {
              id: 'arrays-lists', title: 'Arrays & Lists',
              difficulty: 'medium', xp: 45, game: 'Code War',
              enemy: 'logic-lord', estimatedTime: '18 min',
              recommendedLevel: 6, unlockRequirement: null,
              rewards: { xp: 45, coins: 20 },
              description: 'Understand arrays, indexing, and list operations.',
              questions: [
                { id: 'g11_arr_q1', question: 'Array index in most languages starts at?', options: ['1', '0', '-1', '2'], answer: '0', explanation: 'Most languages (Python, Java, JS, C++) use 0-based indexing.', difficulty: 'easy', xp: 9 },
                { id: 'g11_arr_q2', question: 'Time complexity of accessing an array element by index?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 'O(1)', explanation: 'Direct index access is constant time — no searching needed.', difficulty: 'medium', xp: 11 },
                { id: 'g11_arr_q3', question: 'Which operation is slowest on an unsorted array?', options: ['Access by index', 'Update by index', 'Search for a value', 'Get length'], answer: 'Search for a value', explanation: 'Searching requires O(n) — checking each element in the worst case.', difficulty: 'medium', xp: 11 },
                { id: 'g11_arr_q4', question: 'A 2D array can be visualized as?', options: ['A line', 'A stack', 'A grid/table', 'A tree'], answer: 'A grid/table', explanation: '2D arrays have rows and columns — like a spreadsheet or matrix.', difficulty: 'medium', xp: 11 },
              ],
            },
            {
              id: 'stacks-queues', title: 'Stacks & Queues',
              difficulty: 'hard', xp: 55, game: 'Code War',
              enemy: 'sort-saboteur', estimatedTime: '20 min',
              recommendedLevel: 6, unlockRequirement: 'arrays-lists',
              rewards: { xp: 55, coins: 25 },
              description: 'Understand LIFO and FIFO data structures and their use cases.',
              questions: [
                { id: 'g11_stk_q1', question: 'A stack follows which principle?', options: ['FIFO', 'LIFO', 'FILO', 'Random'], answer: 'LIFO', explanation: 'Stack = Last In, First Out. Like a stack of plates.', difficulty: 'medium', xp: 12 },
                { id: 'g11_stk_q2', question: 'Which real-world scenario uses a queue?', options: ['Browser back button', 'Function call stack', 'Printer job queue', 'Undo operation'], answer: 'Printer job queue', explanation: 'Queues (FIFO) model real-world lines — first request = first printed.', difficulty: 'medium', xp: 12 },
                { id: 'g11_stk_q3', question: 'push() and pop() are operations on a?', options: ['Queue', 'Array', 'Stack', 'Tree'], answer: 'Stack', explanation: 'push() adds to top, pop() removes from top — both are stack operations.', difficulty: 'easy', xp: 10 },
                { id: 'g11_stk_q4', question: 'Browser back/forward button is implemented using?', options: ['Queue', 'Two Stacks', 'Linked List', 'Binary Tree'], answer: 'Two Stacks', explanation: 'Back button uses a "back stack" and "forward stack" internally.', difficulty: 'hard', xp: 14 },
              ],
            },
          ],
        },
        algorithms: {
          title: 'Algorithms',
          description: 'Master sorting, searching, and algorithmic complexity.',
          topics: [
            {
              id: 'sorting-algorithms', title: 'Sorting Algorithms',
              difficulty: 'hard', xp: 60, game: 'Code War',
              enemy: 'sort-saboteur', estimatedTime: '22 min',
              recommendedLevel: 6, unlockRequirement: null,
              rewards: { xp: 60, coins: 28 },
              description: 'Compare bubble sort, merge sort, quick sort and their complexities.',
              questions: [
                { id: 'g11_sort_q1', question: 'Best-case time complexity of Bubble Sort?', options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'], answer: 'O(n)', explanation: 'With optimization, bubble sort is O(n) if already sorted.', difficulty: 'hard', xp: 15 },
                { id: 'g11_sort_q2', question: 'Which sorting algorithm uses divide and conquer?', options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'], answer: 'Merge Sort', explanation: 'Merge Sort splits array in half, sorts each, then merges — classic divide and conquer.', difficulty: 'medium', xp: 12 },
                { id: 'g11_sort_q3', question: 'Average time complexity of Quick Sort?', options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'], answer: 'O(n log n)', explanation: 'Quick Sort averages O(n log n) with good pivot selection.', difficulty: 'hard', xp: 15 },
                { id: 'g11_sort_q4', question: 'Which sort is best for nearly-sorted data?', options: ['Quick Sort', 'Merge Sort', 'Insertion Sort', 'Heap Sort'], answer: 'Insertion Sort', explanation: 'Insertion sort is O(n) for nearly-sorted data — very efficient in that case.', difficulty: 'medium', xp: 12 },
              ],
            },
          ],
        },
      },
    },
    python: {
      title: 'Python', color: '#3b82f6',
      description: 'Learn Python — the language of AI, data, and automation.',
      chapters: {
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
                { id: 'g11_py_q1', question: 'Python is a ___ typed language.', options: ['Statically', 'Dynamically', 'Strongly & Statically', 'Weakly'], answer: 'Dynamically', explanation: 'Python determines types at runtime — no type declarations needed.', difficulty: 'easy', xp: 6 },
                { id: 'g11_py_q2', question: 'How do you print "Hello" in Python?', options: ['console.log("Hello")', 'print("Hello")', 'echo "Hello"', 'puts "Hello"'], answer: 'print("Hello")', explanation: 'Python uses the built-in print() function.', difficulty: 'easy', xp: 5 },
                { id: 'g11_py_q3', question: 'What is the type of 3.14 in Python?', options: ['int', 'str', 'float', 'decimal'], answer: 'float', explanation: 'Numbers with decimal points are floats in Python.', difficulty: 'easy', xp: 6 },
                { id: 'g11_py_q4', question: 'Python uses ___ for comments.', options: ['//', '/* */', '#', '--'], answer: '#', explanation: 'Python single-line comments start with #.', difficulty: 'easy', xp: 5 },
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
                { id: 'g11_pyfn_q1', question: 'How do you define a function in Python?', options: ['function name():', 'def name():', 'func name():', 'define name():'], answer: 'def name():', explanation: "Python uses the 'def' keyword to define functions.", difficulty: 'easy', xp: 8 },
                { id: 'g11_pyfn_q2', question: "What does 'return' do in a function?", options: ['Prints the result', 'Sends a value back to the caller', 'Ends the program', 'Loops the function'], answer: 'Sends a value back to the caller', explanation: 'return sends a value back and exits the function.', difficulty: 'easy', xp: 8 },
                { id: 'g11_pyfn_q3', question: 'A function that calls itself is called?', options: ['Iteration', 'Recursion', 'Lambda', 'Closure'], answer: 'Recursion', explanation: 'A recursive function calls itself with a modified argument until a base case.', difficulty: 'medium', xp: 10 },
                { id: 'g11_pyfn_q4', question: "What is a Python lambda?", options: ['A loop', 'A class method', 'An anonymous single-expression function', 'A module'], answer: 'An anonymous single-expression function', explanation: 'lambda x: x*2 is equivalent to a small function with no name.', difficulty: 'medium', xp: 10 },
              ],
            },
          ],
        },
      },
    },
    'ai-ml': {
      title: 'AI & ML', color: '#06b6d4',
      description: 'Enter the world of artificial intelligence and machine learning.',
      chapters: {
        'ml-basics': {
          title: 'Machine Learning Fundamentals',
          description: 'Understand what ML is, its types, and key concepts.',
          topics: [
            {
              id: 'what-is-ml', title: 'Introduction to Machine Learning',
              difficulty: 'medium', xp: 45, game: 'Neural Storm',
              enemy: 'neural-nexus', estimatedTime: '18 min',
              recommendedLevel: 6, unlockRequirement: null,
              rewards: { xp: 45, coins: 20 },
              description: 'Discover what machine learning is and where it\'s used.',
              questions: [
                { id: 'g11_ml_q1', question: 'Machine Learning is a subset of?', options: ['Mathematics', 'Artificial Intelligence', 'Statistics only', 'Robotics'], answer: 'Artificial Intelligence', explanation: 'ML is a branch of AI where systems learn from data without being explicitly programmed.', difficulty: 'easy', xp: 9 },
                { id: 'g11_ml_q2', question: 'Which is a supervised learning task?', options: ['Clustering customers', 'Finding anomalies', 'Predicting house prices', 'Generating images'], answer: 'Predicting house prices', explanation: 'Supervised learning uses labeled data (input-output pairs) to train models.', difficulty: 'medium', xp: 11 },
                { id: 'g11_ml_q3', question: 'K-Means is an example of?', options: ['Supervised Learning', 'Reinforcement Learning', 'Unsupervised Learning', 'Deep Learning'], answer: 'Unsupervised Learning', explanation: 'K-Means clusters data without labels — typical unsupervised learning.', difficulty: 'medium', xp: 11 },
                { id: 'g11_ml_q4', question: 'Overfitting means a model?', options: ['Performs well on all data', 'Memorizes training data but fails on new data', 'Is too simple', 'Has too little data'], answer: 'Memorizes training data but fails on new data', explanation: 'Overfitting = high training accuracy, low generalization — the model is too complex.', difficulty: 'hard', xp: 13 },
              ],
            },
          ],
        },
      },
    },
  },
};
