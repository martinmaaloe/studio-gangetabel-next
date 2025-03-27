'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CONFIG } from '../lib/config';
import { MESSAGES } from '../lib/messages';

interface GameBoardProps {
  number: number;
  step: number;
  onAnswer: (selected: number, correct: number) => void;
  playerName: string;
}

export default function GameBoard({ number, step, onAnswer, playerName }: GameBoardProps) {
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    generateOptions();
  }, [number, step]);

  const generateOptions = () => {
    const correctAnswer = number * step;
    const newOptions = [correctAnswer];

    while (newOptions.length < CONFIG.OPTIONS_PER_QUESTION) {
      const randomOption = Math.floor(Math.random() * (correctAnswer + 10)) + 1;
      if (!newOptions.includes(randomOption)) {
        newOptions.push(randomOption);
      }
    }

    // Shuffle options
    setOptions(newOptions.sort(() => Math.random() - 0.5));
  };

  const triggerConfetti = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    // Convert to relative coordinates (0-1)
    const x = buttonCenterX / window.innerWidth;
    const y = buttonCenterY / window.innerHeight;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      startVelocity: 30,
      gravity: 0.8,
      ticks: 200,
      colors: ['#4F46E5', '#7C3AED', '#10B981', '#3B82F6', '#EC4899']
    });
  };

  const handleAnswer = (selected: number, event: React.MouseEvent<HTMLButtonElement>) => {
    const correctAnswer = number * step;
    
    if (selected === correctAnswer) {
      setFeedback(getRandomMessage(MESSAGES.correct));
      setFeedbackType('success');
      triggerConfetti(event);
    } else {
      setFeedback(getRandomMessage(MESSAGES.wrong));
      setFeedbackType('error');
    }

    onAnswer(selected, correctAnswer);
  };

  const getRandomMessage = (messages: readonly string[]) => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex].replace('{name}', playerName);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">
        Hvad er {number} x {step}?
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={(event) => handleAnswer(option, event)}
            className="bg-primary text-white p-4 rounded-lg text-xl font-semibold hover:bg-secondary hover:transform hover:scale-105 transition-all"
          >
            {option}
          </button>
        ))}
      </div>

      {feedback && (
        <p className={`text-center text-lg ${
          feedbackType === 'success' ? 'text-success' : 'text-error'
        }`}>
          {feedback}
        </p>
      )}
    </div>
  );
} 