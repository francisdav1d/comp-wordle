import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { userProfile, logout } = useAuth();
  
  const heatmapCells = useMemo(() => {
    const colors = ['bg-[#1c1c1d]', 'bg-[#125217]', 'bg-[#2d6b2d]', 'bg-[#6aaa64]', 'bg-[#94d78c]'];
    return Array.from({ length: 52 * 7 }, () => colors[Math.floor(Math.pow(Math.random(), 3) * 5)]);
  }, []);

  const distribution = userProfile?.guess_distribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 };
  const wins = userProfile?.wins || 0;

  return (
    <main className="max-w-[1440px] mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 pb-24 md:pb-8 bg-[#131314]">
      <section className="col-span-1 md:col-span-12">
        <div className="bg-[#1c1c1d] p-8 border border-[#3a3a3c] flex flex-col lg:flex-row gap-8 items-start lg:items-center">
          <div className="relative shrink-0">
            <img alt="User Avatar" className="w-32 h-32 border border-[#3a3a3c] object-cover" src={userProfile?.avatar_url || "https://ui-avatars.com/api/?name=Player&background=94d78c&color=131314"} />
            <div className="absolute -bottom-2 -right-2 bg-primary text-[#131314] text-[9px] font-black px-2 py-1 rounded-none font-headline tracking-widest uppercase">Ranked</div>
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-black font-headline tracking-tight text-white">@{userProfile?.username || 'player'}</h1>
                <p className="text-[#818384] mt-1 font-headline text-[10px] uppercase tracking-widest font-bold">
                  {userProfile?.tier || 'Bronze'} Combatant • Joined {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : '---'}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-[#131314] px-4 py-3 border border-[#3a3a3c] border-l-4 border-secondary">
                <span className="material-symbols-outlined text-secondary">military_tech</span>
                <div className="font-headline">
                  <div className="text-[9px] text-[#818384] font-bold uppercase tracking-widest">Global Rank</div>
                  <div className="text-sm font-black text-white">#--</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Single ELO', value: userProfile?.single_player_elo || 1000, color: 'text-primary' },
                { label: 'Win Rate', value: `${(userProfile?.win_rate || 0).toFixed(1)}%`, color: 'text-white' },
                { label: 'Win Streak', value: userProfile?.current_win_streak || 0, color: 'text-secondary' },
                { label: 'Total Matches', value: userProfile?.total_matches || 0, color: 'text-white' },
              ].map(stat => (
                <div key={stat.label} className="bg-[#131314] p-4 border border-[#3a3a3c]">
                  <div className="text-[10px] text-[#818384] font-bold uppercase tracking-tighter mb-1">{stat.label}</div>
                  <div className={`text-2xl font-black tracking-tighter ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="col-span-1 md:col-span-8 space-y-6">
        <div className="bg-[#1c1c1d] p-6 border border-[#3a3a3c]">
          <h3 className="font-bold text-lg mb-6 text-white uppercase tracking-widest text-sm font-headline">Arena Performance History</h3>
          <div className="space-y-4">
            {Object.entries(distribution).map(([guess, count]) => {
              const pct = wins > 0 ? (count / wins) * 100 : 0;
              return (
                <div key={guess} className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-[#818384] w-12">{guess} GUESS</span>
                  <div className="flex-1 h-6 bg-[#131314] border border-[#3a3a3c] relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-[#538d4e]" style={{ width: `${pct}%` }}></div>
                    <span className="absolute left-3 inset-y-0 flex items-center text-[10px] font-bold text-white shadow-black drop-shadow-sm">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#1c1c1d] p-6 border border-[#3a3a3c] h-64 flex flex-col">
          <h3 className="font-bold text-lg mb-6 text-white uppercase tracking-widest text-sm font-headline">Lexical Activity</h3>
          <div className="flex-1 flex flex-col justify-center overflow-hidden">
            <div className="w-full overflow-x-auto no-scrollbar py-2">
              <div className="flex gap-1">
                <div className="grid grid-flow-col grid-rows-7 gap-1">
                  {heatmapCells.map((color, i) => (
                    <div key={i} className={`w-2.5 h-2.5 ${color} border border-white/5`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="col-span-1 md:col-span-4 space-y-6">
        <div className="bg-[#1c1c1d] p-6 border border-[#3a3a3c]">
          <p className="text-[10px] font-bold text-[#818384] uppercase tracking-widest mb-4 text-center italic opacity-60">"Precision is the hallmark of the elite."</p>
          <button 
            onClick={logout}
            className="w-full py-3 border border-red-500/30 text-red-500 text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Terminate Session
          </button>
        </div>
      </aside>
    </main>
  );
};

export default Profile;
