import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createPrivateLobby, joinPrivateLobby } from '../lib/api';

const Social = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [joinCode, setJoinCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const friends = [
    { name: 'LexiconKing', status: 'In a Match', online: true, inMatch: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCV26PMVIEuiVagPNI4O8ciIauC4E7mVvLV_Kep5Yp86RMI-74FX2JC725-GlUZaUWC-_2en5X31T8-1i45Sorp8Pwn4osESqrKnDEZFdAsmKkFOI2MhgGKtFGZiDwHraMa_5MpkNNb-DolYK5QZudju1mUugJD0wl8RzobqlaHwd71kRSEH2-m5Fxxwx3kC8sQnjE_dgArqb2UkFSHFRVS_saMyLAXogwUlApuUandOc1eiGQZT6PLrquZoUB9ompTg8myshf4h0' },
    { name: 'VowelVortex', status: 'Online', online: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtdu75WDbxCj2_T2hGxwcscSDjxRlAHh8Ico40nlIhoGJFVkQVN87gUbVQkZX7MK0LrzcMNss8UZT9mVDPTEjEZ4rcCcTajpGrRoiFQGwr_jY0Zrixm1ae7vua07Dy4H3JgzNd4fGufrKre7axwPo2Kd9scdChYapqvNwSivyRS79HxBIzhuixMRd1JObXR7VHbgJn8Q1FhdRDFIo_J7eeRfwcowrb05PmkfijM7MKFsw8ozREIV3oxR_wPKz53CvOV4iBjIM9i2g' },
    { name: 'WordSmith99', status: 'Offline (4h)', offline: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDavKi7qnjB62G9bp52cqmPJXo1ykPcwn7DG19DQ7s1ggKrAaZN2u0YPPTVO_2t3JhN_ZzmuPaUrum6vgHMDnzHWbYzm08V4Za1eiQqox5KQQ6XKfaD9WCU-8hfc35BtRiFlpaJTm7Mx5I4069DsZAMLDr9sxDs25JdKTgIzDTPl2R_CRZ2NIkYpB8kGfdxjhe9k1Z0xE5l9Q8zDfRFI2JN7hYOhF3pZPSVhsqXFesedNvRbFOLqHZdfOHK5aDCHd_ntaEmwmg7pVQ' },
    { name: 'Gryph0n', status: 'Offline (1d)', offline: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUsMrxWUiV6RyKUVK2md6o1yPRRET3hm-3F7F3MLcq6VlAvb5aIVtcSmPtlAcyKedqLB7ytvCGkQztzEVPqolkZzudZEqrzZ_3SziNjwa0GlCsIlk8TPr_XBnXLoWz_pi516JUs8f0X2sxce5yPnQqZQ5HnQe67hQ0c79bU0Biaux-NFEMcitzkGVrydsSNGjnshTv_5HY9eGwe6AwEoPVj8na4uv3Cgv1tu18jSYF3OnM2szZjY1d8OnEl4h6FyoTuwkV7j6lTMI' },
    { name: 'AlphaBeta', status: 'Offline (3d)', offline: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSkSS-rS-9ylsdtQaNlkjTvULJYbnLSDd0j6yrs4BsyDhm0vezvT34d3ipNH-DlXyJx19HseJ_oNXSdVoqCOLc4Fb3rZYqiDdl31Q2DcQ2swLPxsud6-iRLPvoG5NpHtc458_7ql00sPVAyjK46mEXU2-XROhtcE7-EVPf2rdpvuvy1RwqSHmU0nG-v-XVdO9gIwBGOu6sSkZP7YtmCabKB8EzeMjUSCFHEWkjXCJeSQqBSjfnAmswg1kg_T36_FsPNasuKzSQKrY' },
  ];

  const handleCreateLobby = async () => {
    if (!user || isProcessing) return;
    setIsProcessing(true);
    try {
        const { gameId } = await createPrivateLobby();
        if (gameId) navigate(`/private-lobby/${gameId}`);
    } catch (err) {
        console.error(err);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleJoinLobby = async () => {
    if (joinCode.length !== 6 || isProcessing) return;
    setIsProcessing(true);
    try {
        const { gameId } = await joinPrivateLobby(joinCode.toUpperCase());
        if (gameId) navigate(`/private-lobby/${gameId}`);
    } catch (err) {
        console.error(err);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <section className="lg:col-span-7 flex flex-col gap-10">
          <div>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight mb-2">Play with Friends</h2>
            <p className="text-on-surface-variant font-body text-sm">Challenge your inner circle to high-stakes lexical duels.</p>
          </div>
          <div className="flex flex-col gap-6">
            {/* Host Private Match */}
            <div className="bg-surface-container-low p-8 rounded-lg flex flex-col gap-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-8xl">groups</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-headline text-xl font-bold mb-2">Host Private Match</h3>
                <p className="text-on-surface-variant text-sm mb-6 max-w-md">Create a unique lobby and invite up to 8 friends for a synchronous Wordle battle. Custom rules enabled.</p>
                <button 
                  onClick={handleCreateLobby}
                  className="bg-primary-container text-on-primary-container px-8 py-4 rounded font-headline font-extrabold tracking-tight uppercase text-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 w-full sm:w-max shadow-sm border-t border-white/10"
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  {isProcessing ? 'CREATING...' : 'CREATE LOBBY'}
                </button>
              </div>
            </div>
            {/* Join with Code */}
            <div className="bg-surface-container-low p-8 rounded-lg flex flex-col gap-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-8xl">vibration</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-headline text-xl font-bold mb-2">Join with Code</h3>
                <p className="text-on-surface-variant text-sm mb-6 max-w-md">Enter a 6-digit invitation code to jump straight into an existing friend's session.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    className="bg-surface-container-highest border-none focus:ring-1 focus:ring-primary/30 rounded px-4 py-4 font-headline tracking-widest text-lg w-full sm:w-64 placeholder:text-outline/50 placeholder:tracking-normal uppercase outline-none" 
                    placeholder="ENTER ROOM CODE" 
                    type="text" 
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  />
                  <button 
                    onClick={handleJoinLobby}
                    className="bg-surface-container-highest text-on-surface hover:bg-surface-bright px-8 py-4 rounded font-headline font-extrabold tracking-tight uppercase text-sm active:scale-[0.98] transition-all border-t border-white/5"
                  >
                    JOIN MATCH
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-5">
          <div className="bg-surface-container-low rounded-lg h-full flex flex-col">
            <div className="p-6 border-b border-white/5">
              <h2 className="font-headline text-xl font-bold mb-6">Friends List</h2>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-primary/30 rounded-full pl-12 pr-4 py-3 text-sm placeholder:text-outline outline-none" placeholder="Add friends by username..." type="text" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="px-4 py-4 space-y-2">
                {friends.map((friend) => (
                  <div key={friend.name} className={`flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-high transition-colors group ${friend.offline ? 'opacity-60' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img alt="Avatar" className="w-10 h-10 rounded-full bg-surface-container-highest object-cover" src={friend.img} />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface-container-low ${friend.online ? 'bg-primary' : 'bg-outline'}`}></div>
                      </div>
                      <div>
                        <p className="font-headline font-bold text-sm">{friend.name}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${friend.inMatch ? 'text-primary' : 'text-on-surface-variant'}`}>{friend.status}</p>
                      </div>
                    </div>
                    <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">{friend.offline ? 'mail' : 'chat'}</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-surface-container">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-highest/30 border border-white/5">
                <div className="p-2 rounded bg-tertiary/10 text-tertiary">
                  <span className="material-symbols-outlined">military_tech</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-tertiary">Pro Tip</p>
                  <p className="text-[11px] text-on-surface-variant">Private matches do not affect your Global MMR, but they do contribute to your shared streaks.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Social;
