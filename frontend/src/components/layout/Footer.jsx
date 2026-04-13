import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const navItems = [
    { name: 'Training', path: '/single-player', icon: 'widgets' },
    { name: 'Arena', path: '/arena', icon: 'explore' },
    { name: 'Social', path: '/social', icon: 'account_circle' },
    { name: 'Ranking', path: '/leaderboard', icon: 'poll' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex items-stretch bg-[#131314] border-t border-[#3a3a3c] md:hidden h-[64px] pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `flex-1 flex flex-col items-center justify-center transition-all ${
              isActive ? 'text-white' : 'text-[#818384]'
            }`
          }
        >
          <span 
            className="material-symbols-outlined text-xl mb-1"
            style={{ 
              fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
            }}
          >
            {item.icon}
          </span>
          <span className="text-sm font-medium uppercase tracking-wider whitespace-nowrap">
            {item.name}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Footer;
