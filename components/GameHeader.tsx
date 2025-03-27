'use client';

import React from 'react';
import { MESSAGES } from '../lib/messages';
import { CONFIG } from '../lib/config';

interface GameHeaderProps {
  number: number;
  step: number;
  score: number;
  streak: number;
  bestStreak: number;
  questionsAnswered: number;
}

export default function GameHeader({ number, step, score, streak, bestStreak, questionsAnswered }: GameHeaderProps) {
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
          style={{ width: `${(questionsAnswered / CONFIG.QUESTIONS_PER_GAME) * 100}%` }}
        />
      </div>
    </div>
  );
} 