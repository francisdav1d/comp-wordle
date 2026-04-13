import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { generateLeaderboardData } from '../utils/LeaderboardData';

const Leaderboard = () => {
  const [category, setCategory] = useState('global');
  const [gameMode, setGameMode] = useState('singleplayer');
  const [realPlayers, setRealPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchLeaderboard = async () => {
      setLoading(true);
      if (!supabase) {
        if (active) setLoading(false);
        return;
      }
      
      const orderColumn = gameMode === 'multiplayer' ? 'multiplayer_elo' : 'single_player_elo';
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order(orderColumn, { ascending: false })
        .limit(30);
        
      if (!error && data && active) {
        setRealPlayers(data);
      }
      if (active) setLoading(false);
    };

    fetchLeaderboard();

    // Subscribe to real-time changes
    let channel;
    if (supabase) {
      channel = supabase
        .channel('leaderboard_updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
           fetchLeaderboard();
        })
        .subscribe();
    }
    
    return () => { 
      active = false;
      if (channel) supabase.removeChannel(channel); 
    };
  }, [gameMode]); // Refetch fully if gameMode changes to ensure we have top 30 for the specific queue!

  const fallbackData = useMemo(() => generateLeaderboardData(), []);
  
  const displayRankings = useMemo(() => {
    let baseData = realPlayers.map((p, i) => {
        const eloToUse = gameMode === 'multiplayer' ? p.multiplayer_elo : p.single_player_elo;
        return {
            rank: (i + 1).toString().padStart(2, '0'),
            name: p.display_name || p.username || `Player_${p.id.substring(0,4)}`,
            tier: p.tier || 'Unranked',
            elo: (eloToUse || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            avg: p.avg_solve_time ? Number(p.avg_solve_time).toFixed(1) : '3.5',
            wr: (p.win_rate !== null && p.win_rate !== undefined) ? Number(p.win_rate).toFixed(1) + '%' : '0.0%',
            trend: p.current_win_streak || 0,
            trendDir: p.current_win_streak > 0 ? 'up' : 'flat',
            img: p.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${p.username}`,
            streak: p.current_daily_streak || 0
        };
    });
    
    let result = [...baseData];
    
    // Fake friends filter
    if (category === 'friends') {
      result = result.filter((_, i) => i % 3 === 0);
    }
    
    // Force rank reallocation so numbers 01 to X are perfectly sequential
    return result.map((r, i) => ({
      ...r,
      rank: (i + 1).toString().padStart(2, '0')
    }));
  }, [realPlayers, fallbackData, category, gameMode]);
        
  const top3 = displayRankings.slice(0, 3);
  const tableData = displayRankings.slice(3);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-headline text-primary text-xl">Loading Arena Systems...</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 pb-32">
      {/* Title & Toggle */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">Arena Rankings</h1>
          <p className="text-on-surface-variant font-medium">Global lexical dominance tracking. Resetting in <span className="text-secondary">4d 12h</span></p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="bg-surface-container-low p-1.5 rounded-xl grid grid-cols-2 gap-1 shadow-inner w-full md:w-[340px]">
            <button onClick={() => setCategory('global')} className={`w-full py-2 rounded-lg font-bold text-sm tracking-wide transition-all ${category === 'global' ? 'bg-surface-container-highest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>GLOBAL</button>
            <button onClick={() => setCategory('friends')} className={`w-full py-2 rounded-lg font-bold text-sm tracking-wide transition-all ${category === 'friends' ? 'bg-surface-container-highest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>FRIENDS</button>
          </div>
          <div className="bg-surface-container-low p-1.5 rounded-xl grid grid-cols-2 gap-1 shadow-inner w-full md:w-[340px]">
            <button onClick={() => setGameMode('singleplayer')} className={`w-full py-2 rounded-lg font-bold text-xs tracking-wide transition-all ${gameMode === 'singleplayer' ? 'bg-surface-container-highest text-secondary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>SINGLE PLAYER</button>
            <button onClick={() => setGameMode('multiplayer')} className={`w-full py-2 rounded-lg font-bold text-xs tracking-wide transition-all ${gameMode === 'multiplayer' ? 'bg-surface-container-highest text-secondary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>MULTIPLAYER</button>
          </div>
        </div>
      </section>

      {/* Top 3 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Rank 2 */}
        {top3[1] && (
        <div className="order-2 md:order-1 flex flex-col justify-end">
          <div className="bg-surface-container-low rounded-xl p-8 relative overflow-hidden group hover:bg-surface-container transition-all">
            <div className="absolute top-0 right-0 p-4 font-headline text-6xl font-black text-on-surface-variant/5">{top3[1].rank.padStart(2, '0')}</div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="relative mb-4">
                <img alt={top3[1].name} className="w-24 h-24 rounded-full border-4 border-outline-variant/30" src={top3[1].img} />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-outline-variant text-on-surface text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase shadow-lg whitespace-nowrap">{top3[1].tier}</div>
              </div>
              <h3 className="font-headline text-xl font-bold mb-1">{top3[1].name}</h3>
              <p className="text-primary font-black text-2xl mb-4 font-headline">{top3[1].elo} <span className="text-xs text-on-surface-variant font-normal tracking-normal">ELO</span></p>
              <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-outline-variant/10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Win Rate</p>
                  <p className="font-headline font-bold text-lg">{top3[1].wr}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Streak</p>
                  <p className="font-headline font-bold text-lg text-secondary">{top3[1].streak || 24}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        {/* Rank 1 */}
        {top3[0] && (
        <div className="order-1 md:order-2 flex flex-col justify-end scale-105">
          <div className="bg-surface-container-high rounded-xl p-10 relative overflow-hidden group border border-primary/20 shadow-[0_20px_50px_rgba(106,170,100,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 p-4 font-headline text-8xl font-black text-primary/10">{top3[0].rank.padStart(2, '0')}</div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="relative mb-6">
                <img alt={top3[0].name} className="w-32 h-32 rounded-full border-4 border-primary" src={top3[0].img} />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-tertiary text-on-tertiary text-[10px] px-4 py-1.5 rounded-full font-black tracking-widest uppercase shadow-xl ring-4 ring-surface-container-high whitespace-nowrap">{top3[0].tier}</div>
              </div>
              <h3 className="font-headline text-3xl font-black mb-1">{top3[0].name}</h3>
              <p className="text-primary font-black text-4xl mb-6 font-headline tracking-tighter">{top3[0].elo} <span className="text-sm text-on-surface-variant font-normal tracking-normal">ELO</span></p>
              <div className="grid grid-cols-2 gap-8 w-full pt-6 border-t border-primary/20">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Avg Guesses</p>
                  <p className="font-headline font-black text-2xl text-primary">{top3[0].avg}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Win Rate</p>
                  <p className="font-headline font-black text-2xl">{top3[0].wr}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        {/* Rank 3 */}
        {top3[2] && (
        <div className="order-3 flex flex-col justify-end">
          <div className="bg-surface-container-low rounded-xl p-8 relative overflow-hidden group hover:bg-surface-container transition-all">
            <div className="absolute top-0 right-0 p-4 font-headline text-6xl font-black text-on-surface-variant/5">{top3[2].rank.padStart(2, '0')}</div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="relative mb-4">
                <img alt={top3[2].name} className="w-24 h-24 rounded-full border-4 border-outline-variant/30" src={top3[2].img} />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase shadow-lg whitespace-nowrap">{top3[2].tier}</div>
              </div>
              <h3 className="font-headline text-xl font-bold mb-1">{top3[2].name}</h3>
              <p className="text-primary font-black text-2xl mb-4 font-headline">{top3[2].elo} <span className="text-xs text-on-surface-variant font-normal tracking-normal">ELO</span></p>
              <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-outline-variant/10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Win Rate</p>
                  <p className="font-headline font-bold text-lg">{top3[2].wr}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Trend</p>
                  <p className="font-headline font-bold text-lg text-primary flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">{top3[2].trendDir === 'up' ? 'trending_up' : top3[2].trendDir === 'down' ? 'trending_down' : 'horizontal_rule'}</span> {top3[2].trend}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </section>

      {/* Rankings Table */}
      <section className="mb-16">
        <h2 className="font-headline text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant mb-6 px-4">Arena Standings: 04 - {tableData.length + 3}</h2>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-on-surface-variant text-[11px] font-black uppercase tracking-widest px-4">
                <th className="pb-4 pl-6">Rank</th>
                <th className="pb-4">Tactician</th>
                <th className="pb-4">Rating (ELO)</th>
                <th className="pb-4">Avg Guesses</th>
                <th className="pb-4">Win Rate</th>
                <th className="pb-4 pr-6">Trend</th>
              </tr>
            </thead>
            <tbody className="font-body">
              {tableData.map((r, index) => (
                <tr key={`${r.rank}-${index}`} className="bg-surface-container-low hover:bg-surface-container transition-colors group">
                  <td className="py-4 pl-6 rounded-l-xl font-headline font-black text-on-surface-variant">{r.rank}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img alt={r.name} className="w-8 h-8 rounded-full bg-surface-container" src={r.img} />
                      <div>
                        <p className="font-bold text-on-surface">{r.name}</p>
                        <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-tighter">{r.tier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-headline font-bold text-primary">{r.elo}</td>
                  <td className="py-4 font-medium">{r.avg}</td>
                  <td className="py-4 font-medium">{r.wr}</td>
                  <td className={`py-4 pr-6 rounded-r-xl flex items-center gap-1 ${r.trendDir === 'up' ? 'text-primary' : r.trendDir === 'down' ? 'text-error' : 'text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-sm">{r.trendDir === 'up' ? 'keyboard_arrow_up' : r.trendDir === 'down' ? 'keyboard_arrow_down' : 'horizontal_rule'}</span> {r.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Analytics Charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Avg Guess Trend */}
        <div className="bg-surface-container-low rounded-xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-headline text-lg font-bold">Avg Guess Trend</h3>
            <span className="text-[10px] uppercase font-black text-primary bg-primary/10 px-2 py-1 rounded">Last 30 Days</span>
          </div>
          <div className="h-48 flex items-end justify-between gap-1">
            {[40, 45, 35, 60, 55, 50, 65, 70, 75, 85].map((h, i) => (
              <div key={i} className={`w-full rounded-t hover:bg-primary transition-all cursor-help ${[3,9].includes(i) ? 'bg-primary' : i === 8 ? 'bg-primary/60' : 'bg-surface-container-highest'}`} style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            <span>Week 01</span><span>Week 02</span><span>Week 03</span><span>Week 04</span>
          </div>
        </div>
        {/* ELO Velocity */}
        <div className="bg-surface-container-low rounded-xl p-6 overflow-hidden relative">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-headline text-lg font-bold">ELO Velocity</h3>
            <span className="text-[10px] uppercase font-black text-secondary bg-secondary/10 px-2 py-1 rounded">Live Feed</span>
          </div>
          <div className="h-48 relative overflow-hidden flex items-center">
            <svg className="w-full h-full stroke-primary fill-none stroke-[3] overflow-visible" viewBox="0 0 400 100">
              <path className="drop-shadow-[0_0_8px_rgba(148,215,140,0.4)]" d="M0,80 Q50,20 100,50 T200,30 T300,70 T400,10"></path>
              <circle cx="100" cy="50" fill="#94d78c" r="4"></circle>
              <circle cx="300" cy="70" fill="#94d78c" r="4"></circle>
              <circle cx="400" cy="10" fill="#94d78c" r="4"></circle>
            </svg>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Avg Gain</p>
              <p className="font-headline font-black text-xl">+14.2</p>
            </div>
            <div className="w-px h-8 bg-outline-variant/20"></div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Peak Gain</p>
              <p className="font-headline font-black text-xl text-secondary">+42</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Leaderboard;
