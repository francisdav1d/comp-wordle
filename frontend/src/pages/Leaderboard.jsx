import React, { useState } from 'react';

const Leaderboard = () => {
  const [tab, setTab] = useState('global');

  const rankings = [
    { rank: '04', name: 'AlphaSolver', tier: 'Diamond Division', elo: '2,650', avg: '3.4', wr: '89.2%', trend: 2, trendDir: 'up', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7gfxwtlgyFAyigDoisCKlsfSS-YKnvw9p7e4pEaHE_7VATKhQ0Mzq5IXZtT1383HovQzx3WNUTpp1olkYSNlPtfAzMdFuIrZ8lGpNpwZwHhx9HUPLoxcB3XS8Y_x3Y9CKho1RpFc8Oqq7k0LLI0OEBbwCdN-2pYacm9nAqvsIVNlGEHUy41FGLKTyyGpiSn1OgO5B7k3YEuQBHXQjNMR0AewNJnmRgQmendJ9OV2OJuQvLna2HJn9uPnK_06rxw1Cj1Fks2BuI-U' },
    { rank: '05', name: 'VowelHunter', tier: 'Elite Tier', elo: '2,510', avg: '3.5', wr: '88.7%', trend: 1, trendDir: 'down', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_7NXX_7f8haW2dg0zmxPQx_Xp93IajAln43RfZ9y1W8NmC_OXrX-gFFdFFhrHXRoNgVXY-CDhHz3ysItvw_moV3alRq4_43m6OlI3H81_q2yraDLkY1gmMknXMaltU0jAZ9eYy2iIetU_eoDLsYnKZ-tASkcS8mbxgpdqtiRzt3fspt3pDo3DXtxZlEdSNS6C74RStmI5OeNT_G9p3UkWcJlrtNwmPXgotIqVn8lmsIZm6pLNivd8QiokMMedu5bAVQU1GUEn34U' },
    { rank: '06', name: 'CrypticMind', tier: 'Platinum IV', elo: '2,485', avg: '3.7', wr: '86.4%', trend: 0, trendDir: 'flat', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhJo-k7_8NdTTORy6xmDqO8XTKpOmcGbj07S4-OjwBQ0mKdMZub9OV5tUdDfnv89oB6x18oq7HTsTEgc3yIad5rP5PzV0zGoDG4O_W9qgGiRBf-ufNQPwp2rR92CGd12FGeM4dDQfMHaG5dGlo-KeqEwQstT3bhhhveq_slSlBr7VUuvSiBwNs9uMuSmiEekDdblIY-d-ldZBGjgRoZ8TvYqf1tPTUmptHA8-GsyDC6lB_XzBvMXV7-ruJhZtBCJkkJW5DeGjnFoM' },
    { rank: '07', name: 'ZeroGuess', tier: 'Platinum III', elo: '2,420', avg: '3.8', wr: '85.0%', trend: 4, trendDir: 'up', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYFxhcdBKqYV5eqXkbm7CzEJKJAVFX1i_0M1VaSyPzqEddW4UAd02iZURKEgVkL4i2WbVL2x57uh2j556GdAi-MHwweuid4YY3K4QVJR2t2U1Zp3HLx7NFpMkCBadKePhAjIHCeJNCWmXJdQhMhzbiBMtJNYES0KxRm_DYmm82hEc_u6UmAFTmggQgMOeMvF1wWVh6WwALXfCW5LmAO3UwGtuR4izGmPGCSVBAZmBUu6ScDuSWhrYjJBJZsayonEyJK9-X-xgYhmU' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 pb-32">
      {/* Title & Toggle */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">Arena Rankings</h1>
          <p className="text-on-surface-variant font-medium">Global lexical dominance tracking. Resetting in <span className="text-secondary">4d 12h</span></p>
        </div>
        <div className="bg-surface-container-low p-1.5 rounded-xl flex items-center shadow-inner">
          <button onClick={() => setTab('global')} className={`px-6 py-2 rounded-lg font-bold text-sm tracking-wide transition-all ${tab === 'global' ? 'bg-surface-container-highest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>GLOBAL</button>
          <button onClick={() => setTab('friends')} className={`px-6 py-2 rounded-lg font-bold text-sm tracking-wide transition-all ${tab === 'friends' ? 'bg-surface-container-highest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>FRIENDS</button>
        </div>
      </section>

      {/* Top 3 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Rank 2 */}
        <div className="order-2 md:order-1 flex flex-col justify-end">
          <div className="bg-surface-container-low rounded-xl p-8 relative overflow-hidden group hover:bg-surface-container transition-all">
            <div className="absolute top-0 right-0 p-4 font-headline text-6xl font-black text-on-surface-variant/5">02</div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="relative mb-4">
                <img alt="Velo_City" className="w-24 h-24 rounded-full border-4 border-outline-variant/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQoJYVSnoyLjCcvSMXleALQFoMr0z4_Ss-CdFH0R-3Vf_D0iTdXm3Lmw5aT25RhKqxo49KLDLRvCE9JOsdQRxPzo4yvv8bXORqsWP3tp8gVR1417EragKIxW6ncmeFIDXxqdEqGjaCejx-hyjgJT0aazIudf5Qt5w8u963mEZw0wgtL6MA_JaQS69vrFlz8v5BtTjdtVZp6Dx9DdmA0rDJvi3xxuHjSkiiO2gXMZrDyeZRs_K-kXd6LAoz9kHMPoqOSP18KK6t_44" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-outline-variant text-on-surface text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase shadow-lg">Silver</div>
              </div>
              <h3 className="font-headline text-xl font-bold mb-1">Velo_City</h3>
              <p className="text-primary font-black text-2xl mb-4 font-headline">2,840 <span className="text-xs text-on-surface-variant font-normal tracking-normal">ELO</span></p>
              <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-outline-variant/10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Win Rate</p>
                  <p className="font-headline font-bold text-lg">94.2%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Streak</p>
                  <p className="font-headline font-bold text-lg text-secondary">24</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Rank 1 */}
        <div className="order-1 md:order-2 flex flex-col justify-end scale-105">
          <div className="bg-surface-container-high rounded-xl p-10 relative overflow-hidden group border border-primary/20 shadow-[0_20px_50px_rgba(106,170,100,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 p-4 font-headline text-8xl font-black text-primary/10">01</div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="relative mb-6">
                <img alt="LexiConqueror" className="w-32 h-32 rounded-full border-4 border-primary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAcTW4YqQh4htNeY-qkJ9tlveMnfGNeyRVoaJbPbLO3p2_l9yVK1jjD09TVN0FmGW2PBVtFKJj0kQRLi6bqsliogXILrj8axsxvam2ntAlHwSyw4Kjv_1oxkFJNLGisktQm_25IJ3wHVCwOtX7f3vs71b06s03TLiMT2FgIRys0N5ZaObPMJLtlh9OHo2ygzGr7cHB_mlWe7oOiytZUJy8rY3wMORtUy5ydPVEnFU5DkzbM4p3EGEwaRFnAFNLS8hdk3lUOgQjHk8" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-tertiary text-on-tertiary text-[10px] px-4 py-1.5 rounded-full font-black tracking-widest uppercase shadow-xl ring-4 ring-surface-container-high">Grandmaster</div>
              </div>
              <h3 className="font-headline text-3xl font-black mb-1">LexiConqueror</h3>
              <p className="text-primary font-black text-4xl mb-6 font-headline tracking-tighter">3,125 <span className="text-sm text-on-surface-variant font-normal tracking-normal">ELO</span></p>
              <div className="grid grid-cols-2 gap-8 w-full pt-6 border-t border-primary/20">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Avg Guesses</p>
                  <p className="font-headline font-black text-2xl text-primary">3.1</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Win Rate</p>
                  <p className="font-headline font-black text-2xl">99.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Rank 3 */}
        <div className="order-3 flex flex-col justify-end">
          <div className="bg-surface-container-low rounded-xl p-8 relative overflow-hidden group hover:bg-surface-container transition-all">
            <div className="absolute top-0 right-0 p-4 font-headline text-6xl font-black text-on-surface-variant/5">03</div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="relative mb-4">
                <img alt="WordSmith_99" className="w-24 h-24 rounded-full border-4 border-outline-variant/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxUsA4ws89I0xpI755vWKli8yymZvKqkJ2nT8NgxJACl9vkPR9dMzXywRILOuz74J6-BY9Ncfy2tRlbSGBQPd2dtYZS6Tz40Hyh-GzFdD6a40sdfyRUq0f-Ps3a49fWj8uMQy5amsPt8pqVMuvyeTFVM6yumO8kSlno-fzZ8vfjZFf1Oy7kCbvLjfyhfrssaBWeOCIdko-gyraLkco37ZuyNNY2M350QAzLuBODDZ2xGybgffbLkFbcKAtj03g6ZckjAky5PMWNfQ" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase shadow-lg">Gold Tier</div>
              </div>
              <h3 className="font-headline text-xl font-bold mb-1">WordSmith_99</h3>
              <p className="text-primary font-black text-2xl mb-4 font-headline">2,795 <span className="text-xs text-on-surface-variant font-normal tracking-normal">ELO</span></p>
              <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-outline-variant/10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Win Rate</p>
                  <p className="font-headline font-bold text-lg">91.5%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Trend</p>
                  <p className="font-headline font-bold text-lg text-primary flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span> +12
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rankings Table */}
      <section className="mb-16">
        <h2 className="font-headline text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant mb-6 px-4">Arena Standings: 04 - 10</h2>
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
              {rankings.map(r => (
                <tr key={r.rank} className="bg-surface-container-low hover:bg-surface-container transition-colors group">
                  <td className="py-4 pl-6 rounded-l-xl font-headline font-black text-on-surface-variant">{r.rank}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img alt={r.name} className="w-8 h-8 rounded-full" src={r.img} />
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
