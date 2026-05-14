/**
 * battleData.js — All enemy definitions for every grade and subject
 */

export const enemies = {
  // ── Programming ──────────────────────────────────────────
  'syntax-phantom':   { id: 'syntax-phantom',   name: 'Syntax Phantom',    title: 'Error Wraith',        health: 80,  color: '#8b5cf6', description: 'A ghost born from runtime errors.' },
  'infinite-loop':    { id: 'infinite-loop',    name: 'Infinite Loop',     title: 'The Endless Daemon',  health: 100, color: '#ef4444', description: 'Trapped in recursion with no base case.' },
  'null-pointer':     { id: 'null-pointer',     name: 'Null Pointer',      title: 'The Void Daemon',     health: 90,  color: '#a78bfa', description: 'Crashes programs with undefined chaos.' },
  'type-error':       { id: 'type-error',       name: 'Type Error',        title: 'The Mismatch Fiend',  health: 85,  color: '#7c3aed', description: 'Exploits weak typing to corrupt data.' },

  // ── Mathematics ───────────────────────────────────────────
  'algebra-titan':    { id: 'algebra-titan',    name: 'Algebra Titan',     title: 'The Equation Lord',   health: 120, color: '#e2b857', description: 'Wields the power of unknown variables.' },
  'fraction-king':    { id: 'fraction-king',    name: 'Fraction King',     title: 'The Ratio Ruler',     health: 70,  color: '#fbbf24', description: 'Splits problems into impossible pieces.' },
  'geo-golem':        { id: 'geo-golem',        name: 'Geo Golem',         title: 'The Shape Shifter',   health: 80,  color: '#f59e0b', description: 'Morphs between angles and dimensions.' },
  'stats-specter':    { id: 'stats-specter',    name: 'Stats Specter',     title: 'The Data Ghost',      health: 110, color: '#d97706', description: 'Manipulates probability to deceive.' },
  'calculus-colossus':{ id: 'calculus-colossus',name: 'Calculus Colossus', title: 'The Limit Breaker',   health: 140, color: '#b45309', description: 'Approaches infinity, never reaching it.' },
  'trig-titan':       { id: 'trig-titan',       name: 'Trig Titan',        title: 'The Angle Tyrant',    health: 115, color: '#ca8a04', description: 'Bends sine waves into deadly spirals.' },

  // ── Physics ───────────────────────────────────────────────
  'gravity-guardian': { id: 'gravity-guardian', name: 'Gravity Guardian',  title: 'Force Field Warden',  health: 120, color: '#38bdf8', description: 'Bends the laws of physics to its will.' },
  'light-wraith':     { id: 'light-wraith',     name: 'Light Wraith',      title: 'The Photon Phantom',  health: 90,  color: '#7dd3fc', description: 'Moves at the speed of light itself.' },
  'wave-rider':       { id: 'wave-rider',       name: 'Wave Rider',        title: 'The Frequency Lord',  health: 100, color: '#0ea5e9', description: 'Disrupts signals with chaotic resonance.' },
  'thermal-titan':    { id: 'thermal-titan',    name: 'Thermal Titan',     title: 'The Heat Daemon',     health: 130, color: '#fb923c', description: 'Burns all entropy in its path.' },
  'electric-eel':     { id: 'electric-eel',     name: 'Electric Eel',      title: 'The Circuit Breaker', health: 95,  color: '#60a5fa', description: 'Shorts out logic with raw voltage.' },

  // ── Chemistry ─────────────────────────────────────────────
  'atom-crusher':     { id: 'atom-crusher',     name: 'Atom Crusher',      title: 'The Nucleus Destroyer',health:100, color: '#f97316', description: 'Splits atoms to cause chain reactions.' },
  'element-golem':    { id: 'element-golem',    name: 'Element Golem',     title: 'The Periodic Terror', health: 110, color: '#fb923c', description: 'Forged from volatile elements.' },

  // ── Biology ───────────────────────────────────────────────
  'cell-devourer':    { id: 'cell-devourer',    name: 'Cell Devourer',     title: 'The Membrane Wraith', health: 85,  color: '#22c55e', description: 'Corrupts cells with toxic mutations.' },
  'bio-titan':        { id: 'bio-titan',        name: 'Bio Titan',         title: 'The DNA Phantom',     health: 115, color: '#16a34a', description: 'Rewrites genetic code to evolve.' },

  // ── Science (Grade 6/7) ───────────────────────────────────
  'eco-phantom':      { id: 'eco-phantom',      name: 'Eco Phantom',       title: 'The Chaos Beast',     health: 65,  color: '#4ade80', description: 'Disrupts ecosystems for fun.' },
  'matter-muncher':   { id: 'matter-muncher',   name: 'Matter Muncher',    title: 'The Phase Shifter',   health: 70,  color: '#86efac', description: 'Switches between solid, liquid, gas.' },

  // ── English ───────────────────────────────────────────────
  'grammar-goblin':   { id: 'grammar-goblin',   name: 'Grammar Goblin',    title: 'The Syntax Saboteur', health: 60,  color: '#c084fc', description: 'Rewrites sentences into nonsense.' },
  'vocab-vampire':    { id: 'vocab-vampire',     name: 'Vocab Vampire',     title: 'The Word Thief',      health: 70,  color: '#a855f7', description: 'Drains meaning from every word.' },

  // ── Computer Science ──────────────────────────────────────
  'logic-lord':       { id: 'logic-lord',       name: 'Logic Lord',        title: 'The Boolean Tyrant',  health: 120, color: '#6366f1', description: 'Twists logic gates into paradoxes.' },
  'sort-saboteur':    { id: 'sort-saboteur',    name: 'Sort Saboteur',     title: 'The Order Breaker',   health: 110, color: '#818cf8', description: 'Scrambles sorted arrays into chaos.' },

  // ── AI & ML ───────────────────────────────────────────────
  'neural-nexus':     { id: 'neural-nexus',     name: 'Neural Nexus',      title: 'The Model Corruptor', health: 140, color: '#06b6d4', description: 'Poisons training data with noise.' },
  'overfit-ogre':     { id: 'overfit-ogre',     name: 'Overfit Ogre',      title: 'The Memorizer',       health: 120, color: '#0891b2', description: 'Memorizes but never generalizes.' },

  // ── Aptitude & Placement ──────────────────────────────────
  'puzzle-phantom':   { id: 'puzzle-phantom',   name: 'Puzzle Phantom',    title: 'The Reasoning Wraith',health: 100, color: '#f472b6', description: 'Shatters logic with trick questions.' },
  'dsa-daemon':       { id: 'dsa-daemon',       name: 'DSA Daemon',        title: 'The Algorithm Breaker',health:150, color: '#ec4899', description: 'Corrupts code with O(n²) complexity.' },
};

// Subject-based special abilities triggered at 5+ combo
export const SUBJECT_ABILITIES = {
  programming:       { name: 'SYNTAX SLASH',     color: '#8b5cf6', icon: '⚡' },
  mathematics:       { name: 'EQUATION BLAST',   color: '#e2b857', icon: '🔥' },
  physics:           { name: 'GRAVITY IMPACT',   color: '#38bdf8', icon: '💫' },
  chemistry:         { name: 'ATOMIC SURGE',     color: '#f97316', icon: '⚗️' },
  biology:           { name: 'CELL STRIKE',      color: '#22c55e', icon: '🧬' },
  science:           { name: 'NATURE FORCE',     color: '#4ade80', icon: '🌿' },
  english:           { name: 'WORD STORM',       color: '#c084fc', icon: '📖' },
  'computer-science':{ name: 'LOGIC OVERRIDE',   color: '#6366f1', icon: '🖥️' },
  'ai-ml':           { name: 'NEURAL STORM',     color: '#06b6d4', icon: '🧠' },
  aptitude:          { name: 'MIND BLAST',       color: '#f472b6', icon: '💡' },
  placement:         { name: 'CODE CRITICAL',    color: '#ec4899', icon: '🚀' },
  default:           { name: 'POWER STRIKE',     color: '#8b5cf6', icon: '⚡' },
};
