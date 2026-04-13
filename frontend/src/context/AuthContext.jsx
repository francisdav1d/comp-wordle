import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setLoading(false);
        return;
      }
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (uid) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      
      if (error && error.code === 'PGRST116') {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;
        
        if (!user) return;

        const newProfile = {
          id: uid,
          display_name: user.user_metadata?.username || user.email.split('@')[0],
          username: user.user_metadata?.username || user.email.split('@')[0].toLowerCase(),
          email: user.email,
          avatar_url: `https://ui-avatars.com/api/?name=${user.email}&background=94d78c&color=131314`,
          single_player_elo: 0,
          multiplayer_elo: 0,
          tier: 'Bronze',
          wins: 0,
          total_matches: 0,
          current_daily_streak: 0,
          max_daily_streak: 0,
          current_win_streak: 0,
          max_win_streak: 0,
          avg_solve_time: 0,
          guess_distribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 },
          created_at: new Date().toISOString(),
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();
          
        if (!createError) setUserProfile(createdProfile);
      } else if (data) {
        setUserProfile(data);
      }
    } catch (err) {
      console.error('Error in profile lifecycle:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileStats = async (statsUpdate) => {
    if (!user || !supabase) return;
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...statsUpdate,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();
    
    if (!error && data) {
      setUserProfile(data);
    }
    return { data, error };
  };

  const loginWithGoogle = async () => {
    if (!supabase) return { error: { message: "Supabase not configured" } };
    return await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };
  
  const loginWithEmail = async (email, password) => {
    if (!supabase) return { error: { message: "Supabase not configured" } };
    return await supabase.auth.signInWithPassword({ email, password });
  };
  
  const signupWithEmail = async (email, password, username) => {
    if (!supabase) return { error: { message: "Supabase not configured" } };
    return await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          username: username.toLowerCase(),
        }
      }
    });
  };

  const logout = () => supabase?.auth.signOut();

  const value = {
    user,
    userProfile,
    loading,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    updateProfileStats
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
