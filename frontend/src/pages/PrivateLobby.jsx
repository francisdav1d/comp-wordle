import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { startGame } from '../lib/api';

const PrivateLobby = () => {
    const { lobbyId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [participants, setParticipants] = useState([]);
    const [game, setGame] = useState(null);
    const [isStarting, setIsStarting] = useState(false);

    useEffect(() => {
        fetchLobby();
        const subscribeToLobby = () => {
            const channel = supabase.channel(`lobby-${lobbyId}`)
                .on('postgres_changes', { event: '*', schema: 'public', table: 'game_participants', filter: `game_id=eq.${lobbyId}` }, () => fetchParticipants())
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: `id=eq.${lobbyId}` }, (payload) => {
                    if (payload.new.status === 'IN_PROGRESS') {
                        navigate(`/game-room/${lobbyId}`);
                    }
                })
                .subscribe();
            return () => supabase.removeChannel(channel);
        };
        const cleanup = subscribeToLobby();
        return () => cleanup();
    }, [lobbyId, navigate]);

    const fetchLobby = async () => {
        try {
            const [{ data: gameData, error: gameError }, { data: participantData, error: participantError }] = await Promise.all([
                supabase.from('games').select('*').eq('id', lobbyId).single(),
                supabase.from('game_participants').select('*, profiles(username, avatar_url)').eq('game_id', lobbyId),
            ]);

            if (gameError) throw gameError;
            if (participantError) throw participantError;

            setGame(gameData);
            setParticipants(participantData || []);
        } catch (err) {
            console.error('Failed to load private lobby:', err);
        }
    };

    const fetchParticipants = async () => {
        try {
            const { data, error } = await supabase.from('game_participants').select('*, profiles(username, avatar_url)').eq('game_id', lobbyId);
            if (error) throw error;
            setParticipants(data || []);
        } catch (err) {
            console.error('Failed to refresh participants:', err);
        }
    };

    const handleStart = async () => {
        setIsStarting(true);
        try {
            await startGame(lobbyId);
        } catch (err) {
            console.error('Failed to start lobby:', err);
            alert(err.message);
            setIsStarting(false);
        }
    };

    const isHost = game?.host_id === user?.id;

    return (
        <main className="flex-grow bg-[#131314] p-6 md:p-12 flex flex-col items-center justify-center">
            <div className="max-w-2xl w-full bg-[#1c1c1d] border border-white/5 rounded-3xl p-10 space-y-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Lobby Active</span>
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <h2 className="text-[10px] font-black text-primary tracking-[0.5em] uppercase">Private War Room</h2>
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter">Lobby <span className="text-white/20">Init</span></h1>
                </div>

                <div className="bg-white/5 border border-white/5 p-8 rounded-2xl text-center space-y-4">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Lobby Access Code</p>
                    <p className="text-5xl font-black text-primary tracking-[0.3em] font-mono">{game?.lobby_code}</p>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed">Share this code with your target combatants<br/>to establish an encrypted link.</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2">Authenticated Personnel ({participants.length})</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {participants.map((p) => (
                            <div key={p.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 transition-all">
                                <img src={p.profiles?.avatar_url} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                                <div className="flex-grow flex items-center justify-between">
                                    <span className="text-sm font-black text-white uppercase tracking-tighter">{p.profiles?.username}</span>
                                    {p.user_id === game?.host_id && <span className="text-[8px] font-black text-primary border border-primary/30 px-2 py-0.5 rounded-full">HOST</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 pt-6">
                    {isHost ? (
                        <button 
                            onClick={handleStart}
                            disabled={isStarting || participants.length < 2}
                            className="w-full py-5 bg-primary text-[#131314] font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                        >
                            {isStarting ? 'INITIALIZING...' : participants.length < 2 ? 'AWAITING REINFORCEMENTS' : 'DEPLOY OPERATION'}
                        </button>
                    ) : (
                        <div className="text-center py-4 bg-white/5 rounded-2xl border border-dashed border-white/10">
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest animate-pulse tracking-[0.2em]">Waiting for host to deploy...</p>
                        </div>
                    )}
                    <button onClick={() => navigate('/arena')} className="w-full text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] hover:text-red-500 transition-colors">Abort Mission</button>
                </div>
            </div>
        </main>
    );
};

export default PrivateLobby;
