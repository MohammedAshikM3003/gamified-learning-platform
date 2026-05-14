export const grade9 = {
  title: 'Grade 9',
  subjects: {
    mathematics: {
      title: 'Mathematics', color: '#e2b857',
      description: 'Master quadratics, trigonometry, and coordinate geometry.',
      chapters: {
        quadratics: {
          title: 'Quadratic Equations',
          description: 'Solve and graph quadratic equations.',
          topics: [
            {
              id: 'factoring-quadratics', title: 'Factoring Quadratics',
              difficulty: 'medium', xp: 40, game: 'Algebra Clash',
              enemy: 'algebra-titan', estimatedTime: '18 min',
              recommendedLevel: 4, unlockRequirement: null,
              rewards: { xp: 40, coins: 18 },
              description: 'Factor quadratic expressions using various methods.',
              questions: [
                { id: 'g9_quad_q1', question: 'Factor: x² + 5x + 6', options: ['(x+2)(x+3)', '(x+1)(x+6)', '(x+2)(x+4)', '(x-2)(x-3)'], answer: '(x+2)(x+3)', explanation: '2×3=6, 2+3=5. So x²+5x+6 = (x+2)(x+3).', difficulty: 'medium', xp: 10 },
                { id: 'g9_quad_q2', question: 'Solve: x² - 9 = 0', options: ['x = 3', 'x = -3', 'x = ±3', 'x = 9'], answer: 'x = ±3', explanation: 'x² = 9, so x = ±√9 = ±3.', difficulty: 'medium', xp: 10 },
                { id: 'g9_quad_q3', question: 'What is the degree of a quadratic equation?', options: ['1', '2', '3', '4'], answer: '2', explanation: 'Quadratic means the highest power of x is 2.', difficulty: 'easy', xp: 7 },
                { id: 'g9_quad_q4', question: 'Roots of x² - 5x + 6 = 0?', options: ['x=1, x=6', 'x=2, x=3', 'x=-2, x=-3', 'x=1, x=5'], answer: 'x=2, x=3', explanation: '(x-2)(x-3) = 0 → x=2 or x=3.', difficulty: 'medium', xp: 10 },
              ],
            },
            {
              id: 'quadratic-formula', title: 'The Quadratic Formula',
              difficulty: 'hard', xp: 50, game: 'Algebra Clash',
              enemy: 'calculus-colossus', estimatedTime: '20 min',
              recommendedLevel: 4, unlockRequirement: 'factoring-quadratics',
              rewards: { xp: 50, coins: 22 },
              description: 'Apply the quadratic formula to solve any quadratic.',
              questions: [
                { id: 'g9_qf_q1', question: 'The quadratic formula solves ax² + bx + c = 0. What is it?', options: ['x = -b ± √(b²-4ac) / 2a', 'x = b ± √(b²+4ac) / 2a', 'x = -b / 2a', 'x = √(b²-4ac)'], answer: 'x = -b ± √(b²-4ac) / 2a', explanation: 'The quadratic formula is x = [-b ± √(b²-4ac)] / 2a.', difficulty: 'hard', xp: 12 },
                { id: 'g9_qf_q2', question: 'In the formula, b²-4ac is called the?', options: ['Coefficient', 'Discriminant', 'Root', 'Factor'], answer: 'Discriminant', explanation: 'The discriminant tells us how many real roots exist.', difficulty: 'medium', xp: 10 },
                { id: 'g9_qf_q3', question: 'If discriminant > 0, the equation has?', options: ['No real roots', 'One root', 'Two distinct real roots', 'Infinite roots'], answer: 'Two distinct real roots', explanation: 'Positive discriminant → two real, distinct roots.', difficulty: 'medium', xp: 10 },
                { id: 'g9_qf_q4', question: 'Solve x² - 4x + 4 = 0.', options: ['x = 4', 'x = ±2', 'x = 2 (double root)', 'x = -2'], answer: 'x = 2 (double root)', explanation: 'Discriminant = 16-16=0 → one repeated root. x = 4/2 = 2.', difficulty: 'hard', xp: 12 },
              ],
            },
          ],
        },
        trigonometry: {
          title: 'Trigonometry',
          description: 'Use sine, cosine, and tangent in right triangles.',
          topics: [
            {
              id: 'trig-ratios', title: 'Trigonometric Ratios',
              difficulty: 'medium', xp: 45, game: 'Trig Tower',
              enemy: 'trig-titan', estimatedTime: '18 min',
              recommendedLevel: 4, unlockRequirement: null,
              rewards: { xp: 45, coins: 20 },
              description: 'Learn SOH-CAH-TOA and apply it to triangles.',
              questions: [
                { id: 'g9_trig_q1', question: 'In a right triangle, sin(θ) = ?', options: ['Adjacent/Hypotenuse', 'Opposite/Hypotenuse', 'Opposite/Adjacent', 'Hypotenuse/Opposite'], answer: 'Opposite/Hypotenuse', explanation: 'SOH: Sin = Opposite/Hypotenuse.', difficulty: 'medium', xp: 11 },
                { id: 'g9_trig_q2', question: 'cos(60°) = ?', options: ['√3/2', '1/2', '1/√2', '√3'], answer: '1/2', explanation: 'cos(60°) = 0.5 = 1/2.', difficulty: 'medium', xp: 11 },
                { id: 'g9_trig_q3', question: 'tan(45°) = ?', options: ['0', '1', '√2', '√3'], answer: '1', explanation: 'tan(45°) = sin(45°)/cos(45°) = 1.', difficulty: 'medium', xp: 11 },
                { id: 'g9_trig_q4', question: 'Which mnemonic helps remember trig ratios?', options: ['BODMAS', 'SOH-CAH-TOA', 'PEMDAS', 'SOHCA'], answer: 'SOH-CAH-TOA', explanation: 'SOH-CAH-TOA: Sin=Opp/Hyp, Cos=Adj/Hyp, Tan=Opp/Adj.', difficulty: 'easy', xp: 8 },
              ],
            },
          ],
        },
      },
    },
    physics: {
      title: 'Physics', color: '#38bdf8',
      description: 'Explore electricity, circuits, and electromagnetic force.',
      chapters: {
        electricity: {
          title: 'Electricity & Circuits',
          description: 'Understand current, voltage, resistance, and circuit types.',
          topics: [
            {
              id: 'current-voltage', title: 'Current & Voltage',
              difficulty: 'medium', xp: 40, game: 'Circuit Battle',
              enemy: 'electric-eel', estimatedTime: '15 min',
              recommendedLevel: 4, unlockRequirement: null,
              rewards: { xp: 40, coins: 18 },
              description: 'Understand electric current, voltage, and Ohm\'s Law.',
              questions: [
                { id: 'g9_elec_q1', question: 'Electric current is measured in?', options: ['Volts', 'Watts', 'Amperes', 'Ohms'], answer: 'Amperes', explanation: 'Current (I) is measured in Amperes (A).', difficulty: 'easy', xp: 8 },
                { id: 'g9_elec_q2', question: 'Ohm\'s Law states V = ?', options: ['I + R', 'I × R', 'I / R', 'I - R'], answer: 'I × R', explanation: 'V = IR (Voltage = Current × Resistance).', difficulty: 'medium', xp: 10 },
                { id: 'g9_elec_q3', question: 'If V=12V and R=4Ω, what is current I?', options: ['3A', '48A', '8A', '0.3A'], answer: '3A', explanation: 'I = V/R = 12/4 = 3A.', difficulty: 'medium', xp: 10 },
                { id: 'g9_elec_q4', question: 'Resistance is measured in?', options: ['Amperes', 'Volts', 'Watts', 'Ohms (Ω)'], answer: 'Ohms (Ω)', explanation: 'Resistance is measured in Ohms, symbolized by Ω.', difficulty: 'easy', xp: 8 },
              ],
            },
            {
              id: 'circuits', title: 'Series & Parallel Circuits',
              difficulty: 'hard', xp: 50, game: 'Circuit Battle',
              enemy: 'electric-eel', estimatedTime: '20 min',
              recommendedLevel: 4, unlockRequirement: 'current-voltage',
              rewards: { xp: 50, coins: 22 },
              description: 'Analyze and compare series and parallel circuit configurations.',
              questions: [
                { id: 'g9_circ_q1', question: 'In a series circuit, if one bulb blows, others?', options: ['Stay on', 'Go out too', 'Get brighter', 'Unchanged'], answer: 'Go out too', explanation: 'Series circuits have one path — one break stops all current.', difficulty: 'medium', xp: 11 },
                { id: 'g9_circ_q2', question: 'Total resistance in series: R1=3Ω, R2=5Ω?', options: ['2Ω', '8Ω', '15Ω', '1.9Ω'], answer: '8Ω', explanation: 'Series: R_total = R1 + R2 = 3 + 5 = 8Ω.', difficulty: 'medium', xp: 11 },
                { id: 'g9_circ_q3', question: 'Home electrical circuits are usually wired in?', options: ['Series', 'Parallel', 'Mixed', 'None'], answer: 'Parallel', explanation: 'Parallel wiring lets each appliance work independently.', difficulty: 'medium', xp: 11 },
                { id: 'g9_circ_q4', question: 'In parallel circuit, voltage across each branch is?', options: ['Different', 'Same as source', 'Half of source', 'Zero'], answer: 'Same as source', explanation: 'Each parallel branch receives the full source voltage.', difficulty: 'hard', xp: 12 },
              ],
            },
          ],
        },
      },
    },
    biology: {
      title: 'Biology', color: '#22c55e',
      description: 'Explore cells, genetics, and the human body systems.',
      chapters: {
        cells: {
          title: 'Cell Biology',
          description: 'Understand cell structure, function, and division.',
          topics: [
            {
              id: 'cell-structure', title: 'Cell Structure & Organelles',
              difficulty: 'medium', xp: 35, game: 'Bio Battle',
              enemy: 'cell-devourer', estimatedTime: '15 min',
              recommendedLevel: 4, unlockRequirement: null,
              rewards: { xp: 35, coins: 15 },
              description: 'Identify cell organelles and their functions.',
              questions: [
                { id: 'g9_cell_q1', question: 'Which organelle is called the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Vacuole'], answer: 'Mitochondria', explanation: 'Mitochondria produce ATP energy through cellular respiration.', difficulty: 'easy', xp: 8 },
                { id: 'g9_cell_q2', question: 'The nucleus contains?', options: ['Chlorophyll', 'DNA', 'Glucose', 'Water'], answer: 'DNA', explanation: 'The nucleus contains DNA — the genetic blueprint of the cell.', difficulty: 'easy', xp: 8 },
                { id: 'g9_cell_q3', question: 'Which is found in plant cells but NOT animal cells?', options: ['Mitochondria', 'Nucleus', 'Cell wall', 'Cell membrane'], answer: 'Cell wall', explanation: 'Plant cells have a rigid cell wall (made of cellulose); animal cells do not.', difficulty: 'medium', xp: 10 },
                { id: 'g9_cell_q4', question: 'Where does protein synthesis occur?', options: ['Mitochondria', 'Ribosome', 'Vacuole', 'Nucleus'], answer: 'Ribosome', explanation: 'Ribosomes are the site of protein synthesis using mRNA instructions.', difficulty: 'medium', xp: 10 },
              ],
            },
            {
              id: 'cell-division', title: 'Cell Division (Mitosis)',
              difficulty: 'hard', xp: 50, game: 'Bio Battle',
              enemy: 'bio-titan', estimatedTime: '20 min',
              recommendedLevel: 4, unlockRequirement: 'cell-structure',
              rewards: { xp: 50, coins: 22 },
              description: 'Understand the stages and purpose of mitosis.',
              questions: [
                { id: 'g9_mito_q1', question: 'Mitosis produces how many daughter cells?', options: ['1', '2', '4', '8'], answer: '2', explanation: 'Mitosis results in 2 genetically identical daughter cells.', difficulty: 'medium', xp: 11 },
                { id: 'g9_mito_q2', question: 'Correct order of mitosis stages?', options: ['Prophase → Metaphase → Anaphase → Telophase', 'Metaphase → Prophase → Telophase → Anaphase', 'Anaphase → Prophase → Metaphase → Telophase', 'Telophase → Anaphase → Metaphase → Prophase'], answer: 'Prophase → Metaphase → Anaphase → Telophase', explanation: 'Remember: PMAT — Prophase, Metaphase, Anaphase, Telophase.', difficulty: 'hard', xp: 12 },
                { id: 'g9_mito_q3', question: 'Mitosis is used for?', options: ['Sexual reproduction', 'Growth and repair', 'Producing sex cells', 'Genetic variation'], answer: 'Growth and repair', explanation: 'Mitosis creates identical cells for growth, repair, and asexual reproduction.', difficulty: 'medium', xp: 11 },
                { id: 'g9_mito_q4', question: 'During which phase do chromosomes line up at the center?', options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'], answer: 'Metaphase', explanation: 'In Metaphase, chromosomes align at the cell\'s equator (metaphase plate).', difficulty: 'hard', xp: 12 },
              ],
            },
          ],
        },
      },
    },
  },
};
