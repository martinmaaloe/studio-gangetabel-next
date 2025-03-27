import { createClient } from '@vercel/edge-config';
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

// Create Edge Config client
let edgeConfig: ReturnType<typeof createClient> | undefined;
try {
  if (process.env.EDGE_CONFIG) {
    edgeConfig = createClient(process.env.EDGE_CONFIG);
  }
} catch (error) {
  console.error('Error creating Edge Config client:', error);
}

export async function GET() {
  try {
    // Get leaderboard data from Edge Config
    let entries: LeaderboardEntry[] = [];
    
    if (edgeConfig) {
      const data = await edgeConfig.get(CONFIG.LEADERBOARD_KEY);
      entries = Array.isArray(data) ? data : [];
    }
    
    return NextResponse.json({ entries });
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    
    // Check if this is a configuration error
    if (error.message && error.message.includes('Missing required environment variable')) {
      return NextResponse.json({ 
        error: 'Edge Config not configured properly. Please set up Edge Config in Vercel.',
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const entry = await request.json() as Omit<LeaderboardEntry, 'date'>;
    
    // If Edge Config is not available, just return success
    // The client will save to localStorage
    if (!edgeConfig) {
      return NextResponse.json({ success: true, usingLocalStorage: true });
    }
    
    // Get current entries
    const data = await edgeConfig.get(CONFIG.LEADERBOARD_KEY);
    let entries: LeaderboardEntry[] = Array.isArray(data) ? data : [];
    
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
    
    // Save back to Edge Config
    await edgeConfig.set(CONFIG.LEADERBOARD_KEY, entries);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error adding to leaderboard:', error);
    
    // Check if this is a configuration error
    if (error.message && error.message.includes('Missing required environment variable')) {
      return NextResponse.json({ 
        error: 'Edge Config not configured properly. Please set up Edge Config in Vercel.',
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'Failed to add to leaderboard' }, { status: 500 });
  }
} 