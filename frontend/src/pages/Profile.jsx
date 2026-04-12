import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { userProfile, logout } = useAuth();
  
  const heatmapCells = useMemo(() => {
    const colors = ['bg-surface-container-highest', 'bg-[#125217]', 'bg-[#2d6b2d]', 'bg-[#6aaa64]', 'bg-[#94d78c]'];
    return Array.from({ length: 52 * 7 }, () => colors[Math.floor(Math.pow(Math.random(), 3) * 5)]);
  }, []);

  return (
    <main className="max-w-[1440px] mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 pb-24 md:pb-8">
      <section className="col-span-1 md:col-span-12">
        <div className="bg-surface-container-low p-8 rounded-xl flex flex-col lg:flex-row gap-8 items-start lg:items-center">
          <div className="relative shrink-0">
            <img alt="User Avatar" className="w-32 h-32 rounded-xl object-cover ring-4 ring-primary/20" src={userProfile?.avatar_url || "https://i.pravatar.cc/200"} />
            <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary text-[10px] font-black px-2 py-1 rounded font-headline tracking-widest">ONLINE</div>
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">@{userProfile?.username || 'player'}</h1>
                <p className="text-slate-400 mt-1 font-headline text-sm uppercase tracking-widest font-bold">{userProfile?.tier || 'Bronze'} Combatant</p>
              </div>
              <div className="flex items-center gap-3 bg-surface-container-highest px-4 py-2 rounded-lg border-l-4 border-tertiary">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                <div className="font-headline">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Rank</div>
                  <div className="text-sm font-black text-tertiary">#42,412</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {[
                { label: 'Win Rate', value: `${(userProfile?.win_rate || 0).toFixed(1)}%`, color: 'text-primary' },
                { label: 'Elo Rating', value: userProfile?.elo || 1000, color: 'text-secondary' },
                { label: 'Current Streak', value: userProfile?.current_streak || 0, color: 'text-secondary' },
                { label: 'Total Matches', value: userProfile?.total_matches || 0, color: 'text-on-surface' },
              ].map(stat => (
                <div key={stat.label} className="bg-surface-container p-4 rounded-lg">
                  <div className="text-[10px] text-slate-500 font-bold font-headline uppercase tracking-tighter mb-1">{stat.label}</div>
                  <div className={`text-2xl font-black font-headline tracking-tighter ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="col-span-1 md:col-span-8">
        <div className="bg-surface-container-low p-6 rounded-xl h-full flex flex-col">
          <h3 className="font-headline font-bold text-xl mb-6">Arena Activity</h3>
          <div className="flex-1 flex flex-col justify-center overflow-hidden">
            <div className="w-full overflow-x-auto no-scrollbar py-2">
              <div className="flex gap-1">
                <div className="grid grid-flow-col grid-rows-7 gap-1">
                  {heatmapCells.map((color, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-sm ${color}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <aside className="col-span-1 md:col-span-4 space-y-6">
        <div className="bg-surface-container-low p-6 rounded-xl">
          <button 
            onClick={logout}
            className="w-full py-3 border border-error/30 text-error text-xs font-bold rounded-lg hover:bg-error hover:text-on-error transition-all uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Exit Arena
          </button>
        </div>
      </aside>
    </main>
  );
};

export default Profile;
