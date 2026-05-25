import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { Swords } from 'lucide-react';
import BattleArenaGame from '../games/battle-arena/BattleArena';
import { getTopicById } from '../data/learningData';
import './dashboard.css';

// BattleArena page — thin wrapper, game logic lives in /games/battle-arena/
export default function BattleArena() {
  const { userProfile } = useAuth();
  const subjects = userProfile?.selectedSubjects || userProfile?.subjects || ['programming'];

  // Default demo topic when accessing via sidebar (not from TopicPage)
  const demoTopic = {
    id: 'variables',
    title: 'Variables & Data Types',
    difficulty: 'easy',
    xp: 20,
    game: 'Code Runner',
    enemy: 'syntax-phantom',
    description: 'A quick battle to warm up.',
    questions: [
      { id: 1, question: "Which keyword is block-scoped in modern JS?", options: ['var', 'let', 'int', 'declare'], answer: 'let', explanation: "'let' is block-scoped." },
      { id: 2, question: 'What does typeof null return?', options: ["'null'", "'undefined'", "'object'", "'string'"], answer: "'object'", explanation: 'Historical JS bug — typeof null returns object.' },
      { id: 3, question: 'Which is NOT a primitive type?', options: ['string', 'boolean', 'array', 'undefined'], answer: 'array', explanation: 'Arrays are objects in JS.' },
    ],
  };

  // Try to resolve a personalized topic from URL or user profile
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const topicIdFromUrl = params.get('topicId');
  const profileTopicId = userProfile?.currentTopicId || userProfile?.lastTopicId || null;

  let resolvedTopic = demoTopic;
  if (topicIdFromUrl) {
    const t = getTopicById(topicIdFromUrl);
    if (t) resolvedTopic = t;
  } else if (profileTopicId) {
    const t = getTopicById(profileTopicId);
    if (t) resolvedTopic = t;
  }

  return (
    <div className="dashboard-content">
      <header className="section-header" style={{ marginBottom: '32px' }}>
        <Swords className="section-icon" />
        <div>
          <h2 className="section-title">BATTLE ARENA</h2>
          <p className="stat-label" style={{ marginTop: '4px' }}>
            TIP: Navigate via Subjects → Chapter → Topic for a personalized battle
          </p>
        </div>
      </header>

      <BattleArenaGame topic={resolvedTopic} />
    </div>
  );
}
