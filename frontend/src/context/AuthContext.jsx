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

  const fetchProfile = async () => {
    try {
      const { initApp } = await import('../lib/api');
      const data = await initApp();
      
      if (data.profile) {
        setUserProfile(data.profile);
        // We could also store leaderboard/games here if we add them to the context
      }
    } catch (err) {
      console.error('Error fetching optimized profile:', err);
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
