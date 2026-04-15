import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRandomWord, allWords } from '../lib/words';
import { LetterState } from '../lib/wordleTypes';

const WIN_PERFORMANCE_RATINGS = [1850, 1680, 1520, 1380, 1260, 1160];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getSinglePlayerKFactor(rating) {
  if (rating < 800) return 40;
  if (rating < 1200) return 32;
  if (rating < 1600) return 24;
  return 18;
}

function calculateSinglePlayerRatingChange({ currentRating, isWin, guessIndex, solveTime }) {
  const performanceBase = isWin ? (WIN_PERFORMANCE_RATINGS[guessIndex] || 1100) : 700;
  const speedAdjustment = isWin ? clamp(Math.round((90 - solveTime) * 2), -80, 120) : 0;
  const performanceRating = performanceBase + speedAdjustment;
  const expectedScore = 1 / (1 + 10 ** ((performanceRating - currentRating) / 400));
  const actualScore = isWin ? 1 : 0;
  const rawChange = Math.round(getSinglePlayerKFactor(currentRating) * (actualScore - expectedScore));

  if (isWin) {
    return clamp(rawChange, 4, 36);
  }

  return clamp(rawChange, -28, -6);
}

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
  const [shakeRowIndex, setShakeRowIndex] = useState(-1);
  const [success, setSuccess] = useState(false);
  const [isRated, setIsRated] = useState(true);
  const [ratingChange, setRatingChange] = useState(null);

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
    setShakeRowIndex(-1);
    setSuccess(false);
    setRatingChange(null);
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

    let nextRating = userProfile.single_player_elo || 0;
    let change = 0;

    if (isRated) {
      const currentRating = userProfile.single_player_elo || 0;
      change = calculateSinglePlayerRatingChange({
        currentRating,
        isWin,
        guessIndex: finalRowIndex,
        solveTime,
      });
      nextRating = Math.max(0, currentRating + change);
      setRatingChange(change);
    }

    const statsUpdate = {
      total_matches: newTotalMatches,
      wins: newWins,
      win_rate: (newTotalMatches > 0 ? (newWins / newTotalMatches) * 100 : 0),
      current_win_streak: newWinStreak,
      max_win_streak: newMaxWinStreak,
      guess_distribution: newDist,
      avg_solve_time: newAvgTime,
      single_player_elo: nextRating,
    };

    const { error } = await updateProfileStats(statsUpdate);
    if (error) {
      console.error('Single-player stats update failed:', error);
      setRatingChange(null);
    }
  };

  const showMessage = (msg, time = 2000) => {
    setMessage(msg);
    if (time > 0) {
      setTimeout(() => setMessage(''), time);
    }
  };

  const shake = () => {
    setShakeRowIndex(currentRowIndex);
    setTimeout(() => setShakeRowIndex(-1), 500);
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
        shake();
        showMessage('Not enough letters');
        return;
      }
      if (!allWords.includes(guess)) {
        shake();
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
        setTimeout(() => setSuccess(true), 1500);
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
      <main className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col min-h-[calc(100vh-112px)] overflow-x-hidden">
        {message && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-[#1c1d1c] text-white px-6 py-3 rounded border border-white/10 font-bold shadow-2xl animate-in fade-in zoom-in duration-300">
            {message}
          </div>
        )}

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 relative">
          {/* Stats Column - Moves to bottom on smaller screens */}
          <div className="order-2 xl:order-1 xl:col-span-3 space-y-4 md:space-y-6">
            {/* Mode Selector */}
            <div className="hidden xl:flex bg-[#1c1c1d]  border border-[#3a3a3c] rounded-xl">
              <button
                onClick={() => gameState === 'playing' && !hasStarted && setIsRated(true)}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${isRated ? 'bg-primary text-[#131314]' : 'text-[#818384] hover:text-white'}`}
                disabled={hasStarted}
              >
                Rated
              </button>
              <button
                onClick={() => gameState === 'playing' && !hasStarted && setIsRated(false)}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${!isRated ? 'bg-[#3a3a3c] text-white' : 'text-[#818384] hover:text-white'}`}
                disabled={hasStarted}
              >
                Unrated
              </button>
            </div>

            <div className={`bg-[#1c1c1d] p-4 md:p-6 border border-[#3a3a3c] rounded-xl transition-all ${isRated ? 'border-l-4 border-l-primary' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#818384] mb-1">Single Player RP</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-white">{userProfile?.single_player_elo || 0}</span>
                    {ratingChange !== null && (
                      <span className={`text-[10px] font-bold ${ratingChange >= 0 ? 'text-primary' : 'text-red-500'}`}>
                        {ratingChange >= 0 ? `+${ratingChange}` : ratingChange}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-[#3a3a3c] flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#818384]">Win Streak</p>
                  <span className="text-xl font-black text-white">{currentStreak}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#818384]">Best</p>
                  <span className="text-xl font-black text-white/40">{maxStreak}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1c1c1d] p-4 md:p-6 border border-[#3a3a3c] rounded-xl grid grid-cols-2">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#818384] mb-1">Today</p>
                <div className="text-xl md:text-2xl font-black text-white tabular-nums">{formatTime(timer)}</div>
              </div>
              <div className="text-center border-l border-[#3a3a3c]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#818384] mb-1">Avg</p>
                <div className="text-xl md:text-2xl font-black text-primary tabular-nums">{formatTime(avgTime)}</div>
              </div>
            </div>

            <div className="bg-[#1c1c1d] p-4 md:p-6 border border-[#3a3a3c] rounded-xl hidden md:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#818384] mb-4">Guess Distribution</p>
              <div className="space-y-2">
                {Object.entries(distribution).map(([guess, count]) => (
                  <div key={guess} className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#818384] w-4">{guess}</span>
                    <div className="flex-1 h-5 bg-[#131314] relative overflow-hidden rounded-md">
                      <div className="absolute inset-y-0 left-0 bg-white/10 rounded-md" style={{ width: `${totalWins > 0 ? (count / totalWins) * 100 : 0}%` }}></div>
                      <span className="absolute right-2 text-[10px] font-bold text-white leading-5">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Game Board Column - Fills viewport on mobile, centered on PC */}
          <div className="order-1 xl:order-2 xl:col-span-9 flex flex-col items-center justify-between xl:justify-center py-6 md:py-4 w-full xl:min-h-0 min-h-[calc(100vh-140px)]">
            {/* Mobile Mode Selector */}
            <div className="xl:hidden w-full max-w-xl px-1 mb-6">
              <div className="bg-[#1c1c1d] border border-[#3a3a3c] rounded-xl flex">
                <button
                  onClick={() => gameState === 'playing' && !hasStarted && setIsRated(true)}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${isRated ? 'bg-primary text-[#131314]' : 'text-[#818384] hover:text-white'}`}
                  disabled={hasStarted}
                >
                  Rated
                </button>
                <button
                  onClick={() => gameState === 'playing' && !hasStarted && setIsRated(false)}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${!isRated ? 'bg-[#3a3a3c] text-white' : 'text-[#818384] hover:text-white'}`}
                  disabled={hasStarted}
                >
                  Unrated
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center w-full flex-1 justify-center">
              <div className="grid grid-rows-6 gap-1.5 md:gap-1.5 mb-8 md:mb-8">
                {board.map((row, rIdx) => (
                  <div key={rIdx} className={`grid grid-cols-5 gap-1.5 md:gap-1.5 ${shakeRowIndex === rIdx ? 'row-anim-shake' : ''}`}>
                    {row.map((tile, tIdx) => (
                      <div
                        key={tIdx}
                        className={`w-14 h-14 sm:w-16 sm:h-16 xl:w-14 xl:sm:w-16 relative tile-flip ${tile.state !== LetterState.INITIAL ? 'tile-revealed' : ''} ${tile.letter && tile.state === LetterState.INITIAL ? 'tile-anim-zoom' : ''}`}
                      >
                        <div
                          className={`tile-flip-inner ${success && rIdx === currentRowIndex ? 'tile-anim-jump' : ''}`}
                          style={{
                            transitionDelay: `${tIdx * 300}ms`,
                            animationDelay: `${tIdx * 100}ms`
                          }}
                        >
                          {/* MOBILE FONT: Change 'text-2xl' to resize letters in boxes */}
                          <div className={`tile-front w-full h-full rounded-lg text-2xl xl:text-2xl xl:md:text-3xl font-bold border-2 ${tile.letter ? 'border-[#818384]' : 'border-[#3a3a3c]'} text-white flex items-center justify-center`}>
                            {tile.letter.toUpperCase()}
                          </div>
                          <div className={`tile-back w-full h-full rounded-lg text-2xl xl:text-2xl xl:md:text-3xl font-bold text-[#131314] ${getTileStyle(tile.state)} flex items-center justify-center`}>
                            {tile.letter.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Responsive Keyboard */}
              {/* Virtual Keyboard */}
              <div className="w-full max-w-xl flex flex-col gap-1 md:gap-2 px-1 mb-4">
                <div className="flex justify-center gap-1 md:gap-1.5">
                  {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(k => (
                    <button key={k} onClick={() => onKey(k)} className={`flex-1 h-12 md:h-14 rounded-md font-black text-xs md:text-sm active:opacity-75 transition-all ${getKeyStyle(k)}`}>{k}</button>
                  ))}
                </div>
                <div className="flex justify-center gap-1 md:gap-1.5 px-3 md:px-8">
                  {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(k => (
                    <button key={k} onClick={() => onKey(k)} className={`flex-1 h-12 md:h-14 rounded-md font-black text-xs md:text-sm active:opacity-75 transition-all ${getKeyStyle(k)}`}>{k}</button>
                  ))}
                </div>
                <div className="flex justify-center gap-1 md:gap-1.5">
                  <button onClick={() => onKey('Enter')} className="px-2 md:px-4 h-12 md:h-14 rounded-md bg-[#818384] text-white font-black text-[9px] md:text-xs active:opacity-75">ENTER</button>
                  {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map(k => (
                    <button key={k} onClick={() => onKey(k)} className={`flex-1 h-12 md:h-14 rounded-md font-black text-xs md:text-sm active:opacity-75 transition-all ${getKeyStyle(k)}`}>{k}</button>
                  ))}
                  <button onClick={() => onKey('Backspace')} className="px-2 md:px-4 h-12 md:h-14 rounded-md bg-[#818384] text-white flex items-center justify-center active:opacity-75">
                    <span className="material-symbols-outlined text-lg md:text-xl">backspace</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-center mt-4">
              {gameState !== 'playing' && (
                <button
                  onClick={resetGame}
                  className="w-full md:w-auto px-12 py-4 bg-primary text-[#131314] font-black text-xs hover:brightness-110 transition-all uppercase tracking-[0.2em] rounded-xl"
                >
                  New Mission
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
