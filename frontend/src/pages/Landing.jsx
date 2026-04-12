import React from 'react';
import { NavLink } from 'react-router-dom';

const Landing = () => {
  return (
    <main className="relative min-h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden px-6 md:px-12 lg:px-24 items-center">
      {/* Left Content Column */}
      <div className="w-full md:w-1/2 z-10 py-12 md:py-24">
        <div className="space-y-2 mb-8">
          <span className="text-secondary font-label text-xs uppercase tracking-[0.3em] font-bold">Lexical Excellence</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-headline tracking-tighter leading-[0.9] text-on-surface">
            Play Wordle <br />
            <span className="text-primary">Competitively</span>
          </h1>
        </div>
        <div className="flex flex-col space-y-4 max-w-sm">
          {/* Go to Dashboard */}
          <NavLink to="/dashboard" className="group flex items-center justify-between bg-surface-container-high text-on-surface hover:bg-surface-bright px-6 py-5 rounded-xl font-headline font-bold text-lg transition-all active:scale-[0.98]">
            <span>Go to Dashboard</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">dashboard</span>
          </NavLink>
          {/* Play Competitively */}
          <NavLink to="/arena" className="group relative flex items-center justify-between bg-primary-container text-on-primary-container px-6 py-5 rounded-xl font-headline font-extrabold text-lg transition-all active:scale-[0.98] shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10">Play Competitively</span>
            <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform">military_tech</span>
          </NavLink>
          {/* Play with Friends */}
          <NavLink to="/social" className="group flex items-center justify-between bg-surface-container-high text-on-surface hover:bg-surface-bright px-6 py-5 rounded-xl font-headline font-bold text-lg transition-all active:scale-[0.98]">
            <span>Play with Friends</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">group</span>
          </NavLink>
        </div>
        <div className="mt-12 flex items-center space-x-6 text-outline">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-highest overflow-hidden">
              <img className="w-full h-full object-cover" src="https://i.pravatar.cc/100?u=a1" alt="player" />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-highest overflow-hidden">
              <img className="w-full h-full object-cover" src="https://i.pravatar.cc/100?u=a2" alt="player" />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-surface flex items-center justify-center bg-surface-container-high text-[10px] font-bold text-primary">
              +12k
            </div>
          </div>
          <p className="text-sm font-label font-medium tracking-wide">Join 12,400+ players in the arena</p>
        </div>
      </div>
      {/* Right Side: Decorative Slanted Grid */}
      <div className="absolute right-[-5%] top-[10%] w-full md:w-3/5 h-[120%] pointer-events-none opacity-20 md:opacity-40">
        <div className="perspectival-grid grid-fade w-full h-full flex items-center justify-center">
          <div className="grid grid-cols-5 gap-3 md:gap-4 p-8">
            {/* Row 1 */}
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-on-primary flex items-center justify-center text-3xl font-black font-headline rounded-lg">T</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-3xl font-black font-headline rounded-lg">R</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-3xl font-black font-headline rounded-lg">A</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-3xl font-black font-headline rounded-lg">I</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-secondary-container text-on-secondary-container flex items-center justify-center text-3xl font-black font-headline rounded-lg">N</div>
            {/* Row 2 */}
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-on-primary flex items-center justify-center text-3xl font-black font-headline rounded-lg">S</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-on-primary flex items-center justify-center text-3xl font-black font-headline rounded-lg">T</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-on-primary flex items-center justify-center text-3xl font-black font-headline rounded-lg">A</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-3xl font-black font-headline rounded-lg">T</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-on-primary flex items-center justify-center text-3xl font-black font-headline rounded-lg">E</div>
            {/* Row 3 */}
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-on-primary flex items-center justify-center text-3xl font-black font-headline rounded-lg shadow-[0_0_30px_rgba(106,170,100,0.3)]">L</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-on-primary flex items-center justify-center text-3xl font-black font-headline rounded-lg shadow-[0_0_30px_rgba(106,170,100,0.3)]">O</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-on-primary flex items-center justify-center text-3xl font-black font-headline rounded-lg shadow-[0_0_30px_rgba(106,170,100,0.3)]">G</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-on-primary flex items-center justify-center text-3xl font-black font-headline rounded-lg shadow-[0_0_30px_rgba(106,170,100,0.3)]">I</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-on-primary flex items-center justify-center text-3xl font-black font-headline rounded-lg shadow-[0_0_30px_rgba(106,170,100,0.3)]">C</div>
            {/* Row 4 */}
            {[...Array(5)].map((_, i) => <div key={`r4-${i}`} className="w-16 h-16 md:w-24 md:h-24 bg-surface-container-highest/20 border border-outline-variant/10 rounded-lg"></div>)}
            {/* Row 5 */}
            {[...Array(5)].map((_, i) => <div key={`r5-${i}`} className="w-16 h-16 md:w-24 md:h-24 bg-surface-container-highest/5 border border-outline-variant/5 rounded-lg"></div>)}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-surface via-transparent to-surface z-20"></div>
      </div>
    </main>
  );
};

export default Landing;
