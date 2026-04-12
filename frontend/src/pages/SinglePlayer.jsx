import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRandomWord, allWords } from '../lib/words';
import { LetterState } from '../lib/wordleTypes';

const SinglePlayer = () => {
  const { userProfile, updateProfileStats } = useAuth();
  const [answer, setAnswer] = useState(() => getRandomWord());
  const [board, setBoard] = useState(
    Array.from({ length: 6 }, () =>
      Array.from({ length: 5 }, () => ({
        letter: '',
        state: LetterState.INITIAL
      }))
    )
  );
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [letterStates, setLetterStates] = useState({});
  const [message, setMessage] = useState('');
  const [gameState, setGameState] = useState('playing');

  // Timer logic
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameState === 'playing' && hasStarted && startTime) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimer(elapsed);
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, hasStarted, startTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const resetGame = useCallback(() => {
    setAnswer(getRandomWord());
    setBoard(Array.from({ length: 6 }, () =>
      Array.from({ length: 5 }, () => ({
        letter: '',
        state: LetterState.INITIAL
      }))
    ));
    setCurrentRowIndex(0);
    setLetterStates({});
    setGameState('playing');
    setMessage('');
    setTimer(0);
    setHasStarted(false);
    setStartTime(null);
  }, []);

  const saveStats = async (finalState, finalRowIndex, solveTime) => {
    if (!userProfile) return;
    const isWin = finalState === 'won';
    const newTotalMatches = (userProfile.total_matches || 0) + 1;
    const newWins = isWin ? (userProfile.wins || 0) + 1 : (userProfile.wins || 0);
    const newWinStreak = isWin ? (userProfile.current_win_streak || 0) + 1 : 0;
    const newMaxWinStreak = Math.max(newWinStreak, userProfile.max_win_streak || 0);
    const newDist = { ...(userProfile.guess_distribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 }) };
    if (isWin) {
      const guessNum = (finalRowIndex + 1).toString();
      newDist[guessNum] = (newDist[guessNum] || 0) + 1;
    }
    let newAvgTime = userProfile.avg_solve_time || 0;
    if (isWin) {
      newAvgTime = Math.floor(((userProfile.avg_solve_time || 0) * (newWins - 1) + solveTime) / newWins);
    }
    await updateProfileStats({
      total_matches: newTotalMatches,
      wins: newWins,
      win_rate: (newTotalMatches > 0 ? (newWins / newTotalMatches) * 100 : 0),
      current_win_streak: newWinStreak,
      max_win_streak: newMaxWinStreak,
      guess_distribution: newDist,
      avg_solve_time: newAvgTime
    });
  };

  const showMessage = (msg, time = 2000) => {
    setMessage(msg);
    if (time > 0) {
      setTimeout(() => setMessage(''), time);
    }
  };

  const onKey = useCallback((key) => {
    if (gameState !== 'playing') return;
    const isLetter = /^[a-zA-Z]$/.test(key);
    if (!hasStarted && isLetter) {
      setHasStarted(true);
      setStartTime(Date.now());
    }
    if (isLetter) {
      setBoard(prev => {
        const newBoard = JSON.parse(JSON.stringify(prev));
        const row = newBoard[currentRowIndex];
        for (let i = 0; i < 5; i++) {
          if (!row[i].letter) {
            row[i].letter = key.toLowerCase();
            break;
          }
        }
        return newBoard;
      });
    } else if (key === 'Backspace') {
      setBoard(prev => {
        const newBoard = JSON.parse(JSON.stringify(prev));
        const row = newBoard[currentRowIndex];
        for (let i = 4; i >= 0; i--) {
          if (row[i].letter) {
            row[i].letter = '';
            break;
          }
        }
        return newBoard;
      });
    } else if (key === 'Enter') {
      const row = board[currentRowIndex];
      const guess = row.map(t => t.letter).join('');
      if (guess.length !== 5) {
        showMessage('Not enough letters');
        return;
      }
      if (!allWords.includes(guess)) {
        showMessage('Not in word list');
        return;
      }
      const newBoard = JSON.parse(JSON.stringify(board));
      const newLetterStates = { ...letterStates };
      const currentBoardRow = newBoard[currentRowIndex];
      const answerLetters = answer.split('');
      currentBoardRow.forEach((tile, i) => {
        if (tile.letter === answerLetters[i]) {
          tile.state = LetterState.CORRECT;
          newLetterStates[tile.letter] = LetterState.CORRECT;
          answerLetters[i] = null;
        }
      });
      currentBoardRow.forEach((tile, i) => {
        if (tile.state !== LetterState.CORRECT && answerLetters.includes(tile.letter)) {
          tile.state = LetterState.PRESENT;
          if (newLetterStates[tile.letter] !== LetterState.CORRECT) {
            newLetterStates[tile.letter] = LetterState.PRESENT;
          }
          answerLetters[answerLetters.indexOf(tile.letter)] = null;
        }
      });
      currentBoardRow.forEach((tile) => {
        if (tile.state === LetterState.INITIAL) {
          tile.state = LetterState.ABSENT;
          if (!newLetterStates[tile.letter]) {
            newLetterStates[tile.letter] = LetterState.ABSENT;
          }
        }
      });
      setBoard(newBoard);
      setLetterStates(newLetterStates);
      if (guess === answer) {
        setGameState('won');
        showMessage(['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew'][currentRowIndex], -1);
        saveStats('won', currentRowIndex, timer);
      } else if (currentRowIndex >= 5) {
        setGameState('lost');
        showMessage(answer.toUpperCase(), -1);
        saveStats('lost', currentRowIndex, timer);
      } else {
        setCurrentRowIndex(prev => prev + 1);
      }
    }
  }, [board, currentRowIndex, gameState, answer, letterStates, timer, hasStarted]);

  useEffect(() => {
    const handleKeyDown = (e) => onKey(e.key);
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKey]);

  // Authentic Wordle Styles: No rounded corners, no glows
  const getTileStyle = (state) => {
    switch (state) {
      case LetterState.CORRECT: return 'bg-primary border-none text-[#131314]';
      case LetterState.PRESENT: return 'bg-secondary border-none text-[#131314]';
      case LetterState.ABSENT: return 'bg-[#3a3a3c] border-none text-white';
      default: return 'bg-transparent border-2 border-[#3a3a3c] text-white';
    }
  };

  const getKeyStyle = (key) => {
    const state = letterStates[key.toLowerCase()];
    switch (state) {
      case LetterState.CORRECT: return 'bg-primary text-[#131314]';
      case LetterState.PRESENT: return 'bg-secondary text-[#131314]';
      case LetterState.ABSENT: return 'bg-[#3a3a3c] text-white';
      default: return 'bg-[#818384] text-white';
    }
  };

  const currentStreak = userProfile?.current_win_streak || 0;
  const maxStreak = userProfile?.max_win_streak || 0;
  const totalWins = userProfile?.wins || 0;
  const distribution = userProfile?.guess_distribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 };
  const avgTime = userProfile?.avg_solve_time || 0;

  return (
    <>
      <main className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col min-h-[calc(100vh-112px)]">
        {message && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1c1d1c] text-white px-6 py-3 rounded border border-white/10 font-bold shadow-2xl animate-in fade-in zoom-in duration-300">
            {message}
          </div>
        )}

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 relative">
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-[#1c1d1c] p-6 border-l-4 border-primary border border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Win Streak</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{currentStreak}</span>
                <span className="text-primary text-[10px] font-bold uppercase tracking-widest">BEST: {maxStreak}</span>
              </div>
            </div>

            <div className="bg-[#1c1d1c] p-6 border border-white/5 grid grid-cols-2">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 text-xs">Today</p>
                <div className="text-2xl font-black text-white tabular-nums">{formatTime(timer)}</div>
              </div>
              <div className="text-center border-l border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 text-xs">Avg</p>
                <div className="text-2xl font-black text-primary tabular-nums">{formatTime(avgTime)}</div>
              </div>
            </div>

            <div className="bg-[#1c1d1c] p-6 border border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Guess Distribution</p>
              <div className="space-y-2">
                {Object.entries(distribution).map(([guess, count]) => (
                  <div key={guess} className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 w-4">{guess}</span>
                    <div className="flex-1 h-5 bg-[#121213] relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-[#538d4e]" style={{ width: `${totalWins > 0 ? (count / totalWins) * 100 : 0}%` }}></div>
                      <span className="absolute right-2 text-[10px] font-bold text-white leading-5">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-9 flex flex-col md:flex-row items-center justify-center py-4 gap-12">
            <div className="flex flex-col items-center flex-1">
              <div className="grid grid-rows-6 gap-1 mb-8">
                {board.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-5 gap-1">
                    {row.map((tile, tIdx) => (
                      <div 
                        key={tIdx} 
                        className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-3xl font-bold transition-colors duration-500 ${getTileStyle(tile.state)}`}
                      >
                        {tile.letter.toUpperCase()}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="w-full max-w-xl flex flex-col gap-2">
                <div className="flex justify-center gap-1.5 px-1">
                  {['Q','W','E','R','T','Y','U','I','O','P'].map(k => (
                    <button key={k} onClick={() => onKey(k)} className={`flex-1 h-14 rounded-md font-bold text-sm active:opacity-75 transition-all ${getKeyStyle(k)}`}>{k}</button>
                  ))}
                </div>
                <div className="flex justify-center gap-1.5 px-8">
                  {['A','S','D','F','G','H','J','K','L'].map(k => (
                    <button key={k} onClick={() => onKey(k)} className={`flex-1 h-14 rounded-md font-bold text-sm active:opacity-75 transition-all ${getKeyStyle(k)}`}>{k}</button>
                  ))}
                </div>
                <div className="flex justify-center gap-1.5 px-1">
                  <button onClick={() => onKey('Enter')} className="px-4 h-14 rounded-md bg-[#818384] text-white font-bold text-xs active:opacity-75">ENTER</button>
                  {['Z','X','C','V','B','N','M'].map(k => (
                    <button key={k} onClick={() => onKey(k)} className={`flex-1 h-14 rounded-md font-bold text-sm active:opacity-75 transition-all ${getKeyStyle(k)}`}>{k}</button>
                  ))}
                  <button onClick={() => onKey('Backspace')} className="px-4 h-14 rounded-md bg-[#818384] text-white flex items-center justify-center active:opacity-75">
                    <span className="material-symbols-outlined text-xl">backspace</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="w-[140px] flex items-center justify-center">
              {gameState !== 'playing' && (
                <button 
                  onClick={resetGame}
                  className="px-6 py-3 bg-[#538d4e] text-white font-bold text-sm hover:opacity-90 transition-all uppercase tracking-widest rounded-sm"
                >
                  Play Again
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SinglePlayer;
