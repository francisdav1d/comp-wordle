import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const ArenaLobby = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [onlineCount, setOnlineCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState(null);

  useEffect(() => {
    setOnlineCount(152);
  }, []);

  const startMatchmaking = async (mode) => {
    if (!user) return;
    
    setSearchMode(mode);
    setIsSearching(true);
    
    try {
      // 1. Join matchmaking and get Room ID
      const { data: gameId, error } = await supabase.rpc('join_matchmaking', { 
        v_user_id: user.id,
        v_mode: mode
      });

      if (error) throw error;

      // 2. Check room status immediately
      const { data: gameData } = await supabase.from('games').select('status').eq('id', gameId).single();
      
      if (gameData?.status === 'IN_PROGRESS') {
          // If already full, jump in!
          navigate(`/game-room/${gameId}`);
          return;
      }

      // 3. If PENDING, stay here and listen for the "Start" event
      const channel = supabase.channel(`waiting-${gameId}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: `id=eq.${gameId}` }, (payload) => {
            if (payload.new.status === 'IN_PROGRESS') {
                supabase.removeChannel(channel);
                navigate(`/game-room/${gameId}`);
            }
        })
        .subscribe();

    } catch (err) {
      console.error('Matchmaking error:', err);
      setIsSearching(true); // Keep searching indicator but maybe show error
    }
  };

  const modes = [
    { id: 'duel', title: 'DUEL', players: '1v1', icon: 'swords' },
    { id: 'trio', title: 'TRIOS', players: '1v1v1', icon: 'groups' },
    { id: 'quad', title: 'QUADS', players: '1v1v1v1', icon: 'grid_view' }
  ];

  if (isSearching) {
    return (
      <main className="flex-grow flex items-center justify-center bg-[#131314]">
        <div className="text-center space-y-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl animate-pulse">radar</span>
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white uppercase tracking-[0.3em]">Establishing Link</h2>
            <p className="text-primary font-bold text-[10px] uppercase tracking-widest animate-pulse">
              {searchMode} matching - Awaiting tactical target...
            </p>
          </div>
          <button onClick={() => window.location.reload()} className="text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white">Cancel</button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-[#131314] p-6 md:p-12 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full space-y-16">
        <header className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-widest uppercase leading-none">
            MultiPlayer <span className="text-primary">lobby</span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-black text-white tracking-[0.2em] uppercase">{onlineCount} ACTIVE PLAYERS</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {modes.map((mode) => (
            <button key={mode.id} onClick={() => startMatchmaking(mode.id)} className="group bg-[#1c1c1d] border border-white/5 p-10 rounded-2xl flex flex-col items-center justify-center transition-all hover:bg-white/[0.04] active:scale-95">
              <div className="mb-6"><span className="material-symbols-outlined text-4xl text-white/20 group-hover:text-primary transition-colors">{mode.icon}</span></div>
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-primary transition-colors">{mode.title}</h3>
                <div className="inline-block py-1 px-3 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:bg-primary/20 group-hover:text-primary transition-colors">{mode.players}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ArenaLobby;
