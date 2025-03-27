'use client';

import React from 'react';
import { MESSAGES } from '../lib/messages';

interface GameControlsProps {
  score: number;
  streak: number;
  progress: number;
}

export default function GameControls({ score, streak, progress }: GameControlsProps) {
  return (
    <div className="space-y-4 mt-6">
      <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-success transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-lg font-semibold">
        <span>
          {MESSAGES.stats.score.replace('{score}', score.toString())}
        </span>
        <span>
          {MESSAGES.stats.streak.replace('{streak}', streak.toString())}
        </span>
      </div>
    </div>
  );
} 