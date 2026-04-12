import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { userProfile, loginWithGoogle } = useAuth();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Training', path: '/single-player' },
    { name: 'Arena', path: '/arena' },
    { name: 'Social', path: '/social' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  return (
    <header className="bg-[#131314] flex justify-between items-center w-full px-6 py-4 max-w-full sticky top-0 z-50 border-b border-[#3a3a3c]">
      <div className="flex items-center gap-8">
        <NavLink to="/" className="text-xl font-black tracking-tighter text-[#94d78c] font-headline">
          COMP WORDLE
        </NavLink>
        
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-[10px] uppercase tracking-[0.2em] font-bold transition-colors duration-200 ${
                  isActive
                    ? 'text-[#94d78c]'
                    : 'text-slate-500 hover:text-white'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-2">
        <button className="hover:bg-[#1c1c1d] transition-all p-2 border border-transparent hover:border-[#3a3a3c]">
          <span className="material-symbols-outlined text-[#818384] text-xl">settings</span>
        </button>
        <button className="hover:bg-[#1c1c1d] transition-all p-2 border border-transparent hover:border-[#3a3a3c]">
          <span className="material-symbols-outlined text-[#818384] text-xl">help</span>
        </button>
        
        <div className="w-[1px] h-6 bg-[#3a3a3c] mx-2"></div>

        {userProfile ? (
          <NavLink to="/profile" className="hover:bg-[#1c1c1d] border border-transparent hover:border-[#3a3a3c] p-1 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-white hidden md:block">@{userProfile.username}</span>
            <img 
              src={userProfile.avatar_url || "https://ui-avatars.com/api/?name=Player&background=94d78c&color=131314"} 
              alt="Profile" 
              className="w-8 h-8 object-cover border border-[#3a3a3c]" 
            />
          </NavLink>
        ) : (
          <button 
            onClick={loginWithGoogle}
            className="bg-[#94d78c] text-[#131314] px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest hover:brightness-110"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
