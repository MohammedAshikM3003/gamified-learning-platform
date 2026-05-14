import React from 'react';
import { Map, Lock, Unlock, Crosshair, Skull } from 'lucide-react';
import { motion } from 'framer-motion';
import '../pages/dashboard.css';

const WORLDS = [
  { id: 1, name: 'BASICS', status: 'completed', nodes: 4 },
  { id: 2, name: 'INTERMEDIATE', status: 'active', nodes: 5 },
  { id: 3, name: 'ADVANCED', status: 'locked', nodes: 6 },
  { id: 4, name: 'MASTERY', status: 'locked', nodes: 3, isBoss: true },
];

export default function QuestMap() {
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
          {WORLDS.map((world, idx) => (
            <motion.div 
              key={world.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '40px' }}
            >
              <div style={{
                width: '80px', height: '80px', borderRadius: '20px',
                background: world.status === 'completed' ? 'var(--overlay-20)' : 
                            world.status === 'active' ? 'var(--gradient-primary)' : 'var(--overlay-10)',
                border: `2px solid ${world.status === 'active' ? 'var(--primary)' : 'var(--color-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: world.status === 'active' ? 'var(--shadow-glow)' : 'none',
                position: 'relative'
              }}>
                {world.isBoss ? <Skull color={world.status === 'locked' ? 'var(--text-dim)' : 'white'} /> : 
                 world.status === 'locked' ? <Lock color="var(--text-dim)" /> : <Unlock color="white" />}
                
                {world.status === 'active' && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ position: 'absolute', inset: -4, border: '2px solid var(--primary)', borderRadius: '24px' }}
                  />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <p className="stat-label">WORLD {world.id}</p>
                <h3 className="section-title" style={{ fontSize: '24px', color: world.status === 'locked' ? 'var(--text-dim)' : 'white' }}>
                  {world.name}
                </h3>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  {Array.from({ length: world.nodes }).map((_, i) => (
                    <div key={i} style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: world.status === 'completed' ? 'var(--success)' : 
                                  (world.status === 'active' && i === 2) ? 'var(--secondary)' : 'var(--overlay-20)',
                      border: '2px solid var(--color-bg)',
                      boxShadow: (world.status === 'active' && i === 2) ? 'var(--shadow-glow-gold)' : 'none'
                    }} />
                  ))}
                </div>
              </div>

              {world.status === 'active' && (
                <button className="btn-ai-action" style={{ width: 'auto', padding: '12px 32px' }}>
                  <Crosshair size={16} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}/>
                  ENGAGE
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
