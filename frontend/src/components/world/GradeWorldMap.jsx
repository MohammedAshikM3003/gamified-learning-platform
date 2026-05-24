import React from 'react';
import { motion } from 'framer-motion';
import worldMap from '../../data/worldMap';
import './gradeWorldMap.css';

export default function GradeWorldMap({ onOpenWorld }) {
  return (
    <div className="grade-world-map">
      <h2>LearnCraft Worlds</h2>
      <div className="world-list">
        {worldMap.map((w) => (
          <motion.div
            key={w.grade}
            className="world-card"
            onClick={() => onOpenWorld?.(w)}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <div className="planet">{w.worldName}</div>
            <div className="meta">Grade {w.grade} — {w.theme}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
