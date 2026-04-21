import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Trophy, Settings } from 'lucide-react';
import { GameContext } from '../context/GameContext';

const Home = () => {
  const navigate = useNavigate();
  const { highScore, user, loginWithGoogle, logout } = useContext(GameContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      className="flex-grow flex flex-col items-center justify-center p-6 h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={itemVariants} className="text-center mb-12 relative z-10">
        <h1 className="text-5xl md:text-7xl font-arcade text-transparent bg-clip-text bg-gradient-to-r from-game-primary to-game-accent mb-4 tracking-tighter drop-shadow-2xl">
          NEON RUSH
        </h1>
        <p className="text-xl md:text-2xl font-light tracking-widest text-gray-300">HIGH SPEED PURSUIT</p>
      </motion.div>

      <motion.div variants={itemVariants} className="glass-dark p-8 md:p-12 w-full max-w-md flex flex-col gap-6 relative z-10 text-center">
        
        <div className="mb-6">
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-1">High Score</p>
          <p className="text-4xl font-arcade text-game-accent">{highScore}</p>
        </div>

        {/* Auth Section */}
        <div className="mb-2">
          {user ? (
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="avatar" className="w-10 h-10 rounded-full border border-game-primary" />
                <div className="text-left">
                  <p className="text-sm font-bold text-white">{user.displayName}</p>
                  <p className="text-xs text-gray-400 font-arcade mt-1">Racer</p>
                </div>
              </div>
              <button onClick={logout} className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1 bg-white/10 rounded-lg transition">Logout</button>
            </div>
          ) : (
            <button 
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all duration-300 shadow-md"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
          )}
        </div>

        <button 
          onClick={() => navigate('/game')}
          className="group relative w-full py-4 rounded-xl font-bold text-xl text-white bg-gradient-to-r from-game-primary to-rose-600 overflow-hidden shadow-[0_0_20px_rgba(230,57,70,0.4)] hover:shadow-[0_0_30px_rgba(230,57,70,0.6)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
        >
          <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out]"></div>
          <span className="flex items-center justify-center gap-3">
            <Play fill="currentColor" /> START ENGINE
          </span>
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/leaderboard')}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all duration-300"
          >
            <Trophy size={18} /> Leaders
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all duration-300"
          >
            <Settings size={18} /> Garage
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
