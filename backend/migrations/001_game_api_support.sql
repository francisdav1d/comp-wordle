ALTER TABLE public.games
  ADD COLUMN IF NOT EXISTS host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS lobby_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS is_private BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS games_status_mode_idx ON public.games (status, mode);
CREATE INDEX IF NOT EXISTS games_lobby_code_idx ON public.games (lobby_code);
CREATE INDEX IF NOT EXISTS game_participants_game_id_idx ON public.game_participants (game_id);
CREATE INDEX IF NOT EXISTS game_participants_user_id_idx ON public.game_participants (user_id);
