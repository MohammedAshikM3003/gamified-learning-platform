import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTopicById, learningData } from '../data/learningData';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './dashboard.css';

// ============================================================================
// AUDIO SYNTHESIZER ENGINE (Zero External Dependencies)
// ============================================================================
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  play(type) {
    if (this.muted) return;
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    switch (type) {
      case 'slice':
        this.slideFreq(900, 200, 0.18, 'triangle', 0.2);
        this.slideFreq(1400, 400, 0.12, 'sine', 0.1);
        break;
      case 'chime':
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          this.triggerTone(freq, now + idx * 0.08, 0.25, 'sine', 0.15);
        });
        break;
      case 'snap':
        this.slideFreq(200, 700, 0.06, 'triangle', 0.25);
        this.slideFreq(400, 150, 0.08, 'sine', 0.15);
        break;
      case 'success':
        {
          const majorChord = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
          majorChord.forEach((freq, idx) => {
            this.triggerTone(freq, now + idx * 0.06, 0.6, 'triangle', 0.12);
          });
        }
        break;
      case 'wrong':
        this.slideFreq(260, 130, 0.4, 'sawtooth', 0.18);
        break;
      case 'pop':
        this.slideFreq(350, 550, 0.06, 'sine', 0.15);
        break;
      default:
        break;
    }
  }

  triggerTone(freq, start, duration, type = 'sine', volume = 0.2) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    
    osc.start(start);
    osc.stop(start + duration);
  }

  slideFreq(start, end, duration, type = 'sine', volume = 0.2) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = type;
    osc.frequency.setValueAtTime(start, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(end, this.ctx.currentTime + duration);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
}

const sfx = new AudioEngine();

const buildKaraokeTokens = (text = '') => {
  const normalizedText = String(text)
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalizedText) return [];

  const tokens = [];
  const tokenRegex = /\S+/g;
  let match;

  while ((match = tokenRegex.exec(normalizedText)) !== null) {
    tokens.push({
      text: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return tokens;
};

// ============================================================================
// COMPONENT IMPLEMENTATION
// ============================================================================
export default function FractionGame() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const fromPath = new URLSearchParams(location.search).get('from');
  const topicId = fromPath && fromPath.startsWith('/topics/') ? fromPath.replace('/topics/', '') : null;
  const topic = topicId ? getTopicById(topicId) : null;
  const grade = userProfile?.profile?.grade || topic?.gradeId || 'grade10';
  const subject = topic?.subjectId ? (learningData[grade]?.subjects?.[topic.subjectId] || null) : null;
  const videoPagePath = fromPath || (topicId ? `/topics/${topicId}` : '/subjects');

  // Global States
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scoreXP, setScoreXP] = useState(0);
  const [clickTracker, setClickTracker] = useState({ correct: 0, total: 0 });
  const [currentDifficulty] = useState('normal');
  const [voiceGender] = useState('female');
  const [talking, setTalking] = useState(false);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const [subtitleOverrideText, setSubtitleOverrideText] = useState('');
  const [auraGlowing, setAuraGlowing] = useState(false);
  const [pippaWiggling, setPippaWiggling] = useState(false);

  // Canvas and TTS refs
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const fallbackTimerRef = useRef(null);
  const mouthTimerRef = useRef(null);
  const speechCleanupRef = useRef(false);

  const displayKaraokeSubtitles = (text) => {
    setSubtitleOverrideText(text || '');
    setHighlightedWordIndex(-1);
  };

  // Subtitle synchronization tracker
  const subtitleWords = buildKaraokeTokens(subtitleOverrideText || PLAYGROUND_SLIDES[currentSlide]?.vo || '');

  // Initialize Canvas Particles Loop
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const drawLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameRef.current = requestAnimationFrame(drawLoop);
        return;
      }
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        p.dy += p.gravity;
        p.rotation += p.rotSpeed;
        p.life -= p.decay;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        if (p.life <= 0 || p.y > canvas.height) {
          particles.splice(i, 1);
        }
      }
      animFrameRef.current = requestAnimationFrame(drawLoop);
    };
    drawLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Sync Narrator Line Voiceover on slide change
  useEffect(() => {
    triggerNarratorLine();
    return () => {
      stopNarratorLine();
    };
  }, [currentSlide]);

  useEffect(() => {
    const hiddenControls = [];

    const hidePlayVideoControls = () => {
      const controls = Array.from(document.querySelectorAll('button, a, [role="button"]'));
      for (const control of controls) {
        const text = (control.textContent || '').trim().toLowerCase();
        if (text === 'play video' && !control.closest('.fraction-game-shell') && !control.dataset.lcHiddenByFractionGame) {
          hiddenControls.push({
            control,
            display: control.style.display,
            visibility: control.style.visibility,
            pointerEvents: control.style.pointerEvents,
          });
          control.dataset.lcHiddenByFractionGame = '1';
          control.style.display = 'none';
          control.style.visibility = 'hidden';
          control.style.pointerEvents = 'none';
        }
      }
    };

    hidePlayVideoControls();
    const observer = new MutationObserver(() => hidePlayVideoControls());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      for (const item of hiddenControls) {
        delete item.control.dataset.lcHiddenByFractionGame;
        item.control.style.display = item.display;
        item.control.style.visibility = item.visibility;
        item.control.style.pointerEvents = item.pointerEvents;
      }
    };
  }, []);

  // Spark visual particle bursts
  const spawnBurst = (x, y, count = 30) => {
    const targetColors = ['#8b5cf6', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      particlesRef.current.push({
        x: x,
        y: y,
        size: Math.random() * 6 + 4,
        color: targetColors[Math.floor(Math.random() * targetColors.length)],
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed - 2,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 10 - 5,
        gravity: 0.25,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.015
      });
    }
  };

  const spawnConfetti = () => {
    const colors = ['#8b5cf6', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#58cc02', '#ff4b4b'];
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : window.innerWidth;
    for (let i = 0; i < 120; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: -20 - (Math.random() * 100),
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        dx: Math.random() * 4 - 2,
        dy: Math.random() * 6 + 4,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 8 - 4,
        gravity: 0.1,
        life: 1.0,
        decay: 0.005
      });
    }
  };

  // Record Click Outcomes
  const recordClick = (isCorrect) => {
    setClickTracker(prev => {
      const nextCorrect = isCorrect ? prev.correct + 1 : prev.correct;
      const nextTotal = prev.total + 1;
      return { correct: nextCorrect, total: nextTotal };
    });
  };

  // XP calculations for LearnCraft OS Game Engine
  const calculateLearnCraftXP = (baseXP) => {
    const typeMultiplier = 1.3; // puzzle-mode
    const accuracy = clickTracker.total > 0 ? (clickTracker.correct / clickTracker.total) : 1.0;
    
    let accuracyBonus = accuracy > 0.95 ? 1.4 : accuracy > 0.9 ? 1.3 : accuracy > 0.8 ? 1.2 : accuracy > 0.7 ? 1.1 : accuracy > 0.5 ? 1.0 : 0.7;
    
    const difficultyMultipliers = { easy: 0.7, normal: 1.0, hard: 1.5, expert: 2.0 };
    const difficultyBonus = difficultyMultipliers[currentDifficulty] || 1.0;
    
    return Math.max(10, Math.round(baseXP * typeMultiplier * accuracyBonus * difficultyBonus));
  };

  const triggerAwardXP = (amount) => {
    setScoreXP(prev => prev + amount);
  };

  // Text-To-Speech (TTS) Execution & Visual Mouth Sync
  const stopNarratorLine = () => {
    speechCleanupRef.current = true;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setTalking(false);
    setHighlightedWordIndex(-1);
    setSubtitleOverrideText('');
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    if (mouthTimerRef.current) clearTimeout(mouthTimerRef.current);
    resetMouth();
  };

  const triggerNarratorLine = (customText = null, onEnd = null) => {
    stopNarratorLine();
    speechCleanupRef.current = false;
    
    const textToSpeak = customText || PLAYGROUND_SLIDES[currentSlide]?.vo;
    const karaokeTokens = buildKaraokeTokens(textToSpeak);
    if (customText) {
      setSubtitleOverrideText(textToSpeak);
    }
    setTalking(true);
    setAuraGlowing(true);

    if (!window.speechSynthesis) {
      speakSimulatedFallback(textToSpeak, onEnd);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = voiceGender === 'female' ? 1.35 : 0.95;

    const voices = window.speechSynthesis.getVoices();
    let desiredVoice = null;
    if (voiceGender === 'female') {
      desiredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira')));
    } else {
      desiredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('David') || v.name.includes('Hazel')));
    }
    if (desiredVoice) utterance.voice = desiredVoice;

    utterance.onboundary = (event) => {
      const charIndex = typeof event.charIndex === 'number' ? event.charIndex : -1;
      if (charIndex < 0 || karaokeTokens.length === 0) return;

      const activeIdx = karaokeTokens.findIndex((token, index) => {
        const isLastToken = index === karaokeTokens.length - 1;
        return charIndex >= token.start && (charIndex < token.end || (isLastToken && charIndex <= token.end + 1));
      });

      if (activeIdx !== -1) {
        setHighlightedWordIndex(activeIdx);
      }
    };

    utterance.onstart = () => {
      animateMouthLoop();
    };

    const cleanUpSpeak = () => {
      if (speechCleanupRef.current) return;
      speechCleanupRef.current = true;
      setTalking(false);
      setAuraGlowing(false);
      setHighlightedWordIndex(-1);
      resetMouth();
      if (onEnd) onEnd();
    };

    utterance.onend = cleanUpSpeak;
    utterance.onerror = cleanUpSpeak;

    // Safety timeout to prevent lockup
    const estimatedDurationMs = (textToSpeak.length * 85) + 1200;
    fallbackTimerRef.current = setTimeout(() => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      cleanUpSpeak();
    }, estimatedDurationMs);

    window.speechSynthesis.speak(utterance);
  };

  const speakSimulatedFallback = (text, onEnd) => {
    animateMouthLoop();
    const tokens = buildKaraokeTokens(text);
    const totalDuration = Math.max(1200, text.length * 55);
    const totalWeight = tokens.reduce((sum, token) => sum + Math.max(1, token.text.length), 0) || 1;

    let elapsed = 0;
    const timers = [];

    tokens.forEach((token, index) => {
      const weight = Math.max(1, token.text.length);
      const tokenDuration = Math.max(160, Math.round((totalDuration * weight) / totalWeight));
      const timer = setTimeout(() => {
        if (speechCleanupRef.current) return;
        setHighlightedWordIndex(index);
      }, elapsed);
      timers.push(timer);
      elapsed += tokenDuration;
    });

    fallbackTimerRef.current = setTimeout(() => {
      timers.forEach(clearTimeout);
      if (speechCleanupRef.current) return;
      speechCleanupRef.current = true;
      setTalking(false);
      setAuraGlowing(false);
      setHighlightedWordIndex(-1);
      resetMouth();
      if (onEnd) onEnd();
    }, Math.max(totalDuration, elapsed) + 120);
  };

  const animateMouthLoop = () => {
    const mouth = document.getElementById('pippa-mouth');
    if (mouth) {
      const shapes = [
        "M 88,104 Q 100,122 112,104 Z", 
        "M 92,104 Q 100,110 108,104 Z", 
        "M 90,104 Q 100,132 110,104 Z", 
        "M 94,106 Q 100,118 106,106 Z"  
      ];
      mouth.setAttribute('d', shapes[Math.floor(Math.random() * shapes.length)]);
    }
    mouthTimerRef.current = setTimeout(() => {
      animateMouthLoop();
    }, 120);
  };

  const resetMouth = () => {
    const mouth = document.getElementById('pippa-mouth');
    if (mouth) mouth.setAttribute('d', "M 88,104 Q 100,122 112,104 Z");
  };

  // Touch/Tap on Pippa body wiggles her character
  const handlePippaClick = (e) => {
    sfx.play('chime');
    setPippaWiggling(true);
    setTimeout(() => setPippaWiggling(false), 800);
    
    // Spawn cosmetic particles
    const rect = e.currentTarget.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
    
    triggerNarratorLine();
  };

  const handleNext = () => {
    sfx.play('pop');
    if (currentSlide < PLAYGROUND_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleBack = () => {
    sfx.play('pop');
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const accuracyPercent = clickTracker.total > 0 
    ? Math.round((clickTracker.correct / clickTracker.total) * 100) 
    : 100;

  return (
    <div className="fraction-game-shell dashboard-content text-slate-100 min-h-screen overflow-x-hidden flex flex-col justify-between select-none relative pb-8">
      {/* Inline styles for custom keyframes and variables support */}
      <style>{`
        .fraction-game-shell {
          --primary: #8b5cf6;
          --secondary: #f59e0b;
          --error: #ef4444;
          --success: #10b981;
          --bg-primary: #0a0a0c;
          --glass-bg: rgba(10, 10, 12, 0.85);
          --border-color: rgba(255, 255, 255, 0.08);
          --duolingo-green: #58cc02;
          --duolingo-red: #ff4b4b;
          --streak-orange: #ff9600;
          font-family: 'Poppins', sans-serif;
        }
        .fraction-game-shell.dashboard-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 30px;
          position: relative;
          z-index: 1;
          box-sizing: border-box;
        }
        .fraction-game-headerbar {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
        }
        .fraction-game-stage {
          width: 100%;
          background: rgba(2, 6, 23, 0.85);
          border: 1px solid var(--color-border, rgba(255,255,255,0.1));
          border-radius: 28px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 540px;
          box-shadow: var(--shadow-lg, 0 16px 40px rgba(0,0,0,0.35));
        }
        .fraction-game-workspace {
          flex: 1;
          display: flex;
          gap: 24px;
          align-items: stretch;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
        }
        .fraction-game-left {
          width: 35%;
          min-width: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .fraction-game-right {
          width: 65%;
          min-height: 380px;
        }
        .font-title {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
        }
        .glass-panel {
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-color);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .glass-card-interactive {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-card-interactive:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: var(--primary);
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(139, 92, 246, 0.15);
        }
        .btn-chunky {
          position: relative;
          transition: all 0.1s ease;
          border-bottom-width: 4px;
        }
        .btn-chunky:active {
          transform: translateY(3px);
          border-bottom-width: 1px;
        }
        .word-highlight {
          color: var(--secondary);
          text-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
          font-weight: 700;
          transition: all 0.15s ease;
          transform: scale(1.05);
          display: inline-block;
        }
        @keyframes floating {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-float {
          animation: floating 4s ease-in-out infinite;
        }
        @keyframes shake-wrong {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-8px); }
          30%, 60%, 90% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake-wrong 0.5s ease-in-out;
        }
        .pizza-slice-transition {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
        }
        @media (max-width: 1024px) {
          .fraction-game-workspace {
            flex-direction: column;
          }
          .fraction-game-left,
          .fraction-game-right {
            width: 100%;
            min-width: 0;
          }
        }
        @media (max-width: 768px) {
          .fraction-game-shell.dashboard-content {
            padding: 20px;
          }
          .fraction-game-headerbar {
            justify-content: flex-start;
          }
          .fraction-game-workspace {
            padding: 16px;
            gap: 16px;
          }
        }
      `}</style>

      <div style={{ marginBottom: '20px', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <button
            onClick={() => navigate(videoPagePath)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '13px' }}
          >
            <ChevronLeft size={16} /> Subjects
          </button>
          <span style={{ color: 'var(--text-dim)' }}>/</span>
          <span style={{ fontSize: '13px', color: subject?.color || 'var(--primary)' }}>{subject?.title || 'Mathematics'}</span>
          <span style={{ color: 'var(--text-dim)' }}>/</span>
          <span style={{ fontSize: '13px' }}>{topic?.title || 'Understanding Fractions'}</span>
        </div>

        <h1 style={{ fontSize: '38px', fontWeight: 800, margin: '6px 0 20px' }}>
          {topic?.title || 'Understanding Fractions'}
        </h1>
      </div>

      {/* Dynamic Celebration Overlay Particles */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />

      {/* Navigation & Header Status Indicators */}
      <header className="fraction-game-headerbar px-4 pt-2 z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 animate-bounce-gentle">
            <span className="text-2xl">🍕</span>
          </div>
          <div>
            <h1 className="font-title text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-amber-300 tracking-wide drop-shadow">
              Pippa's Fractions
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">LearnCraft OS Game Suite</p>
          </div>
        </div>

      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-3 flex flex-col justify-start items-center z-10">
        <div className="fraction-game-stage backdrop-blur-xl relative">
          
          {/* Progress Path trackers */}
          <div className="w-full bg-slate-950/40 px-6 py-3.5 border-b border-white/5 flex flex-wrap justify-between items-center gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse"></span>
              <span className="text-slate-400 font-bold uppercase tracking-wider">Lesson Progress:</span>
              <span className="text-yellow-400 font-bold font-title">
                {PLAYGROUND_SLIDES[currentSlide]?.title}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-slate-400">
                Accuracy: <span className={`${accuracyPercent >= 85 ? 'text-emerald-400' : accuracyPercent >= 50 ? 'text-amber-400' : 'text-rose-400'} font-bold`}>{accuracyPercent}%</span>
              </span>
            </div>
          </div>

          {/* Interactive Screen Grid Split */}
          <div className="fraction-game-workspace">
            
            {/* Pippa Vector Guide Column */}
            <div className="fraction-game-left">
              <div className="relative w-44 h-44 md:w-52 md:h-52 flex items-center justify-center bg-slate-900/40 rounded-full border border-white/5 shadow-inner">
                {/* Aura shadow effect */}
                <div className={`absolute inset-2 bg-purple-600/10 rounded-full blur-2xl transition-all duration-1000 ${auraGlowing ? 'scale-110 opacity-100' : 'scale-95 opacity-50'}`} />

                {/* Vector Pippa character */}
                <svg
                  onClick={handlePippaClick}
                  className={`w-[85%] h-[85%] cursor-pointer select-none z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 ${pippaWiggling ? 'animate-wiggle scale-105' : 'hover:scale-105 active:scale-95'}`}
                  viewBox="0 0 200 200"
                >
                  <defs>
                    <radialGradient id="crust" cx="50%" cy="50%" r="50%">
                      <stop offset="60%" stopColor="#E28F1E"/>
                      <stop offset="100%" stopColor="#9E5400"/>
                    </radialGradient>
                    <radialGradient id="cheese" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFF59D"/>
                      <stop offset="75%" stopColor="#FFD54F"/>
                      <stop offset="100%" stopColor="#F57C00"/>
                    </radialGradient>
                  </defs>
                  
                  <ellipse cx="100" cy="180" rx="60" ry="10" fill="#000" opacity="0.4" />
                  
                  <g id="pippa-body-grp" className="origin-center">
                    <circle cx="100" cy="95" r="75" fill="url(#crust)" stroke="#78350f" strokeWidth="3"/>
                    <circle cx="100" cy="95" r="66" fill="url(#cheese)"/>
                    
                    {/* toppings */}
                    <circle cx="65" cy="65" r="11" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5"/>
                    <circle cx="135" cy="70" r="10" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5"/>
                    <circle cx="70" cy="125" r="12" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5"/>
                    <circle cx="125" cy="125" r="11" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5"/>
                    <circle cx="100" cy="145" r="9" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5"/>
                    <circle cx="100" cy="50" r="8" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5"/>
                    
                    <path d="M52,90 Q44,82 52,74" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M145,100 Q153,92 145,84" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round"/>
                    
                    <g id="pippa-eyes">
                      <circle cx="76" cy="88" r="9" fill="#fff"/>
                      <circle cx="78" cy="87" r="5" fill="#0f172a"/>
                      <circle cx="76" cy="85" r="2.5" fill="#fff"/>
                      
                      <circle cx="124" cy="88" r="9" fill="#fff"/>
                      <circle cx="122" cy="87" r="5" fill="#0f172a"/>
                      <circle cx="120" cy="85" r="2.5" fill="#fff"/>
                      
                      <ellipse cx="62" cy="99" rx="8" ry="4" fill="#f472b6" opacity="0.6"/>
                      <ellipse cx="138" cy="99" rx="8" ry="4" fill="#f472b6" opacity="0.6"/>
                    </g>
                    
                    {/* Animated Mouth */}
                    <path id="pippa-mouth" d="M 88,104 Q 100,120 112,104 Z" fill="#991b1b" stroke="#0f172a" strokeWidth="2.5" />
                    
                    <path d="M 80,26 C 72,8 128,8 120,26 C 132,26 132,36 120,36 L 80,36 C 68,36 68,26 80,26 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5"/>
                    <rect x="84" y="32" width="32" height="5" fill="#ef4444" rx="1.5" />
                  </g>
                </svg>

                {/* Voice waveform bars */}
                <div id="voice-waves" className={`absolute -bottom-1 flex items-center justify-center gap-1 h-6 transition-opacity duration-300 ${talking ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="w-1 bg-violet-400 rounded-full h-2 animate-pulse-glow" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1 bg-violet-400 rounded-full h-4 animate-pulse-glow" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1 bg-violet-400 rounded-full h-3 animate-pulse-glow" style={{ animationDelay: '0.3s' }} />
                  <span className="w-1 bg-violet-400 rounded-full h-5 animate-pulse-glow" style={{ animationDelay: '0.4s' }} />
                  <span className="w-1 bg-violet-400 rounded-full h-2 animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>

            </div>

            {/* Right Sandbox Level Column */}
            <div className="fraction-game-right flex flex-col justify-between p-0 relative">
              <div className="w-full bg-slate-900/60 rounded-2xl p-5 border border-white/5 shadow-inner mb-4 min-h-[120px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                  <span className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">Pippa's Voice Assistance</span>
                  <button onClick={() => { sfx.play('pop'); triggerNarratorLine(); }} className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-all">
                    Replay Voice
                  </button>
                </div>
                
                <p className="text-sm md:text-base font-semibold leading-relaxed text-indigo-100/90 text-center select-none flex flex-wrap justify-center gap-x-1 gap-y-1">
                  {subtitleWords.map((word, index) => (
                    <span
                        key={`${word.text}-${index}`}
                      className={`inline-block transition-all duration-150 ${index === highlightedWordIndex ? 'word-highlight scale-105 font-bold' : ''}`}
                    >
                        {word.text}
                    </span>
                  ))}
                </p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[280px]">
                {/* Dynamically mount Slide Screen Elements */}
                {currentSlide === 0 && (
                  <CalibrationSlide />
                )}
                {currentSlide === 1 && (
                  <HalvesSliceSlide 
                    recordClick={recordClick} 
                    triggerAwardXP={triggerAwardXP} 
                    calculateLearnCraftXP={calculateLearnCraftXP} 
                    spawnBurst={spawnBurst} 
                  />
                )}
                {currentSlide === 2 && (
                  <QuartersSliceSlide 
                    recordClick={recordClick} 
                    triggerAwardXP={triggerAwardXP} 
                    calculateLearnCraftXP={calculateLearnCraftXP} 
                    spawnBurst={spawnBurst} 
                  />
                )}
                {currentSlide === 3 && (
                  <DockQuartersSlide 
                    recordClick={recordClick} 
                    triggerAwardXP={triggerAwardXP} 
                    calculateLearnCraftXP={calculateLearnCraftXP} 
                  />
                )}
                {currentSlide === 4 && (
                  <MultiPuzzleSlide 
                    recordClick={recordClick} 
                    triggerAwardXP={triggerAwardXP} 
                    calculateLearnCraftXP={calculateLearnCraftXP} 
                    spawnBurst={spawnBurst} 
                    displayKaraokeSubtitles={displayKaraokeSubtitles}
                    speakText={triggerNarratorLine}
                    stopSpeech={stopNarratorLine}
                  />
                )}
                {currentSlide === 5 && (
                  <OutroRewardSlide 
                    scoreXP={scoreXP} 
                    currentDifficulty={currentDifficulty} 
                    clickTracker={clickTracker} 
                    resetGame={() => {
                      setCurrentSlide(0);
                      setScoreXP(0);
                      setClickTracker({ correct: 0, total: 0 });
                    }} 
                    spawnConfetti={spawnConfetti}
                  />
                )}
              </div>

              <div className="w-full flex items-center justify-between mt-3">
                <button
                  onClick={handleBack}
                  disabled={currentSlide === 0}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-lg border border-white/10 flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentSlide === PLAYGROUND_SLIDES.length - 1}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-4 py-2 rounded-lg border border-emerald-300/30 flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

// ============================================================================
// MODULAR SANDBOX SLIDES
// ============================================================================

// --- SLIDE 0: Calibration Screen ---
function CalibrationSlide() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-5 max-w-md w-full animate-float">
    </div>
  );
}

// --- SLIDE 1: Halves Slice Screen ---
function HalvesSliceSlide({ recordClick, triggerAwardXP, calculateLearnCraftXP, spawnBurst }) {
  const [sliced, setSliced] = useState(false);
  const swipeRef = useRef(false);
  const startYRef = useRef(0);
  const startXRef = useRef(0);

  const handleSliceAction = () => {
    if (sliced) return;
    setSliced(true);
    sfx.play('slice');
    spawnBurst(window.innerWidth / 2 + 100, window.innerHeight / 2 - 20, 30);
    recordClick(true);
    triggerAwardXP(calculateLearnCraftXP(10));
  };

  const handleReset = () => {
    sfx.play('snap');
    setSliced(false);
  };

  const onDragStart = (x, y) => {
    swipeRef.current = true;
    startYRef.current = y;
    startXRef.current = x;
  };

  const onDragMove = (x, y, width) => {
    if (!swipeRef.current || sliced) return;
    const dy = y - startYRef.current;
    const dx = Math.abs(x - startXRef.current);
    const centerX = width / 2;
    const centerBand = width * 0.22;
    const nearCenter = Math.abs(startXRef.current - centerX) < centerBand || Math.abs(x - centerX) < centerBand;

    if (dy > 55 && dx < width * 0.28 && nearCenter) {
      swipeRef.current = false;
      handleSliceAction();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full animate-fade-in">
      <div className="text-center">
        <h3 className="font-title text-lg text-yellow-300">Slice down the Middle!</h3>
        <p className="text-[11px] text-slate-400">Drag your cursor or swipe vertically down the guide line.</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center bg-slate-950/50 rounded-full border border-white/5 shadow-inner overflow-hidden">
        {!sliced ? (
          <div className="relative w-[224px] h-[224px] rounded-full bg-gradient-to-r from-amber-500 to-orange-400 border border-amber-600 shadow-lg z-10">
            <div className="absolute inset-[14px] rounded-full bg-yellow-300">
              <span className="absolute w-4 h-4 rounded-full bg-red-700 top-8 left-10" />
              <span className="absolute w-4 h-4 rounded-full bg-red-700 top-12 right-12" />
              <span className="absolute w-4 h-4 rounded-full bg-red-700 bottom-12 left-14" />
              <span className="absolute w-4 h-4 rounded-full bg-red-700 bottom-10 right-10" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center gap-3 z-10 p-2">
            <div
              className="relative h-[212px] w-[106px] bg-gradient-to-r from-amber-500 to-orange-400 border border-amber-600 shadow-md pizza-slice-transition"
              style={{ borderRadius: '120px 0 0 120px', transform: 'translateX(-12px) rotate(-6deg)' }}
            >
              <div
                className="absolute top-[10px] left-[10px] bottom-[10px] right-[2px] bg-yellow-300"
                style={{ borderRadius: '110px 0 0 110px' }}
              >
                <span className="absolute w-3.5 h-3.5 rounded-full bg-red-700 top-9 left-8" />
                <span className="absolute w-3.5 h-3.5 rounded-full bg-red-700 bottom-12 left-10" />
              </div>
              <div className="absolute right-4 top-[40%] bg-purple-950/90 text-yellow-300 font-title text-sm border border-yellow-400 px-3 py-1 rounded-xl flex flex-col items-center shadow-lg">
                <span>1/2</span>
                <span className="text-[8px] text-white">HALF</span>
              </div>
            </div>

            <div
              className="relative h-[212px] w-[106px] bg-gradient-to-l from-amber-500 to-orange-400 border border-amber-600 shadow-md pizza-slice-transition"
              style={{ borderRadius: '0 120px 120px 0', transform: 'translateX(12px) rotate(6deg)' }}
            >
              <div
                className="absolute top-[10px] left-[2px] bottom-[10px] right-[10px] bg-yellow-300"
                style={{ borderRadius: '0 110px 110px 0' }}
              >
                <span className="absolute w-3.5 h-3.5 rounded-full bg-red-700 top-10 right-8" />
                <span className="absolute w-3.5 h-3.5 rounded-full bg-red-700 bottom-12 right-10" />
              </div>
              <div className="absolute left-4 top-[40%] bg-purple-950/90 text-yellow-300 font-title text-sm border border-yellow-400 px-3 py-1 rounded-xl flex flex-col items-center shadow-lg">
                <span>1/2</span>
                <span className="text-[8px] text-white">HALF</span>
              </div>
            </div>
          </div>
        )}

        {!sliced && (
          <>
            <div className="absolute h-full w-1 border-l-2 border-dashed border-red-500/60 left-1/2 -translate-x-1/2 z-20 pointer-events-none" />
            <div className="absolute left-1/2 -translate-x-1/2 top-3 text-[10px] px-2 py-1 rounded-md bg-slate-900/70 border border-red-400/40 text-red-200 z-20 pointer-events-none">
              Slice Here
            </div>
          </>
        )}

        {/* Swipe tracking surface */}
        <div
          className="absolute inset-0 z-30 cursor-crosshair"
          style={{ touchAction: 'none' }}
          onMouseDown={(e) => onDragStart(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
          onMouseMove={(e) => onDragMove(e.nativeEvent.offsetX, e.nativeEvent.offsetY, e.currentTarget.clientWidth)}
          onMouseUp={() => { swipeRef.current = false; }}
          onMouseLeave={() => { swipeRef.current = false; }}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            onDragStart(touch.clientX - rect.left, touch.clientY - rect.top);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            onDragMove(touch.clientX - rect.left, touch.clientY - rect.top, rect.width);
          }}
          onTouchEnd={() => { swipeRef.current = false; }}
        />
      </div>

      <div className="flex gap-4">
        <button onClick={handleSliceAction} className="btn-chunky bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-title text-xs px-5 py-2.5 rounded-xl border-b-4 border-purple-800">
          🔪 Auto Slice!
        </button>
        <button onClick={handleReset} className="text-xs text-slate-400 hover:text-slate-300 py-2.5 px-4 rounded-xl">
          Reset Whole
        </button>
      </div>

      {sliced && (
        <div className="w-full text-center mt-2 transition-all duration-500">
          <span className="bg-slate-900/90 px-6 py-3 rounded-2xl text-base font-bold font-title border border-purple-500/20 text-yellow-300 shadow-lg tracking-wider inline-block">
            1/2 + 1/2 = 1 Whole Pizza
          </span>
        </div>
      )}
    </div>
  );
}

// --- SLIDE 2: Quarters Slice Screen ---
function QuartersSliceSlide({ recordClick, triggerAwardXP, calculateLearnCraftXP, spawnBurst }) {
  const [cutState, setCutState] = useState({ v: false, h: false });
  const swipeRef = useRef(false);
  const startYRef = useRef(0);
  const startXRef = useRef(0);

  const sliced = cutState.v && cutState.h;

  const triggerQuarterCut = () => {
    sfx.play('slice');
    spawnBurst(window.innerWidth / 2 + 100, window.innerHeight / 2 - 20, 40);
    recordClick(true);
    triggerAwardXP(calculateLearnCraftXP(15));
  };

  const handleAutoCut = () => {
    if (sliced) return;
    setCutState({ v: true, h: true });
    triggerQuarterCut();
  };

  const handleReset = () => {
    sfx.play('snap');
    setCutState({ v: false, h: false });
  };

  const onDragStart = (x, y) => {
    swipeRef.current = true;
    startYRef.current = y;
    startXRef.current = x;
  };

  const onDragMove = (x, y, width, height) => {
    if (!swipeRef.current || sliced) return;
    const rawDy = y - startYRef.current;
    const dy = Math.abs(rawDy);
    const dx = Math.abs(x - startXRef.current);
    const centerX = width / 2;
    const centerY = height / 2;
    const nearCenterX = Math.abs(startXRef.current - centerX) < width * 0.22 || Math.abs(x - centerX) < width * 0.22;
    const nearCenterY = Math.abs(startYRef.current - centerY) < height * 0.22 || Math.abs(y - centerY) < height * 0.22;

    if (!cutState.v && rawDy > 55 && dx < width * 0.28 && nearCenterX) {
      setCutState(prev => ({ ...prev, v: true }));
      sfx.play('slice');
      swipeRef.current = false;
      return;
    }

    if (cutState.v && !cutState.h && dx > 55 && dy < height * 0.28 && nearCenterY) {
      setCutState(prev => ({ ...prev, h: true }));
      sfx.play('slice');
      triggerQuarterCut();
      swipeRef.current = false;
    }
  };

  const phaseTitle = !cutState.v
    ? 'Step 1: Slice into Two Halves'
    : !cutState.h
      ? 'Step 2: Slice Across to Make Quarters'
      : 'Great! You made Four Quarters';

  const phaseHint = !cutState.v
    ? 'Make a vertical cut down the middle first.'
    : !cutState.h
      ? 'Now make a horizontal cut across the middle.'
      : '1/4 + 1/4 + 1/4 + 1/4 = 1 whole pizza.';

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full animate-fade-in">
      <div className="text-center">
        <h3 className="font-title text-lg text-teal-300">{phaseTitle}</h3>
        <p className="text-[11px] text-slate-400">{phaseHint}</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center bg-slate-950/50 rounded-full border border-white/5 shadow-inner overflow-hidden">
        {!cutState.v && (
          <div className="relative w-[224px] h-[224px] rounded-full bg-gradient-to-r from-amber-500 to-orange-400 border border-amber-600 shadow-lg z-10">
            <div className="absolute inset-[14px] rounded-full bg-yellow-300">
              <span className="absolute w-4 h-4 rounded-full bg-red-700 top-8 left-10" />
              <span className="absolute w-4 h-4 rounded-full bg-red-700 top-11 right-11" />
              <span className="absolute w-4 h-4 rounded-full bg-red-700 bottom-14 left-14" />
              <span className="absolute w-4 h-4 rounded-full bg-red-700 bottom-10 right-12" />
            </div>
          </div>
        )}

        {cutState.v && !cutState.h && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 z-10 p-2">
            <div
              className="relative h-[212px] w-[106px] bg-gradient-to-r from-amber-500 to-orange-400 border border-amber-600 shadow-md pizza-slice-transition"
              style={{ borderRadius: '120px 0 0 120px', transform: 'translateX(-6px)' }}
            >
              <div className="absolute top-[10px] left-[10px] bottom-[10px] right-[2px] bg-yellow-300" style={{ borderRadius: '110px 0 0 110px' }} />
              <span className="absolute w-3.5 h-3.5 rounded-full bg-red-700 top-14 left-9" />
              <span className="absolute w-3.5 h-3.5 rounded-full bg-red-700 bottom-14 left-11" />
              <div className="absolute right-3 top-[42%] bg-purple-950/90 text-yellow-300 font-title text-xs border border-yellow-400 px-2 py-1 rounded-lg shadow-lg">1/2</div>
            </div>
            <div
              className="relative h-[212px] w-[106px] bg-gradient-to-l from-amber-500 to-orange-400 border border-amber-600 shadow-md pizza-slice-transition"
              style={{ borderRadius: '0 120px 120px 0', transform: 'translateX(6px)' }}
            >
              <div className="absolute top-[10px] left-[2px] bottom-[10px] right-[10px] bg-yellow-300" style={{ borderRadius: '0 110px 110px 0' }} />
              <span className="absolute w-3.5 h-3.5 rounded-full bg-red-700 top-14 right-9" />
              <span className="absolute w-3.5 h-3.5 rounded-full bg-red-700 bottom-14 right-11" />
              <div className="absolute left-3 top-[42%] bg-purple-950/90 text-yellow-300 font-title text-xs border border-yellow-400 px-2 py-1 rounded-lg shadow-lg">1/2</div>
            </div>
          </div>
        )}

        {sliced && (
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-2 gap-2 z-10">
            <div className="relative rounded-tl-full overflow-hidden bg-gradient-to-br from-amber-500 to-orange-400 border border-amber-600/50 pizza-slice-transition" style={{ transform: 'translate(-10px, -10px) rotate(-4deg)' }}>
              <div className="absolute inset-2 bg-yellow-300 rounded-tl-full">
                <span className="absolute w-3 h-3 rounded-full bg-red-700 top-4 left-4" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-[11px] font-title text-teal-200">1/4</div>
            </div>
            <div className="relative rounded-tr-full overflow-hidden bg-gradient-to-bl from-amber-500 to-orange-400 border border-amber-600/50 pizza-slice-transition" style={{ transform: 'translate(10px, -10px) rotate(4deg)' }}>
              <div className="absolute inset-2 bg-yellow-300 rounded-tr-full">
                <span className="absolute w-3 h-3 rounded-full bg-red-700 top-4 right-4" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-[11px] font-title text-teal-200">1/4</div>
            </div>
            <div className="relative rounded-bl-full overflow-hidden bg-gradient-to-tr from-amber-500 to-orange-400 border border-amber-600/50 pizza-slice-transition" style={{ transform: 'translate(-10px, 10px) rotate(-4deg)' }}>
              <div className="absolute inset-2 bg-yellow-300 rounded-bl-full">
                <span className="absolute w-3 h-3 rounded-full bg-red-700 bottom-4 left-4" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-[11px] font-title text-teal-200">1/4</div>
            </div>
            <div className="relative rounded-br-full overflow-hidden bg-gradient-to-tl from-amber-500 to-orange-400 border border-amber-600/50 pizza-slice-transition" style={{ transform: 'translate(10px, 10px) rotate(4deg)' }}>
              <div className="absolute inset-2 bg-yellow-300 rounded-br-full">
                <span className="absolute w-3 h-3 rounded-full bg-red-700 bottom-4 right-4" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-[11px] font-title text-teal-200">1/4</div>
            </div>
          </div>
        )}

        {!cutState.v && (
          <>
            <div className="absolute h-full w-0.5 bg-red-500/50 left-1/2 -translate-x-1/2 z-20 pointer-events-none border-l-2 border-dashed" />
            <div className="absolute left-1/2 -translate-x-1/2 top-3 text-[10px] px-2 py-1 rounded-md bg-slate-900/70 border border-red-400/40 text-red-200 z-20 pointer-events-none">
              Slice 1/2 First
            </div>
          </>
        )}

        {cutState.v && !cutState.h && (
          <>
            <div className="absolute h-full w-0.5 bg-amber-400/80 left-1/2 -translate-x-1/2 z-20 pointer-events-none" />
            <div className="absolute w-full h-0.5 bg-red-500/50 top-1/2 -translate-y-1/2 z-20 pointer-events-none border-t-2 border-dashed" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-2 py-1 rounded-md bg-slate-900/70 border border-red-400/40 text-red-200 z-20 pointer-events-none">
              Then Slice 1/4
            </div>
          </>
        )}

        {sliced && (
          <>
            <div className="absolute h-full w-0.5 bg-amber-400/70 left-1/2 -translate-x-1/2 z-20 pointer-events-none" />
            <div className="absolute w-full h-0.5 bg-amber-400/70 top-1/2 -translate-y-1/2 z-20 pointer-events-none" />
          </>
        )}

        {/* Hot Touch surface drag capture */}
        <div
          className="absolute inset-0 z-30 cursor-crosshair"
          style={{ touchAction: 'none' }}
          onMouseDown={(e) => onDragStart(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
          onMouseMove={(e) => onDragMove(e.nativeEvent.offsetX, e.nativeEvent.offsetY, e.currentTarget.clientWidth, e.currentTarget.clientHeight)}
          onMouseUp={() => { swipeRef.current = false; }}
          onMouseLeave={() => { swipeRef.current = false; }}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            onDragStart(touch.clientX - rect.left, touch.clientY - rect.top);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            onDragMove(touch.clientX - rect.left, touch.clientY - rect.top, rect.width, rect.height);
          }}
          onTouchEnd={() => { swipeRef.current = false; }}
        />
      </div>

      <div className="flex gap-4">
        <button onClick={handleAutoCut} className="btn-chunky bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-title text-xs px-5 py-2.5 rounded-xl border-b-4 border-teal-800">
          🔪 Auto 1/2 → 1/4
        </button>
        <button onClick={handleReset} className="text-xs text-slate-400 hover:text-slate-300 py-2.5 px-4 rounded-xl">
          Reset Whole
        </button>
      </div>

      {sliced && (
        <div className="w-full text-center mt-2 transition-all duration-500">
          <span className="bg-slate-900/90 px-6 py-3 rounded-2xl text-base font-bold font-title border border-purple-500/20 text-yellow-300 shadow-lg tracking-wider inline-block">
            1/4 + 1/4 + 1/4 + 1/4 = 1 Whole Pizza
          </span>
        </div>
      )}
    </div>
  );
}

// --- SLIDE 3: Dock Quarters Screen ---
function DockQuartersSlide({ recordClick, triggerAwardXP, calculateLearnCraftXP }) {
  const [dockState, setDockState] = useState({ top: false, bottom: false });

  const complete = dockState.top && dockState.bottom;

  const handleDock = (part) => {
    if (dockState[part]) return;
    sfx.play('snap');
    
    setDockState(prev => {
      const next = { ...prev, [part]: true };
      if (next.top && next.bottom) {
        sfx.play('success');
        recordClick(true);
        triggerAwardXP(calculateLearnCraftXP(20));
      }
      return next;
    });
  };

  const handleReset = () => {
    sfx.play('pop');
    setDockState({ top: false, bottom: false });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full animate-fade-in">
      <div className="text-center">
        <h3 className="font-title text-lg text-yellow-300">Join Quarters to make a Half!</h3>
        <p className="text-[11px] text-slate-400">Click individual quarter slices to dock them into the frame.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-slate-950/40 p-6 rounded-2xl border border-white/5 w-full max-w-lg h-60 relative">
        {/* Target receiver dock */}
        <div className={`w-32 h-32 border-4 border-dashed border-purple-500/20 rounded-r-full relative flex items-center justify-center overflow-hidden bg-slate-950/20 transition-all duration-500 ${complete ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-yellow-400' : ''}`}>
          <div className={`absolute inset-0 flex items-center justify-center text-center transition-all duration-300 ${complete ? 'opacity-100' : 'opacity-40'}`}>
            <span className="text-[10px] text-purple-400 font-bold tracking-widest uppercase">
              {complete ? 'SUCCESS! 1/2' : 'Target Half'}
            </span>
          </div>
          
          <div
            className="absolute top-0 right-0 w-full h-1/2 bg-yellow-300 border-b border-amber-500/40 transition-all duration-500"
            style={{ opacity: dockState.top ? 1 : 0, transform: dockState.top ? 'none' : 'translateX(80px)' }}
          >
            <span className="absolute w-3 h-3 rounded-full bg-red-700 top-3 right-7" />
            <span className="absolute w-3 h-3 rounded-full bg-red-700 bottom-3 right-4" />
          </div>
          <div
            className="absolute bottom-0 right-0 w-full h-1/2 bg-yellow-300 border-t border-amber-500/40 transition-all duration-500"
            style={{ opacity: dockState.bottom ? 1 : 0, transform: dockState.bottom ? 'none' : 'translateX(80px)' }}
          >
            <span className="absolute w-3 h-3 rounded-full bg-red-700 top-3 right-5" />
            <span className="absolute w-3 h-3 rounded-full bg-red-700 bottom-3 right-8" />
          </div>
        </div>

        {/* Trigger controls */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleDock('top')}
            disabled={dockState.top}
            className={`px-4 py-3 rounded-xl text-xs flex items-center gap-2 transition-all ${dockState.top ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-none' : 'btn-chunky bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white border-b-4 border-purple-800 font-bold shadow-md'}`}
          >
            <span>🍕</span> Dock Quarter (1/4)
          </button>
          <button
            onClick={() => handleDock('bottom')}
            disabled={dockState.bottom}
            className={`px-4 py-3 rounded-xl text-xs flex items-center gap-2 transition-all ${dockState.bottom ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-none' : 'btn-chunky bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white border-b-4 border-purple-800 font-bold shadow-md'}`}
          >
            <span>🍕</span> Dock Quarter (1/4)
          </button>
        </div>
      </div>

      {complete && (
        <div className="flex flex-col items-center gap-3">
          <span className="bg-slate-900/90 px-6 py-3 rounded-2xl text-base font-bold font-title border border-purple-500/20 text-yellow-300 shadow-lg tracking-wider inline-block">
            1/4 + 1/4 = 1/2 (Two Quarters Make a Half!)
          </span>
          <button onClick={handleReset} className="text-xs text-slate-400 hover:text-slate-300 py-1.5 px-3 rounded-md underline decoration-indigo-400">
            🔄 Reset Match Box
          </button>
        </div>
      )}
    </div>
  );
}

// --- SLIDE 4: Find & Tap Challenge Screen ---
function MultiPuzzleSlide({ recordClick, triggerAwardXP, calculateLearnCraftXP, spawnBurst, displayKaraokeSubtitles, speakText, stopSpeech }) {
  const [stepIndex, setStepIndex] = useState(-1); // -1: Intro line running, 0, 1, 2: Active steps, 3: Completed
  const [evalText, setEvalText] = useState("Awaiting your choice...");
  const [shakingCard, setShakingCard] = useState(null);

  const steps = [
    {
      txt: "Can you tap a HALF (1/2) of the Apple?",
      answers: ["opt-apple-1", "opt-apple-2"],
      cardId: "p-apple-card",
      lockId: "apple-lock"
    },
    {
      txt: "Now find a QUARTER (1/4) of the Cookie!",
      answers: ["opt-cookie-1", "opt-cookie-2", "opt-cookie-3", "opt-cookie-4"],
      cardId: "p-cookie-card",
      lockId: "cookie-lock"
    },
    {
      txt: "Awesome! Finally, find a HALF (1/2) of the Chocolate Bar!",
      answers: ["opt-choco-1", "opt-choco-2"],
      cardId: "p-choco-card",
      lockId: "choco-lock"
    }
  ];

  // Sequentially kickstart step questions when intro ends
  const startPuzzleQuiz = () => {
    setStepIndex(0);
    setEvalText("Awaiting your choice...");
  };

  useEffect(() => {
    // If the step index updates to valid stage, trigger localized speech synthesizer
    if (stepIndex >= 0 && stepIndex < steps.length) {
      const current = steps[stepIndex];
      displayKaraokeSubtitles(current.txt);
      speakText(current.txt);
    } else if (stepIndex === steps.length) {
      const completionVo = "Wow! You found all the halves and quarters! Great job!";
      displayKaraokeSubtitles(completionVo);
      speakText(completionVo);
    }
  }, [stepIndex]);

  const handleSelection = (elementId, cardId) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    const current = steps[stepIndex];
    const isCorrect = current.answers.includes(elementId);

    recordClick(isCorrect);

    if (isCorrect) {
      sfx.play('chime');
      setEvalText("✨ Correct Choice! +15 XP");
      
      const node = document.getElementById(elementId);
      if (node) {
        const rect = node.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
      }

      triggerAwardXP(calculateLearnCraftXP(15));

      setTimeout(() => {
        setStepIndex(prev => prev + 1);
        setEvalText("Awaiting your choice...");
      }, 2000);
    } else {
      sfx.play('wrong');
      setEvalText("Not quite! Try looking at the slice values.");
      setShakingCard(cardId);
      setTimeout(() => setShakingCard(null), 500);
    }
  };

  const skipIntro = () => {
    stopSpeech();
    startPuzzleQuiz();
  };

  // Autoplay intro line and anchor its ending callback to launch steps
  useEffect(() => {
    // Trigger speaking "Now let's find halves and quarters! Tap..."
    speakText(null, () => {
      startPuzzleQuiz();
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full animate-fade-in">
      {stepIndex === -1 && (
        <div className="w-full flex justify-end px-4">
          <button onClick={skipIntro} className="text-xs bg-purple-950/60 hover:bg-purple-900 text-purple-300 font-bold px-3 py-1.5 rounded-lg border border-purple-500/30 transition-all">
            Skip Intro & Start Puzzle ⚡
          </button>
        </div>
      )}

      {/* Challenge question status header */}
      <div className="bg-indigo-950/60 px-5 py-4 rounded-2xl border border-white/5 text-center max-w-sm w-full shadow-lg animate-float">
        <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20 mb-2 inline-block">Puzzle Level:</span>
        <h3 className="font-title text-base text-yellow-300">
          {stepIndex === -1 ? 'Listening to Pippa...' : stepIndex === steps.length ? 'Perfect Masterclass!' : steps[stepIndex].txt}
        </h3>
        <p className="text-[10px] text-slate-400 mt-1">
          {stepIndex === -1 ? 'We will start when Pippa finishes speaking!' : stepIndex === steps.length ? 'Click Next to claim your medal!' : 'Tap the correct fraction chunk below.'}
        </p>
      </div>

      {/* Item Row layouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-lg mt-1">
        
        {/* Card 1: Apple Halves */}
        <div
          id="p-apple-card"
          className={`p-4 rounded-xl border flex flex-col items-center justify-between min-h-[160px] relative transition-all ${stepIndex === 0 ? 'border-purple-500/60 bg-purple-950/10' : stepIndex > 0 ? 'border-emerald-500/40 bg-slate-900/40 opacity-80 pointer-events-none' : 'opacity-40 pointer-events-none'} ${shakingCard === 'p-apple-card' ? 'animate-shake border-rose-500' : ''}`}
        >
          {stepIndex !== 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs rounded-xl z-10 transition-all">
              <span className={`font-bold text-sm ${stepIndex > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {stepIndex > 0 ? '✅ Done' : '🔒 Locked'}
              </span>
            </div>
          )}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apple halves</span>
          <div className="flex justify-center gap-3 mt-2">
            <div id="opt-apple-1" onClick={() => handleSelection('opt-apple-1', 'p-apple-card')} className="cursor-pointer hover:scale-115 active:scale-95 transition-all p-1.5 rounded-full border-2 border-transparent">
              <svg className="w-10 h-14" viewBox="0 0 30 50">
                <path d="M28,5 C18,3 5,10 5,25 C5,40 18,48 28,45 L28,5 Z" fill="#EF5350" stroke="#B71C1C" strokeWidth="1.5" />
                <ellipse cx="26" cy="24" rx="2" ry="3.5" fill="#3E2723" />
                <path d="M28,5 Q20,-4 15,-2 Q20,2 28,5" fill="#4CAF50" />
              </svg>
            </div>
            <div id="opt-apple-2" onClick={() => handleSelection('opt-apple-2', 'p-apple-card')} className="cursor-pointer hover:scale-115 active:scale-95 transition-all p-1.5 rounded-full border-2 border-transparent">
              <svg className="w-10 h-14" viewBox="0 0 30 50">
                <path d="M2,5 C12,3 25,10 25,25 C25,40 12,48 2,45 L2,5 Z" fill="#EF5350" stroke="#B71C1C" strokeWidth="1.5" />
                <ellipse cx="4" cy="24" rx="2" ry="3.5" fill="#3E2723" />
              </svg>
            </div>
          </div>
          <span className="text-[10px] text-yellow-400 font-bold mt-2">Select 1/2 Half</span>
        </div>

        {/* Card 2: Cookie Quarters */}
        <div
          id="p-cookie-card"
          className={`p-4 rounded-xl border flex flex-col items-center justify-between min-h-[160px] relative transition-all ${stepIndex === 1 ? 'border-purple-500/60 bg-purple-950/10' : stepIndex > 1 ? 'border-emerald-500/40 bg-slate-900/40 opacity-80 pointer-events-none' : 'opacity-40 pointer-events-none'} ${shakingCard === 'p-cookie-card' ? 'animate-shake border-rose-500' : ''}`}
        >
          {stepIndex !== 1 && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs rounded-xl z-10 transition-all">
              <span className={`font-bold text-sm ${stepIndex > 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {stepIndex > 1 ? '✅ Done' : '🔒 Locked'}
              </span>
            </div>
          )}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cookie quarters</span>
          <div className="grid grid-cols-2 gap-1.5 w-14 h-14 mt-3 relative justify-center items-center">
            {['opt-cookie-1', 'opt-cookie-2', 'opt-cookie-3', 'opt-cookie-4'].map((id, idx) => {
              const borderRounded = idx === 0 ? 'rounded-tl-full' : idx === 1 ? 'rounded-tr-full' : idx === 2 ? 'rounded-bl-full' : 'rounded-br-full';
              return (
                <div
                  key={id}
                  id={id}
                  onClick={() => handleSelection(id, 'p-cookie-card')}
                  className={`cursor-pointer hover:scale-115 transition-all w-6.5 h-6.5 bg-amber-700 hover:bg-amber-600 border border-amber-900 ${borderRounded}`}
                />
              );
            })}
          </div>
          <span className="text-[10px] text-yellow-400 font-bold mt-2">Select 1/4 Quarter</span>
        </div>

        {/* Card 3: Chocolate Halves */}
        <div
          id="p-choco-card"
          className={`p-4 rounded-xl border flex flex-col items-center justify-between min-h-[160px] relative transition-all ${stepIndex === 2 ? 'border-purple-500/60 bg-purple-950/10' : stepIndex > 2 ? 'border-emerald-500/40 bg-slate-900/40 opacity-80 pointer-events-none' : 'opacity-40 pointer-events-none'} ${shakingCard === 'p-choco-card' ? 'animate-shake border-rose-500' : ''}`}
        >
          {stepIndex !== 2 && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs rounded-xl z-10 transition-all">
              <span className={`font-bold text-sm ${stepIndex > 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {stepIndex > 2 ? '✅ Done' : '🔒 Locked'}
              </span>
            </div>
          )}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chocolate halves</span>
          <div className="flex flex-col gap-1.5 mt-3 w-16">
            <div id="opt-choco-1" onClick={() => handleSelection('opt-choco-1', 'p-choco-card')} className="cursor-pointer hover:scale-115 transition-all w-full h-5 bg-amber-900 border border-amber-950 rounded-t-md" />
            <div id="opt-choco-2" onClick={() => handleSelection('opt-choco-2', 'p-choco-card')} className="cursor-pointer hover:scale-115 transition-all w-full h-5 bg-amber-900 border border-amber-950 rounded-b-md" />
          </div>
          <span className="text-[10px] text-yellow-400 font-bold mt-2">Select 1/2 Half</span>
        </div>

      </div>

      <div className="h-6 text-sm font-bold tracking-wide text-center mt-1">
        <span className={evalText.includes('✨') ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}>{evalText}</span>
      </div>
    </div>
  );
}

// --- SLIDE 5: Outro Reward Medal Screen ---
function OutroRewardSlide({ scoreXP, currentDifficulty, clickTracker, resetGame, spawnConfetti }) {
  useEffect(() => {
    // Blast celebratory reward sparkles
    setTimeout(() => {
      sfx.play('success');
      spawnConfetti();
    }, 350);
  }, []);

  const accuracy = clickTracker.total > 0 ? Math.round((clickTracker.correct / clickTracker.total) * 100) : 100;

  return (
    <div className="flex flex-col items-center justify-center text-center gap-5 max-w-md w-full animate-float">
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500 rounded-2xl border-2 border-white/20 flex items-center justify-center shadow-2xl relative">
          <span className="text-4xl">🏅</span>
          <span className="absolute -top-3 -left-3 text-lg animate-pulse">⭐</span>
          <span className="absolute -bottom-3 -right-3 text-lg animate-pulse">⭐</span>
        </div>
      </div>

      <div>
        <h3 className="font-title text-xl text-yellow-300">Fraction Master!</h3>
        <p className="text-[11px] text-slate-400 mt-1">Telemetry generated & submitted successfully to LearnCraft OS dashboards.</p>
      </div>

      <div className="bg-indigo-950/40 p-5 rounded-2xl border border-white/5 w-full shadow-inner text-xs">
        <span className="text-[9px] uppercase tracking-widest text-purple-400 font-bold block mb-3">Live Progress Summary:</span>
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400">Game Multiplier (Puzzle):</span>
            <span className="text-yellow-400 font-bold">1.3x</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400">Click Accuracy Score:</span>
            <span className="text-emerald-400 font-bold">{accuracy}%</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400">Chosen Difficulty Bonus:</span>
            <span className="text-amber-400 font-bold uppercase">{currentDifficulty}</span>
          </div>
          <div className="flex justify-between font-title text-sm pt-1">
            <span className="text-white">Earned Experience:</span>
            <span className="text-yellow-300">+{scoreXP} XP</span>
          </div>
        </div>
      </div>

      <button onClick={() => { sfx.play('pop'); resetGame(); }} className="btn-chunky bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 text-xs px-5 py-2.5 rounded-xl border-b-4 border-slate-950">
        🔄 Replay Lesson Course
      </button>
    </div>
  );
}

// ============================================================================
// LESSON SLIDES CONSTANTS CONFIGURATION
// ============================================================================
const PLAYGROUND_SLIDES = [
  {
    id: "calibration",
    title: "Meet Pippa!",
    tip: "Hi! I’m Pippa the Pizza. Today we’ll learn about halves and quarters!",
    vo: "Hi! I’m Pippa the Pizza. Today we’ll learn about halves and quarters!"
  },
  {
    id: "halves_slice",
    title: "Tactile Slicing - Halves",
    tip: "Slash Pippa right through the vertical line to create two equal halves!",
    vo: "If Pippa is cut into two equal pieces, each piece is called a half — one of two equal parts."
  },
  {
    id: "quarters_slice",
    title: "Tactile Slicing - Quarters",
    tip: "Slice Pippa along BOTH the vertical and horizontal guides to get four quarters!",
    vo: "If Pippa is cut into four equal pieces, each piece is called a quarter — one of four equal parts."
  },
  {
    id: "dock_quarters",
    title: "Match & Dock Quarters",
    tip: "Dock both of the separated quarter slices into the Half Frame target to match them!",
    vo: "Two quarters joined together make a half. See how they match?"
  },
  {
    id: "multi_puzzle",
    title: "Find & Tap Challenge",
    tip: "Help Pippa find the exact fraction pieces she needs by tapping them!",
    vo: "Now let’s find halves and quarters! Tap the correct piece of the apple, cookie, or chocolate bar."
  },
  {
    id: "outro_reward",
    title: "Triumphant Reward Outro",
    tip: "Congratulations! You earned your LearnCraft Fractions Medal!",
    vo: "Great job! Halves are two equal parts, quarters are four. Bye from Pippa!"
  }
];