export const generateLeaderboardData = () => {
  const top3 = [
    { rank: '01', name: 'LexiConqueror',  tier: 'Grandmaster', elo: '3,125', avg: '3.1', wr: '99.8%', trend: 12, trendDir: 'up', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAcTW4YqQh4htNeY-qkJ9tlveMnfGNeyRVoaJbPbLO3p2_l9yVK1jjD09TVN0FmGW2PBVtFKJj0kQRLi6bqsliogXILrj8axsxvam2ntAlHwSyw4Kjv_1oxkFJNLGisktQm_25IJ3wHVCwOtX7f3vs71b06s03TLiMT2FgIRys0N5ZaObPMJLtlh9OHo2ygzGr7cHB_mlWe7oOiytZUJy8rY3wMORtUy5ydPVEnFU5DkzbM4p3EGEwaRFnAFNLS8hdk3lUOgQjHk8', streak: 120 },
    { rank: '02', name: 'Velo_City', tier: 'Silver', elo: '2,840', avg: '3.3', wr: '94.2%', trend: 24, trendDir: 'up', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQoJYVSnoyLjCcvSMXleALQFoMr0z4_Ss-CdFH0R-3Vf_D0iTdXm3Lmw5aT25RhKqxo49KLDLRvCE9JOsdQRxPzo4yvv8bXORqsWP3tp8gVR1417EragKIxW6ncmeFIDXxqdEqGjaCejx-hyjgJT0aazIudf5Qt5w8u963mEZw0wgtL6MA_JaQS69vrFlz8v5BtTjdtVZp6Dx9DdmA0rDJvi3xxuHjSkiiO2gXMZrDyeZRs_K-kXd6LAoz9kHMPoqOSP18KK6t_44', streak: 24 },
    { rank: '03', name: 'WordSmith_99', tier: 'Gold Tier', elo: '2,795', avg: '3.4', wr: '91.5%', trend: 12, trendDir: 'up', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxUsA4ws89I0xpI755vWKli8yymZvKqkJ2nT8NgxJACl9vkPR9dMzXywRILOuz74J6-BY9Ncfy2tRlbSGBQPd2dtYZS6Tz40Hyh-GzFdD6a40sdfyRUq0f-Ps3a49fWj8uMQy5amsPt8pqVMuvyeTFVM6yumO8kSlno-fzZ8vfjZFf1Oy7kCbvLjfyhfrssaBWeOCIdko-gyraLkco37ZuyNNY2M350QAzLuBODDZ2xGybgffbLkFbcKAtj03g6ZckjAky5PMWNfQ', streak: 14 }
  ];

  const firstNames = ['Crypto', 'Shadow', 'Iron', 'Rapid', 'Silent', 'Alpha', 'Beta', 'Omega', 'Lethal', 'Pixel', 'Cyber', 'Neon', 'Lunar', 'Solar', 'Void'];
  const lastNames = ['Blade', 'Strike', 'Wolf', 'Hawk', 'Sniper', 'Runner', 'Caster', 'Walker', 'Dash', 'Shift', 'Pulse', 'Force', 'Vibe', 'Ray', 'Spark'];

  const restPlayers = Array.from({length: 27}).map((_, i) => {
    const rankNum = i + 4;
    const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]}${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const baseElo = 2700 - (i * 25) - Math.floor(Math.random() * 10);
    const wrVal = Math.max(45, 90 - (i * 1.5));
    
    return {
      rank: rankNum < 10 ? `0${rankNum}` : `${rankNum}`,
      name: name,
      tier: 'Gold ' + ['I','II','III'][i%3],
      elo: baseElo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      avg: (3.5 + (i * 0.05) + (Math.random()*0.1)).toFixed(1),
      wr: wrVal.toFixed(1) + '%',
      trend: Math.floor(Math.random() * 8),
      trendDir: Math.random() > 0.5 ? 'up' : (Math.random() > 0.5 ? 'down' : 'flat'),
      img: `https://api.dicebear.com/9.x/avataaars/svg?seed=${name}`,
      streak: Math.floor(Math.random() * 10)
    };
  });

  return [...top3, ...restPlayers];
};
