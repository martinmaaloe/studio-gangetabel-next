import React from 'react';
import { MESSAGES } from '../lib/messages';

interface GameHeaderProps {
  number: number;
  step: number;
  score: number;
  streak: number;
  bestStreak: number;
}

export default function GameHeader({ number, step, score, streak, bestStreak }: GameHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-lg">
          {MESSAGES.stats.score.replace('{score}', score.toString())}
        </div>
        <div className="text-lg">
          {MESSAGES.stats.streak.replace('{streak}', streak.toString())}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(step / 10) * 100}%` }}
        />
      </div>
    </div>
  );
} 