import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { LetterState } from '../lib/wordleTypes';
import { getGame, getGameParticipants, submitGuess } from '../lib/api';

const GameArena = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  
  // Game State
  const [game, setGame] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [revealedAnswer, setRevealedAnswer] = useState('');
  
  // Board State
  const [board, setBoard] = useState(Array.from({ length: 6 }, () => Array.from({ length: 5 }, () => ({ letter: '', state: LetterState.INITIAL }))));
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [letterStates, setLetterStates] = useState({});
  const [gameState, setGameState] = useState('waiting'); 
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  // 1. Initial Fetch
  useEffect(() => {
    const fetchGameData = async () => {
      if (!gameId) return;

      try {
        const [{ game: gameData }, { participants: partData }] = await Promise.all([
          getGame(gameId),
          getGameParticipants(gameId),
        ]);

        if (!gameData) return;

        setGame(gameData);
        if (gameData.status === 'IN_PROGRESS') {
          setGameState('playing');
          startTimer();
        }

        setParticipants(partData || []);
      } catch (err) {
        console.error('Failed to load game data:', err);
      }
    };

    fetchGameData();
  }, [gameId]);

  // 2. Realtime
  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel(`game-${gameId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_participants', filter: `game_id=eq.${gameId}` }, () => refreshParticipants())
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: `id=eq.${gameId}` }, (payload) => {
        setGame(payload.new);
        if (payload.new.status === 'FINISHED' && gameState === 'playing') {
            setGameState('finished');
            clearInterval(timerRef.current);
            showMessage('MATCH TERMINATED', -1);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameId, gameState]);

  const refreshParticipants = async () => {
    try {
      const { participants: nextParticipants } = await getGameParticipants(gameId);
      if (nextParticipants) setParticipants(nextParticipants);
    } catch (err) {
      console.error('Failed to refresh participants:', err);
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer(v => v + 1), 1000);
  };

  const showMessage = (msg, time = 2000) => {
    setMessage(msg);
    if (time > 0) setTimeout(() => setMessage(''), time);
  };

  const onKey = useCallback(async (key) => {
    if (gameState !== 'playing') return;
    const isLetter = /^[a-zA-Z]$/.test(key);
    if (isLetter) {
        setBoard(prev => {
            const newBoard = JSON.parse(JSON.stringify(prev));
            const row = newBoard[currentRowIndex];
            const emptyIndex = row.findIndex(t => !t.letter);
            if (emptyIndex !== -1) { row[emptyIndex].letter = key.toLowerCase(); return newBoard; }
            return prev;
          });
    } else if (key === 'Backspace') {
      setBoard(prev => {
        const newBoard = JSON.parse(JSON.stringify(prev));
        const row = newBoard[currentRowIndex];
        for (let i = 4; i >= 0; i--) { if (row[i].letter) { row[i].letter = ''; break; } }
        return newBoard;
      });
    } else if (key === 'Enter') {
      const row = board[currentRowIndex];
      const guess = row.map(t => t.letter).join('');
      if (guess.length !== 5) { showMessage('TOO SHORT'); return; }

      try {
        const payload = await submitGuess(gameId, guess);
        const newBoard = JSON.parse(JSON.stringify(board));
        const newLetterStates = { ...letterStates };
        const currentBoardRow = newBoard[currentRowIndex];

        currentBoardRow.forEach((tile, index) => {
          tile.state = payload.result[index] || LetterState.ABSENT;
          const nextState = payload.result[index];
          if (nextState === LetterState.CORRECT) {
            newLetterStates[tile.letter] = LetterState.CORRECT;
          } else if (nextState === LetterState.PRESENT && newLetterStates[tile.letter] !== LetterState.CORRECT) {
            newLetterStates[tile.letter] = LetterState.PRESENT;
          } else if (!newLetterStates[tile.letter]) {
            newLetterStates[tile.letter] = LetterState.ABSENT;
          }
        });

        setBoard(newBoard);
        setLetterStates(newLetterStates);
        setRevealedAnswer(payload.answer || '');
        refreshParticipants();

        if (payload.participantStatus === 'won') {
          setGameState('won');
          clearInterval(timerRef.current);
          showMessage('VICTORY!', -1);
        } else if (payload.participantStatus === 'lost') {
          setGameState('lost');
          clearInterval(timerRef.current);
          showMessage((payload.answer || '').toUpperCase(), -1);
        } else {
          setCurrentRowIndex(prev => prev + 1);
        }
      } catch (err) {
        showMessage(err.message.toUpperCase());
      }
    }
  }, [board, currentRowIndex, gameId, gameState, letterStates]);

  useEffect(() => {
    const handleKeyDown = (e) => onKey(e.key);
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKey]);

  const isFinished = gameState === 'won' || gameState === 'lost' || gameState === 'finished';
  const finalMessage = gameState === 'won' ? 'VICTORY' : gameState === 'lost' ? 'DEFEATED' : 'MATCH CLOSED';

  return (
    <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0 lg:overflow-hidden relative">
      <aside className="lg:col-span-3 bg-surface-container-low p-6 flex flex-col space-y-6">
        <div>
          <h3 className="uppercase tracking-widest text-outline font-bold text-[10px] mb-4 text-white/40">Opponent Intelligence</h3>
          <div className="space-y-4">
            {participants.filter(p => p.user_id !== user.id).map((opp) => (
              <div key={opp.id} className="bg-[#1c1c1d] border border-white/5 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-white">{opp.profiles?.username}</span>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Turn {opp.guesses?.length || 0}</span>
                </div>
                <div className="grid grid-rows-6 gap-1 w-24 mx-auto">
                  {[...Array(6)].map((_, r) => (
                    <div key={r} className="grid grid-cols-5 gap-1">
                      {[...Array(5)].map((_, c) => {
                        const state = opp.guesses?.[r]?.result?.[c] || LetterState.INITIAL;
                        const color = state === LetterState.CORRECT ? 'bg-primary' : state === LetterState.PRESENT ? 'bg-secondary' : state === LetterState.ABSENT ? 'bg-[#3a3a3c]' : 'bg-transparent border border-white/5';
                        return <div key={c} className={`w-4 h-4 rounded-sm ${color}`}></div>;
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className="lg:col-span-6 bg-surface p-4 flex flex-col items-center justify-between">
        <div className="w-full max-w-lg grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1c1c1d] p-3 rounded-lg text-center border border-white/5">
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Time</div>
            <div className="text-xl font-bold text-white tracking-tight">{Math.floor(timer/60).toString().padStart(2, '0')}:{(timer%60).toString().padStart(2, '0')}</div>
          </div>
          <div className="bg-[#1c1c1d] p-3 rounded-lg text-center border-t-2 border-primary border-x border-white/5 border-b border-white/5">
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Status</div>
            <div className="text-xl font-bold text-primary tracking-tight uppercase">{gameState}</div>
          </div>
          <div className="bg-[#1c1c1d] p-3 rounded-lg text-center border border-white/5">
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">RP</div>
            <div className="text-xl font-bold text-white tracking-tight">{userProfile?.multiplayer_elo || 0}</div>
          </div>
        </div>

        <div className="relative">
          {message && <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 bg-primary text-[#131314] px-4 py-2 rounded font-bold text-xs uppercase tracking-widest shadow-xl animate-bounce">{message}</div>}
          <div className="grid grid-rows-6 gap-2 mb-8">
            {board.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-5 gap-2">
                {row.map((tile, tIdx) => (
                  <div key={tIdx} className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl font-black rounded transition-all duration-500 ${tile.state === LetterState.INITIAL ? (tile.letter ? 'border-2 border-[#818384] text-white bg-white/5' : 'border-2 border-white/5 bg-transparent') : 'border-none text-[#131314]'} ${tile.state === LetterState.CORRECT ? 'bg-primary' : tile.state === LetterState.PRESENT ? 'bg-secondary' : tile.state === LetterState.ABSENT ? 'bg-[#3a3a3c]' : ''}`}>
                    {tile.letter.toUpperCase()}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-2xl px-2">
          {isFinished ? (
              <div className="bg-[#1c1c1d] border border-white/5 p-8 rounded-2xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
                  <div>
                    <h3 className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase mb-1">Match Concluded</h3>
                     <p className="text-4xl font-black text-white uppercase tracking-tighter">{finalMessage}</p>
                     {revealedAnswer && gameState === 'lost' ? <p className="mt-2 text-xs font-bold tracking-[0.2em] text-white/50">ANSWER {revealedAnswer}</p> : null}
                  </div>
                  <div className="flex gap-4 items-center justify-center">
                    <button onClick={() => navigate('/arena')} className="px-8 py-3 bg-primary text-[#131314] font-bold text-xs uppercase tracking-widest rounded-lg transition-transform hover:scale-105 active:scale-95">Play Again</button>
                    <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-white/5 text-white/40 font-bold text-xs uppercase tracking-widest rounded-lg hover:text-white transition-colors">Main Menu</button>
                  </div>
              </div>
          ) : (
            <div className="flex flex-col gap-2">
                {[['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['Enter', 'Z','X','C','V','B','N','M', 'Backspace']].map((row, i) => (
                <div key={i} className="flex justify-center gap-1.5">
                    {row.map(k => {
                    const state = letterStates[k.toLowerCase()];
                    const keyStyle = state === LetterState.CORRECT ? 'bg-primary text-[#131314]' : state === LetterState.PRESENT ? 'bg-secondary text-[#131314]' : state === LetterState.ABSENT ? 'bg-[#3a3a3c] text-white' : 'bg-[#1c1c1d] border border-white/10 text-white';
                    return <button key={k} onClick={() => onKey(k)} className={`h-12 md:h-14 rounded-md font-bold text-xs uppercase active:opacity-50 ${k === 'Enter' || k === 'Backspace' ? 'flex-[1.5] bg-white/10 text-white' : `flex-1 ${keyStyle}`}`}>{k === 'Backspace' ? <span className="material-symbols-outlined text-sm">backspace</span> : k}</button>;
                    })}
                </div>
                ))}
            </div>
          )}
        </div>
      </section>

      <aside className="lg:col-span-3 bg-surface-container-low p-6 flex flex-col space-y-8">
        <div className="grow">
          <h3 className="uppercase tracking-widest text-outline font-bold text-[10px] mb-4 text-white/40">Combatants</h3>
          <div className="space-y-3">
            {participants.map((p) => (
              <div key={p.id} className={`flex items-center gap-3 p-2 rounded ${p.user_id === user.id ? 'bg-primary/10 border-l-2 border-primary' : ''}`}>
                 <img src={p.profiles?.avatar_url} className="w-8 h-8 rounded-full" alt="" />
                 <div className="grow">
                    <p className="text-xs font-bold text-white">{p.profiles?.username} {p.user_id === user.id && '(YOU)'}</p>
                    <p className="text-[10px] text-white/40 tracking-widest">{p.finished_at ? 'FINISHED' : 'IN PLAY'}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <button onClick={() => navigate('/arena')} className="w-full py-3 bg-[#1c1c1d] text-white/40 font-bold text-[10px] uppercase tracking-widest rounded-lg border border-white/5 hover:text-white transition-all">
            Abandon Match
          </button>
        </div>
      </aside>
    </main>
  );
};

export default GameArena;
