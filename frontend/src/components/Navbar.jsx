import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Trophy, Settings as SettingsIcon, Home, Play, Info } from 'lucide-react';
import { GameContext } from '../context/GameContext';

const Navbar = () => {
  const location = useLocation();
  const { gameState } = useContext(GameContext);

  // Hide navbar during active gameplay
  if (location.pathname === '/game' && (gameState === 'playing' || gameState === 'paused')) {
    return null;
  }

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Home' },
    { path: '/game', icon: <Play size={20} />, label: 'Play' },
    { path: '/leaderboard', icon: <Trophy size={20} />, label: 'Leaders' },
    { path: '/about', icon: <Info size={20} />, label: 'About' },
    { path: '/settings', icon: <SettingsIcon size={20} />, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 w-full md:top-0 md:bottom-auto z-50 p-4 pb-6 md:p-6 flex justify-center pointer-events-none">
      <div className="glass pointer-events-auto flex gap-2 md:gap-6 px-6 py-3 rounded-full bg-white/10 dark:bg-black/40 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-md">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-full transition-all duration-300
              ${isActive ? 'bg-game-primary text-white shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'}
            `}
          >
            {item.icon}
            <span className="text-[10px] md:text-sm font-semibold uppercase tracking-wider hidden sm:block">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
