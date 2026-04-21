import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, RotateCcw, Home as HomeIcon, Zap } from 'lucide-react';
import { GameContext } from '../context/GameContext';
import { useGameEngine } from '../hooks/useGameEngine';

const Game = () => {
  const navigate = useNavigate();
  const { 
    gameState, setGameState, 
    score, setScore, 
    difficulty, highScore, 
    selectedCar, theme,
    startGame, pauseGame, resumeGame, resetToMenu 
  } = useContext(GameContext);

  const { canvasRef, resetEngine, touchControls } = useGameEngine(gameState, setGameState, setScore, difficulty, selectedCar, theme);

  // Initialize game when mounted
  useEffect(() => {
    if (gameState === 'menu') {
      resetEngine();
      startGame();
    }
  }, []);

  const handleRestart = () => {
    resetEngine();
    startGame();
  };

  const handleQuit = () => {
    resetEngine();
    resetToMenu();
    navigate('/');
  };

  return (
    <div className="flex-grow flex justify-center items-center h-screen w-full relative bg-[#1a1a1a]">
      
      {/* Top HUD */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20 pointer-events-none">
        <div className="glass px-4 py-2 pointer-events-auto">
          <p className="text-gray-400 text-xs font-bold uppercase">Score</p>
          <p className="text-2xl font-arcade text-white">{score}</p>
        </div>

        <button 
          onClick={gameState === 'playing' ? pauseGame : resumeGame}
          className="glass p-3 pointer-events-auto hover:bg-white/20 transition"
        >
          {gameState === 'playing' ? <Pause fill="white" /> : <Play fill="white" />}
        </button>
      </div>

      {/* Game Canvas Container */}
      <div className="relative h-full w-full max-w-[400px] bg-[#222] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={typeof window !== 'undefined' ? window.innerHeight : 800}
          className="w-full h-full block"
        />

        {/* Speed blur effect overlay when playing */}
        {gameState === 'playing' && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-transparent to-black/10 animate-[pulse_0.5s_ease-in-out_infinite]"></div>
        )}

        {/* Touch Controls (Mobile) */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 flex z-10 opacity-0 md:hidden">
          <div 
            className="w-1/3 h-full"
            onTouchStart={touchControls.left.start}
            onTouchEnd={touchControls.left.end}
          ></div>
          <div 
            className="w-1/3 h-full bg-white/10"
            onTouchStart={touchControls.nitro.start}
            onTouchEnd={touchControls.nitro.end}
          ></div>
          <div 
            className="w-1/3 h-full"
            onTouchStart={touchControls.right.start}
            onTouchEnd={touchControls.right.end}
          ></div>
        </div>

        {/* Nitro visual cue for desktop */}
        {gameState === 'playing' && (
          <div className="absolute bottom-6 right-4 z-20 pointer-events-none opacity-80 hidden md:block">
            <div className="glass px-3 py-2 flex items-center gap-2">
              <Zap size={16} className="text-game-accent animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Hold Space</span>
            </div>
          </div>
        )}
      </div>

      {/* Overlays (Pause / Game Over) */}
      <AnimatePresence>
        {(gameState === 'paused' || gameState === 'gameover') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-dark p-8 rounded-2xl flex flex-col items-center gap-6 w-full max-w-[320px] text-center"
            >
              <h2 className="text-3xl font-arcade text-game-primary">
                {gameState === 'paused' ? 'PAUSED' : 'CRASHED'}
              </h2>

              {gameState === 'gameover' && (
                <div className="w-full">
                  <p className="text-gray-400 text-sm">FINAL SCORE</p>
                  <p className="text-4xl font-bold text-white mb-2">{score}</p>
                  {score >= highScore && score > 0 && (
                    <p className="text-game-accent text-sm font-bold animate-pulse">NEW HIGH SCORE!</p>
                  )}
                </div>
              )}

              <div className="flex w-full gap-4 mt-4">
                {gameState === 'paused' ? (
                  <button onClick={resumeGame} className="flex-1 py-3 rounded-xl bg-game-primary text-white font-bold hover:bg-rose-600 transition flex justify-center items-center gap-2">
                    <Play size={18} fill="currentColor" /> RESUME
                  </button>
                ) : (
                  <button onClick={handleRestart} className="flex-1 py-3 rounded-xl bg-game-primary text-white font-bold hover:bg-rose-600 transition flex justify-center items-center gap-2">
                    <RotateCcw size={18} /> RETRY
                  </button>
                )}
              </div>
              
              <button onClick={handleQuit} className="w-full py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition flex justify-center items-center gap-2">
                <HomeIcon size={18} /> MAIN MENU
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Game;
