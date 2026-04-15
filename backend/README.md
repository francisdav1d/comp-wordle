# CompWordle Backend

This project now has an actual application backend alongside the database SQL.

## What this backend does

- Validates the logged-in Supabase user with their access token
- Owns matchmaking and private lobby creation/joining
- Starts private games on behalf of the lobby host
- Validates guesses and scores multiplayer matches server-side
- Updates multiplayer profile stats server-side
- Exposes leaderboard and game read endpoints for the frontend

## Stack

- Node.js
- Express
- Supabase service-role client

## Setup

1. Copy `backend/.env.example` to `backend/.env`
2. Fill in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
3. Run the SQL in `backend/migrations/001_game_api_support.sql`
4. Install dependencies with `npm install` inside `backend`
5. Start the API with `npm run dev`

## Render Latency

- Render free instances can sleep, so the first request after idle time can take several seconds.
- This backend now warms the word cache on boot, but it cannot remove Render cold starts by itself.
- To keep it warm, ping `GET /health` every 10 to 14 minutes from a cron service or use a paid always-on Render instance.
- Keep your Render region close to your Supabase region.

## Routes

- `GET /health`
- `GET /api/leaderboard?mode=singleplayer|multiplayer`
- `POST /api/matchmaking/join`
- `POST /api/lobbies/private`
- `POST /api/lobbies/private/join`
- `GET /api/games/:gameId`
- `GET /api/games/:gameId/participants`
- `POST /api/games/:gameId/start`
- `POST /api/games/:gameId/guess`

All `/api/*` routes require `Authorization: Bearer <supabase-access-token>`.
