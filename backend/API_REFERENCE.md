# 🛠 Backend API Reference (Supabase)

This document explains how your frontend should interact with the backend logic I've built.

## 1. Authentication
Use the standard Supabase Auth client to log users in.
```javascript
const { user, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'password',
})
```

## 2. Competitive Functions (RPC)
I have created custom "Remote Procedure Calls" (RPC) for competitive logic.

### Matchmaking: `join_matchmaking`
Call this when a user clicks "Find Match" or "Start Arena". It will either pair them with someone waiting or create a new room.
```javascript
const { data: gameId, error } = await supabase.rpc('join_matchmaking', { 
  v_user_id: user.id 
})
```

### Submit Result: `calculate_game_result`
Call this when the user finishes their Wordle game (either win or loss). This securely updates their Points and Rank.
```javascript
const { error } = await supabase.rpc('calculate_game_result', {
  v_participant_id: participantId,
  v_attempts: 4, // Final number of guesses
  v_is_win: true
})
```

## 3. Real-time Subscriptions
To make the "Arena" feel alive, subscribe to your opponent's progress.

```javascript
const opponentSubscription = supabase
  .channel('game_state')
  .on('postgres_changes', { 
    event: 'UPDATE', 
    schema: 'public', 
    table: 'game_participants',
    filter: `game_id=eq.${currentGameId}` 
  }, (payload) => {
    // payload.new.guesses.length will show how many rows the opponent has filled
    console.log("Opponent progress:", payload.new.guesses.length)
  })
  .subscribe()
```

## 4. Leaderboard Fetching
Get the top 100 players for the "Global Leaderboard" page.
```javascript
const { data: leaderboard } = await supabase
  .from('profiles')
  .select('username, points, rank_tier, avatar_url')
  .order('points', { ascending: false })
  .limit(100)
```

## 5. Security (RLS)
The database is protected. 
- **Profiles**: Anyone can see them, only the owner can change their avatar/username.
- **Games**: Only players assigned to the game can see the result.
- **Points**: Can **only** be updated via the `calculate_game_result` function (users cannot manually change their own scores).
