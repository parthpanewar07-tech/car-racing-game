import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Loader } from 'lucide-react';
import { GameContext } from '../context/GameContext';
import { db, collection, query, orderBy, limit, onSnapshot, isConfigured } from '../firebase';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('global'); // global, local
  const [localHighScore, setLocalHighScore] = useState(0);
  const [globalScores, setGlobalScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(GameContext);

  useEffect(() => {
    const saved = localStorage.getItem('racing_highScore');
    if (saved) setLocalHighScore(parseInt(saved, 10));
  }, []);

  // Fetch Global Leaderboard from Express Server
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leaderboard`);
        const result = await response.json();
        if (result.success && result.data) {
          setGlobalScores(result.data);
        }
      } catch (error) {
        console.error("Error fetching leaderboard from Express server", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScores();
    // Refresh every 10 seconds
    const interval = setInterval(fetchScores, 10000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <div className="flex-grow flex flex-col items-center pt-12 p-6 pb-32 h-screen overflow-hidden">
      
      <div className="w-full max-w-md text-center mb-8 relative z-10">
        <h2 className="text-4xl font-arcade text-game-accent flex justify-center items-center gap-4 drop-shadow-lg">
          <Trophy size={40} /> HALL OF FAME
        </h2>
      </div>

      <div className="glass-dark w-full max-w-md flex flex-col flex-grow relative z-10 overflow-hidden shadow-2xl">
        
        {/* Tabs */}
        <div className="flex border-b border-white/10 p-2 gap-2">
          <button 
            onClick={() => setActiveTab('global')}
            className={`flex-1 py-3 rounded-xl font-bold transition ${activeTab === 'global' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            GLOBAL ONLINE
          </button>
          <button 
            onClick={() => setActiveTab('local')}
            className={`flex-1 py-3 rounded-xl font-bold transition ${activeTab === 'local' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            LOCAL BEST
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar relative">
          {activeTab === 'global' ? (
            <>
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="animate-spin text-game-primary" size={40} />
                </div>
              ) : globalScores.length > 0 ? (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-3">
                  {globalScores.map((player, index) => {
                    const isMe = user && user.uid === player.uid;
                    return (
                      <motion.div 
                        key={player.id} 
                        variants={itemVariants}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300
                          ${isMe ? 'bg-game-primary/20 border-game-primary shadow-[0_0_15px_rgba(230,57,70,0.3)]' : 
                          index === 0 ? 'bg-game-accent/10 border-game-accent/50' : 'bg-white/5 border-white/5'} backdrop-blur-sm`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                            ${index === 0 ? 'bg-game-accent text-black' : index === 1 ? 'bg-gray-300 text-black' : index === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-gray-400'}`}>
                            {index === 0 ? <Crown size={16} /> : index + 1}
                          </div>
                          
                          {player.photoURL ? (
                             <img src={player.photoURL} alt="avatar" className="w-8 h-8 rounded-full border border-white/20" />
                          ) : (
                             <div className="w-8 h-8 rounded-full bg-gray-700 border border-white/20 flex items-center justify-center text-xs">
                               {player.name ? player.name.charAt(0).toUpperCase() : '?'}
                             </div>
                          )}
                          
                          <div className="flex flex-col">
                            <span className={`font-bold text-sm ${isMe ? 'text-game-primary' : index === 0 ? 'text-game-accent' : 'text-white'}`}>
                              {player.name || 'Anonymous Racer'}
                              {isMe && <span className="ml-2 text-[10px] bg-game-primary text-white px-2 py-0.5 rounded-full uppercase">You</span>}
                            </span>
                          </div>
                        </div>
                        <span className="font-arcade text-sm text-gray-300">{player.score}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <p>No scores yet.</p>
                  <p className="text-sm mt-2">Be the first to set a high score!</p>
                  {!isConfigured && (
                    <p className="text-xs text-game-primary mt-4 max-w-[200px] text-center bg-game-primary/10 p-2 rounded">
                      Firebase is not configured in .env
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Trophy size={64} className="text-gray-600 mb-6" />
              <p className="text-gray-400 mb-2">YOUR PERSONAL BEST</p>
              <p className="text-5xl font-arcade text-game-primary">{localHighScore}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
