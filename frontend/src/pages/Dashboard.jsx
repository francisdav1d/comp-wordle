import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { userProfile } = useAuth();

  const stats = [
    { label: 'Elo Rating', value: userProfile?.elo || 1000, color: 'text-primary' },
    { label: 'Win Rate', value: `${(userProfile?.win_rate || 0).toFixed(1)}%`, color: 'text-on-surface' },
    { label: 'Rank', value: userProfile?.tier || 'Bronze', color: 'text-secondary' },
  ];

  return (
    <main className="max-w-[1440px] mx-auto p-4 md:p-8 space-y-6 pb-24 md:pb-8 bg-[#131314]">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Balanced rounded-xl, no glow */}
          <div className="bg-[#1c1b1c] p-8 rounded-xl relative overflow-hidden border border-white/5 shadow-none">
            <div className="relative z-10">
              <span className="text-primary font-headline font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block opacity-70">Current Status</span>
              <h1 className="text-4xl md:text-5xl font-headline font-black text-white tracking-tighter mb-4">
                Welcome back, <span className="text-primary">@{userProfile?.username || 'Player'}</span>
              </h1>
              <div className="flex flex-wrap gap-4 mt-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-[#2a292a] p-6 rounded-xl border border-white/5 flex-1 min-w-[160px]">
                    <div className="text-[10px] text-slate-500 font-bold font-headline uppercase tracking-widest mb-2">{stat.label}</div>
                    <div className={`text-3xl font-black font-headline tracking-tighter ${stat.color}`}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1e291e] p-6 rounded-xl border border-primary/20 group hover:bg-[#253625] transition-all cursor-pointer shadow-none">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-primary text-4xl">style</span>
                <span className="material-symbols-outlined text-primary/40 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <h3 className="text-xl font-headline font-bold text-white mb-1">Enter Arena</h3>
              <p className="text-sm text-slate-400">Competitive multiplayer matches</p>
            </div>
            <div className="bg-[#1c1b1c] p-6 rounded-xl border border-white/5 group hover:bg-[#2a292a] transition-all cursor-pointer shadow-none">
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-secondary text-4xl">fitness_center</span>
                <span className="material-symbols-outlined text-slate-500 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <h3 className="text-xl font-headline font-bold text-white mb-1">Training Mode</h3>
              <p className="text-sm text-slate-400">Sharpen your skills solo</p>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-[#1c1b1c] p-6 rounded-xl border border-white/5 shadow-none">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline font-bold text-lg text-white">Daily Streak</h3>
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
            <div className="text-center py-4">
              <div className="text-6xl font-headline font-black text-white mb-2 tracking-tighter">{userProfile?.current_streak || 0}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Consecutive Days Active</div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between text-[10px] font-bold font-headline uppercase tracking-widest text-slate-500">
              <span>Max Streak</span>
              <span className="text-white">{userProfile?.max_streak || 0} Days</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Dashboard;
