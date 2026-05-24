import React, { useMemo } from 'react';
import { Map, Lock, Unlock, Crosshair, Skull, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/UserProgressContext';
import { getChaptersBySubject } from '../data/learningData';
import '../pages/dashboard.css';

export default function QuestMap() {
  const navigate = useNavigate();
  const { grade, mySubjectObjects, isTopicUnlocked, isTopicCompleted } = useProgress();

  // Build the dynamic worlds based on user's active subjects and their topics
  const worlds = useMemo(() => {
    return mySubjectObjects.map((subject, index) => {
      // Get all topics for this subject across all its chapters
      const chapters = getChaptersBySubject(grade, subject.id);
      const allTopics = [];
      for (const chapter of Object.values(chapters)) {
        if (chapter.topics) {
          allTopics.push(...chapter.topics);
        }
      }

      // Calculate progress
      const completedCount = allTopics.filter(t => isTopicCompleted(t.id)).length;
      const totalCount = allTopics.length;
      
      let status = 'locked';
      if (totalCount === 0) {
        status = 'locked';
      } else if (completedCount === totalCount) {
        status = 'completed';
      } else {
        status = 'active'; // If there's at least one topic and it's not all done
      }

      // Generate nodes for the UI based on topics
      const nodes = allTopics.map(topic => ({
        id: topic.id,
        isCompleted: isTopicCompleted(topic.id),
        isUnlocked: isTopicUnlocked(topic.id),
      }));

      return {
        id: subject.id,
        name: subject.label.toUpperCase(),
        color: subject.color,
        status,
        nodes,
        totalCount,
        completedCount,
        isBoss: false // Could be enhanced later to check for actual boss topics
      };
    });
  }, [grade, mySubjectObjects, isTopicUnlocked, isTopicCompleted]);

  return (
    <div className="dashboard-content">
      <header className="section-header">
        <Map className="section-icon" />
        <h2 className="section-title">GLOBAL QUEST ROADMAP</h2>
      </header>
      
      <div className="premium-card" style={{ minHeight: '600px', position: 'relative', overflow: 'hidden', padding: '60px 40px' }}>
        {/* Decorative Grid Background */}
        <div style={{
          position: 'absolute', inset: 0, 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '60px' }}>
          {worlds.length === 0 ? (
             <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '40px' }}>
                No active quests found. Please select subjects in your profile.
             </div>
          ) : (
            worlds.map((world, idx) => (
              <motion.div 
                key={world.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                style={{ display: 'flex', alignItems: 'center', gap: '40px' }}
              >
                {/* World Icon */}
                <div style={{
                  width: '80px', height: '80px', borderRadius: '20px',
                  background: world.status === 'completed' ? 'var(--overlay-20)' : 
                              world.status === 'active' ? world.color : 'var(--overlay-10)',
                  border: `2px solid ${world.status === 'active' ? world.color : 'var(--color-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: world.status === 'active' ? `0 0 20px ${world.color}80` : 'none',
                  position: 'relative'
                }}>
                  {world.status === 'locked' || world.totalCount === 0 ? (
                    <Lock color="var(--text-dim)" />
                  ) : world.status === 'completed' ? (
                    <Unlock color="white" />
                  ) : (
                    <BookOpen color="white" />
                  )}
                  
                  {world.status === 'active' && (
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      style={{ position: 'absolute', inset: -4, border: `2px solid ${world.color}`, borderRadius: '24px' }}
                    />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <p className="stat-label">WORLD {idx + 1}</p>
                  <h3 className="section-title" style={{ fontSize: '24px', color: world.status === 'locked' ? 'var(--text-dim)' : 'white' }}>
                    {world.name}
                  </h3>
                  
                  {/* Topic Nodes Graph */}
                  {world.nodes.length > 0 ? (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                      {world.nodes.map((node, i) => (
                        <div 
                          key={node.id} 
                          title={node.id}
                          style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: node.isCompleted ? 'var(--success)' : 
                                        node.isUnlocked ? world.color : 'var(--overlay-20)',
                            border: '2px solid var(--color-bg)',
                            boxShadow: node.isUnlocked && !node.isCompleted ? `0 0 10px ${world.color}` : 'none',
                            cursor: node.isUnlocked ? 'pointer' : 'not-allowed',
                            opacity: node.isUnlocked ? 1 : 0.5
                          }} 
                          onClick={() => {
                            if (node.isUnlocked && !node.isCompleted) {
                                navigate(`/topics/${node.id}`);
                            }
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '8px' }}>Coming Soon</p>
                  )}
                </div>

                {world.status === 'active' && (
                  <button 
                    className="btn-ai-action" 
                    onClick={() => navigate(`/subjects/${world.id}`)}
                    style={{ width: 'auto', padding: '12px 32px', background: world.color, color: '#000', border: 'none' }}
                  >
                    <Crosshair size={16} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}/>
                    EXPLORE
                  </button>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
