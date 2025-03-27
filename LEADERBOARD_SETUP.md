# Setting Up the Leaderboard with Vercel

This guide will help you set up the Vercel KV database for the gangetabel leaderboard.

## Step 1: Install the Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

## Step 3: Link Your Project to Vercel

```bash
vercel link
```

## Step 4: Create a KV Database in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to the "Storage" tab
4. Click "Create" and select "KV Database"
5. Follow the setup instructions to create your KV database

## Step 5: Connect Your Local Project

After creating the KV database, pull the environment variables:

```bash
vercel env pull .env.local
```

This will create or update your `.env.local` file with the necessary KV credentials.

## Step 6: Test Locally

Start your development server:

```bash
npm run dev
```

The leaderboard should now be connected to your Vercel KV database.

## Step 7: Deploy

Deploy your application to Vercel:

```bash
vercel
```

## Usage

- The leaderboard will automatically save game results when a player completes a game
- The data is stored in your Vercel KV database and is accessible across all devices
- The free tier includes 1 database, 200 MB storage, and 10,000 operations/day

## Troubleshooting

If you encounter issues:

1. Check that your `.env.local` file has the proper KV credentials
2. Make sure your KV database is properly set up in the Vercel dashboard
3. Check the browser console and server logs for any error messages 