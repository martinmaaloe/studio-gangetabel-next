'use client';

import React from 'react';
import { MESSAGES } from '../lib/messages';

interface GameResultsProps {
  playerName: string;
  number: number;
  score: number;
  bestStreak: number;
  onRestart: () => void;
}

export default function GameResults({
  playerName,
  number,
  score,
  bestStreak,
  onRestart
}: GameResultsProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center">
      <h2 className="text-2xl text-primary mb-6">
        {MESSAGES.endGame
          .replace('{name}', playerName)
          .replace('{number}', number.toString())}
      </h2>

      <div className="bg-white/10 rounded-lg p-4 mb-6">
        <p className="text-xl mb-2">
          {MESSAGES.stats.finalScore.replace('{score}', score.toString())}
        </p>
        <p className="text-xl">
          {MESSAGES.stats.bestStreak.replace('{streak}', bestStreak.toString())}
        </p>
      </div>

      <button
        onClick={onRestart}
        className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:transform hover:scale-105 transition-all"
      >
        Spil igen
      </button>
    </div>
  );
} 