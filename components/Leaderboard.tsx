'use client';

import React, { useState, useEffect } from 'react';
import { CONFIG } from '../lib/config';

export interface LeaderboardEntry {
  playerName: string;
  score: number;
  bestStreak: number;
  wrongAnswers: number;
  chosenNumber: number;
  date: string;
}

interface LeaderboardProps {
  onClose: () => void;
}

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'date'>('score');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingFallback, setUsingFallback] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // Immediately try to load from localStorage as a backup
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const storedEntries = localStorage.getItem(CONFIG.LEADERBOARD_KEY);
        if (storedEntries) {
          setEntries(JSON.parse(storedEntries));
          setUsingFallback(true);
          setError('Bruger lokal lagring - leaderboard vil kun vises på denne enhed');
          return true;
        }
      } catch (err) {
        console.error('Error loading from localStorage:', err);
      }
      return false;
    };

    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setDebugInfo('Fetching from API...');
        
        // First try the API
        try {
          console.log('Fetching leaderboard from API...');
          const response = await fetch('/api/leaderboard');
          console.log('API response status:', response.status);
          
          const data = await response.json();
          console.log('API response data:', data);
          
          if (response.ok) {
            setEntries(data.entries || []);
            
            // Check if we're using localStorage fallback from the API
            if (data.usingLocalStorage) {
              setUsingFallback(true);
              setError('Bruger lokal lagring - leaderboard vil kun vises på denne enhed');
              setDebugInfo('API returned usingLocalStorage=true');
            } else {
              setUsingFallback(false);
              setError('');
              setDebugInfo('Using Edge Config successfully');
            }
            setLoading(false);
            return;
          }
          
          // API failed but returned a response
          setDebugInfo(`API error: ${data.error || 'Unknown error'}`);
          console.error('API error:', data);
          
          // Fall back to localStorage if API fails
          if (!loadFromLocalStorage()) {
            setEntries([]);
            if (data.error && data.error.includes('Edge Config not configured')) {
              setError('Bruger lokal lagring - leaderboard vil kun vises på denne enhed');
            } else {
              setError(`Kunne ikke hente leaderboard data: ${data.error || 'Unknown error'}`);
            }
          }
        } catch (err) {
          console.error('Error fetching from API:', err);
          setDebugInfo(`API fetch error: ${err instanceof Error ? err.message : String(err)}`);
          
          // API request completely failed, fallback to localStorage
          if (!loadFromLocalStorage()) {
            setEntries([]);
            setError('Kunne ikke hente leaderboard data - netværksfejl');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const sortedEntries = [...entries].sort((a, b) => {
    if (sortBy === 'score') {
      return b.score - a.score;
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-6 relative">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-xl font-bold"
      >
        ✕
      </button>
      
      <h2 className="text-2xl font-bold text-center mb-4">🏆 Leaderboard</h2>
      
      {usingFallback && (
        <div className="bg-yellow-100 p-2 mb-4 rounded text-center text-sm">
          {error}
        </div>
      )}
      
      {error && !usingFallback && (
        <div className="bg-red-100 p-2 mb-4 rounded text-center text-sm">
          {error}
        </div>
      )}
      
      <div className="flex justify-between mb-4">
        <button 
          onClick={() => setSortBy('score')}
          className={`px-4 py-2 rounded ${sortBy === 'score' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Sortér efter point
        </button>
        <button 
          onClick={() => setSortBy('date')}
          className={`px-4 py-2 rounded ${sortBy === 'date' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Seneste først
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-4">Indlæser...</div>
      ) : sortedEntries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">🏆 Point</th>
                <th className="py-2 text-left">Spiller</th>
                <th className="py-2 text-right">Tabel</th>
                <th className="py-2 text-right">🔥 Streak</th>
                <th className="py-2 text-right">🙈 Fejl</th>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.slice(0, 10).map((entry, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 font-bold">{entry.score}</td>
                  <td className="py-2 text-left">{entry.playerName}</td>
                  <td className="py-2 text-right">{entry.chosenNumber}</td>
                  <td className="py-2 text-right">{entry.bestStreak}</td>
                  <td className="py-2 text-right">{entry.wrongAnswers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-4">Ingen resultater endnu. Spil et spil!</p>
      )}
      
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div className="mt-4 text-xs text-gray-500 border-t pt-2">
          <div>Debug: {debugInfo}</div>
        </div>
      )}
    </div>
  );
} 