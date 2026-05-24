import React from 'react';
import { motion } from 'framer-motion';

export default function SubjectKingdom({ kingdom, onOpenChapter }) {
  if (!kingdom) return null;

  return (
    <div className="subject-kingdom">
      <h3>{kingdom.kingdomName}</h3>
      <div className="chapters">
        {kingdom.chapters?.length ? (
          kingdom.chapters.map((ch) => (
            <motion.div
              key={ch.id}
              className="chapter-card"
              onClick={() => onOpenChapter?.(ch)}
              whileHover={{ scale: 1.02, x: 3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <div className="region">{ch.regionName}</div>
            </motion.div>
          ))
        ) : (
          <div className="empty">No chapters yet</div>
        )}
      </div>
    </div>
  );
}
