# Competitive Wordle Backend Schema

This document outlines the database structure for the Competitive Wordle Platform using Supabase (PostgreSQL).

## Tables

### 1. `profiles`
Stores user-specific metadata and competitive statistics.
- `id`: uuid (primary key, references auth.users)
- `username`: text (unique)
- `avatar_url`: text
- `points`: integer (default: 0) - Used for ranking.
- `rank_tier`: text (e.g., 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM')
- `games_played`: integer (default: 0)
- `games_won`: integer (default: 0)
- `created_at`: timestamp with time zone

### 2. `games`
Stores information about each multiplayer match.
- `id`: uuid (primary key)
- `word`: varchar(5) - The target word for this game.
- `status`: text ('PENDING', 'IN_PROGRESS', 'COMPLETED')
- `created_at`: timestamp with time zone

### 3. `game_participants`
Links players to games and tracks their individual progress.
- `id`: uuid (primary key)
- `game_id`: uuid (references games.id)
- `user_id`: uuid (references profiles.id)
- `score`: integer - Final score for this game.
- `guesses`: jsonb - Array of strings (the player's guesses).
- `finished_at`: timestamp with time zone

### 4. `words`
A dictionary of allowed words and daily challenges.
- `word`: varchar(5) (primary key)
- `is_common`: boolean - Used to filter simple words for lower ranks.

## Real-time Features
- **Matchmaking**: Players will subscribe to the `games` table for new pending matches.
- **Live Scores**: Players in the same `game_id` will subscribe to `game_participants` to see opponents' progress (e.g., number of tiles filled, but not the letters).

## Security (Row Level Security)
- Users can read all profiles and leaderboards.
- Users can only update their own profile and their own `game_participants` row.
- Word logic should be handled via database functions or edge functions to prevent client-side leaks.
