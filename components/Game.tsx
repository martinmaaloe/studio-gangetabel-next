'use client';

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../lib/hooks/useLocalStorage';
import { CONFIG } from '../lib/config';
import { MESSAGES } from '../lib/messages';
import GameHeader from './GameHeader';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import GameResults from './GameResults';

interface GameState {
  playerName: string;
  chosenNumber: number | null;
  currentStep: number | null;
  score: number;
  currentStreak: number;
  bestStreak: number;
}

const initialGameState: GameState = {
  playerName: '',
  chosenNumber: null,
  currentStep: null,
  score: 0,
  currentStreak: 0,
  bestStreak: 0,
};

export default function Game() {
  const [gameState, setGameState] = useLocalStorage<GameState>('gangetabel_game_state', initialGameState);
  const [currentScreen, setCurrentScreen] = useState<'name' | 'start' | 'game' | 'end'>('name');

  useEffect(() => {
    if (gameState.playerName) {
      if (gameState.chosenNumber && gameState.currentStep) {
        setCurrentScreen('game');
      } else {
        setCurrentScreen('start');
      }
    } else {
      setCurrentScreen('name');
    }
  }, [gameState.playerName, gameState.chosenNumber, gameState.currentStep]);

  const saveName = (name: string) => {
    if (name.trim()) {
      setGameState(prev => ({ ...prev, playerName: name.trim() }));
    }
  };

  const startGame = (number: number) => {
    setGameState(prev => ({
      ...prev,
      chosenNumber: number,
      currentStep: CONFIG.START_STEP,
      score: 0,
      currentStreak: 0,
    }));
  };

  const checkAnswer = (selected: number, correct: number) => {
    if (selected === correct) {
      const newStep = (gameState.currentStep || CONFIG.START_STEP) + 1;
      const newScore = gameState.score + CONFIG.POINTS_PER_CORRECT;
      const newStreak = gameState.currentStreak + 1;
      const newBestStreak = Math.max(gameState.bestStreak, newStreak);

      if (newStep > CONFIG.MAX_STEPS) {
        setGameState(prev => ({
          ...prev,
          score: newScore,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
        }));
        setCurrentScreen('end');
      } else {
        setGameState(prev => ({
          ...prev,
          currentStep: newStep,
          score: newScore,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
        }));
      }
    } else {
      setGameState(prev => ({ ...prev, currentStreak: 0 }));
    }
  };

  const restartGame = () => {
    setGameState(prev => ({
      ...prev,
      chosenNumber: null,
      currentStep: null,
      score: 0,
      currentStreak: 0,
    }));
    setCurrentScreen('start');
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-primary mb-8 text-shadow">
        Gangetabel Spil 2.0
      </h1>

      {currentScreen === 'name' && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl text-primary mb-4">Velkommen! Indtast dit navn:</h2>
          <input
            type="text"
            placeholder="Dit navn"
            className="w-full max-w-sm mx-auto block p-3 rounded-lg border-2 border-primary text-center font-semibold"
            onKeyPress={(e) => e.key === 'Enter' && saveName(e.currentTarget.value)}
          />
          <button
            className="mt-4 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:transform hover:scale-105 transition-all"
            onClick={(e) => saveName((e.target as HTMLButtonElement).previousElementSibling?.value || '')}
          >
            Start
          </button>
        </div>
      )}

      {currentScreen === 'start' && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl text-primary mb-4">
            {MESSAGES.welcome.replace('{name}', gameState.playerName)}
          </h2>
          <h3 className="text-xl text-success mb-4">{MESSAGES.chooseNumber}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {CONFIG.AVAILABLE_NUMBERS.map(num => (
              <button
                key={num}
                onClick={() => startGame(num)}
                className="bg-primary text-white p-4 rounded-lg text-xl font-semibold hover:bg-secondary hover:transform hover:scale-105 transition-all"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentScreen === 'game' && gameState.chosenNumber && gameState.currentStep && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <GameBoard
            number={gameState.chosenNumber}
            step={gameState.currentStep}
            onAnswer={checkAnswer}
          />
          <GameControls
            score={gameState.score}
            streak={gameState.currentStreak}
            progress={(gameState.currentStep - CONFIG.START_STEP) / (CONFIG.MAX_STEPS - CONFIG.START_STEP + 1) * 100}
          />
        </div>
      )}

      {currentScreen === 'end' && (
        <GameResults
          playerName={gameState.playerName}
          number={gameState.chosenNumber || 0}
          score={gameState.score}
          bestStreak={gameState.bestStreak}
          onRestart={restartGame}
        />
      )}

      <div className="fixed bottom-0 left-0 w-full h-36 bg-gradient-to-t from-primary to-secondary rounded-t-full -z-10" />
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-10">
        <img
          src="/images/ugle2.png"
          alt="Ugle maskot"
          className="w-36 h-auto opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
        />
      </div>
    </div>
  );
} 