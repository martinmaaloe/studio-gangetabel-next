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
    <div className="max-w-2xl mx-auto p-4">
      {currentScreen === 'name' && (
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary mb-8">Gangetabel Spil</h1>
          <p className="text-xl mb-4">Hvad hedder du?</p>
          <input
            type="text"
            className="border-2 border-primary rounded-lg px-4 py-2 text-lg w-full max-w-md"
            placeholder="Skriv dit navn her"
            onKeyPress={(e) => e.key === 'Enter' && saveName((e.target as HTMLInputElement).value)}
          />
          <button
            onClick={() => saveName((document.querySelector('input') as HTMLInputElement).value)}
            className="bg-primary text-white px-6 py-2 rounded-lg text-lg hover:bg-secondary transition-colors"
          >
            Start
          </button>
        </div>
      )}

      {currentScreen === 'start' && (
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary mb-8">Gangetabel Spil</h1>
          <p className="text-xl mb-4">{MESSAGES.welcome.replace('{name}', gameState.playerName)}</p>
          <p className="text-lg mb-8">{MESSAGES.chooseNumber}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
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
        <div className="space-y-6">
          <GameHeader
            number={gameState.chosenNumber}
            step={gameState.currentStep}
            score={gameState.score}
            streak={gameState.currentStreak}
            bestStreak={gameState.bestStreak}
          />
          <GameBoard
            number={gameState.chosenNumber}
            step={gameState.currentStep}
            onAnswer={checkAnswer}
            playerName={gameState.playerName}
          />
          <GameControls onRestart={restartGame} />
        </div>
      )}

      {currentScreen === 'end' && (
        <GameResults
          score={gameState.score}
          bestStreak={gameState.bestStreak}
          number={gameState.chosenNumber || 0}
          playerName={gameState.playerName}
          onRestart={restartGame}
        />
      )}
    </div>
  );
} 