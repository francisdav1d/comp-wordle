import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const navItems = [
    { name: 'Arena', path: '/arena', icon: 'videogame_asset' },
    { name: 'Stats', path: '/leaderboard', icon: 'leaderboard' },
    { name: 'Profile', path: '/profile', icon: 'person', featured: true },
    { name: 'Social', path: '/social', icon: 'group' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#131314]/90 backdrop-blur-xl border-t border-[#2A2A2B] shadow-[0_-4px_20px_rgba(0,0,0,0.4)] md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => {
            if (item.featured) {
              return `flex flex-col items-center justify-center rounded-xl px-4 py-1.5 active:scale-90 transition-transform ${
                isActive ? 'bg-[#6aaa64] text-[#131314]' : 'bg-[#2A2A2B] text-slate-400'
              }`;
            }
            return `flex flex-col items-center justify-center transition-all active:scale-90 ${
              isActive ? 'text-primary' : 'text-slate-500 hover:text-white'
            }`;
          }}
        >
          <span className={`material-symbols-outlined ${item.featured ? '' : 'mb-1'} ${item.featured ? 'fill-1' : ''}`}>
            {item.icon}
          </span>
          <span className="font-body text-[10px] uppercase tracking-widest font-bold">
            {item.name}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Footer;
