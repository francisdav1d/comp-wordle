-- Advanced Competitive Schema
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  email TEXT,
  
  -- Competitive ELO
  single_player_elo INTEGER DEFAULT 1000,
  multiplayer_elo INTEGER DEFAULT 1000,
  tier TEXT DEFAULT 'Bronze',
  
  -- Match Stats
  wins INTEGER DEFAULT 0,
  total_matches INTEGER DEFAULT 0,
  win_rate FLOAT DEFAULT 0.0,
  
  -- Streaks
  current_daily_streak INTEGER DEFAULT 0,
  max_daily_streak INTEGER DEFAULT 0,
  current_win_streak INTEGER DEFAULT 0,
  max_win_streak INTEGER DEFAULT 0,
  
  -- Analytical Metrics
  avg_solve_time INTEGER DEFAULT 0, -- Store in seconds
  guess_distribution JSONB DEFAULT '{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0}'::JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, avatar_url, display_name)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', LOWER(SPLIT_PART(new.email, '@', 1))), 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://ui-avatars.com/api/?name=' || new.email || '&background=94d78c&color=131314'),
    COALESCE(new.raw_user_meta_data->>'full_name', SPLIT_PART(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
