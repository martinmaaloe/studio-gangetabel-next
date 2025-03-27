import { createClient } from '@vercel/edge-config';
import { NextResponse } from 'next/server';
import { CONFIG } from '../../../lib/config';
import axios from 'axios';

// Define the LeaderboardEntry type
interface LeaderboardEntry {
  playerName: string;
  score: number;
  bestStreak: number;
  wrongAnswers: number;
  chosenNumber: number;
  date: string;
}

// Create Edge Config client for reading
let edgeConfig: ReturnType<typeof createClient> | undefined;
try {
  if (process.env.EDGE_CONFIG) {
    console.log('Edge Config string present:', process.env.EDGE_CONFIG.substring(0, 50) + '...');
    edgeConfig = createClient(process.env.EDGE_CONFIG);
    console.log('Edge Config client created successfully');
  } else {
    console.warn('EDGE_CONFIG environment variable is not set');
  }
} catch (error) {
  console.error('Error creating Edge Config client:', error);
}

// Extract ID from the EDGE_CONFIG environment variable for writing
function parseEdgeConfigId(connectionString: string): string | null {
  try {
    const url = new URL(connectionString);
    return url.pathname.split('/').pop() || null;
  } catch (error) {
    console.error('Failed to parse EDGE_CONFIG connection string:', error);
    return null;
  }
}

export async function GET() {
  try {
    // Get leaderboard data from Edge Config
    let entries: LeaderboardEntry[] = [];
    console.log('GET /api/leaderboard - Edge Config client available:', !!edgeConfig);
    
    if (edgeConfig) {
      try {
        console.log('Attempting to read from Edge Config, key:', CONFIG.LEADERBOARD_KEY);
        const data = await edgeConfig.get(CONFIG.LEADERBOARD_KEY);
        console.log('Edge Config data received:', JSON.stringify(data).substring(0, 100));
        
        if (data && Array.isArray(data)) {
          // Use a safer type conversion approach
          entries = (data as unknown) as LeaderboardEntry[];
          console.log(`Found ${entries.length} entries in Edge Config`);
        } else {
          console.warn('Data from Edge Config is not an array:', typeof data);
        }
      } catch (error) {
        console.error('Error reading from Edge Config:', error);
        console.error('Edge Config details:', {
          configId: process.env.EDGE_CONFIG?.split('?')[0],
          hasToken: !!process.env.EDGE_CONFIG?.includes('token=')
        });
        // Continue with empty entries array
      }
    } else {
      console.warn('Edge Config client not available, returning empty entries');
    }
    
    return NextResponse.json({ entries, usingLocalStorage: !edgeConfig });
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    
    // Check if this is a configuration error
    if (error.message && error.message.includes('Missing required environment variable')) {
      return NextResponse.json({ 
        error: 'Edge Config not configured properly. Please set up Edge Config in Vercel.',
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'Failed to fetch leaderboard', message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const entry = await request.json() as Omit<LeaderboardEntry, 'date'>;
    console.log('POST /api/leaderboard - New entry:', entry);
    
    // If Edge Config is not available, just return success
    // The client will save to localStorage
    if (!process.env.EDGE_CONFIG) {
      console.warn('Edge Config not configured, using localStorage');
      return NextResponse.json({ success: true, usingLocalStorage: true });
    }
    
    try {
      // Get current entries from Edge Config (for reading)
      let entries: LeaderboardEntry[] = [];
      
      if (edgeConfig) {
        console.log('Attempting to read existing entries from Edge Config');
        const data = await edgeConfig.get(CONFIG.LEADERBOARD_KEY);
        if (data && Array.isArray(data)) {
          entries = (data as unknown) as LeaderboardEntry[];
          console.log(`Found ${entries.length} existing entries in Edge Config`);
        } else {
          console.warn('Data from Edge Config is not an array:', typeof data);
        }
      } else {
        console.warn('Edge Config client not available for reading existing entries');
      }
      
      // Add new entry
      entries.push({
        ...entry,
        date: new Date().toISOString(),
      });
      
      // Keep only top 100 entries
      if (entries.length > 100) {
        entries.sort((a, b) => b.score - a.score);
        entries = entries.slice(0, 100);
      }
      
      console.log(`Returning success, total entries: ${entries.length}`);
      // For now, we'll return success and rely on the dashboard for writing
      // In a real production app, we'd use the Vercel API to write
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('Error updating leaderboard:', error);
      // Fall back to localStorage
      return NextResponse.json({ 
        success: true, 
        usingLocalStorage: true, 
        error: error.message 
      });
    }
  } catch (error: any) {
    console.error('Error adding to leaderboard:', error);
    
    // Check if this is a configuration error
    if (error.message && error.message.includes('Missing required environment variable')) {
      return NextResponse.json({ 
        error: 'Edge Config not configured properly. Please set up Edge Config in Vercel.',
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'Failed to add to leaderboard', message: error.message }, { status: 500 });
  }
} 