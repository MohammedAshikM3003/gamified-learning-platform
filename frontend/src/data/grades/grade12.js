export const grade12 = {
  title: 'Grade 12',
  subjects: {
    'ai-ml': {
      title: 'AI & ML', color: '#06b6d4',
      description: 'Master deep learning, NLP, and real-world AI applications.',
      chapters: {
        'deep-learning': {
          title: 'Deep Learning',
          description: 'Neural networks, backpropagation, and modern architectures.',
          topics: [
            {
              id: 'neural-networks', title: 'Neural Networks',
              difficulty: 'hard', xp: 65, game: 'Neural Storm',
              enemy: 'neural-nexus', estimatedTime: '25 min',
              recommendedLevel: 7, unlockRequirement: null,
              rewards: { xp: 65, coins: 30 },
              description: 'Understand artificial neural networks, layers, and activation.',
              questions: [
                { id: 'g12_nn_q1', question: 'An artificial neuron is inspired by?', options: ['Computer circuits', 'Biological brain neurons', 'Mathematical equations only', 'Transistors'], answer: 'Biological brain neurons', explanation: 'ANNs mimic the structure of biological neurons with inputs, weights, and activation.', difficulty: 'easy', xp: 13 },
                { id: 'g12_nn_q2', question: 'Which activation function outputs values between 0 and 1?', options: ['ReLU', 'Sigmoid', 'Tanh', 'Softmax'], answer: 'Sigmoid', explanation: 'Sigmoid squashes values to (0,1) — useful for binary classification output.', difficulty: 'hard', xp: 16 },
                { id: 'g12_nn_q3', question: 'What does backpropagation compute?', options: ['Forward pass', 'Loss function only', 'Gradients for updating weights', 'Predictions'], answer: 'Gradients for updating weights', explanation: 'Backprop uses chain rule to compute gradients, enabling weight updates via gradient descent.', difficulty: 'hard', xp: 16 },
                { id: 'g12_nn_q4', question: 'ReLU activation function outputs?', options: ['max(0, x)', 'min(0, x)', '1/(1+e^-x)', 'tanh(x)'], answer: 'max(0, x)', explanation: 'ReLU: f(x) = max(0, x). Zero for negatives, identity for positives.', difficulty: 'hard', xp: 16 },
              ],
            },
            {
              id: 'cnn-basics', title: 'Convolutional Neural Networks',
              difficulty: 'hard', xp: 70, game: 'Neural Storm',
              enemy: 'overfit-ogre', estimatedTime: '28 min',
              recommendedLevel: 7, unlockRequirement: 'neural-networks',
              rewards: { xp: 70, coins: 32 },
              description: 'Understand CNNs for image recognition and computer vision.',
              questions: [
                { id: 'g12_cnn_q1', question: 'CNNs are primarily used for?', options: ['Text processing', 'Image recognition', 'Time series', 'Graph analysis'], answer: 'Image recognition', explanation: 'Convolutional layers detect spatial features like edges, textures, and shapes in images.', difficulty: 'medium', xp: 14 },
                { id: 'g12_cnn_q2', question: 'What does a pooling layer do?', options: ['Adds more parameters', 'Reduces spatial dimensions', 'Increases image size', 'Normalizes weights'], answer: 'Reduces spatial dimensions', explanation: 'Pooling (max/avg) reduces width×height while preserving important features.', difficulty: 'hard', xp: 17 },
                { id: 'g12_cnn_q3', question: 'The "depth" of a CNN layer refers to?', options: ['Number of training samples', 'Number of filters/channels', 'Learning rate', 'Batch size'], answer: 'Number of filters/channels', explanation: 'Each filter learns a different feature — more filters = more depth.', difficulty: 'hard', xp: 17 },
                { id: 'g12_cnn_q4', question: 'Transfer learning means?', options: ['Training from scratch', 'Using a pre-trained model on a new task', 'Copying data between models', 'Transferring weights to CPU'], answer: 'Using a pre-trained model on a new task', explanation: 'Transfer learning reuses learned features from a large model (e.g. ResNet) for a new task.', difficulty: 'hard', xp: 17 },
              ],
            },
          ],
        },
      },
    },
    aptitude: {
      title: 'Aptitude', color: '#f472b6',
      description: 'Build quantitative, logical, and verbal reasoning skills.',
      chapters: {
        'logical-reasoning': {
          title: 'Logical Reasoning',
          description: 'Master patterns, series, and deductive reasoning.',
          topics: [
            {
              id: 'number-series', title: 'Number Series & Patterns',
              difficulty: 'medium', xp: 40, game: 'Mind Battle',
              enemy: 'puzzle-phantom', estimatedTime: '15 min',
              recommendedLevel: 7, unlockRequirement: null,
              rewards: { xp: 40, coins: 18 },
              description: 'Identify patterns and find missing numbers in series.',
              questions: [
                { id: 'g12_ser_q1', question: 'Next in series: 2, 4, 8, 16, ___?', options: ['18', '24', '32', '28'], answer: '32', explanation: 'Each term doubles: 16 × 2 = 32.', difficulty: 'easy', xp: 9 },
                { id: 'g12_ser_q2', question: 'Next: 1, 4, 9, 16, 25, ___?', options: ['30', '36', '32', '35'], answer: '36', explanation: 'These are perfect squares: 1²,2²,3²,4²,5²,6² = 36.', difficulty: 'easy', xp: 9 },
                { id: 'g12_ser_q3', question: 'Missing: 3, 6, 11, 18, ___, 38', options: ['25', '27', '28', '26'], answer: '27', explanation: 'Differences: +3,+5,+7,+9,+11. So 18+9 = 27.', difficulty: 'medium', xp: 12 },
                { id: 'g12_ser_q4', question: 'Next: 2, 3, 5, 8, 13, ___?', options: ['18', '19', '21', '20'], answer: '21', explanation: 'Fibonacci: each term = sum of previous two. 8+13 = 21.', difficulty: 'medium', xp: 12 },
              ],
            },
            {
              id: 'syllogisms', title: 'Syllogisms & Logic',
              difficulty: 'hard', xp: 50, game: 'Mind Battle',
              enemy: 'puzzle-phantom', estimatedTime: '20 min',
              recommendedLevel: 7, unlockRequirement: 'number-series',
              rewards: { xp: 50, coins: 22 },
              description: 'Apply deductive reasoning to reach valid conclusions.',
              questions: [
                { id: 'g12_syl_q1', question: 'All cats are animals. All animals breathe. Conclusion?', options: ['Some cats breathe', 'All cats breathe', 'No cats breathe', 'Some animals are cats'], answer: 'All cats breathe', explanation: 'All cats → animals → breathe. Transitive: all cats breathe.', difficulty: 'medium', xp: 12 },
                { id: 'g12_syl_q2', question: 'No roses are blue. Some flowers are roses. Conclusion?', options: ['Some flowers are not blue', 'No flowers are blue', 'All flowers are roses', 'Some roses are flowers'], answer: 'Some flowers are not blue', explanation: 'Those flowers that are roses are NOT blue (since no roses are blue).', difficulty: 'hard', xp: 15 },
                { id: 'g12_syl_q3', question: 'If all A are B, and all B are C, then?', options: ['Some A are C', 'All A are C', 'No A are C', 'Some C are not A'], answer: 'All A are C', explanation: 'Transitivity: A⊆B and B⊆C implies A⊆C.', difficulty: 'medium', xp: 12 },
                { id: 'g12_syl_q4', question: 'Which is a valid deduction?', options: ['Some dogs bark → All dogs bark', 'All birds fly → penguins fly', 'No fish walk → penguins don\'t walk', 'All humans run → Tom runs'], answer: 'All humans run → Tom runs', explanation: 'If ALL humans run and Tom is human, then Tom runs — valid universal instantiation.', difficulty: 'hard', xp: 15 },
              ],
            },
          ],
        },
        'numerical-aptitude': {
          title: 'Numerical Aptitude',
          description: 'Speed, distance, profit/loss, and time-work problems.',
          topics: [
            {
              id: 'speed-distance', title: 'Speed, Distance & Time',
              difficulty: 'medium', xp: 45, game: 'Mind Battle',
              enemy: 'puzzle-phantom', estimatedTime: '18 min',
              recommendedLevel: 7, unlockRequirement: null,
              rewards: { xp: 45, coins: 20 },
              description: 'Solve speed-distance-time problems with confidence.',
              questions: [
                { id: 'g12_spd_q1', question: 'Distance = 120 km, Time = 2 hrs. Speed = ?', options: ['60 km/h', '240 km/h', '30 km/h', '90 km/h'], answer: '60 km/h', explanation: 'Speed = Distance/Time = 120/2 = 60 km/h.', difficulty: 'easy', xp: 10 },
                { id: 'g12_spd_q2', question: 'A train 200m long passes a pole in 10s. Its speed?', options: ['10 m/s', '20 m/s', '25 m/s', '15 m/s'], answer: '20 m/s', explanation: 'Speed = 200m/10s = 20 m/s.', difficulty: 'medium', xp: 12 },
                { id: 'g12_spd_q3', question: 'Two trains start 300km apart, moving towards each other at 60 and 90 km/h. They meet in?', options: ['2 hrs', '2.5 hrs', '3 hrs', '1.5 hrs'], answer: '2 hrs', explanation: 'Relative speed = 60+90 = 150 km/h. Time = 300/150 = 2 hrs.', difficulty: 'hard', xp: 14 },
                { id: 'g12_spd_q4', question: 'Converting 72 km/h to m/s?', options: ['20 m/s', '25 m/s', '36 m/s', '15 m/s'], answer: '20 m/s', explanation: '72 × (1000/3600) = 72 × 5/18 = 20 m/s.', difficulty: 'medium', xp: 12 },
              ],
            },
          ],
        },
      },
    },
    placement: {
      title: 'Placement Preparation', color: '#ec4899',
      description: 'Crack technical interviews with DSA and system design mastery.',
      chapters: {
        dsa: {
          title: 'Data Structures & Algorithms',
          description: 'Master arrays, trees, graphs, and dynamic programming.',
          topics: [
            {
              id: 'arrays-sorting-adv', title: 'Advanced Arrays & Sorting',
              difficulty: 'hard', xp: 65, game: 'Code War',
              enemy: 'dsa-daemon', estimatedTime: '25 min',
              recommendedLevel: 7, unlockRequirement: null,
              rewards: { xp: 65, coins: 30 },
              description: 'Solve array interview problems and sorting algorithms.',
              questions: [
                { id: 'g12_dsa_q1', question: 'Find the missing number in [1,2,4,5,6]. Sum formula?', options: ['21-18=3', '15-12=3', 'Sum(1-6)-sum(array)=3', 'Binary search'], answer: 'Sum(1-6)-sum(array)=3', explanation: 'Sum 1-6 = 21. Array sum = 18. Missing = 21-18 = 3.', difficulty: 'medium', xp: 14 },
                { id: 'g12_dsa_q2', question: 'Two Sum problem: best approach for O(n)?', options: ['Nested loops', 'Sorting first', 'Hash Map', 'Binary Search'], answer: 'Hash Map', explanation: 'Store complements in a hash map for O(1) lookup — O(n) overall.', difficulty: 'hard', xp: 17 },
                { id: 'g12_dsa_q3', question: 'Heapify is a core operation in?', options: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Radix Sort'], answer: 'Heap Sort', explanation: 'Heap Sort uses heapify to maintain the heap property during sorting.', difficulty: 'hard', xp: 17 },
                { id: 'g12_dsa_q4', question: 'Kadane\'s algorithm solves?', options: ['Shortest Path', 'Maximum Subarray Sum', 'Sorting', 'Matrix multiplication'], answer: 'Maximum Subarray Sum', explanation: 'Kadane\'s finds the contiguous subarray with largest sum in O(n).', difficulty: 'hard', xp: 17 },
              ],
            },
            {
              id: 'binary-trees', title: 'Binary Trees & BST',
              difficulty: 'hard', xp: 70, game: 'Code War',
              enemy: 'dsa-daemon', estimatedTime: '28 min',
              recommendedLevel: 7, unlockRequirement: 'arrays-sorting-adv',
              rewards: { xp: 70, coins: 32 },
              description: 'Traverse, search, and manipulate binary search trees.',
              questions: [
                { id: 'g12_tree_q1', question: 'Inorder traversal of BST gives elements in?', options: ['Random order', 'Reverse order', 'Sorted order', 'Level order'], answer: 'Sorted order', explanation: 'BST inorder (Left→Root→Right) gives elements in ascending sorted order.', difficulty: 'medium', xp: 15 },
                { id: 'g12_tree_q2', question: 'Height of a balanced BST with n nodes?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(√n)'], answer: 'O(log n)', explanation: 'Balanced BST has height O(log n), giving efficient O(log n) operations.', difficulty: 'hard', xp: 18 },
                { id: 'g12_tree_q3', question: 'BST insert: where does a new node always go?', options: ['At root', 'At a leaf position', 'At level 2', 'Randomly'], answer: 'At a leaf position', explanation: 'New nodes in BST always become leaves — inserted at the correct position bottom-up comparison.', difficulty: 'medium', xp: 15 },
                { id: 'g12_tree_q4', question: 'Level-order traversal uses which data structure?', options: ['Stack', 'Recursion', 'Queue', 'Array'], answer: 'Queue', explanation: 'BFS/level-order uses a queue: process node, enqueue its children.', difficulty: 'hard', xp: 18 },
              ],
            },
          ],
        },
      },
    },
  },
};
