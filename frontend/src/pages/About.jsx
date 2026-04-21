import React from 'react';
import { motion } from 'framer-motion';
import { Info, Code, Gamepad2, User } from 'lucide-react';

const About = () => {
  return (
    <div className="flex-grow flex flex-col items-center pt-24 p-6 h-screen overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl text-center mb-8 relative z-10"
      >
        <h2 className="text-4xl font-arcade text-game-accent flex justify-center items-center gap-4 drop-shadow-lg mb-8">
          <Info size={40} /> ABOUT
        </h2>

        <div className="glass-dark w-full flex flex-col p-8 rounded-2xl relative z-10 overflow-y-auto custom-scrollbar shadow-2xl text-left border border-white/10 gap-8">
          
          {/* About App Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold text-game-primary flex items-center gap-2 border-b border-white/10 pb-2">
              <Gamepad2 /> The Game
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Welcome to the ultimate arcade racing experience! This game was built to bring back the nostalgic feel of classic 2D top-down racers, combined with modern web technologies. 
              Dodge traffic, use nitro boosts, and climb the global leaderboard to prove you are the fastest racer on the track.
            </p>
          </div>

          {/* About Developer Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold text-game-accent flex items-center gap-2 border-b border-white/10 pb-2">
              <Code /> The Developer
            </h3>
            <div className="flex items-center gap-4 md:gap-6 mt-2 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-game-primary/20 rounded-full flex items-center justify-center border-2 border-game-primary shadow-[0_0_15px_rgba(230,57,70,0.5)]">
                <User size={32} className="text-game-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-arcade text-white tracking-widest">PARTH PANEWAR</span>
                <span className="text-xs md:text-sm text-game-primary font-bold uppercase tracking-widest mt-1">Lead Developer & Creator</span>
                <p className="text-gray-400 text-xs md:text-sm mt-2">
                  Passionate software developer focused on building high-performance, beautiful web applications. 
                  This game was built using React, Vite, Tailwind CSS, Node.js, and HTML5 Canvas.
                </p>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default About;
