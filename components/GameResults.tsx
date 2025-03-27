'use client';

import React from 'react';
import { MESSAGES } from '../lib/messages';

interface GameResultsProps {
  playerName: string;
  number: number;
  score: number;
  bestStreak: number;
  wrongAnswers: number;
  onRestart: () => void;
}

export default function GameResults({
  playerName,
  number,
  score,
  bestStreak,
  wrongAnswers,
  onRestart
}: GameResultsProps) {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold text-primary mb-4">Godt klaret, {playerName}!</h1>
      <p className="text-xl">Du har gennemført {number}-tabellen.</p>
      
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <span className="font-semibold">🏆 Point:</span>
          <span className="text-xl">{score}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">🔥 Højeste streak:</span>
          <span className="text-xl">{bestStreak}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">🙈 Kom igen:</span>
          <span className="text-xl">{wrongAnswers}</span>
        </div>
      </div>
      
      <button
        onClick={onRestart}
        className="bg-primary text-white px-6 py-3 rounded-lg text-lg hover:bg-secondary transition-colors"
      >
        Prøv en anden tabel
      </button>
    </div>
  );
} 