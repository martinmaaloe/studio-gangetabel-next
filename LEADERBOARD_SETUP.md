# Setting Up the Leaderboard with Vercel Edge Config

## Introduction
This leaderboard implementation uses Vercel Edge Config, a globally distributed key-value store that offers ultra-low latency reads. Edge Config is perfect for storing leaderboard data which is frequently read but infrequently updated.

## Setup Steps

### 1. Create an Edge Config in Vercel

1. Go to your Vercel dashboard and select your project.
2. Navigate to the "Storage" tab.
3. Select "Edge Config" from the available options.
4. Click "Create Edge Config".
5. Once created, you'll see your Edge Config ID and connection information.

### 2. Initialize your leaderboard

1. In the Edge Config dashboard, locate the JSON editor at the bottom of the screen
2. Enter the following JSON to create an empty leaderboard array:
   ```json
   {
     "leaderboard": []
   }
   ```
3. Click "Save" or "Submit" to store this configuration

### 3. Connect Edge Config to your local project

1. Make sure your project is linked to Vercel:
   ```bash
   npx vercel link
   ```

2. Pull your environment variables:
   ```bash
   npx vercel env pull
   ```

3. This will create or update your `.env.local` file with the `EDGE_CONFIG` connection string.

### 4. Test locally

1. Run your development server:
   ```bash
   npm run dev
   ```

2. Test the leaderboard functionality. The app will automatically use localStorage if Edge Config is not properly configured.

### 5. Deploy to Vercel

```bash
npx vercel deploy
```

## Usage

The leaderboard implementation will:
- Automatically read data from Edge Config when available
- Fall back to localStorage if Edge Config is not configured or encounters errors
- Display a yellow banner when using localStorage instead of Edge Config
- Store the top 100 scores sorted by highest score first

## Benefits of Edge Config

- Ultra-low latency reads globally
- Automatically replicated across all Vercel regions
- No infrastructure to manage
- Perfect for data that is frequently read but rarely written to

## Troubleshooting

If you encounter issues:

1. Verify your Edge Config is properly created in the Vercel dashboard
2. Ensure your `.env.local` file contains the `EDGE_CONFIG` variable with the correct ID
3. Check the browser console for any error messages
4. Restart your development server after making changes to environment variables

Note: The leaderboard will always fall back to localStorage if Edge Config is not available, so your application will continue to function even without Edge Config configured. 