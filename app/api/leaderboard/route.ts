import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { CONFIG } from '../../../lib/config';

// Define the LeaderboardEntry type
interface LeaderboardEntry {
  playerName: string;
  score: number;
  bestStreak: number;
  wrongAnswers: number;
  chosenNumber: number;
  date: string;
}

export async function GET() {
  try {
    // Get leaderboard data from KV
    const entries = await kv.get<LeaderboardEntry[]>(CONFIG.LEADERBOARD_KEY) || [];
    
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const entry = await request.json() as Omit<LeaderboardEntry, 'date'>;
    
    // Get current entries
    let entries: LeaderboardEntry[] = await kv.get<LeaderboardEntry[]>(CONFIG.LEADERBOARD_KEY) || [];
    
    // Add new entry
    entries.push({
      ...entry,
      date: new Date().toISOString(),
    });
    
    // Keep only top 100 entries
    if (entries.length > 100) {
      entries.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score);
      entries = entries.slice(0, 100);
    }
    
    // Save back to KV
    await kv.set(CONFIG.LEADERBOARD_KEY, entries);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to leaderboard:', error);
    return NextResponse.json({ error: 'Failed to add to leaderboard' }, { status: 500 });
  }
} 