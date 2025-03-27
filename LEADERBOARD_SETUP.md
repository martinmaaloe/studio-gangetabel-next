# Setting Up the Leaderboard with Vercel Edge Config

This guide will help you set up Vercel Edge Config for the gangetabel leaderboard.

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

## Step 4: Create an Edge Config in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to the "Storage" tab
4. Click "Create" and select "Edge Config"
5. Follow the setup instructions to create your Edge Config

## Step 5: Connect Your Local Project

After creating the Edge Config, get the connection string:

1. In the Vercel dashboard, go to your Edge Config
2. Copy the connection string (it looks like `https://edge-config.vercel.com/[ID]_[SECRET]`)
3. Add it to your `.env.local` file:

```
EDGE_CONFIG="https://edge-config.vercel.com/YOUR_CONNECTION_STRING"
```

## Step 6: Test Locally

Start your development server:

```bash
npm run dev
```

The leaderboard should now be connected to your Vercel Edge Config.

## Step 7: Deploy

Deploy your application to Vercel:

```bash
vercel
```

## Usage

- The leaderboard will automatically save game results when a player completes a game
- The data is stored in Edge Config and is accessible across all devices
- Edge Config has ultra-fast reads (most under 1ms)
- The data is replicated globally in all Edge Network regions

## Benefits of Using Edge Config

- Ultra-low latency access (most reads under 1ms)
- Global replication across all Vercel Edge Network regions
- Simple key-value storage perfect for leaderboards
- Compatible with all Vercel plans including Hobby

## Troubleshooting

If you encounter issues:

1. Check that your `.env.local` file has the proper Edge Config connection string
2. Make sure your Edge Config is properly set up in the Vercel dashboard
3. Check the browser console and server logs for any error messages 