import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const navItems = [
    { name: 'Singleplayer', path: '/single-player', icon: 'grid_view' },
    { name: 'Arena', path: '/arena', icon: 'shield' },
    { name: 'Social', path: '/social', icon: 'hub' },
    { name: 'Leaderboard', path: '/leaderboard', icon: 'military_tech' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex items-stretch bg-[#131314] border-t border-[#3a3a3c] md:hidden h-[64px]">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `flex-1 flex flex-col items-center justify-center border-t-2 rounded-xl transition-all active:scale-95 ${
              isActive ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-600'
            }`
          }
        >
          <span 
            className="material-symbols-outlined text-xl mb-0.5"
            style={{ 
              fontVariationSettings: "'FILL' 0, 'wght' 700, 'GRAD' 0, 'opsz' 24",
            }}
          >
            {item.icon}
          </span>
          <span className="text-[9px] uppercase tracking-[0.1em] font-black whitespace-nowrap">
            {item.name}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Footer;
