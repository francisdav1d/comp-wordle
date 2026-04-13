import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { userProfile } = useAuth();

  const mainStats = [
    { label: 'Single RP', value: userProfile?.single_player_elo || 0, color: 'text-primary' },
    { label: 'Win Rate', value: `${(userProfile?.win_rate || 0).toFixed(1)}%`, color: 'text-white' },
    { label: 'Current Tier', value: userProfile?.tier || 'Bronze', color: 'text-secondary' },
    { label: 'Daily Streak', value: userProfile?.current_daily_streak || 0, color: 'text-primary' },
    { label: 'Win Streak', value: userProfile?.current_win_streak || 0, color: 'text-secondary' },
  ];

  return (
    <main className="max-w-[1440px] mx-auto p-4 md:p-8 space-y-6 pb-24 md:pb-8 bg-[#131314]">
      {/* Profile/Hero Section */}
      <section className="bg-[#1c1c1d] p-8 border border-[#3a3a3c]">
        <div className="relative z-10">
          <span className="text-[#818384] font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">Combatant Profile</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8">
            Welcome, <span className="text-primary">@{userProfile?.username || 'Player'}</span>
          </h1>

          {/* Aligned Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {mainStats.map((stat) => (
              <div key={stat.label} className="bg-[#131314] p-4 md:p-6 border border-[#3a3a3c] rounded-xl">
                <div className="text-[8px] md:text-[9px] text-[#818384] font-bold uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                <div className={`text-2xl md:text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <a href="/arena" className="bg-[#1c1c1d] p-8 border border-[#3a3a3c] rounded-xl group hover:border-primary/50 transition-all cursor-pointer block">
          <div className="flex justify-between items-start mb-6">
            <span className="material-symbols-outlined text-primary text-4xl">style</span>
            <span className="material-symbols-outlined text-[#3a3a3c] group-hover:text-primary transition-colors">arrow_forward</span>
          </div>
          <h3 className="text-xl font-black text-white uppercase mb-2 tracking-widest">Multiplayer Arena</h3>
          <p className="text-xs text-[#818384] font-bold uppercase tracking-widest leading-relaxed">
            Engage in synchronized combat sessions against active operatives.
          </p>
        </a>

        <a href="/single-player" className="bg-[#1c1c1d] p-8 border border-[#3a3a3c] rounded-xl group hover:border-primary/50 transition-all cursor-pointer block">
          <div className="flex justify-between items-start mb-6">
            <span className="material-symbols-outlined text-secondary text-4xl">fitness_center</span>
            <span className="material-symbols-outlined text-[#3a3a3c] group-hover:text-secondary transition-colors">arrow_forward</span>
          </div>
          <h3 className="text-xl font-black text-white uppercase mb-2 tracking-widest">Training Mission</h3>
          <p className="text-xs text-[#818384] font-bold uppercase tracking-widest leading-relaxed">
            Execute solo lexical sequences to optimize solve tempo and logic.
          </p>
        </a>

        <a href="/leaderboard" className="bg-[#1c1c1d] p-8 border border-[#3a3a3c] rounded-xl group hover:border-primary/50 transition-all cursor-pointer block">
          <div className="flex justify-between items-start mb-6">
            <span className="material-symbols-outlined text-white/50 text-4xl">military_tech</span>
            <span className="material-symbols-outlined text-[#3a3a3c] group-hover:text-white transition-colors">arrow_forward</span>
          </div>
          <h3 className="text-xl font-black text-white uppercase mb-2 tracking-widest">Global Ranking</h3>
          <p className="text-xs text-[#818384] font-bold uppercase tracking-widest leading-relaxed">
            Review performance metrics across the top-tier operative network.
          </p>
        </a>
      </section>

      {/* Secondary Data Strip */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1c1c1d] p-6 border border-[#3a3a3c] rounded-md flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-1.5 bg-primary"></div>
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Last Session Solve Time</span>
          </div>
          <span className="text-xl font-black text-primary tabular-nums">00:48</span>
        </div>
        <div className="bg-[#1c1c1d] p-6 border border-[#3a3a3c] flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-1.5 bg-secondary"></div>
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Max Accomplished Streak</span>
          </div>
          <span className="text-xl font-black text-secondary tabular-nums">{userProfile?.max_win_streak || 0} Wins</span>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
