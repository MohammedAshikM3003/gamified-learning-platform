import React, { useState, useEffect, useRef } from 'react';
import { 
  Pizza, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Play, 
  ChefHat, 
  Smile, 
  Lightbulb, 
  Layers, 
  HelpCircle as HelpIcon,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

// Simple Audio synthesizer to avoid external assets and keep app fully self-contained
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    switch(type) {
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
        break;
      }
      case 'correct': {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.4);
        osc2.stop(ctx.currentTime + 0.4);
        break;
      }
      case 'incorrect': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
        break;
      }
      case 'victory': {
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.2);
        });
        break;
      }
      default: break;
    }
  } catch (e) {
    console.warn("Audio Context not supported or allowed yet.");
  }
};

export default function MixedNumberGames() {
  const [activeTab, setActiveTab] = useState('sandbox'); // 'sandbox' | 'quest' | 'match'
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Trigger audio helper wrapper
  const triggerSound = (type) => {
    if (!muted) playSound(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-rose-50 to-orange-100 text-slate-800 font-sans pb-12 transition-all duration-300">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-orange-100 shadow-sm px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-amber-500 to-rose-500 p-2.5 rounded-2xl shadow-md text-white animate-pulse">
              <ChefHat size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-amber-600 via-rose-600 to-orange-600 bg-clip-text text-transparent tracking-tight">
                Fraction Feast!
              </h1>
              <p className="text-xs font-semibold text-rose-500 tracking-wider uppercase">Improper & Mixed Number Adventure</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="bg-amber-100/80 border border-amber-200 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold text-amber-800 shadow-sm">
              <Sparkles size={16} className="text-amber-500" />
              Score: <span className="text-amber-600 text-base">{score}</span>
            </div>

            <div className="bg-rose-100/80 border border-rose-200 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold text-rose-800 shadow-sm">
              <Flame size={16} className="text-rose-500 animate-bounce" />
              Streak: <span className="text-rose-600 text-base">{streak}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => { setMuted(!muted); triggerSound('click'); }} 
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shadow-sm"
                title={muted ? "Unmute" : "Mute Sounds"}
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button 
                onClick={() => { setShowHelp(true); triggerSound('click'); }} 
                className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-sm flex items-center gap-1"
                title="How to Play"
              >
                <HelpIcon size={18} />
                <span className="hidden md:inline text-xs font-bold px-1">Guide</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-white/60 p-1.5 rounded-2xl shadow-inner border border-orange-100/50 flex flex-row gap-2 max-w-lg mx-auto mb-8">
          <button
            onClick={() => { setActiveTab('sandbox'); triggerSound('click'); }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex flex-col md:flex-row items-center justify-center gap-2 ${
              activeTab === 'sandbox' 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md transform scale-102' 
                : 'text-slate-600 hover:bg-white/80 hover:text-slate-800'
            }`}
          >
            <Layers size={18} />
            <span>Interactive Kitchen</span>
          </button>
          <button
            onClick={() => { setActiveTab('quest'); triggerSound('click'); }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex flex-col md:flex-row items-center justify-center gap-2 ${
              activeTab === 'quest' 
                ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md transform scale-102' 
                : 'text-slate-600 hover:bg-white/80 hover:text-slate-800'
            }`}
          >
            <ChefHat size={18} />
            <span>Chef's Quest</span>
          </button>
          <button
            onClick={() => { setActiveTab('match'); triggerSound('click'); }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex flex-col md:flex-row items-center justify-center gap-2 ${
              activeTab === 'match' 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md transform scale-102' 
                : 'text-slate-600 hover:bg-white/80 hover:text-slate-800'
            }`}
          >
            <Sparkles size={18} />
            <span>Memory Feast</span>
          </button>
        </div>

        {/* Dynamic Game Workspace */}
        <div className="transition-all duration-300">
          {activeTab === 'sandbox' && (
            <SandboxMode triggerSound={triggerSound} />
          )}
          {activeTab === 'quest' && (
            <QuestMode 
              score={score} 
              setScore={setScore} 
              streak={streak} 
              setStreak={setStreak}
              highestStreak={highestStreak}
              setHighestStreak={setHighestStreak}
              triggerSound={triggerSound} 
            />
          )}
          {activeTab === 'match' && (
            <MatchMode 
              score={score} 
              setScore={setScore} 
              triggerSound={triggerSound} 
            />
          )}
        </div>
      </div>

      {/* Guide / Help Overlay Dialog */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 border border-orange-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5 text-amber-600">
                <Lightbulb size={24} className="text-amber-500 animate-bounce" />
                <h3 className="text-xl font-extrabold text-slate-800">Learn & Play: Improper Fractions vs Mixed Numbers</h3>
              </div>
              <button 
                onClick={() => { setShowHelp(false); triggerSound('click'); }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                Welcome to the kitchen! Let's review the quick mathematical rules from our video lesson before we start cooking:
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                <h4 className="font-extrabold text-amber-900 mb-1">🍕 1. Proper Fractions</h4>
                <p>The numerator (top) is smaller than the denominator (bottom). It is always <strong>less than 1 whole</strong> food item.</p>
                <div className="mt-2 text-xs text-amber-800 font-mono font-bold bg-white/80 py-1 px-2 rounded inline-block">
                  Example: 1/2 of a sandwich or 2/8 of a pizza.
                </div>
              </div>

              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl">
                <h4 className="font-extrabold text-rose-900 mb-1">🍊 2. Improper Fractions</h4>
                <p>The numerator is <strong>larger than or equal to</strong> the denominator. It is <strong>bigger than 1 whole</strong> food item!</p>
                <div className="mt-2 text-xs text-rose-800 font-mono font-bold bg-white/80 py-1 px-2 rounded inline-block">
                  Example: 3/2 oranges. Let's count them: 1 half, 2 halves (makes a whole), and 3 halves!
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl">
                <h4 className="font-extrabold text-orange-900 mb-1">🧁 3. Mixed Numbers</h4>
                <p>A mix of a <strong>whole number</strong> and a <strong>fraction</strong> together. It is another way to express improper fractions.</p>
                <div className="mt-2 text-xs text-orange-800 font-mono font-bold bg-white/80 py-1 px-2 rounded inline-block">
                  Example: 3/2 is equal to 1 Whole and 1/2. written as: 1 1/2 Oranges!
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-800 mb-2">How to play the modes:</h4>
                <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
                  <li><strong className="text-amber-600">Interactive Kitchen:</strong> Tap slices on the screen to change food amounts. Instantly see how improper formulas translate to mixed formulas!</li>
                  <li><strong className="text-rose-600">Chef's Quest:</strong> Slice the pizzas, oranges, or bars and tap the correct slices to fulfill the precise customer requests before time is up!</li>
                  <li><strong className="text-orange-600">Memory Feast:</strong> Flip matching triplets of visual foods, mixed equations, and improper cards to clear the kitchen.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => { setShowHelp(false); triggerSound('click'); }}
                className="bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg hover:brightness-105 transition-all text-sm"
              >
                Let's Cook!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// This displays up to 4 wholes of food item split into any denominator, completely interactive.
function FoodVisualizer({ 
  foodType, 
  denominator, 
  selectedSlices, 
  onSliceToggle, 
  interactive = true 
}) {
  const maxWholes = 3;
  const wholes = Array.from({ length: maxWholes });

  // Render a single whole pizza, orange, or grid bar
  const renderWhole = (wholeIndex) => {
    const slices = Array.from({ length: denominator });
    
    if (foodType === 'pizza') {
      return (
        <div key={wholeIndex} className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-amber-50 rounded-full shadow-md border border-amber-200/50 flex items-center justify-center p-1.5">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Crust background */}
            <circle cx="50" cy="50" r="48" fill="#dfb385" stroke="#c09363" strokeWidth="2" />
            {/* Sauce background */}
            <circle cx="50" cy="50" r="41" fill="#c13b2b" />
            {/* Cheese background */}
            <circle cx="50" cy="50" r="38" fill="#f1c40f" />
            
            {/* Pizza Slices */}
            {slices.map((_, sliceIndex) => {
              const absIndex = wholeIndex * denominator + sliceIndex;
              const isSelected = absIndex < selectedSlices;
              
              // Angle math for pie slice path
              const angleStep = 360 / denominator;
              const startAngle = (sliceIndex * angleStep) * (Math.PI / 180);
              const endAngle = ((sliceIndex + 1) * angleStep) * (Math.PI / 180);
              
              const x1 = 50 + 38 * Math.cos(startAngle);
              const y1 = 50 + 38 * Math.sin(startAngle);
              const x2 = 50 + 38 * Math.cos(endAngle);
              const y2 = 50 + 38 * Math.sin(endAngle);
              
              // Large arc flag for angle > 180
              const largeArcFlag = angleStep > 180 ? 1 : 0;
              const pathData = `M 50 50 L ${x1} ${y1} A 38 38 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

              return (
                <path
                  key={sliceIndex}
                  d={pathData}
                  fill={isSelected ? '#f39c12' : '#ebd496'}
                  stroke="#c0392b"
                  strokeWidth="1.5"
                  className={`${interactive ? 'cursor-pointer hover:fill-amber-400 transition-all active:scale-95' : ''}`}
                  onClick={() => interactive && onSliceToggle(absIndex)}
                />
              );
            })}

            {/* Pepperonis on active slices */}
            {slices.map((_, sliceIndex) => {
              const absIndex = wholeIndex * denominator + sliceIndex;
              const isSelected = absIndex < selectedSlices;
              if (!isSelected) return null;

              // Place pepperoni in center of the wedge
              const angleStep = 360 / denominator;
              const midAngle = ((sliceIndex + 0.5) * angleStep) * (Math.PI / 180);
              const r = 22; // distance from center
              const px = 50 + r * Math.cos(midAngle);
              const py = 50 + r * Math.sin(midAngle);

              return (
                <circle 
                  key={`pep-${sliceIndex}`} 
                  cx={px} 
                  cy={py} 
                  r="4" 
                  fill="#962d22" 
                  className="pointer-events-none" 
                />
              );
            })}

            {/* Division Line Overlays */}
            {slices.map((_, sliceIndex) => {
              const angleStep = 360 / denominator;
              const angle = (sliceIndex * angleStep) * (Math.PI / 180);
              const lx = 50 + 38 * Math.cos(angle);
              const ly = 50 + 38 * Math.sin(angle);
              return (
                <line 
                  key={`line-${sliceIndex}`}
                  x1="50" y1="50" x2={lx} y2={ly} 
                  stroke="#dfb385" strokeWidth="1.5" 
                  className="pointer-events-none"
                />
              );
            })}
          </svg>
          <div className="absolute top-1 left-2.5 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
            Whole {wholeIndex + 1}
          </div>
        </div>
      );
    } else if (foodType === 'orange') {
      return (
        <div key={wholeIndex} className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-orange-50 rounded-full shadow-md border border-orange-200/50 flex items-center justify-center p-1.5">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Outer Orange Peel */}
            <circle cx="50" cy="50" r="48" fill="#e67e22" stroke="#d35400" strokeWidth="2.5" />
            {/* White Pith Layer */}
            <circle cx="50" cy="50" r="43" fill="#fcf5e3" />
            
            {/* Citrus Segments */}
            {slices.map((_, sliceIndex) => {
              const absIndex = wholeIndex * denominator + sliceIndex;
              const isSelected = absIndex < selectedSlices;
              
              const angleStep = 360 / denominator;
              // Add minor offset margins so they look like distinct segments
              const paddingAngle = Math.min(4, angleStep / 4);
              const startAngle = (sliceIndex * angleStep + paddingAngle) * (Math.PI / 180);
              const endAngle = ((sliceIndex + 1) * angleStep - paddingAngle) * (Math.PI / 180);
              
              const innerRadius = 8;
              const outerRadius = 40;

              const x1 = 50 + innerRadius * Math.cos(startAngle);
              const y1 = 50 + innerRadius * Math.sin(startAngle);
              const x2 = 50 + outerRadius * Math.cos(startAngle);
              const y2 = 50 + outerRadius * Math.sin(startAngle);
              
              const x3 = 50 + outerRadius * Math.cos(endAngle);
              const y3 = 50 + outerRadius * Math.sin(endAngle);
              const x4 = 50 + innerRadius * Math.cos(endAngle);
              const y4 = 50 + innerRadius * Math.sin(endAngle);
              
              const largeArcFlag = angleStep > 180 ? 1 : 0;
              
              const pathData = `
                M ${x1} ${y1} 
                L ${x2} ${y2} 
                A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} 
                L ${x4} ${y4} 
                A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1} 
                Z
              `;

              return (
                <path
                  key={sliceIndex}
                  d={pathData}
                  fill={isSelected ? '#f39c12' : '#ffd394'}
                  stroke="#e67e22"
                  strokeWidth="1"
                  className={`${interactive ? 'cursor-pointer hover:fill-orange-400 transition-all active:scale-95' : ''}`}
                  onClick={() => interactive && onSliceToggle(absIndex)}
                />
              );
            })}
          </svg>
          <div className="absolute top-1 left-2.5 bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
            Whole {wholeIndex + 1}
          </div>
        </div>
      );
    } else {
      return (
        <div key={wholeIndex} className="relative w-28 sm:w-36 md:w-40 bg-purple-50 rounded-xl shadow-md border border-purple-200/50 p-2.5 flex flex-col justify-center gap-1.5">
          <div className="text-[10px] font-black text-purple-700 bg-purple-200/50 self-start px-2 py-0.5 rounded-full mb-1">
            Whole {wholeIndex + 1}
          </div>
          <div className="grid grid-cols-2 gap-1.5 w-full">
            {slices.map((_, sliceIndex) => {
              const absIndex = wholeIndex * denominator + sliceIndex;
              const isSelected = absIndex < selectedSlices;

              return (
                <button
                  key={sliceIndex}
                  onClick={() => interactive && onSliceToggle(absIndex)}
                  disabled={!interactive}
                  className={`h-11 sm:h-14 rounded-lg font-bold text-xs flex items-center justify-center border-2 transition-all active:scale-95 ${
                    isSelected 
                      ? 'bg-purple-600 border-purple-700 text-purple-50 shadow-sm' 
                      : 'bg-purple-100/60 border-purple-200 text-purple-400 hover:bg-purple-100'
                  }`}
                >
                  {sliceIndex + 1}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-6 py-6 px-2 bg-white/70 rounded-3xl shadow-inner border border-orange-100/30">
      {wholes.map((_, index) => renderWhole(index))}
    </div>
  );
}

function SandboxMode({ triggerSound }) {
  const [foodType, setFoodType] = useState('pizza'); // 'pizza' | 'orange' | 'bar'
  const [denominator, setDenominator] = useState(4); // 2, 3, 4, 8
  const [selectedSlices, setSelectedSlices] = useState(5); // Default improper 5/4

  // Handler for slice interactions
  const handleSliceToggle = (clickedAbsIndex) => {
    triggerSound('click');
    // If user clicks an unselected slice, set total selected to cover up to that index
    // If they click an already selected slice, we can set selected to exactly that index (or toggle)
    if (clickedAbsIndex >= selectedSlices) {
      setSelectedSlices(clickedAbsIndex + 1);
    } else {
      setSelectedSlices(clickedAbsIndex);
    }
  };

  const maxTotalSlices = denominator * 3;

  // Fraction Math calculations
  const wholeNumber = Math.floor(selectedSlices / denominator);
  const leftoverNumerator = selectedSlices % denominator;
  const isImproper = selectedSlices >= denominator;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Visual Workspace Area */}
      <div className="lg:col-span-8 bg-white/80 p-6 rounded-3xl shadow-xl border border-orange-100 flex flex-col gap-6">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-orange-50 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800">1. Interactive Sandbox Workspace</h3>
            <p className="text-xs font-semibold text-slate-500">Slice, tap, and watch fractions convert in real-time!</p>
          </div>
          
          {/* Quick Preset Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => { setFoodType('pizza'); triggerSound('click'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                foodType === 'pizza' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              🍕 Pizza
            </button>
            <button
              onClick={() => { setFoodType('orange'); triggerSound('click'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                foodType === 'orange' ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              🍊 Orange
            </button>
            <button
              onClick={() => { setFoodType('bar'); triggerSound('click'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                foodType === 'bar' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              🍫 Grid Bar
            </button>
          </div>
        </div>

        {/* Dynamic visual food models */}
        <FoodVisualizer 
          foodType={foodType}
          denominator={denominator}
          selectedSlices={selectedSlices}
          onSliceToggle={handleSliceToggle}
        />

        {/* Dynamic Sliders to tweak parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
          {/* Slices per Whole slider */}
          <div>
            <label className="block text-xs font-black text-slate-500 tracking-wider uppercase mb-2">
              🔪 Split Food Into (Denominator): <span className="text-amber-600 font-extrabold text-sm">{denominator} parts</span>
            </label>
            <div className="flex gap-2">
              {[2, 3, 4, 8].map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDenominator(d);
                    setSelectedSlices(Math.min(selectedSlices, d * 3));
                    triggerSound('click');
                  }}
                  className={`flex-1 py-2 rounded-xl text-sm font-extrabold transition-all border ${
                    denominator === d 
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {d === 2 ? 'Halves' : d === 3 ? 'Thirds' : d === 4 ? 'Quarters' : 'Eighths'} ({d})
                </button>
              ))}
            </div>
          </div>

          {/* Slices filled slider */}
          <div>
            <label className="block text-xs font-black text-slate-500 tracking-wider uppercase mb-2">
              ⭐ Total Active Slices (Numerator): <span className="text-rose-500 font-extrabold text-sm">{selectedSlices} of {maxTotalSlices}</span>
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range"
                min="0"
                max={maxTotalSlices}
                value={selectedSlices}
                onChange={(e) => {
                  setSelectedSlices(parseInt(e.target.value));
                  triggerSound('click');
                }}
                className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-bold bg-white px-2.5 py-1 rounded-lg border text-slate-600 shrink-0 shadow-sm">
                {selectedSlices} slices
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Math Board sidebar */}
      <div className="lg:col-span-4 bg-gradient-to-tr from-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div>
          <h3 className="text-lg font-black text-amber-400 flex items-center gap-1.5">
            <Lightbulb size={20} />
            Mathematical Board
          </h3>
          <p className="text-xs text-slate-300">Formulas update live with your slicing!</p>
        </div>

        {/* Live Equation Display */}
        <div className="space-y-4">
          {/* Improper display card */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
            <span className="text-[10px] uppercase font-black text-rose-400 tracking-wider mb-2">Improper Fraction</span>
            
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-white px-3 py-1 bg-rose-500/20 rounded-lg border border-rose-500/30 animate-pulse">
                  {selectedSlices}
                </span>
                <div className="w-10 h-1 bg-white my-1 rounded" />
                <span className="text-xl font-bold text-slate-300">
                  {denominator}
                </span>
              </div>
              <span className="text-xs text-slate-400 italic">
                {isImproper ? 'Numerator is larger than denominator!' : 'Proper fraction'}
              </span>
            </div>
          </div>

          <div className="flex justify-center text-amber-400 font-extrabold text-xl">＝</div>

          {/* Mixed Number display card */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
            <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider mb-2">Mixed Number equivalent</span>
            
            <div className="flex items-center gap-3">
              {wholeNumber > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-black text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-2xl border border-amber-400/25">
                    {wholeNumber}
                  </span>
                  <span className="text-xs text-slate-400 font-bold mr-1">Whole{wholeNumber > 1 ? 's' : ''}</span>
                </div>
              ) : null}

              {leftoverNumerator > 0 || selectedSlices === 0 ? (
                <div className="flex flex-col items-center">
                  <span className="text-xl font-black text-white">{leftoverNumerator}</span>
                  <div className="w-8 h-0.5 bg-slate-400 my-0.5 rounded" />
                  <span className="text-lg font-semibold text-slate-300">{denominator}</span>
                </div>
              ) : (
                wholeNumber > 0 ? <span className="text-xs text-emerald-400 font-bold italic">Perfect Wholes!</span> : <span className="text-slate-500">0</span>
              )}
            </div>
          </div>
        </div>

        {/* Step-by-Step interactive guide banner */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest border-b border-white/10 pb-1.5">
            How is this worked out?
          </h4>
          <div className="text-xs text-slate-400 space-y-2.5">
            <div>
              <p className="text-slate-200 font-bold mb-0.5">Step 1: Divide Slices by Whole</p>
              <code className="text-amber-400 bg-black/30 px-1.5 py-0.5 rounded block">
                {selectedSlices} ÷ {denominator} = {wholeNumber} with a remainder of {leftoverNumerator}
              </code>
            </div>
            <div>
              <p className="text-slate-200 font-bold mb-0.5">Step 2: Assemble Mixed Number</p>
              <p>The whole division is your big number <span className="text-amber-300 font-bold">({wholeNumber})</span>, the remainder is the leftover numerator <span className="text-amber-300 font-bold">({leftoverNumerator})</span>, and split part is still <span className="text-amber-300 font-bold">({denominator})</span>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestMode({ 
  score, 
  setScore, 
  streak, 
  setStreak, 
  highestStreak, 
  setHighestStreak, 
  triggerSound 
}) {
  const [questDenominator, setQuestDenominator] = useState(4);
  const [targetWhole, setTargetWhole] = useState(1);
  const [targetLeftover, setTargetLeftover] = useState(1);
  const [questFoodType, setQuestFoodType] = useState('pizza');
  const [userSlices, setUserSlices] = useState(0);
  const [questStatus, setQuestStatus] = useState('idle'); // 'idle' | 'success' | 'fail'
  const [questMessage, setQuestMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(45);
  const [gameActive, setGameActive] = useState(false);

  const timerRef = useRef(null);

  // Helper lists matching video categories
  const denominatorsPool = [2, 3, 4, 8];
  const foodTypesPool = ['pizza', 'orange', 'bar'];

  // Start a brand new Chef Order / Question
  const generateNewQuest = () => {
    // Pick random food, denominator & quantities
    const randomFood = foodTypesPool[Math.floor(Math.random() * foodTypesPool.length)];
    const randomDenom = denominatorsPool[Math.floor(Math.random() * denominatorsPool.length)];
    
    // Wholes from 1 to 2, leftovers from 1 to denom-1
    const randWhole = Math.floor(Math.random() * 2) + 1; // 1 or 2
    const randLeftover = Math.floor(Math.random() * (randomDenom - 1)) + 1; // At least 1 leftover slice

    setQuestFoodType(randomFood);
    setQuestDenominator(randomDenom);
    setTargetWhole(randWhole);
    setTargetLeftover(randLeftover);
    
    setUserSlices(0);
    setQuestStatus('idle');
    setQuestMessage('');
  };

  // Launch a game session
  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeRemaining(45);
    setGameActive(true);
    generateNewQuest();
    triggerSound('click');
  };

  // Handle Game Timer count
  useEffect(() => {
    if (gameActive && timeRemaining > 0 && questStatus === 'idle') {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && gameActive) {
      setGameActive(false);
      triggerSound('incorrect');
    }
    return () => clearTimeout(timerRef.current);
  }, [timeRemaining, gameActive, questStatus]);

  // Handle slice selection logic
  const handleUserSliceToggle = (clickedAbsIndex) => {
    if (questStatus !== 'idle') return;
    triggerSound('click');
    if (clickedAbsIndex >= userSlices) {
      setUserSlices(clickedAbsIndex + 1);
    } else {
      setUserSlices(clickedAbsIndex);
    }
  };

  // Serve/Verify order calculations
  const verifyOrder = () => {
    const requiredSlices = (targetWhole * questDenominator) + targetLeftover;
    
    if (userSlices === requiredSlices) {
      // Correct!
      setQuestStatus('success');
      setScore(prev => prev + 150 + streak * 10);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);
      setQuestMessage('Delicious! Perfectly converted and sliced. Serving standard!');
      triggerSound('correct');
    } else {
      // Incorrect
      setQuestStatus('fail');
      setStreak(0);
      setQuestMessage(`Oops! You served ${userSlices} slices, but customer ordered exactly ${requiredSlices} slices (${targetWhole} Whole & ${targetLeftover}/${questDenominator}). Try resetting!`);
      triggerSound('incorrect');
    }
  };

  return (
    <div className="bg-white/80 p-6 rounded-3xl shadow-xl border border-orange-100 max-w-4xl mx-auto">
      {/* Game lobby if not active */}
      {!gameActive ? (
        <div className="text-center py-12 px-4 flex flex-col items-center max-w-lg mx-auto">
          <div className="bg-rose-100 p-4 rounded-3xl text-rose-500 mb-4 animate-bounce">
            <ChefHat size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-800">Chef's Quest Conversion Challenge</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">
            Help the Bakery prepare customized fractions of Pizza, Orange or Chocolate! Match the mixed numbers requested by customers by slicing and serving correct portions under pressure.
          </p>

          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl w-full text-left mb-6 space-y-2 text-xs text-slate-600">
            <p className="font-bold text-slate-700">🏆 Rules & Scoring:</p>
            <p>✔ Every correct serving awards +150 Points + Streak multipliers.</p>
            <p>✔ Build streaks to supercharge score.</p>
            <p>✔ Timer is set to 45 seconds to check how many conversions you can serve!</p>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-base py-3.5 rounded-2xl shadow-xl hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Play size={20} />
            Start Baking Quest!
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active HUD Info */}
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-400 uppercase">Timer:</span>
              <div className={`px-3 py-1 rounded-full text-sm font-extrabold shadow-sm ${
                timeRemaining < 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200 text-slate-700'
              }`}>
                ⏰ {timeRemaining}s
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-400 uppercase font-mono">Streak:</span>
              <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                🔥 {streak}
              </span>
              <span className="text-[10px] font-bold text-slate-400">Best: {highestStreak}</span>
            </div>

            <button
              onClick={() => { setGameActive(false); triggerSound('click'); }}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg"
            >
              End Game
            </button>
          </div>

          {/* Customer Avatar Order Window */}
          <div className="bg-gradient-to-tr from-amber-500/10 to-rose-500/10 p-5 rounded-3xl border border-rose-100/40 relative flex flex-col md:flex-row items-center gap-6">
            {/* Visual Monster / Customer SVG */}
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-md p-3.5 flex items-center justify-center relative shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="4" />
                {/* Cute Monster Eye */}
                <circle cx="35" cy="40" r="8" fill="white" />
                <circle cx="35" cy="40" r="4" fill="#333" />
                <circle cx="65" cy="40" r="8" fill="white" />
                <circle cx="65" cy="40" r="4" fill="#333" />
                {/* Smile */}
                <path d="M 30 65 Q 50 85 70 65" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
                {/* Chef Hat atop */}
                <path d="M 40 12 C 40 2 60 2 60 12 Z" fill="#fff" />
              </svg>
              <div className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black p-1 rounded-full shadow">
                ORDER
              </div>
            </div>

            {/* Speaking Bubble */}
            <div className="space-y-2 text-center md:text-left flex-1">
              <p className="text-sm font-semibold text-slate-500 flex items-center justify-center md:justify-start gap-1">
                <Smile size={16} className="text-amber-500" />
                Hungry Customer demands:
              </p>
              
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Formula display of Request */}
                <div className="bg-white px-5 py-3.5 rounded-2xl shadow-md border border-amber-100/50 flex items-center gap-3">
                  <span className="text-base font-bold text-slate-600">I want exactly</span>
                  
                  {/* Mixed fraction output */}
                  <div className="flex items-center gap-1 bg-amber-50/70 p-2 rounded-xl border border-amber-100">
                    <span className="text-3xl font-black text-amber-600">{targetWhole}</span>
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-black text-slate-800">{targetLeftover}</span>
                      <div className="w-5 h-0.5 bg-slate-500 my-0.5" />
                      <span className="text-sm font-bold text-slate-600">{questDenominator}</span>
                    </div>
                  </div>

                  <span className="text-lg font-extrabold text-slate-700 capitalize">
                    {questFoodType === 'pizza' ? '🍕 Pizzas' : questFoodType === 'orange' ? '🍊 Oranges' : '🍫 Grid Bars'}
                  </span>
                </div>

                {/* Secret Help Tooltip conversion indicator */}
                <div className="text-xs text-slate-500 bg-white/70 px-3 py-2 rounded-xl border border-dashed border-slate-200">
                  💡 Hint: <strong className="text-slate-700">Multiply</strong> Whole by Denominator, then <strong className="text-slate-700">add</strong> leftover. 
                  <span className="block text-slate-500 font-mono mt-0.5">({targetWhole} × {questDenominator}) + {targetLeftover} = { (targetWhole * questDenominator) + targetLeftover } slices.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive food setup */}
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-sm font-bold text-slate-600">Prepare serving below by clicking the slices to slice them!</h4>
              <p className="text-xs text-slate-400">Selected total slices: <span className="font-extrabold text-rose-500 text-sm">{userSlices}</span></p>
            </div>

            <FoodVisualizer 
              foodType={questFoodType}
              denominator={questDenominator}
              selectedSlices={userSlices}
              onSliceToggle={handleUserSliceToggle}
              interactive={questStatus === 'idle'}
            />

            {/* Serve & Quest Status controls */}
            <div className="flex flex-col items-center gap-3">
              {questStatus === 'idle' ? (
                <div className="flex gap-2 w-full max-w-sm">
                  <button
                    onClick={() => { setUserSlices(0); triggerSound('click'); }}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 rounded-xl text-sm transition-all"
                  >
                    Reset Slices
                  </button>
                  <button
                    onClick={verifyOrder}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 text-white font-extrabold py-2.5 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Serve Order!
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-lg p-4 rounded-2xl text-center space-y-3 animate-in slide-in-from-bottom duration-300">
                  {questStatus === 'success' ? (
                    <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl">
                      <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
                        <Smile size={24} className="animate-bounce" />
                        <span className="font-black text-sm">Perfect Delivery! +150 XP</span>
                      </div>
                      <p className="text-xs text-emerald-800">{questMessage}</p>
                    </div>
                  ) : (
                    <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl">
                      <div className="flex items-center justify-center gap-2 text-rose-600 mb-1">
                        <XCircle size={24} />
                        <span className="font-black text-sm">Order Denied!</span>
                      </div>
                      <p className="text-xs text-rose-800">{questMessage}</p>
                    </div>
                  )}

                  <button
                    onClick={() => { generateNewQuest(); triggerSound('click'); }}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow transition-all inline-flex items-center gap-1"
                  >
                    Next Customer Please
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Grid matching visually represented fractions with Improper and Mixed values
function MatchMode({ score, setScore, triggerSound }) {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [movesCount, setMovesCount] = useState(0);

  // Initialize Memory Match levels
  const setupMatchGame = () => {
    // Generate 4 matched pairs of conversions (Improper & Mixed equivalents)
    // 1. 3/2 <-> 1 1/2
    // 2. 9/4 <-> 2 1/4
    // 3. 10/8 <-> 1 2/8 (or 1 1/4)
    // 4. 11/3 <-> 3 2/3
    const matchData = [
      { id: '1a', pairId: 1, type: 'improper', valStr: '3/2', display: '3/2 (Halves)', color: 'amber' },
      { id: '1b', pairId: 1, type: 'mixed', valStr: '1 1/2', display: '1 1/2 (Orange halves)', color: 'amber' },
      
      { id: '2a', pairId: 2, type: 'improper', valStr: '9/4', display: '9/4 (Quarters)', color: 'rose' },
      { id: '2b', pairId: 2, type: 'mixed', valStr: '2 1/4', display: '2 1/4 (Pizza quarters)', color: 'rose' },
      
      { id: '3a', pairId: 3, type: 'improper', valStr: '10/8', display: '10/8 (Eighths)', color: 'purple' },
      { id: '3b', pairId: 3, type: 'mixed', valStr: '1 2/8', display: '1 2/8 (Choc bars)', color: 'purple' },
      
      { id: '4a', pairId: 4, type: 'improper', valStr: '11/3', display: '11/3 (Thirds)', color: 'indigo' },
      { id: '4b', pairId: 4, type: 'mixed', valStr: '3 2/3', display: '3 2/3 (Pie thirds)', color: 'indigo' },
    ];

    // Shuffle cards
    const shuffled = [...matchData].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setMatchedIds([]);
    setGameWon(false);
    setMovesCount(0);
  };

  useEffect(() => {
    setupMatchGame();
  }, []);

  // Handle Card Click selection
  const handleCardClick = (card) => {
    if (matchedIds.includes(card.id) || selectedCards.find(c => c.id === card.id) || selectedCards.length >= 2) return;
    
    triggerSound('click');
    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMovesCount(prev => prev + 1);
      // Check for match pairing
      if (newSelected[0].pairId === newSelected[1].pairId) {
        // Correct pair!
        setTimeout(() => {
          setMatchedIds(prev => {
            const updated = [...prev, newSelected[0].id, newSelected[1].id];
            if (updated.length === cards.length) {
              setGameWon(true);
              setScore(score => score + 500);
              triggerSound('victory');
            } else {
              triggerSound('correct');
            }
            return updated;
          });
          setSelectedCards([]);
        }, 500);
      } else {
        // Not matched - flip back
        setTimeout(() => {
          setSelectedCards([]);
          triggerSound('incorrect');
        }, 1200);
      }
    }
  };

  return (
    <div className="bg-white/80 p-6 rounded-3xl shadow-xl border border-orange-100 max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-extrabold text-slate-800">🥗 Memory Equivalents Board</h3>
        <p className="text-xs text-slate-500">Pair matching Improper and Mixed Numbers values together!</p>
      </div>

      {gameWon ? (
        <div className="text-center py-10 space-y-4 max-w-sm mx-auto">
          <div className="bg-gradient-to-tr from-amber-400 to-rose-500 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-amber-500/20 animate-bounce">
            <Award size={36} />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-800">Fabulous Job Chef!</h4>
            <p className="text-xs text-slate-500 mt-1">
              You cleared all equivalent couples successfully in <strong className="text-slate-800">{movesCount} turns</strong>!
            </p>
            <p className="text-xs font-semibold text-emerald-600 mt-2">+500 Points awarded!</p>
          </div>
          <button
            onClick={() => { setupMatchGame(); triggerSound('click'); }}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-sm py-2.5 rounded-xl shadow-md transition-all"
          >
            Play Again!
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between text-xs text-slate-500 px-1">
            <span>Pairs Found: <strong className="text-slate-800">{matchedIds.length / 2} / 4</strong></span>
            <span>Turns Used: <strong className="text-slate-800">{movesCount}</strong></span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cards.map((card) => {
              const isSelected = selectedCards.find(c => c.id === card.id);
              const isMatched = matchedIds.includes(card.id);

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className={`h-28 sm:h-36 rounded-2xl border-2 transition-all p-3.5 flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden active:scale-95 ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700 opacity-60'
                      : isSelected
                      ? 'bg-amber-50 border-amber-500 shadow-md transform rotate-1'
                      : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {/* Decorative Back grid lines if not flipped */}
                  {!isSelected && !isMatched && (
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:12px_12px]" />
                  )}

                  {/* Card Front content */}
                  {(isSelected || isMatched) ? (
                    <>
                      <div className="bg-slate-200/60 text-[10px] font-black tracking-widest text-slate-500 px-1.5 py-0.5 rounded-md uppercase">
                        {card.type === 'improper' ? 'Improper' : 'Mixed No.'}
                      </div>
                      <div className="text-2xl font-black text-slate-800">
                        {card.valStr}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400">
                        {card.display}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gradient-to-tr from-rose-500 to-amber-500 p-2.5 rounded-xl text-white shadow-sm">
                        <Pizza size={22} className="animate-spin-slow" />
                      </div>
                      <span className="text-xs font-black text-slate-400 tracking-wider">TAP CARD</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => { setupMatchGame(); triggerSound('click'); }}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 mx-auto"
            >
              <RefreshCw size={12} />
              Reset Cards Layout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}