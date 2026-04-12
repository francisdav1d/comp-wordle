import React from 'react';

const GameArena = () => {
  return (
    <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0 lg:overflow-hidden">
      {/* Left: Live Intelligence Feed */}
      <aside className="lg:col-span-3 bg-surface-container-low p-6 lg:border-r border-transparent flex flex-col space-y-6">
        <div>
          <h3 className="uppercase tracking-widest text-outline font-bold text-[10px] mb-4">Opponent Intelligence</h3>
          <div className="space-y-4">
            {/* Opponent 1: Viper_Grid */}
            <div className="bg-surface-container-high p-3 rounded shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-on-surface">Viper_Grid</span>
                <span className="text-[10px] font-bold text-primary bg-on-primary/10 px-2 py-0.5 rounded">Turn 4</span>
              </div>
              <div className="grid grid-cols-5 gap-1 w-24">
                {/* Turn 1 */}
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-secondary rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                {/* Turn 2 */}
                <div className="w-4 h-4 bg-primary rounded-sm"></div>
                <div className="w-4 h-4 bg-secondary rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                {/* Turn 3 */}
                <div className="w-4 h-4 bg-primary rounded-sm"></div>
                <div className="w-4 h-4 bg-primary rounded-sm"></div>
                <div className="w-4 h-4 bg-secondary rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
              </div>
            </div>
            {/* Opponent 2: EchoMaster */}
            <div className="bg-surface-container-high p-3 rounded shadow-sm opacity-90">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-on-surface">EchoMaster</span>
                <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded">Turn 3</span>
              </div>
              <div className="grid grid-cols-5 gap-1 w-24">
                <div className="w-4 h-4 bg-secondary rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-secondary rounded-sm"></div>
                <div className="w-4 h-4 bg-secondary rounded-sm"></div>
                <div className="w-4 h-4 bg-primary rounded-sm"></div>
                <div className="w-4 h-4 bg-primary rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
              </div>
            </div>
            {/* Opponent 3: Lexi_Lover */}
            <div className="bg-surface-container-high p-3 rounded shadow-sm opacity-80">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-on-surface">Lexi_Lover</span>
                <span className="text-[10px] font-bold text-error bg-error/10 px-2 py-0.5 rounded">Turn 5</span>
              </div>
              <div className="grid grid-cols-5 gap-1 w-24 opacity-60">
                {[...Array(10)].map((_, i) => <div key={i} className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>)}
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-secondary rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-primary rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
                <div className="w-4 h-4 bg-surface-container-highest rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-auto pt-6">
          <div className="bg-primary/5 p-4 rounded border-l-2 border-primary">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <span className="text-primary font-bold">INSIGHT:</span> Viper_Grid is currently matching your Turn 3 accuracy. Focus on eliminating vowels.
            </p>
          </div>
        </div>
      </aside>

      {/* Center: Game Board & Metrics */}
      <section className="lg:col-span-6 bg-surface p-4 flex flex-col items-center justify-between">
        {/* Metrics Bar */}
        <div className="w-full max-w-lg grid grid-cols-3 gap-4 mb-8">
          <div className="bg-surface-container-low p-3 rounded-lg text-center">
            <div className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Time Remaining</div>
            <div className="text-xl font-headline font-extrabold text-on-surface tracking-tight">04:22</div>
          </div>
          <div className="bg-surface-container-low p-3 rounded-lg text-center border-t-2 border-primary-container">
            <div className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Solver Success</div>
            <div className="text-xl font-headline font-extrabold text-primary tracking-tight">94.2%</div>
          </div>
          <div className="bg-surface-container-low p-3 rounded-lg text-center">
            <div className="text-[10px] uppercase tracking-widest text-outline font-bold mb-1">Avg Turns</div>
            <div className="text-xl font-headline font-extrabold text-on-surface tracking-tight">3.82</div>
          </div>
        </div>

        {/* Wordle Grid */}
        <div className="grid grid-rows-6 gap-2 mb-8">
          {/* Guess 1: STARE */}
          <div className="grid grid-cols-5 gap-2">
            {['S','T','A','R','E'].map((l,i) => <div key={i} className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-surface-container-highest text-2xl font-black border-2 border-transparent text-on-surface">{l}</div>)}
          </div>
          {/* Guess 2: CLOUD */}
          <div className="grid grid-cols-5 gap-2">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-primary text-2xl font-black text-on-primary-container">C</div>
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-secondary text-2xl font-black text-on-secondary">L</div>
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-primary text-2xl font-black text-on-primary-container">O</div>
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-surface-container-highest text-2xl font-black text-on-surface">U</div>
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-surface-container-highest text-2xl font-black text-on-surface">D</div>
          </div>
          {/* Guess 3: COLON */}
          <div className="grid grid-cols-5 gap-2">
            {['C','O','L','O','N'].map((l,i) => <div key={i} className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-primary text-2xl font-black text-on-primary-container">{l}</div>)}
          </div>
          {/* Empty rows 4-6 */}
          {[4,5,6].map(row => (
            <div key={row} className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_,i) => <div key={i} className="w-14 h-14 md:w-16 md:h-16 border-2 border-surface-container-highest bg-transparent"></div>)}
            </div>
          ))}
        </div>

        {/* On-Screen Keyboard */}
        <div className="w-full max-w-2xl px-2 mb-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-center gap-1.5">
              {['Q','W','E','R','T','Y','U','I'].map(k => <button key={k} className="flex-1 h-12 md:h-14 bg-surface-container-highest rounded font-bold text-sm uppercase">{k}</button>)}
              <button className="flex-1 h-12 md:h-14 bg-primary rounded font-bold text-sm uppercase text-on-primary">O</button>
              <button className="flex-1 h-12 md:h-14 bg-surface-container-highest rounded font-bold text-sm uppercase">P</button>
            </div>
            <div className="flex justify-center gap-1.5 px-4">
              {['A','S','D','F','G','H','J','K'].map(k => <button key={k} className="flex-1 h-12 md:h-14 bg-surface-container-highest rounded font-bold text-sm uppercase">{k}</button>)}
              <button className="flex-1 h-12 md:h-14 bg-secondary rounded font-bold text-sm uppercase text-on-secondary">L</button>
            </div>
            <div className="flex justify-center gap-1.5">
              <button className="flex-[1.5] h-12 md:h-14 bg-surface-container-high rounded font-bold text-[10px] uppercase">Enter</button>
              {['Z','X'].map(k => <button key={k} className="flex-1 h-12 md:h-14 bg-surface-container-highest rounded font-bold text-sm uppercase">{k}</button>)}
              <button className="flex-1 h-12 md:h-14 bg-primary rounded font-bold text-sm uppercase text-on-primary">C</button>
              {['V','B'].map(k => <button key={k} className="flex-1 h-12 md:h-14 bg-surface-container-highest rounded font-bold text-sm uppercase">{k}</button>)}
              <button className="flex-1 h-12 md:h-14 bg-primary rounded font-bold text-sm uppercase text-on-primary">N</button>
              <button className="flex-1 h-12 md:h-14 bg-surface-container-highest rounded font-bold text-sm uppercase">M</button>
              <button className="flex-[1.5] h-12 md:h-14 bg-surface-container-high rounded font-bold text-sm uppercase">
                <span className="material-symbols-outlined text-base">backspace</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Right: Rankings / Live Stats */}
      <aside className="lg:col-span-3 bg-surface-container-low p-6 flex flex-col space-y-8">
        <div>
          <h3 className="uppercase tracking-widest text-outline font-bold text-[10px] mb-4">Rank Progress</h3>
          <div className="relative bg-surface-container-high h-2 rounded-full overflow-hidden mb-2">
            <div className="absolute inset-0 bg-tertiary-fixed-dim" style={{ width: '75%' }}></div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-outline uppercase tracking-wider">
            <span>Platinum I</span>
            <span className="text-on-surface">320 / 400 LP</span>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="uppercase tracking-widest text-outline font-bold text-[10px]">Leaderboard Standing</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center font-bold text-[#131314] text-xs">1</div>
              <div className="flex-grow">
                <div className="text-xs font-bold text-on-surface">Syntax_Error</div>
                <div className="text-[10px] text-outline">Streak: 42</div>
              </div>
              <div className="text-xs font-headline font-bold text-tertiary">2,840</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-on-surface-variant/20 flex items-center justify-center font-bold text-on-surface text-xs">2</div>
              <div className="flex-grow">
                <div className="text-xs font-bold text-on-surface">WordWiz_99</div>
                <div className="text-[10px] text-outline">Streak: 18</div>
              </div>
              <div className="text-xs font-headline font-bold">2,710</div>
            </div>
            <div className="flex items-center gap-3 border-l-2 border-primary pl-3 bg-primary/5 py-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-on-primary text-xs">3</div>
              <div className="flex-grow">
                <div className="text-xs font-bold text-on-surface">You</div>
                <div className="text-[10px] text-outline">Streak: 12</div>
              </div>
              <div className="text-xs font-headline font-bold text-primary">2,655</div>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="p-4 bg-surface-container-highest rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary">trending_up</span>
              <span className="text-xs font-bold text-on-surface uppercase tracking-tight">Performance Trend</span>
            </div>
            <div className="h-24 w-full flex items-end justify-between gap-1">
              <div className="w-2 bg-outline-variant h-1/2 rounded-t-sm"></div>
              <div className="w-2 bg-outline-variant h-2/3 rounded-t-sm"></div>
              <div className="w-2 bg-primary h-3/4 rounded-t-sm"></div>
              <div className="w-2 bg-primary h-full rounded-t-sm"></div>
              <div className="w-2 bg-primary h-5/6 rounded-t-sm"></div>
              <div className="w-2 bg-primary h-full rounded-t-sm"></div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
};

export default GameArena;
