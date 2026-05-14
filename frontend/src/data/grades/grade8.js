export const grade8 = {
  title: 'Grade 8',
  subjects: {
    mathematics: {
      title: 'Mathematics', color: '#e2b857',
      description: 'Tackle linear equations, graphs, and coordinate geometry.',
      chapters: {
        'linear-equations': {
          title: 'Linear Equations',
          description: 'Solve equations with one and two variables.',
          topics: [
            {
              id: 'one-variable', title: 'One-Variable Equations',
              difficulty: 'medium', xp: 35, game: 'Algebra Clash',
              enemy: 'algebra-titan', estimatedTime: '15 min',
              recommendedLevel: 3, unlockRequirement: null,
              rewards: { xp: 35, coins: 15 },
              description: 'Solve linear equations in one variable systematically.',
              questions: [
                { id: 'g8_eq1_q1', question: 'Solve: 4x + 8 = 24', options: ['x = 2', 'x = 4', 'x = 6', 'x = 8'], answer: 'x = 4', explanation: '4x = 24 - 8 = 16, so x = 4.', difficulty: 'medium', xp: 8 },
                { id: 'g8_eq1_q2', question: 'Solve: 3(x - 2) = 9', options: ['x = 3', 'x = 5', 'x = 4', 'x = 7'], answer: 'x = 5', explanation: '3x - 6 = 9 → 3x = 15 → x = 5.', difficulty: 'medium', xp: 8 },
                { id: 'g8_eq1_q3', question: 'Solve: x/3 + 1 = 4', options: ['x = 6', 'x = 9', 'x = 12', 'x = 3'], answer: 'x = 9', explanation: 'x/3 = 3 → x = 9.', difficulty: 'medium', xp: 8 },
                { id: 'g8_eq1_q4', question: 'Solve: 2x - 5 = x + 3', options: ['x = 4', 'x = 8', 'x = 6', 'x = 2'], answer: 'x = 8', explanation: '2x - x = 3 + 5 → x = 8.', difficulty: 'medium', xp: 8 },
              ],
            },
            {
              id: 'linear-graphs', title: 'Graphing Linear Equations',
              difficulty: 'medium', xp: 40, game: 'Algebra Clash',
              enemy: 'algebra-titan', estimatedTime: '18 min',
              recommendedLevel: 3, unlockRequirement: 'one-variable',
              rewards: { xp: 40, coins: 18 },
              description: 'Plot and interpret linear equations on a coordinate plane.',
              questions: [
                { id: 'g8_gr_q1', question: 'What is the slope of y = 3x - 2?', options: ['3', '-2', '2', '-3'], answer: '3', explanation: 'In y = mx + b, m is the slope. Here m = 3.', difficulty: 'medium', xp: 9 },
                { id: 'g8_gr_q2', question: 'Where does y = 2x + 4 cross the y-axis?', options: ['y = 2', 'y = 4', 'y = -4', 'y = 0'], answer: 'y = 4', explanation: 'The y-intercept is b = 4 in y = mx + b.', difficulty: 'medium', xp: 9 },
                { id: 'g8_gr_q3', question: 'A line has slope 0. It is:', options: ['Vertical', 'Diagonal', 'Horizontal', 'Curved'], answer: 'Horizontal', explanation: 'Slope = 0 means no rise — the line is flat/horizontal.', difficulty: 'medium', xp: 9 },
                { id: 'g8_gr_q4', question: 'What is the x-intercept of y = 2x - 6?', options: ['x = 3', 'x = 6', 'x = -6', 'x = 2'], answer: 'x = 3', explanation: 'Set y=0: 0 = 2x - 6 → x = 3.', difficulty: 'medium', xp: 9 },
              ],
            },
          ],
        },
      },
    },
    physics: {
      title: 'Physics', color: '#38bdf8',
      description: 'Explore light, sound, force, and gravity.',
      chapters: {
        'light-optics': {
          title: 'Light & Optics',
          description: 'Discover how light travels, reflects, and refracts.',
          topics: [
            {
              id: 'reflection', title: 'Reflection of Light',
              difficulty: 'easy', xp: 25, game: 'Physics Arena',
              enemy: 'light-wraith', estimatedTime: '12 min',
              recommendedLevel: 3, unlockRequirement: null,
              rewards: { xp: 25, coins: 12 },
              description: 'Understand laws of reflection and mirrors.',
              questions: [
                { id: 'g8_ref_q1', question: 'The angle of incidence equals the angle of ___?', options: ['Reflection', 'Refraction', 'Diffraction', 'Absorption'], answer: 'Reflection', explanation: 'Law of Reflection: angle in = angle out, measured from the normal.', difficulty: 'easy', xp: 6 },
                { id: 'g8_ref_q2', question: 'A plane mirror creates what type of image?', options: ['Real and inverted', 'Virtual and upright', 'Real and upright', 'Virtual and inverted'], answer: 'Virtual and upright', explanation: 'Plane mirrors form virtual, upright, laterally inverted images.', difficulty: 'easy', xp: 6 },
                { id: 'g8_ref_q3', question: 'Light travels fastest in?', options: ['Water', 'Glass', 'Air/Vacuum', 'Diamond'], answer: 'Air/Vacuum', explanation: 'Light travels at ~3×10⁸ m/s in a vacuum — slowest in dense materials.', difficulty: 'easy', xp: 6 },
                { id: 'g8_ref_q4', question: 'A concave mirror is used in?', options: ['Car rear-view mirrors', 'Solar cookers', 'Periscopes', 'Kaleidoscopes'], answer: 'Solar cookers', explanation: 'Concave mirrors focus light at a focal point, used in solar cookers.', difficulty: 'medium', xp: 8 },
              ],
            },
            {
              id: 'refraction', title: 'Refraction of Light',
              difficulty: 'medium', xp: 35, game: 'Physics Arena',
              enemy: 'light-wraith', estimatedTime: '15 min',
              recommendedLevel: 3, unlockRequirement: 'reflection',
              rewards: { xp: 35, coins: 15 },
              description: 'Understand how light bends when it changes medium.',
              questions: [
                { id: 'g8_refr_q1', question: 'Refraction occurs because light changes its?', options: ['Color', 'Speed', 'Intensity', 'Direction only'], answer: 'Speed', explanation: 'Light slows down or speeds up when entering a new medium, causing bending.', difficulty: 'medium', xp: 8 },
                { id: 'g8_refr_q2', question: 'A straw appears bent in water due to?', options: ['Reflection', 'Refraction', 'Diffraction', 'Absorption'], answer: 'Refraction', explanation: 'Light bends at the water-air boundary, making the straw appear bent.', difficulty: 'easy', xp: 6 },
                { id: 'g8_refr_q3', question: 'Which color bends the MOST when white light passes through a prism?', options: ['Red', 'Green', 'Blue', 'Violet'], answer: 'Violet', explanation: 'Violet has the shortest wavelength and bends the most.', difficulty: 'medium', xp: 8 },
                { id: 'g8_refr_q4', question: 'A convex lens is used in?', options: ['Car mirrors', 'Cameras and spectacles for farsightedness', 'Periscopes', 'Plane mirrors'], answer: 'Cameras and spectacles for farsightedness', explanation: 'Convex lenses converge light — used in cameras, magnifying glasses, and farsighted spectacles.', difficulty: 'medium', xp: 8 },
              ],
            },
          ],
        },
        'force-gravity': {
          title: 'Force & Gravity',
          description: 'Understand gravitational force, friction, and motion.',
          topics: [
            {
              id: 'gravity-basics', title: 'Gravity & Weight',
              difficulty: 'easy', xp: 25, game: 'Physics Arena',
              enemy: 'gravity-guardian', estimatedTime: '12 min',
              recommendedLevel: 3, unlockRequirement: null,
              rewards: { xp: 25, coins: 12 },
              description: 'Distinguish between mass and weight, understand gravity.',
              questions: [
                { id: 'g8_grav_q1', question: 'What is the unit of force?', options: ['Kilogram', 'Newton', 'Joule', 'Watt'], answer: 'Newton', explanation: 'Force is measured in Newtons (N), named after Isaac Newton.', difficulty: 'easy', xp: 6 },
                { id: 'g8_grav_q2', question: 'Weight is a measure of?', options: ['Amount of matter', 'Gravitational pull on an object', 'Volume', 'Density'], answer: 'Gravitational pull on an object', explanation: 'Weight = mass × gravitational acceleration (W = mg).', difficulty: 'easy', xp: 6 },
                { id: 'g8_grav_q3', question: 'If you weigh 60N on Earth (g=10), your mass is?', options: ['600 kg', '6 kg', '60 kg', '0.6 kg'], answer: '6 kg', explanation: 'Mass = Weight/g = 60/10 = 6 kg.', difficulty: 'medium', xp: 8 },
                { id: 'g8_grav_q4', question: 'On the Moon, compared to Earth, your weight is?', options: ['Same', 'Greater', 'Less', 'Zero'], answer: 'Less', explanation: 'Moon has weaker gravity (~1/6 of Earth), so you weigh less.', difficulty: 'easy', xp: 6 },
              ],
            },
          ],
        },
      },
    },
    chemistry: {
      title: 'Chemistry', color: '#f97316',
      description: 'Explore atoms, elements, and the structure of matter.',
      chapters: {
        'matter-atoms': {
          title: 'Matter & Atoms',
          description: 'Understand atomic structure and the periodic table basics.',
          topics: [
            {
              id: 'atomic-structure', title: 'Atomic Structure',
              difficulty: 'medium', xp: 35, game: 'Atom Smasher',
              enemy: 'atom-crusher', estimatedTime: '15 min',
              recommendedLevel: 3, unlockRequirement: null,
              rewards: { xp: 35, coins: 15 },
              description: 'Learn about protons, neutrons, electrons, and atomic models.',
              questions: [
                { id: 'g8_atom_q1', question: 'Where are electrons found in an atom?', options: ['Nucleus', 'Orbiting the nucleus', 'Proton shells', 'Neutron field'], answer: 'Orbiting the nucleus', explanation: 'Electrons orbit the nucleus in energy levels/shells.', difficulty: 'medium', xp: 8 },
                { id: 'g8_atom_q2', question: 'What is the charge of a proton?', options: ['Negative', 'Neutral', 'Positive', 'Variable'], answer: 'Positive', explanation: 'Protons carry a positive charge (+1).', difficulty: 'easy', xp: 6 },
                { id: 'g8_atom_q3', question: 'The atomic number of an element equals its number of?', options: ['Neutrons', 'Protons', 'Electrons + Neutrons', 'Protons + Neutrons'], answer: 'Protons', explanation: 'Atomic number = number of protons in the nucleus.', difficulty: 'medium', xp: 8 },
                { id: 'g8_atom_q4', question: 'What holds the nucleus together?', options: ['Electromagnetic force', 'Strong nuclear force', 'Gravity', 'Weak force'], answer: 'Strong nuclear force', explanation: 'The strong nuclear force overcomes electrostatic repulsion to hold the nucleus together.', difficulty: 'hard', xp: 10 },
              ],
            },
            {
              id: 'elements-compounds', title: 'Elements & Compounds',
              difficulty: 'medium', xp: 35, game: 'Atom Smasher',
              enemy: 'element-golem', estimatedTime: '15 min',
              recommendedLevel: 3, unlockRequirement: 'atomic-structure',
              rewards: { xp: 35, coins: 15 },
              description: 'Distinguish elements, compounds, and mixtures.',
              questions: [
                { id: 'g8_elem_q1', question: 'Water (H₂O) is an example of a?', options: ['Element', 'Mixture', 'Compound', 'Atom'], answer: 'Compound', explanation: 'A compound is made of two or more elements chemically bonded. H₂O = hydrogen + oxygen.', difficulty: 'easy', xp: 7 },
                { id: 'g8_elem_q2', question: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], answer: 'Au', explanation: 'Au comes from the Latin "Aurum" meaning gold.', difficulty: 'easy', xp: 7 },
                { id: 'g8_elem_q3', question: 'Air is an example of a?', options: ['Element', 'Compound', 'Mixture', 'Solution'], answer: 'Mixture', explanation: 'Air is a mixture of nitrogen, oxygen, and other gases — not chemically bonded.', difficulty: 'medium', xp: 8 },
                { id: 'g8_elem_q4', question: 'NaCl (table salt) is a compound of?', options: ['Nitrogen & Carbon', 'Sodium & Chlorine', 'Nickel & Calcium', 'Neon & Carbon'], answer: 'Sodium & Chlorine', explanation: 'Na = Sodium, Cl = Chlorine. NaCl is sodium chloride.', difficulty: 'easy', xp: 7 },
              ],
            },
          ],
        },
      },
    },
  },
};
