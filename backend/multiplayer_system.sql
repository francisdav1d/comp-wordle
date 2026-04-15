-- Comprehensive Multiplayer System for Competitive Wordle

-- 1. Tables Update
CREATE TABLE IF NOT EXISTS public.words (
    word VARCHAR(5) PRIMARY KEY,
    is_common BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word VARCHAR(5) NOT NULL,
    status TEXT DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED
    mode TEXT DEFAULT 'duel', -- duel, trio, quad
    player_limit INTEGER DEFAULT 2,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.game_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    guesses JSONB DEFAULT '[]'::JSONB, -- Array of { guess: string, result: string[] }
    score INTEGER DEFAULT 0,
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(game_id, user_id)
);

-- 2. Realtime Enablement
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_participants;

-- 3. Matchmaking Logic
CREATE OR REPLACE FUNCTION join_matchmaking(v_user_id UUID, v_mode TEXT)
RETURNS UUID AS $$
DECLARE
    v_game_id UUID;
    v_word VARCHAR(5);
    v_limit INTEGER;
BEGIN
    -- Set player limit based on mode
    v_limit := CASE 
        WHEN v_mode = 'duel' THEN 2
        WHEN v_mode = 'trio' THEN 3
        WHEN v_mode = 'quad' THEN 4
        ELSE 2
    END;

    -- 1. Check if user is already in an active game of this mode
    SELECT g.id INTO v_game_id
    FROM games g
    JOIN game_participants gp ON g.id = gp.game_id
    WHERE gp.user_id = v_user_id 
    AND g.mode = v_mode
    AND (g.status = 'PENDING' OR g.status = 'IN_PROGRESS')
    LIMIT 1;

    IF v_game_id IS NOT NULL THEN
        RETURN v_game_id;
    END IF;

    -- 2. Find an existing pending game with space
    SELECT g.id INTO v_game_id
    FROM games g
    LEFT JOIN game_participants gp ON g.id = gp.game_id
    WHERE g.status = 'PENDING' 
    AND g.mode = v_mode
    GROUP BY g.id
    HAVING COUNT(gp.id) < v_limit
    LIMIT 1
    FOR UPDATE SKIP LOCKED;

    -- 3. Create new game if none found
    IF v_game_id IS NULL THEN
        -- Get a random word
        SELECT word INTO v_word FROM words ORDER BY RANDOM() LIMIT 1;
        IF v_word IS NULL THEN v_word := 'ALERT'; END IF;

        INSERT INTO games (word, status, mode, player_limit)
        VALUES (v_word, 'PENDING', v_mode, v_limit)
        RETURNING id INTO v_game_id;
    END IF;

    -- 4. Join the game
    INSERT INTO game_participants (game_id, user_id)
    VALUES (v_game_id, v_user_id)
    ON CONFLICT (game_id, user_id) DO NOTHING;

    -- 5. Auto-start if full
    IF (SELECT COUNT(*) FROM game_participants WHERE game_id = v_game_id) >= v_limit THEN
        UPDATE games SET status = 'IN_PROGRESS', started_at = NOW() WHERE id = v_game_id;
    END IF;

    RETURN v_game_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
