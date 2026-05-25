export const grade6 = {
  title: 'Grade 6',
  subjects: {
    mathematics: {
      title: 'Mathematics', color: '#e2b857',
      description: 'Build number sense with fractions and basic geometry.',
      chapters: {
        fractions: {
          title: 'Fractions',
          description: 'Understand, compare, and operate with fractions.',
          topics: [
            {
              id: 'proper-fractions', title: 'Understanding Fractions',
              difficulty: 'easy', xp: 20, game: 'Fraction Blaster',
              enemy: 'fraction-king', estimatedTime: '10 min',
              recommendedLevel: 1, unlockRequirement: null,
              rewards: { xp: 20, coins: 10 },
              description: 'Learn what fractions mean and how to compare them.',
              questions: [
                { id: 'g6_frac_q1', question: 'In the fraction 3/4, what does the 4 represent?', options: ['Shaded parts', 'Total equal parts', 'Whole numbers', 'Numerator'], answer: 'Total equal parts', explanation: 'The denominator shows how many equal parts the whole is divided into.', difficulty: 'easy', xp: 5 },
                { id: 'g6_frac_q2', question: 'Which fraction equals 1/2?', options: ['2/3', '3/6', '2/5', '4/9'], answer: '3/6', explanation: '3/6 simplifies to 1/2 — both are multiplied by 3.', difficulty: 'easy', xp: 5 },
                { id: 'g6_frac_q3', question: 'Which fraction is largest?', options: ['1/4', '1/6', '1/2', '1/3'], answer: '1/2', explanation: 'Same numerator → smallest denominator = largest fraction.', difficulty: 'easy', xp: 5 },
                { id: 'g6_frac_q4', question: 'A pizza has 8 slices. You eat 3. What fraction did you eat?', options: ['3/5', '5/8', '3/8', '8/3'], answer: '3/8', explanation: 'You ate 3 out of 8 equal parts = 3/8.', difficulty: 'easy', xp: 5 },
              ],
            },
            {
              id: 'mixed-numbers', title: 'Mixed Numbers',
              difficulty: 'easy', xp: 25, game: 'Fraction Blaster',
              enemy: 'fraction-king', estimatedTime: '15 min',
              recommendedLevel: 1, unlockRequirement: 'proper-fractions',
              rewards: { xp: 25, coins: 12 },
              description: 'Convert between mixed numbers and improper fractions.',
              videoPath: '/videos/Improper%20Fractions%20%26%20Mixed%20Numbers%20%20Learning%20Maths_720p.mp4',
              gameRoute: '/games/mixed-numbers',
              questions: [
                { id: 'g6_mix_q1', question: 'Convert 2 1/3 to an improper fraction.', options: ['5/3', '7/3', '6/3', '4/3'], answer: '7/3', explanation: '2 × 3 + 1 = 7, so the answer is 7/3.', difficulty: 'easy', xp: 5 },
                { id: 'g6_mix_q2', question: 'Convert 9/4 to a mixed number.', options: ['2 1/4', '2 2/4', '3 1/4', '1 5/4'], answer: '2 1/4', explanation: '9 ÷ 4 = 2 remainder 1 → 2 1/4.', difficulty: 'easy', xp: 5 },
                { id: 'g6_mix_q3', question: 'What is 1 1/2 + 2 1/2?', options: ['3 1/2', '4', '3 2/4', '3'], answer: '4', explanation: '1½ + 2½ = 3 + 1 = 4.', difficulty: 'easy', xp: 5 },
                { id: 'g6_mix_q4', question: 'Which is larger: 1 3/4 or 7/4?', options: ['1 3/4', '7/4', 'They are equal', 'Cannot compare'], answer: 'They are equal', explanation: '1 3/4 = 7/4 because 1×4+3 = 7.', difficulty: 'easy', xp: 5 },
              ],
            },
          ],
        },
        'basic-geometry': {
          title: 'Basic Geometry',
          description: 'Explore shapes, angles, perimeter, and area.',
          topics: [
            {
              id: 'shapes-angles', title: 'Shapes & Angles',
              difficulty: 'easy', xp: 20, game: 'Shape Shifter',
              enemy: 'geo-golem', estimatedTime: '10 min',
              recommendedLevel: 1, unlockRequirement: null,
              rewards: { xp: 20, coins: 10 },
              description: 'Identify angle types and 2D shapes.',
              questions: [
                { id: 'g6_geo_q1', question: 'What is an angle less than 90° called?', options: ['Obtuse', 'Right', 'Acute', 'Straight'], answer: 'Acute', explanation: 'Acute angles measure between 0° and 90°.', difficulty: 'easy', xp: 5 },
                { id: 'g6_geo_q2', question: 'How many sides does a hexagon have?', options: ['5', '7', '6', '8'], answer: '6', explanation: '"Hex" means 6.', difficulty: 'easy', xp: 5 },
                { id: 'g6_geo_q3', question: 'A triangle has three 60° angles. What type is it?', options: ['Scalene', 'Isosceles', 'Equilateral', 'Right'], answer: 'Equilateral', explanation: 'All angles are equal → equilateral triangle.', difficulty: 'easy', xp: 5 },
                { id: 'g6_geo_q4', question: 'What type of angle is exactly 90°?', options: ['Acute', 'Obtuse', 'Right', 'Reflex'], answer: 'Right', explanation: 'A right angle is exactly 90°, marked with a small square.', difficulty: 'easy', xp: 5 },
              ],
            },
            {
              id: 'perimeter-area', title: 'Perimeter & Area',
              difficulty: 'easy', xp: 25, game: 'Shape Shifter',
              enemy: 'geo-golem', estimatedTime: '15 min',
              recommendedLevel: 1, unlockRequirement: 'shapes-angles',
              rewards: { xp: 25, coins: 12 },
              description: 'Calculate perimeter and area of basic shapes.',
              questions: [
                { id: 'g6_peri_q1', question: 'Perimeter of a square with side 5 cm?', options: ['10 cm', '25 cm', '20 cm', '15 cm'], answer: '20 cm', explanation: 'P = 4 × 5 = 20 cm.', difficulty: 'easy', xp: 5 },
                { id: 'g6_peri_q2', question: 'Area of a rectangle 6 m × 4 m?', options: ['10 m²', '20 m²', '24 m²', '12 m²'], answer: '24 m²', explanation: 'A = 6 × 4 = 24 m².', difficulty: 'easy', xp: 5 },
                { id: 'g6_peri_q3', question: 'Area of a square is 49 cm². What is the side length?', options: ['6 cm', '7 cm', '8 cm', '9 cm'], answer: '7 cm', explanation: '√49 = 7 cm.', difficulty: 'easy', xp: 5 },
                { id: 'g6_peri_q4', question: 'Formula for area of a triangle?', options: ['base × height', '½ × base × height', '2 × (base + height)', 'base + height'], answer: '½ × base × height', explanation: 'A = ½bh for any triangle.', difficulty: 'easy', xp: 5 },
              ],
            },
          ],
        },
      },
    },
    science: {
      title: 'Science', color: '#10b981',
      description: 'Discover the living world, matter, and natural forces.',
      chapters: {
        'living-things': {
          title: 'Living Things',
          description: 'Explore plants, animals, and life processes.',
          topics: [
            {
              id: 'plant-life', title: 'Plant Life & Photosynthesis',
              difficulty: 'easy', xp: 20, game: 'Eco Battle',
              enemy: 'eco-phantom', estimatedTime: '10 min',
              recommendedLevel: 1, unlockRequirement: null,
              rewards: { xp: 20, coins: 10 },
              description: 'Learn how plants make food and survive.',
              questions: [
                { id: 'g6_plant_q1', question: 'What do plants use to make food?', options: ['Sunlight, water, CO₂', 'Sunlight and oxygen', 'Water and nitrogen', 'Soil only'], answer: 'Sunlight, water, CO₂', explanation: 'Photosynthesis uses sunlight + H₂O + CO₂ to produce glucose.', difficulty: 'easy', xp: 5 },
                { id: 'g6_plant_q2', question: 'Which part absorbs water from soil?', options: ['Leaves', 'Stem', 'Roots', 'Flowers'], answer: 'Roots', explanation: 'Roots anchor the plant and absorb water and minerals.', difficulty: 'easy', xp: 5 },
                { id: 'g6_plant_q3', question: 'What gas do plants release during photosynthesis?', options: ['CO₂', 'Nitrogen', 'Oxygen', 'Hydrogen'], answer: 'Oxygen', explanation: 'O₂ is a byproduct of photosynthesis.', difficulty: 'easy', xp: 5 },
                { id: 'g6_plant_q4', question: 'What green pigment captures sunlight?', options: ['Melanin', 'Chlorophyll', 'Carotene', 'Hemoglobin'], answer: 'Chlorophyll', explanation: 'Chlorophyll gives leaves their green color and absorbs sunlight.', difficulty: 'easy', xp: 5 },
              ],
            },
            {
              id: 'states-of-matter', title: 'States of Matter',
              difficulty: 'easy', xp: 20, game: 'Matter Blaster',
              enemy: 'matter-muncher', estimatedTime: '10 min',
              recommendedLevel: 1, unlockRequirement: null,
              rewards: { xp: 20, coins: 10 },
              description: 'Understand solids, liquids, and gases.',
              questions: [
                { id: 'g6_mat_q1', question: 'Which state has a definite shape and volume?', options: ['Gas', 'Liquid', 'Solid', 'Plasma'], answer: 'Solid', explanation: 'Solids have fixed shape and volume.', difficulty: 'easy', xp: 5 },
                { id: 'g6_mat_q2', question: 'What happens to most matter when heated?', options: ['It contracts', 'It expands', 'Nothing', 'It becomes solid'], answer: 'It expands', explanation: 'Heat causes particles to move faster and spread apart.', difficulty: 'easy', xp: 5 },
                { id: 'g6_mat_q3', question: 'Liquid turning to gas is called?', options: ['Condensation', 'Freezing', 'Evaporation', 'Melting'], answer: 'Evaporation', explanation: 'Evaporation is liquid converting to vapor at the surface.', difficulty: 'easy', xp: 5 },
                { id: 'g6_mat_q4', question: 'Freezing point of water?', options: ['100°C', '50°C', '0°C', '-10°C'], answer: '0°C', explanation: 'Water freezes at 0°C (32°F).', difficulty: 'easy', xp: 5 },
              ],
            },
          ],
        },
      },
    },
    english: {
      title: 'English', color: '#38bdf8',
      description: 'Master grammar, vocabulary, and reading skills.',
      chapters: {
        'grammar-basics': {
          title: 'Grammar Basics',
          description: 'Parts of speech and sentence structure.',
          topics: [
            {
              id: 'nouns-verbs', title: 'Nouns & Verbs',
              difficulty: 'easy', xp: 15, game: 'Word Battle',
              enemy: 'grammar-goblin', estimatedTime: '10 min',
              recommendedLevel: 1, unlockRequirement: null,
              rewards: { xp: 15, coins: 8 },
              description: 'Identify and use nouns and verbs correctly.',
              questions: [
                { id: 'g6_eng_q1', question: 'Which is a noun in: "The dog runs fast"?', options: ['runs', 'fast', 'The', 'dog'], answer: 'dog', explanation: 'A noun is a person, place, or thing. "Dog" is the thing.', difficulty: 'easy', xp: 4 },
                { id: 'g6_eng_q2', question: 'Which word is a verb?', options: ['beautiful', 'quickly', 'jumps', 'mountain'], answer: 'jumps', explanation: 'Verbs are action words. "Jumps" is the action.', difficulty: 'easy', xp: 4 },
                { id: 'g6_eng_q3', question: 'How many nouns in: "The cat sat on the mat"?', options: ['1', '2', '3', '4'], answer: '2', explanation: '"Cat" and "mat" are the two nouns.', difficulty: 'easy', xp: 4 },
                { id: 'g6_eng_q4', question: 'Which is a proper noun?', options: ['city', 'river', 'London', 'mountain'], answer: 'London', explanation: 'Proper nouns name specific places/people and are capitalized.', difficulty: 'easy', xp: 4 },
              ],
            },
            {
              id: 'adjectives-adverbs', title: 'Adjectives & Adverbs',
              difficulty: 'easy', xp: 15, game: 'Word Battle',
              enemy: 'vocab-vampire', estimatedTime: '10 min',
              recommendedLevel: 1, unlockRequirement: 'nouns-verbs',
              rewards: { xp: 15, coins: 8 },
              description: 'Use descriptors to make writing more vivid.',
              questions: [
                { id: 'g6_adj_q1', question: 'Which word is an adjective in: "The red ball bounced"?', options: ['The', 'red', 'ball', 'bounced'], answer: 'red', explanation: 'Adjectives describe nouns. "Red" describes the ball.', difficulty: 'easy', xp: 4 },
                { id: 'g6_adj_q2', question: 'Which word is an adverb in: "She runs quickly"?', options: ['She', 'runs', 'quickly', 'the'], answer: 'quickly', explanation: 'Adverbs modify verbs. "Quickly" tells HOW she runs.', difficulty: 'easy', xp: 4 },
                { id: 'g6_adj_q3', question: 'Which modifies a noun?', options: ['Adverb', 'Verb', 'Adjective', 'Pronoun'], answer: 'Adjective', explanation: 'Adjectives describe or modify nouns.', difficulty: 'easy', xp: 4 },
                { id: 'g6_adj_q4', question: 'Adjective in: "The big, friendly dog barked"?', options: ['dog', 'barked', 'big', 'The'], answer: 'big', explanation: '"Big" and "friendly" are both adjectives — "big" comes first.', difficulty: 'easy', xp: 4 },
              ],
            },
          ],
        },
      },
    },
  },
};
