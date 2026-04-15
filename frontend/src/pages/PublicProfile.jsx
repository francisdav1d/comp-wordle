import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getProfileByUsername } from '../lib/api';

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use passed data if available for instant loading
  const initialData = location.state?.profileData;
  const [profile, setProfile] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Even if we have initial data, we fetch fresh data to ensure accuracy
        const data = await getProfileByUsername(username);
        setProfile(data.profile);
      } catch (err) {
        console.error('Error fetching public profile:', err);
        if (!initialData) {
          setError('Operative profile not found in database.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, initialData]);

  const distribution = profile?.guess_distribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 };
  const wins = profile?.wins || 0;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#131314] text-primary font-black uppercase tracking-widest">
      Retrieving Intelligence...
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#131314] text-white p-6 text-center">
      <span className="material-symbols-outlined text-red-500 text-6xl mb-4">gpp_maybe</span>
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">{error}</h2>
      <button 
        onClick={() => navigate('/dashboard')}
        className="px-8 py-3 bg-primary text-black font-black uppercase text-xs rounded-md"
      >
        Return to Dashboard
      </button>
    </div>
  );

  return (
    <main className="max-w-[1440px] mx-auto p-4 md:p-8 space-y-6 pb-24 md:pb-8 bg-[#131314]">
      {/* Profile/Hero Section */}
      <section className="bg-[#1c1c1d] p-8 border border-[#3a3a3c] flex flex-col lg:flex-row gap-8 items-start lg:items-center">
        <div className="relative shrink-0">
          <img 
            alt="User Avatar" 
            className="w-32 h-32 border border-[#3a3a3c] object-cover" 
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.username}&background=94d78c&color=131314`} 
          />
          <div className="absolute -bottom-2 -right-2 bg-secondary text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest">Target Profile</div>
        </div>
        
        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white uppercase">@{profile?.username}</h1>
              <p className="text-[#818384] mt-1 text-[10px] uppercase tracking-widest font-bold">
                {profile?.tier || 'Bronze'} Combatant • Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '---'}
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-[#131314] px-4 py-3 border border-[#3a3a3c] border-l-4 border-primary">
              <span className="material-symbols-outlined text-primary">analytics</span>
              <div>
                <div className="text-[9px] text-[#818384] font-bold uppercase tracking-widest">Status</div>
                <div className="text-sm font-black text-white uppercase">Active Operative</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Single RP', value: profile?.single_player_elo || 0, color: 'text-primary' },
              { label: 'Multi RP', value: profile?.multiplayer_elo || 0, color: 'text-secondary' },
              { label: 'Win Rate', value: `${(profile?.win_rate || 0).toFixed(1)}%`, color: 'text-white' },
              { label: 'Best Streak', value: profile?.max_win_streak || 0, color: 'text-white' },
            ].map(stat => (
              <div key={stat.label} className="bg-[#131314] p-4 border border-[#3a3a3c]">
                <div className="text-[10px] text-[#818384] font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                <div className={`text-2xl font-black tracking-tighter ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Breakdown */}
      <section className="bg-[#1c1c1d] p-6 border border-[#3a3a3c]">
        <h3 className="font-bold text-white uppercase tracking-widest text-sm mb-6">Strategic Performance</h3>
        <div className="space-y-4 max-w-2xl">
          {Object.entries(distribution).map(([guess, count]) => {
            const pct = wins > 0 ? (count / wins) * 100 : 0;
            return (
              <div key={guess} className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-[#818384] w-16 uppercase">{guess} Guess</span>
                <div className="flex-1 h-6 bg-[#131314] border border-[#3a3a3c] relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-[#538d4e]" style={{ width: `${pct}%` }}></div>
                  <span className="absolute left-3 inset-y-0 flex items-center text-[10px] font-bold text-white">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default PublicProfile;
