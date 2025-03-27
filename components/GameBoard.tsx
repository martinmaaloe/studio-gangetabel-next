'use client';

import React, { useState, useEffect } from 'react';
import { CONFIG } from '../lib/config';
import { MESSAGES } from '../lib/messages';

interface GameBoardProps {
  number: number;
  step: number;
  onAnswer: (selected: number, correct: number) => void;
}

export default function GameBoard({ number, step, onAnswer }: GameBoardProps) {
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

  const handleAnswer = (selected: number) => {
    const correctAnswer = number * step;
    
    if (selected === correctAnswer) {
      setFeedback(getRandomMessage(MESSAGES.correct));
      setFeedbackType('success');
      // Trigger confetti animation here if needed
    } else {
      setFeedback(getRandomMessage(MESSAGES.wrong));
      setFeedbackType('error');
    }

    onAnswer(selected, correctAnswer);
  };

  const getRandomMessage = (messages: readonly string[]) => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
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
            onClick={() => handleAnswer(option)}
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