import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Volume2, VolumeX, Moon, Sun, Shield } from 'lucide-react';
import { GameContext } from '../context/GameContext';

const Settings = () => {
  const { 
    soundEnabled, setSoundEnabled, 
    difficulty, setDifficulty,
    theme, setTheme,
    selectedCar, setSelectedCar
  } = useContext(GameContext);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="flex-grow flex flex-col items-center pt-12 p-6 pb-32 h-screen overflow-hidden">
      
      <div className="w-full max-w-md text-center mb-8 relative z-10">
        <h2 className="text-4xl font-arcade text-gray-300 flex justify-center items-center gap-4 drop-shadow-lg">
          <SettingsIcon size={36} /> GARAGE
        </h2>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="glass-dark w-full max-w-md flex flex-col p-6 gap-8 relative z-10 overflow-y-auto custom-scrollbar shadow-2xl">
        
        {/* Audio Settings */}
        <section>
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
            Audio & Display
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
              <span className="font-semibold">Sound Effects</span>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg transition ${soundEnabled ? 'bg-game-primary text-white' : 'bg-gray-700 text-gray-400'}`}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
              <span className="font-semibold">Theme</span>
              <div className="flex bg-black/40 rounded-lg p-1">
                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-md transition ${theme === 'dark' ? 'bg-gray-700 text-white shadow' : 'text-gray-400'}`}
                >
                  <Moon size={16} />
                </button>
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-md transition ${theme === 'light' ? 'bg-gray-200 text-black shadow' : 'text-gray-400'}`}
                >
                  <Sun size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Difficulty Settings */}
        <section>
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
            <Shield size={16} /> Difficulty
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {['easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`py-3 rounded-xl font-bold uppercase text-xs transition border
                  ${difficulty === level 
                    ? 'bg-game-primary border-game-primary text-white shadow-[0_0_15px_rgba(230,57,70,0.5)]' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        {/* Car Selection */}
        <section>
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Car Selection
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'car1', color: 'bg-game-primary', name: 'Racer' },
              { id: 'car2', color: 'bg-blue-500', name: 'Speedster' },
              { id: 'car3', color: 'bg-purple-500', name: 'Phantom' }
            ].map((car) => (
              <button
                key={car.id}
                onClick={() => setSelectedCar(car.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition border
                  ${selectedCar === car.id 
                    ? 'bg-white/10 border-white/50 shadow-lg scale-105' 
                    : 'bg-black/20 border-transparent opacity-60 hover:opacity-100'}`}
              >
                <div className={`w-8 h-12 rounded-sm ${car.color} relative`}>
                  <div className="absolute top-[20%] left-[10%] w-[80%] h-[20%] bg-black/80 rounded-sm"></div>
                </div>
                <span className="text-xs font-bold">{car.name}</span>
              </button>
            ))}
          </div>
        </section>

      </motion.div>
    </div>
  );
};

export default Settings;
