import React, { useState } from 'react';
import { HeartPulse, Zap, TrophyFill, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { battleEngine } from '../../game-engine/battleEngine';
import { xpEngine } from '../../game-engine/xpEngine';
import { useAuth } from '../../context/AuthContext';
import { firestoreService } from '../../services/firestoreService';

const MOCK_QUESTIONS = {
  'Mathematics': [
    { q: 'What is the derivative of x^2?', options: ['2x', 'x', '2', 'x^2'], ans: '2x' },
    { q: 'Solve: 5x = 25', options: ['5', '10', '15', '20'], ans: '5' }
  ],
  'Programming': [
    { q: 'Which method adds an item to an array in JS?', options: ['push()', 'pop()', 'concat()', 'slice()'], ans: 'push()' },
    { q: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Text Machine Language', 'Hyper Loop', 'None'], ans: 'Hyper Text Markup Language' }
  ]
};

export default function QuizBattle({ subject, onExit }) {
  const { user, userProfile } = useAuth();
  const [battleState, setBattleState] = useState('fighting');
  const [enemyHp, setEnemyHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [combo, setCombo] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  const questions = MOCK_QUESTIONS[subject] || MOCK_QUESTIONS['Programming'];
  const currentQ = questions[questionIndex % questions.length];

  const handleAttack = async (selectedOption) => {
    const isCorrect = selectedOption === currentQ.ans;
    const playerLevel = userProfile?.progression?.level || 1;

    if (isCorrect) {
      const damage = battleEngine.calculateDamage(true, playerLevel, combo, 10);
      const newEnemyHp = Math.max(0, enemyHp - damage);
      setEnemyHp(newEnemyHp);
      setCombo(prev => prev + 1);
      
      if (newEnemyHp <= 0) {
        setBattleState('victory');
        // Grant XP to Firebase
        const xpGained = xpEngine.calculateReward('BATTLE_WIN', 1.0, combo * 10);
        const currentProgression = userProfile?.progression || { xp: 0, level: 1, streak: 0 };
        const newProgression = {
          ...currentProgression,
          xp: currentProgression.xp + xpGained
        };
        await firestoreService.updateUserStats(user.uid, newProgression);
      } else {
        setQuestionIndex(prev => prev + 1);
      }
    } else {
      const damage = battleEngine.calculatePlayerDamage(20, 5);
      const newPlayerHp = Math.max(0, playerHp - damage);
      setPlayerHp(newPlayerHp);
      setCombo(0);

      if (newPlayerHp <= 0) {
        setBattleState('defeat');
      } else {
        setQuestionIndex(prev => prev + 1);
      }
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="dashboard-grid-main" style={{ gridTemplateColumns: '1fr' }}>
        {/* Battle HUD */}
        <div className="premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px' }}>
          
          {/* Player Stats */}
          <div style={{ flex: 1 }}>
            <p className="stat-label">{userProfile?.fullName?.toUpperCase() || 'LEARNER'}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <HeartPulse color="var(--success)" />
              <div className="progress-bar-full" style={{ margin: 0, flex: 1, background: 'var(--overlay-20)', border: 'none' }}>
                <motion.div className="progress-bar-fill" style={{ background: 'var(--success)' }} animate={{ width: `${playerHp}%` }} />
              </div>
            </div>
          </div>

          <div style={{ padding: '0 40px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-dim)' }}>VS</div>
            {combo > 1 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: 'var(--secondary)', fontWeight: 800 }}>
                {combo}x COMBO!
              </motion.div>
            )}
          </div>

          {/* Enemy Stats */}
          <div style={{ flex: 1, textAlign: 'right' }}>
            <p className="stat-label" style={{ color: 'var(--error)' }}>{subject.toUpperCase()} BOSS</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexDirection: 'row-reverse' }}>
              <HeartPulse color="var(--error)" />
              <div className="progress-bar-full" style={{ margin: 0, flex: 1, background: 'var(--overlay-20)', border: 'none' }}>
                <motion.div className="progress-bar-fill" style={{ background: 'var(--error)' }} animate={{ width: `${enemyHp}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Combat Area */}
        <AnimatePresence mode="wait">
          {battleState === 'fighting' && (
            <motion.div key="fighting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="premium-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
              <h3 className="section-title" style={{ fontSize: '24px', marginBottom: '32px' }}>{currentQ.q}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '600px', margin: '0 auto' }}>
                {currentQ.options.map((opt, i) => (
                  <button key={i} className="btn-logout" style={{ padding: '20px', fontSize: '16px', justifyContent: 'center' }} onClick={() => handleAttack(opt)}>
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {battleState === 'victory' && (
            <motion.div key="victory" initial={{ scale: 0 }} animate={{ scale: 1 }} className="premium-card" style={{ textAlign: 'center', padding: '60px' }}>
              <TrophyFill size={64} style={{ color: 'var(--secondary)', marginBottom: '24px' }} />
              <h2 className="section-title" style={{ color: 'var(--secondary)', fontSize: '32px' }}>BOSS DEFEATED!</h2>
              <p style={{ marginTop: '16px' }}>XP Awarded and Synced to Profile!</p>
              <button className="btn-ai-action" style={{ width: 'auto', padding: '12px 32px', marginTop: '24px' }} onClick={onExit}>RETURN TO HUB</button>
            </motion.div>
          )}

          {battleState === 'defeat' && (
            <motion.div key="defeat" initial={{ scale: 0 }} animate={{ scale: 1 }} className="premium-card" style={{ textAlign: 'center', padding: '60px' }}>
              <Skull size={64} style={{ color: 'var(--error)', marginBottom: '24px' }} />
              <h2 className="section-title" style={{ color: 'var(--error)', fontSize: '32px' }}>SYSTEM FAILURE</h2>
              <button className="btn-logout" style={{ width: 'auto', padding: '12px 32px', marginTop: '24px', margin: '24px auto 0' }} onClick={onExit}>EXIT ARENA</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
