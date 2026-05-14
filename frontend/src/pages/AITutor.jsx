import React, { useState, useRef, useEffect } from 'react';
import { Cpu, Send, Zap, BookOpen, AlertTriangle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/UserProgressContext';
import { useAuth } from '../context/AuthContext';
import '../pages/dashboard.css';

// ── Gemini API call ──────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(systemPrompt, conversation) {
  // Build content array: system instruction + conversation history
  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Understood. I am your personalized LearnCraft mentor. Ready to assist.' }] },
    ...conversation.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))
  ];

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 512, temperature: 0.7 } })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || 'Gemini API error');
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate a response. Please try again.';
}

// ── Quick query prompts ──────────────────────────────────────
const QUICK_QUERIES = [
  { icon: BookOpen, label: 'Explain my weak topic', prompt: (weak) => `Explain ${weak || 'algebra'} simply with an example I can understand.` },
  { icon: Zap,      label: 'Give me a challenge',   prompt: (_, topic) => `Give me a tricky MCQ question about ${topic || 'programming loops'} with 4 options and the answer.` },
  { icon: Cpu,      label: 'Study plan for today',  prompt: (_, __, grade) => `Create a short 30-minute study plan for a ${grade || 'Grade 10'} student focused on improving quickly.` },
  { icon: AlertTriangle, label: 'Battle tips',      prompt: () => `Give me 3 tips to perform better in quiz battles and improve my combo streak.` },
];

export default function AITutor() {
  const { user } = useAuth();
  const {
    grade, mySubjectObjects, weakAreas, recommendedTopics,
    completedTopics, profile, progression
  } = useProgress();

  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: `Crafton AI initialized. I know your grade, subjects, weak areas, and battle history. Ask me anything — I'll give personalized guidance.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Build the system prompt with full user context
  const buildSystemPrompt = () => {
    const gradeLabel  = grade?.replace('grade', 'Grade ') || 'Grade 10';
    const subjects    = mySubjectObjects.map(s => s.label).join(', ') || 'Programming, Mathematics';
    const weak        = weakAreas.length > 0 ? weakAreas.join(', ') : 'none detected yet';
    const completed   = completedTopics.length > 0 ? completedTopics.join(', ') : 'none yet';
    const nextTopics  = recommendedTopics.map(t => t.title).join(', ') || 'just getting started';
    const level       = progression?.level || 1;
    const xp          = progression?.xp || 0;

    return `You are Crafton, an advanced AI tutor inside LearnCraft — a gamified learning platform.

STUDENT PROFILE:
- Name: ${user?.displayName || profile?.fullName || 'Learner'}
- Grade: ${gradeLabel}
- Level: ${level} (${xp} XP total)
- Active Subjects: ${subjects}
- Weak Areas: ${weak}
- Completed Topics: ${completed}
- Recommended Next: ${nextTopics}

YOUR ROLE:
- Be concise, encouraging, and educational
- Tailor ALL explanations to ${gradeLabel} level
- When explaining concepts, use simple analogies and examples
- When generating questions, include 4 MCQ options and the correct answer
- Use a slightly gamified, motivating tone — like a coach, not a textbook
- Keep responses under 200 words unless the student asks for more detail`;
  };

  const handleSend = async (overrideInput) => {
    const text = (overrideInput || input).trim();
    if (!text) return;

    const userMessage = { role: 'user', content: text };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput('');
    setIsTyping(true);
    setApiError('');

    try {
      // Only send non-system messages to Gemini
      const conversation = updated.filter(m => m.role !== 'system');

      let reply;
      if (GEMINI_API_KEY) {
        reply = await callGemini(buildSystemPrompt(), conversation);
      } else {
        // Fallback: no API key configured
        await new Promise(r => setTimeout(r, 1000));
        reply = `⚠️ No Gemini API key set. Add VITE_GEMINI_API_KEY to your .env file to enable real AI responses.\n\nYour question was: "${text}"`;
      }

      setMessages(prev => [...prev, { role: 'system', content: reply }]);
    } catch (err) {
      console.error('Gemini error:', err);
      setApiError(err.message);
      setMessages(prev => [...prev, {
        role: 'system',
        content: `Connection error: ${err.message}. Check your API key or network.`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuery = (queryFn) => {
    const weak  = weakAreas[0] || mySubjectObjects[0]?.label;
    const topic = recommendedTopics[0]?.title;
    const gradeLabel = grade?.replace('grade', 'Grade ') || 'Grade 10';
    const prompt = queryFn(weak, topic, gradeLabel);
    setInput(prompt);
    handleSend(prompt);
  };

  const clearChat = () => {
    setMessages([{ role: 'system', content: 'Chat cleared. Crafton AI ready. What would you like to learn?' }]);
    setApiError('');
  };

  return (
    <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 40px)' }}>

      {/* Header */}
      <header className="section-header" style={{ marginBottom: '24px' }}>
        <Cpu className="section-icon" />
        <h2 className="section-title">CRAFTON AI TUTOR</h2>
        <button
          onClick={clearChat}
          title="Clear chat"
          style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '6px 12px', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
        >
          <RotateCcw size={14} /> CLEAR
        </button>
      </header>

      {!GEMINI_API_KEY && (
        <div style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#ca8a04', fontFamily: 'Poppins, sans-serif' }}>
          ⚠️ <strong>API key missing.</strong> Add <code>VITE_GEMINI_API_KEY=your_key</code> to <code>frontend/.env</code> for real AI responses.
        </div>
      )}

      <div className="dashboard-grid-main" style={{ flex: 1, overflow: 'hidden', gridTemplateColumns: '1fr 320px' }}>

        {/* Chat Panel */}
        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px', paddingRight: '4px' }}>
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.role === 'user' ? 'var(--gradient-primary)' : 'var(--overlay-10)',
                    border: `1px solid ${msg.role === 'user' ? 'transparent' : 'var(--color-border)'}`,
                    padding: '14px 18px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    maxWidth: '82%',
                    color: 'white',
                    boxShadow: msg.role === 'user' ? 'var(--shadow-glow)' : 'none',
                  }}
                >
                  {msg.role === 'system' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Cpu size={14} style={{ color: 'var(--secondary)' }} />
                      <span style={{ fontSize: '11px', color: 'var(--secondary)', fontWeight: 700, letterSpacing: '1px' }}>CRAFTON AI</span>
                    </div>
                  )}
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap', fontFamily: 'Poppins, sans-serif' }}>
                    {msg.content}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ alignSelf: 'flex-start', padding: '14px 18px', background: 'var(--overlay-10)', border: '1px solid var(--color-border)', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: '6px' }}
              >
                {[0, 1, 2].map(i => (
                  <motion.div key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                    style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }}
                  />
                ))}
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask Crafton anything about your subjects..."
              disabled={isTyping}
              style={{
                flex: 1,
                background: 'var(--overlay-10)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              style={{
                background: isTyping ? 'var(--overlay-10)' : 'var(--gradient-gold)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0 24px',
                color: isTyping ? 'var(--text-dim)' : 'black',
                cursor: isTyping ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>

          {/* Student Context Card */}
          <div className="premium-card" style={{ padding: '20px' }}>
            <div className="section-header" style={{ marginBottom: '16px' }}>
              <Cpu className="section-icon" style={{ color: 'var(--primary)' }} />
              <h3 className="section-title" style={{ fontSize: '14px' }}>YOUR PROFILE</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Grade', val: grade?.replace('grade', 'Grade ') || '—' },
                { label: 'Level', val: `${progression?.level || 1} (${progression?.xp || 0} XP)` },
                { label: 'Subjects', val: mySubjectObjects.map(s => s.label).join(', ') || '—' },
                { label: 'Weak Areas', val: weakAreas.length > 0 ? weakAreas.join(', ') : 'None yet' },
                { label: 'Completed', val: `${completedTopics.length} topics` },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="stat-label" style={{ fontSize: '11px' }}>{label}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Queries */}
          <div className="premium-card" style={{ padding: '20px' }}>
            <div className="section-header" style={{ marginBottom: '16px' }}>
              <Zap className="section-icon" />
              <h3 className="section-title" style={{ fontSize: '14px' }}>QUICK QUERIES</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {QUICK_QUERIES.map(({ icon: Icon, label, prompt }) => (
                <button
                  key={label}
                  onClick={() => handleQuickQuery(prompt)}
                  disabled={isTyping}
                  style={{
                    background: 'var(--overlay-10)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: 'var(--text-secondary)',
                    cursor: isTyping ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                  <Icon size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Topics */}
          {recommendedTopics.length > 0 && (
            <div className="premium-card" style={{ padding: '20px' }}>
              <div className="section-header" style={{ marginBottom: '16px' }}>
                <BookOpen className="section-icon" style={{ color: 'var(--secondary)' }} />
                <h3 className="section-title" style={{ fontSize: '14px' }}>ASK ABOUT</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recommendedTopics.slice(0, 3).map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(`Explain "${topic.title}" in a simple way for a ${grade?.replace('grade', 'Grade ')} student.`)}
                    disabled={isTyping}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontFamily: 'Poppins, sans-serif',
                      textAlign: 'left',
                    }}
                  >
                    📚 {topic.title}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
