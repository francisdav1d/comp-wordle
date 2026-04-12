-- 1. Function to create a match and pair players
-- This is called when a user clicks "Find Match"
CREATE OR REPLACE FUNCTION join_matchmaking(v_user_id UUID)
RETURNS UUID AS $$
DECLARE
    v_game_id UUID;
BEGIN
    -- Look for a pending game that isn't full (max 2 players for 1v1)
    SELECT g.id INTO v_game_id
    FROM games g
    JOIN game_participants gp ON g.id = gp.game_id
    WHERE g.status = 'PENDING'
    GROUP BY g.id
    HAVING COUNT(gp.id) < 2
    LIMIT 1;

    -- If no pending game found, create a new one
    IF v_game_id IS NULL THEN
        INSERT INTO games (word, status)
        VALUES ('APPLE', 'PENDING') -- Note: 'APPLE' is a placeholder; real word selection logic below
        RETURNING id INTO v_game_id;
    END IF;

    -- Join the game
    INSERT INTO game_participants (game_id, user_id)
    VALUES (v_game_id, v_user_id)
    ON CONFLICT (game_id, user_id) DO NOTHING;

    -- If we have 2 players, start the game
    IF (SELECT COUNT(*) FROM game_participants WHERE game_id = v_game_id) = 2 THEN
        UPDATE games SET status = 'IN_PROGRESS' WHERE id = v_game_id;
    END IF;

    RETURN v_game_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Function to calculate points after a win/loss
CREATE OR REPLACE FUNCTION calculate_game_result(v_participant_id UUID, v_attempts INTEGER, v_is_win BOOLEAN)
RETURNS VOID AS $$
DECLARE
    v_points_change INTEGER := 0;
    v_user_id UUID;
BEGIN
    SELECT user_id INTO v_user_id FROM game_participants WHERE id = v_participant_id;

    IF v_is_win THEN
        -- Scoring Logic: Faster wins = More points
        CASE v_attempts
            WHEN 1 THEN v_points_change := 50;
            WHEN 2 THEN v_points_change := 40;
            WHEN 3 THEN v_points_change := 30;
            WHEN 4 THEN v_points_change := 20;
            WHEN 5 THEN v_points_change := 15;
            ELSE v_points_change := 10;
        END CASE;
        
        -- Increment total wins
        UPDATE profiles SET 
            points = points + v_points_change,
            games_won = games_won + 1,
            games_played = games_played + 1
        WHERE id = v_user_id;
    ELSE
        -- Penalty for losing
        v_points_change := -15;
        UPDATE profiles SET 
            points = GREATEST(0, points + v_points_change), -- Prevent negative points
            games_played = games_played + 1
        WHERE id = v_user_id;
    END IF;

    -- Mark participant as finished
    UPDATE game_participants SET 
        score = v_points_change,
        finished_at = NOW()
    WHERE id = v_participant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
