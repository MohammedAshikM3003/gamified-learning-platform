import React, { useState } from 'react';
import { Cpu, Send, Zap, BookOpen, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import '../pages/dashboard.css';

export default function AITutor() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Onyx OS AI initialized. How can I assist your progression today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      setMessages([...newMessages, { 
        role: 'system', 
        content: `I've analyzed your query regarding "${input}". Based on your learning curve, here is a breakdown...` 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      <header className="section-header">
        <Cpu className="section-icon" />
        <h2 className="section-title">ONYX AI CONSOLE</h2>
      </header>
      
      <div className="dashboard-grid-main" style={{ flex: 1, gridTemplateColumns: '1fr 350px' }}>
        
        {/* Chat Interface */}
        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
          <div className="chat-history" style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx} 
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' ? 'var(--gradient-primary)' : 'var(--overlay-10)',
                  border: `1px solid ${msg.role === 'user' ? 'transparent' : 'var(--color-border)'}`,
                  padding: '16px 20px',
                  borderRadius: '16px',
                  maxWidth: '80%',
                  color: 'white',
                  boxShadow: msg.role === 'user' ? 'var(--shadow-glow)' : 'none'
                }}
              >
                {msg.role === 'system' && <Cpu size={16} style={{ marginBottom: '8px', color: 'var(--secondary)' }} />}
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{msg.content}</p>
              </motion.div>
            ))}
            {isTyping && (
              <div style={{ padding: '16px', color: 'var(--text-dim)', fontSize: '12px', textTransform: 'uppercase' }}>
                Onyx is processing...
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query the system..."
              style={{
                flex: 1,
                background: 'var(--overlay-10)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
            <button 
              onClick={handleSend}
              style={{
                background: 'var(--gradient-gold)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0 24px',
                color: 'black',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="premium-card" style={{ padding: '20px' }}>
            <div className="section-header" style={{ marginBottom: '16px' }}>
              <AlertTriangle className="section-icon" style={{ color: 'var(--error)' }} />
              <h3 className="section-title" style={{ fontSize: '16px' }}>WEAKNESS DETECTED</h3>
            </div>
            <p className="stat-label">SUBJECT: ALGEBRA</p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Your accuracy dropped by 15% in the last 3 battles. I have compiled a custom drill.
            </p>
            <button className="btn-ai-action" style={{ padding: '10px', fontSize: '12px', marginTop: '16px' }}>
              INITIATE DRILL
            </button>
          </div>

          <div className="premium-card" style={{ padding: '20px' }}>
            <div className="section-header" style={{ marginBottom: '16px' }}>
              <Zap className="section-icon" />
              <h3 className="section-title" style={{ fontSize: '16px' }}>QUICK QUERIES</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="btn-logout" onClick={() => setInput('Explain Quantum Physics simply')} style={{ width: '100%', justifyContent: 'flex-start' }}>
                <BookOpen size={14} /> Explain Quantum
              </button>
              <button className="btn-logout" onClick={() => setInput('Generate a coding challenge')} style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Cpu size={14} /> Coding Challenge
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
