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
  usedCombinations: Set<string>;
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
  usedCombinations: new Set(),
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
      currentStep: getRandomNumber(number, new Set()),
      questionsAnswered: 0,
      wrongAnswers: 0,
      score: 0,
      currentStreak: 0,
      usedCombinations: new Set(),
    }));
  };

  const saveToLeaderboard = async () => {
    const entry = {
      playerName: gameState.playerName,
      score: gameState.score,
      bestStreak: gameState.bestStreak,
      wrongAnswers: gameState.wrongAnswers,
      chosenNumber: gameState.chosenNumber || 0
    };
    
    // Always save to localStorage first for immediate feedback
    saveToLocalStorage(entry);
    
    // Then try to save to the KV database via API
    try {
      console.log('Saving to leaderboard API:', entry);
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
      
      if (!response.ok) {
        console.error('Failed to save to leaderboard API, using localStorage only');
        // We already saved to localStorage above
      } else {
        const data = await response.json();
        if (data.usingLocalStorage) {
          console.log('API is falling back to localStorage');
        } else if (data.entries) {
          console.log('Successfully saved to Edge Config, received updated entries');
          // Store the updated entries in localStorage to ensure immediate visibility
          localStorage.setItem(CONFIG.LEADERBOARD_KEY, JSON.stringify(data.entries));
        } else {
          console.log('Successfully saved to Edge Config');
        }
      }
    } catch (error) {
      console.error('Error saving to leaderboard API:', error);
      // Already saved to localStorage above
    }
  };

  // Helper function to save to localStorage as a fallback
  const saveToLocalStorage = (entry: Omit<LeaderboardEntry, 'date'>) => {
    try {
      // Get current entries from localStorage
      const storedEntries = localStorage.getItem(CONFIG.LEADERBOARD_KEY);
      let entries: LeaderboardEntry[] = storedEntries ? JSON.parse(storedEntries) : [];
      
      // Add new entry with date
      entries.push({
        ...entry,
        date: new Date().toISOString()
      });
      
      // Keep only top 100 entries
      if (entries.length > 100) {
        entries.sort((a, b) => b.score - a.score);
        entries = entries.slice(0, 100);
      }
      
      // Save back to localStorage
      localStorage.setItem(CONFIG.LEADERBOARD_KEY, JSON.stringify(entries));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  };

  const checkAnswer = (selected: number, correct: number) => {
    if (selected === correct) {
      const combination = `${gameState.chosenNumber}x${gameState.currentStep}`;
      const newUsedCombinations = new Set(gameState.usedCombinations);
      newUsedCombinations.add(combination);
      
      const newStep = getRandomNumber(gameState.chosenNumber!, newUsedCombinations);
      const newQuestionsAnswered = (gameState.questionsAnswered || 0) + 1;
      const totalAttempts = newQuestionsAnswered + gameState.wrongAnswers;
      
      // Calculate score with accuracy formula
      const accuracyRatio = newQuestionsAnswered / totalAttempts;
      const newScore = Math.round(newQuestionsAnswered * CONFIG.POINTS_PER_CORRECT * accuracyRatio);
      
      const newStreak = gameState.currentStreak + 1;
      const newBestStreak = Math.max(gameState.bestStreak, newStreak);

      if (newQuestionsAnswered >= CONFIG.QUESTIONS_PER_GAME || newStep === null) {
        setGameState(prev => ({
          ...prev,
          score: newScore,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          questionsAnswered: newQuestionsAnswered,
          usedCombinations: newUsedCombinations,
        }));
        
        // Save to leaderboard when game is completed
        saveToLeaderboard().then(() => {
          setCurrentScreen('end');
        });
      } else {
        setGameState(prev => ({
          ...prev,
          currentStep: newStep,
          score: newScore,
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          questionsAnswered: newQuestionsAnswered,
          usedCombinations: newUsedCombinations,
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

  // Helper function to get random number between 2-10 that hasn't been used before
  const getRandomNumber = (chosenNumber: number, usedCombinations: Set<string>) => {
    const availableNumbers = [];
    for (let i = 2; i <= 10; i++) {
      const combination = `${chosenNumber}x${i}`;
      if (!usedCombinations.has(combination)) {
        availableNumbers.push(i);
      }
    }
    
    if (availableNumbers.length === 0) {
      return null; // All combinations have been used
    }
    
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    return availableNumbers[randomIndex];
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