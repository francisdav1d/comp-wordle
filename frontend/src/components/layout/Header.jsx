import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { userProfile, loginWithGoogle } = useAuth();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Single Player', path: '/single-player' },
    { name: 'Multiplayer', path: '/arena' },
    { name: 'Social', path: '/social' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  return (
    <header className="bg-[#131314] flex justify-between items-center w-full px-6 py-4 max-w-full sticky top-0 z-50">
      <NavLink to="/" className="text-xl font-black tracking-tighter text-[#94d78c] font-headline">
        Comp Wordle
      </NavLink>
      
      <nav className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `font-headline tracking-tight font-bold transition-colors duration-200 ${
                isActive
                  ? 'text-[#94d78c] border-b-2 border-[#94d78c] pb-1'
                  : 'text-slate-400 font-medium hover:text-slate-200 hover:text-[#94d78c]'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center space-x-4">
        <button className="hover:bg-[#2A2A2B] rounded-md transition-all p-2 active:scale-95 duration-150">
          <span className="material-symbols-outlined text-on-surface-variant text-2xl">settings</span>
        </button>
        <button className="hover:bg-[#2A2A2B] rounded-md transition-all p-2 active:scale-95 duration-150">
          <span className="material-symbols-outlined text-on-surface-variant text-2xl">help</span>
        </button>
        
        {userProfile ? (
          <NavLink to="/profile" className="hover:bg-[#2A2A2B] rounded-md transition-all p-1 active:scale-95 duration-150">
            {userProfile.photoURL ? (
              <img src={userProfile.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-outline/20" />
            ) : (
              <span className="material-symbols-outlined text-on-surface-variant text-3xl">account_circle</span>
            )}
          </NavLink>
        ) : (
          <button 
            onClick={loginWithGoogle}
            className="bg-[#94d78c] text-[#131314] px-4 py-1.5 rounded-md font-bold text-sm active:scale-95 transition-transform"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
