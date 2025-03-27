'use client';

import React from 'react';

interface GameControlsProps {
  onRestart: () => void;
}

export default function GameControls({ onRestart }: GameControlsProps) {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="bg-secondary text-white px-6 py-2 rounded-lg text-lg hover:bg-primary transition-colors"
        >
          Start forfra
        </button>
      </div>
    </div>
  );
} 