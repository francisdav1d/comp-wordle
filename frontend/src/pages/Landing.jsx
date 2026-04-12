import React from 'react';
import { NavLink } from 'react-router-dom';

const Landing = () => {
  return (
    <main className="relative min-h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden px-6 md:px-12 lg:px-24 items-center bg-[#131314]">
      {/* Left Content Column */}
      <div className="w-full md:w-1/2 z-30 py-8 md:py-24">
        <div className="space-y-4 mb-8 md:mb-12 text-center md:text-left">
          <span className="text-secondary font-bold text-[10px] md:text-xs uppercase tracking-[0.4em]">Lexical Excellence</span>
          <h1 className="text-6xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-white uppercase">
            COMP<br />
            <span className="text-primary">WORDLE</span>
          </h1>
          <p className="text-[#818384] max-w-sm mx-auto md:mx-0 text-[10px] md:text-sm font-bold uppercase tracking-widest leading-relaxed mt-4">
            The definitive technical arena for lexical combatants. Precision. Speed. Strategy.
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 max-w-sm mx-auto md:mx-0">
          <NavLink to="/dashboard" className="group flex items-center justify-between bg-[#1c1c1d] text-white px-6 py-5 border border-[#3a3a3c] font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-[#252526]">
            <span>Initialize Dashboard</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </NavLink>
          
          <NavLink to="/arena" className="group flex items-center justify-between bg-primary text-[#131314] px-6 py-5 border border-primary font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:brightness-110">
            <span>Enter Combat Arena</span>
            <span className="material-symbols-outlined text-sm font-black text-[#131314]">shield</span>
          </NavLink>
          
          <NavLink to="/social" className="group flex items-center justify-between bg-transparent text-white px-6 py-5 border border-[#3a3a3c] font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-[#1c1c1d]">
            <span>Operative Network</span>
            <span className="material-symbols-outlined text-sm">group</span>
          </NavLink>
        </div>

        <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center gap-6 justify-center md:justify-start">
          <div className="flex -space-x-0">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 border border-[#3a3a3c] bg-[#1c1c1d] overflow-hidden grayscale">
                <img src={`https://i.pravatar.cc/100?u=a${i}`} alt="user" className="w-full h-full object-cover opacity-50" />
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#818384]">
            <span className="text-white">12,400+</span> ACTIVE OPERATIVES
          </p>
        </div>
      </div>

      {/* RE-IMPLEMENTED FADED PERSPECTIVAL GRID - Hidden on mobile for performance and clarity */}
      <div className="absolute right-[-5%] top-[5%] w-full md:w-3/5 h-[120%] pointer-events-none opacity-10 md:opacity-30 z-10 overflow-hidden hidden md:block">
        <div className="perspectival-grid grid-fade w-full h-full flex items-center justify-center">
          <div className="grid grid-cols-5 gap-3 md:gap-4 p-8">
            {/* Row 1: TRAIN */}
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-[#131314] flex items-center justify-center text-4xl font-black">T</div>
            <div className="w-16 h-16 md:w-24 md:h-24 border border-[#3a3a3c] text-white flex items-center justify-center text-4xl font-black">R</div>
            <div className="w-16 h-16 md:w-24 md:h-24 border border-[#3a3a3c] text-white flex items-center justify-center text-4xl font-black">A</div>
            <div className="w-16 h-16 md:w-24 md:h-24 border border-[#3a3a3c] text-white flex items-center justify-center text-4xl font-black">I</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-secondary text-[#131314] flex items-center justify-center text-4xl font-black">N</div>
            
            {/* Row 2: STATE */}
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-[#131314] flex items-center justify-center text-4xl font-black">S</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-[#131314] flex items-center justify-center text-4xl font-black">T</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-[#131314] flex items-center justify-center text-4xl font-black">A</div>
            <div className="w-16 h-16 md:w-24 md:h-24 border border-[#3a3a3c] text-white flex items-center justify-center text-4xl font-black">T</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-[#131314] flex items-center justify-center text-4xl font-black">E</div>
            
            {/* Row 3: LOGIC */}
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-[#131314] flex items-center justify-center text-4xl font-black">L</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-[#131314] flex items-center justify-center text-4xl font-black">O</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-[#131314] flex items-center justify-center text-4xl font-black">G</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-[#131314] flex items-center justify-center text-4xl font-black">I</div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-[#131314] flex items-center justify-center text-4xl font-black">C</div>
            
            {/* Decorative Fillers */}
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-16 h-16 md:w-24 md:h-24 border border-[#3a3a3c]/20 rounded-none bg-white/[0.01]"></div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-[#131314] via-transparent to-[#131314] z-20"></div>
      </div>
    </main>
  );
};

export default Landing;
