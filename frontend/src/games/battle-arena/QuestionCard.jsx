import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

export default function QuestionCard({ question, onAnswer, disabled }) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  const handleSelect = (option) => {
    if (disabled || selected) return;
    const isCorrect = option === question.answer;
    setSelected(option);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      onAnswer(isCorrect, option);
      setSelected(null);
      setFeedback(null);
    }, 900);
  };

  return (
    <div style={{
      background: 'rgba(10, 10, 12, 0.8)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '40px',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.h3
          key={question.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center', marginBottom: '32px', lineHeight: 1.4 }}
        >
          {question.question}
        </motion.h3>
      </AnimatePresence>

      {/* Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {question.options.map((option, i) => {
          const isSelected = selected === option;
          const isCorrect = option === question.answer;
          let borderColor = 'rgba(255,255,255,0.08)';
          let bg = 'rgba(255,255,255,0.04)';

          if (isSelected) {
            borderColor = feedback === 'correct' ? 'var(--success)' : 'var(--error)';
            bg = feedback === 'correct' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)';
          } else if (selected && isCorrect) {
            borderColor = 'var(--success)';
            bg = 'rgba(16,185,129,0.1)';
          }

          return (
            <motion.button
              key={i}
              whileHover={!selected ? { scale: 1.02, borderColor: 'var(--primary)' } : {}}
              whileTap={!selected ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(option)}
              disabled={!!selected || disabled}
              style={{
                padding: '16px 20px',
                border: `1px solid ${borderColor}`,
                borderRadius: '12px',
                background: bg,
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: selected ? 'default' : 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s ease',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              <span style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '12px', fontWeight: 700,
              }}>
                {['A', 'B', 'C', 'D'][i]}
              </span>
              {option}
              {isSelected && (
                feedback === 'correct'
                  ? <CheckCircle size={16} color="var(--success)" style={{ marginLeft: 'auto' }} />
                  : <XCircle size={16} color="var(--error)" style={{ marginLeft: 'auto' }} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation (shows briefly after answer) */}
      <AnimatePresence>
        {selected && question.explanation && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginTop: '20px',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '10px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              borderLeft: `3px solid ${feedback === 'correct' ? 'var(--success)' : 'var(--error)'}`,
            }}
          >
            {question.explanation}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
