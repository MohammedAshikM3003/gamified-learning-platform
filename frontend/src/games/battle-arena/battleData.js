/**
 * battleData.js — Enemy definitions for the Battle Arena
 * Each enemy maps to a topic's `enemy` field in learningData.js
 */

export const enemies = {
  'syntax-phantom': {
    id: 'syntax-phantom',
    name: 'Syntax Phantom',
    title: 'Error Wraith',
    health: 80,
    color: '#8b5cf6',
    description: 'A ghost born from runtime errors.',
  },
  'infinite-loop': {
    id: 'infinite-loop',
    name: 'Infinite Loop',
    title: 'The Endless Daemon',
    health: 100,
    color: '#ef4444',
    description: 'Trapped in recursion with no base case.',
  },
  'algebra-titan': {
    id: 'algebra-titan',
    name: 'Algebra Titan',
    title: 'The Equation Lord',
    health: 120,
    color: '#e2b857',
    description: 'Wields the power of unknown variables.',
  },
  'gravity-guardian': {
    id: 'gravity-guardian',
    name: 'Gravity Guardian',
    title: 'Force Field Warden',
    health: 120,
    color: '#38bdf8',
    description: 'Bends the laws of physics to its will.',
  },
};

// Subject-based special abilities triggered at 5+ combo
export const SUBJECT_ABILITIES = {
  programming: { name: 'SYNTAX SLASH',    color: '#8b5cf6', icon: '⚡' },
  mathematics:  { name: 'EQUATION BLAST', color: '#e2b857', icon: '🔥' },
  physics:      { name: 'GRAVITY IMPACT', color: '#38bdf8', icon: '💫' },
  'ai-ml':      { name: 'NEURAL STORM',   color: '#10b981', icon: '🧠' },
  default:      { name: 'POWER STRIKE',   color: '#8b5cf6', icon: '⚡' },
};
