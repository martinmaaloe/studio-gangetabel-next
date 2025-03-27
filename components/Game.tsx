'use client';

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../lib/hooks/useLocalStorage';
import { CONFIG } from '../lib/config';
import { MESSAGES } from '../lib/messages';
import GameBoard from './GameBoard';
import GameHeader from './GameHeader';
import GameControls from './GameControls';
import GameResults from './GameResults';
import { LeaderboardEntry } from './Leaderboard';
import Leaderboard from './Leaderboard';

interface GameState {
  playerName: string;
  chosenNumber: number | null;
  currentStep: number | null;
  questionsAnswered: number;
  wrongAnswers: number;
  score: number;
  currentStreak: number;
  bestStreak: number;
}

const initialGameState: GameState = {
  playerName: '',
  chosenNumber: null,
  currentStep: null,
  questionsAnswered: 0,
  wrongAnswers: 0,
  score: 0,
  currentStreak: 0,
  bestStreak: 0,
};

export default function Game() {
  const [gameState, setGameState] = useLocalStorage<GameState>('gangetabel_game_state', initialGameState);
  const [currentScreen, setCurrentScreen] = useState<'name' | 'start' | 'game' | 'end'>('name');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

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
      currentStep: getRandomNumber(),
      questionsAnswered: 0,
      wrongAnswers: 0,
      score: 0,
      currentStreak: 0,
    }));
  };

  const saveToLeaderboard = () => {
    const storedEntries = localStorage.getItem(CONFIG.LEADERBOARD_KEY);
    let entries: LeaderboardEntry[] = storedEntries ? JSON.parse(storedEntries) : [];
    
    const newEntry: LeaderboardEntry = {
      playerName: gameState.playerName,
      score: gameState.score,
      bestStreak: gameState.bestStreak,
      wrongAnswers: gameState.wrongAnswers,
      chosenNumber: gameState.chosenNumber || 0,
      date: new Date().toISOString()
    };
    
    entries.push(newEntry);
    
    // Keep only the top 100 entries
    if (entries.length > 100) {
      entries.sort((a, b) => b.score - a.score);
      entries = entries.slice(0, 100);
    }
    
    localStorage.setItem(CONFIG.LEADERBOARD_KEY, JSON.stringify(entries));
  };

  const checkAnswer = (selected: number, correct: number) => {
    // Track if this is a first attempt for this question
    const isFirstAttempt = true; // We'll assume each question is a new attempt

    if (selected === correct) {
      const newStep = getRandomNumber();
      const newQuestionsAnswered = (gameState.questionsAnswered || 0) + 1;
      const totalAttempts = newQuestionsAnswered + gameState.wrongAnswers;
      
      // Calculate score with accuracy formula
      // Score = (Correct Answers × Base Points) × (Correct Answers / Total Attempts)
      const accuracyRatio = newQuestionsAnswered / totalAttempts;
      const newScore = Math.round(newQuestionsAnswered * CONFIG.POINTS_PER_CORRECT * accuracyRatio);
      
      const newStreak = gameState.currentStreak + 1;
      const newBestStreak = Math.max(gameState.bestStreak, newStreak);

      if (newQuestionsAnswered >= CONFIG.QUESTIONS_PER_GAME) {
        setGameState(prev => ({
          ...prev,
          score: newScore,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          questionsAnswered: newQuestionsAnswered,
        }));
        
        // Save to leaderboard when game is completed
        setTimeout(() => {
          saveToLeaderboard();
          setCurrentScreen('end');
        }, 100);
      } else {
        setGameState(prev => ({
          ...prev,
          currentStep: newStep,
          score: newScore,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          questionsAnswered: newQuestionsAnswered,
        }));
      }
    } else {
      // Increment wrong answers counter
      setGameState(prev => {
        const newWrongAnswers = prev.wrongAnswers + 1;
        const totalAttempts = prev.questionsAnswered + newWrongAnswers;
        
        // Recalculate score with new accuracy ratio
        const accuracyRatio = prev.questionsAnswered / totalAttempts;
        const newScore = Math.round(prev.questionsAnswered * CONFIG.POINTS_PER_CORRECT * accuracyRatio);
        
        return {
          ...prev,
          wrongAnswers: newWrongAnswers,
          score: newScore,
          currentStreak: 0
        };
      });
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

  // Helper function to get random number between 2-10
  const getRandomNumber = () => {
    return Math.floor(Math.random() * 9) + 2; // Random number between 2-10
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
          
          <div className="mt-8">
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="bg-secondary text-white px-6 py-2 rounded-lg text-lg hover:opacity-90 transition-opacity"
            >
              {showLeaderboard ? 'Skjul leaderboard' : 'Vis leaderboard'}
            </button>
            
            {showLeaderboard && (
              <Leaderboard onClose={() => setShowLeaderboard(false)} />
            )}
          </div>
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
            questionsAnswered={gameState.questionsAnswered}
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
          wrongAnswers={gameState.wrongAnswers}
          onRestart={restartGame}
        />
      )}
    </div>
  );
} 