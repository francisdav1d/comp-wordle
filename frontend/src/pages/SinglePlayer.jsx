import React, { useState } from 'react';

const SinglePlayer = () => {
  const [mode, setMode] = useState('zen');

  return (
    <>
      <main className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col min-h-[calc(100vh-112px)]">
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left-side training protocol/stats */}
          <div className="xl:col-span-3 space-y-6">
            {/* Mode Toggle */}
            <div className="bg-[#1c1d1c] p-6 rounded-xl">
              <p className="text-[10px] font-label uppercase tracking-[0.15em] font-bold text-on-surface-variant mb-4">Training Protocol</p>
              <div className="flex p-1 bg-[#252625] rounded-lg">
                <button 
                  onClick={() => setMode('zen')}
                  className={`flex-1 py-2 text-xs font-bold font-label rounded-md transition-all ${mode === 'zen' ? 'bg-[#323332] text-primary' : 'text-slate-500 hover:text-on-surface'}`}
                >
                  ZEN MODE
                </button>
                <button 
                  onClick={() => setMode('timed')}
                  className={`flex-1 py-2 text-xs font-bold font-label rounded-md transition-all ${mode === 'timed' ? 'bg-[#323332] text-primary' : 'text-slate-500 hover:text-on-surface'}`}
                >
                  TIMED
                </button>
              </div>
            </div>
            {/* Stats */}
            <div className="space-y-6">
              <div className="bg-[#1c1d1c] p-6 rounded-xl border-l-4 border-primary shadow-sm">
                <p className="text-[10px] font-label uppercase tracking-[0.15em] font-bold text-on-surface-variant mb-2">Current Streak</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-headline font-black text-on-surface">14</span>
                  <span className="text-primary text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">trending_up</span>
                    BEST: 22
                  </span>
                </div>
              </div>
              <div className="bg-[#1c1d1c] p-6 rounded-xl">
                <p className="text-[10px] font-label uppercase tracking-[0.15em] font-bold text-on-surface-variant mb-2">Avg Solve Time</p>
                <span className="text-3xl font-headline font-black text-on-surface">01:42</span>
                <div className="mt-4 w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[65%]"></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">Top 12% of the Elite Tier</p>
              </div>
              <div className="bg-[#1c1d1c] p-6 rounded-xl">
                <p className="text-[10px] font-label uppercase tracking-[0.15em] font-bold text-on-surface-variant mb-4">Historical Performance</p>
                <div className="space-y-3">
                  {[
                    { guess: 'Guess 1', pct: '5%', count: 2, opacity: 'bg-primary-container/30' },
                    { guess: 'Guess 2', pct: '18%', count: 14, opacity: 'bg-primary-container/30' },
                    { guess: 'Guess 3', pct: '45%', count: 42, opacity: 'bg-primary-container' },
                    { guess: 'Guess 4', pct: '22%', count: 18, opacity: 'bg-primary-container/60' },
                  ].map(item => (
                    <div key={item.guess} className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.guess}</span>
                      <div className="flex-1 mx-3 h-4 bg-surface-container-highest rounded-sm relative overflow-hidden">
                        <div className={`absolute inset-y-0 left-0 ${item.opacity}`} style={{ width: item.pct }}></div>
                        <span className="absolute right-2 text-[10px] font-bold">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Central Game Board */}
          <div className="xl:col-span-9 flex flex-col items-center justify-center py-8">
            {/* Wordle Grid */}
            <div className="grid grid-rows-6 gap-2 mb-12">
              {/* Row 1: PIVOT */}
              <div className="grid grid-cols-5 gap-2">
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-primary border-none text-on-primary font-headline text-2xl font-black rounded-sm">P</div>
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-[#2d2e2d] border-none text-slate-500 font-headline text-2xl font-black rounded-sm">I</div>
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-secondary border-none text-on-secondary font-headline text-2xl font-black rounded-sm">V</div>
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-[#2d2e2d] border-none text-slate-500 font-headline text-2xl font-black rounded-sm">O</div>
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-[#2d2e2d] border-none text-slate-500 font-headline text-2xl font-black rounded-sm">T</div>
              </div>
              {/* Row 2: SLATE (active) */}
              <div className="grid grid-cols-5 gap-2">
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-[#2d2e2d] border-none text-on-surface font-headline text-2xl font-black outline outline-2 outline-primary rounded-sm">S</div>
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-[#2d2e2d] border-none text-on-surface font-headline text-2xl font-black rounded-sm">L</div>
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-[#2d2e2d] border-none text-on-surface font-headline text-2xl font-black rounded-sm">A</div>
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-[#2d2e2d] border-none text-on-surface font-headline text-2xl font-black rounded-sm">T</div>
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-[#2d2e2d] border-none text-on-surface font-headline text-2xl font-black rounded-sm">E</div>
              </div>
              {/* Empty rows with fading opacity */}
              {[40, 20, 10, 5].map((op, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-2" style={{ opacity: op / 100 }}>
                  {[...Array(5)].map((_, i) => <div key={i} className="w-14 h-14 md:w-16 md:h-16 bg-[#1c1d1c] rounded-sm"></div>)}
                </div>
              ))}
            </div>

            {/* Keyboard */}
            <div className="w-full max-w-xl flex flex-col gap-2">
              <div className="flex justify-center gap-1 md:gap-2">
                {['Q','W','E','R','T','Y','U','I','O','P'].map(k => (
                  <button key={k} className="flex-1 h-14 rounded-lg bg-[#252625] text-on-surface font-bold text-sm md:text-base hover:bg-surface-bright active:scale-95 transition-all">{k}</button>
                ))}
              </div>
              <div className="flex justify-center gap-1 md:gap-2 px-4 md:px-6">
                {['A','S','D','F','G','H','J','K','L'].map(k => (
                  <button key={k} className="flex-1 h-14 rounded-lg bg-[#252625] text-on-surface font-bold text-sm md:text-base hover:bg-surface-bright active:scale-95 transition-all">{k}</button>
                ))}
              </div>
              <div className="flex justify-center gap-1 md:gap-2">
                <button className="px-4 h-14 rounded-lg bg-[#2d2e2d] text-[#8e918e] font-bold text-xs hover:bg-surface-bright transition-all">ENTER</button>
                {['Z','X','C','V','B','N','M'].map(k => (
                  <button key={k} className="flex-1 h-14 rounded-lg bg-[#252625] text-on-surface font-bold text-sm md:text-base hover:bg-surface-bright active:scale-95 transition-all">{k}</button>
                ))}
                <button className="px-4 h-14 rounded-lg bg-[#2d2e2d] text-[#8e918e] font-bold text-xs hover:bg-surface-bright transition-all flex items-center justify-center">
                  <span className="material-symbols-outlined">backspace</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Contextual FAB */}
      <button className="fixed bottom-24 right-8 lg:bottom-10 lg:right-10 w-16 h-16 bg-[#94d78c] text-[#0f110f] rounded-2xl shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40">
        <span className="material-symbols-outlined text-3xl font-bold">refresh</span>
      </button>
    </>
  );
};

export default SinglePlayer;
