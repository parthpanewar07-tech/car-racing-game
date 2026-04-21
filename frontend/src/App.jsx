import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameContext } from './context/GameContext';
import Home from './pages/Home';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { theme } = useContext(GameContext);

  return (
    <Router>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-game-dark text-game-light' : 'bg-game-light text-game-dark'} transition-colors duration-300 font-sans relative overflow-hidden`}>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-game-primary blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-game-accent blur-[120px]"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow flex flex-col">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game" element={<Game />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
