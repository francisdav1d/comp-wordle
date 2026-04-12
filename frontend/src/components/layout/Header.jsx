import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { userProfile, loginWithGoogle } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Singleplayer', path: '/single-player' },
    { name: 'Arena', path: '/arena' },
    { name: 'Social', path: '/social' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <header className="bg-[#131314] flex justify-between items-center w-full px-4 md:px-6 py-4 max-w-full sticky top-0 z-50 border-b border-[#3a3a3c]">
      <div className="flex items-center gap-4 md:gap-8">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-1"
        >
          <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
        </button>

        <NavLink to="/" className="text-base md:text-xl font-black tracking-tighter text-primary font-headline">
          COMP-W
        </NavLink>
        
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-[10px] uppercase tracking-[0.2em] font-bold transition-colors duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-slate-500 hover:text-white'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-1 md:space-x-2">
        <button className="hover:bg-[#1c1c1d] transition-all p-2 border border-transparent hover:border-[#3a3a3c]">
          <span className="material-symbols-outlined text-[#818384] text-xl">settings</span>
        </button>
        
        <div className="hidden md:block w-[1px] h-6 bg-[#3a3a3c] mx-2"></div>

        {userProfile ? (
          <NavLink to="/profile" className="hover:bg-[#1c1c1d] border border-transparent hover:border-[#3a3a3c] p-1 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-white hidden lg:block">@{userProfile.username}</span>
            <img 
              src={userProfile.avatar_url || `https://ui-avatars.com/api/?name=${userProfile.username}&background=75bb6e&color=131314`} 
              alt="Profile" 
              className="w-8 h-8 object-cover border border-[#3a3a3c]" 
            />
          </NavLink>
        ) : (
          <button 
            onClick={loginWithGoogle}
            className="bg-primary text-[#131314] px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest hover:brightness-110"
          >
            LOG IN
          </button>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[65px] bg-[#131314] z-50 md:hidden animate-in slide-in-from-left duration-300">
          <nav className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-[0.3em] font-black py-4 border-b border-[#3a3a3c] ${
                    isActive ? 'text-primary' : 'text-slate-400'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            {userProfile && (
              <NavLink 
                to="/profile" 
                onClick={() => setIsMenuOpen(false)}
                className="text-xs uppercase tracking-[0.3em] font-black py-4 border-b border-[#3a3a3c] text-white flex items-center gap-3"
              >
                <img src={userProfile.avatar_url} className="w-5 h-5 border border-primary" />
                Profile
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
