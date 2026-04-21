import React, { createContext, useState, useEffect } from 'react';
import { auth, provider, signInWithPopup, signOut, onAuthStateChanged, isConfigured, db, doc, setDoc } from '../firebase';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedCar, setSelectedCar] = useState('car1'); // car1, car2, car3
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard
  const [theme, setTheme] = useState('dark'); // dark, light

  // Auth State
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Load saved data on init
  useEffect(() => {
    const savedHighScore = localStorage.getItem('racing_highScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));

    const savedSettings = localStorage.getItem('racing_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSoundEnabled(parsed.soundEnabled ?? true);
      setSelectedCar(parsed.selectedCar ?? 'car1');
      setDifficulty(parsed.difficulty ?? 'medium');
      setTheme(parsed.theme ?? 'dark');
    }
  }, []);

  // Firebase Auth Listener
  useEffect(() => {
    if (!isConfigured) {
      setIsAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Login / Logout functions
  const loginWithGoogle = async () => {
    if (!isConfigured) return alert("Firebase is not configured yet! Please add credentials to .env");
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    if (!isConfigured) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Save score when updated
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('racing_highScore', score.toString());
    }
  }, [score, highScore]);

  // Sync high score to Firebase on game over if new high score
  useEffect(() => {
    if (gameState === 'gameover' && user && isConfigured && score > 0) {
      // Syncing score to global leaderboard (Firestore)
      const saveToFirebase = async () => {
        try {
          const userDocRef = doc(db, 'leaderboard', user.uid);
          // Only overwrite if it's their best score, but since we just do a simple approach,
          // we might want to check first, but for simplicity we'll just save the highest.
          // In a real app we'd fetch or use rules.
          await setDoc(userDocRef, {
            name: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
            score: highScore > score ? highScore : score,
            updatedAt: new Date()
          }, { merge: true });
          // Also sync to our Express Global Server
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.uid,
              name: user.displayName,
              photoURL: user.photoURL,
              score: highScore > score ? highScore : score
            })
          }).catch(err => console.error("Failed to sync to Express Server", err));
          
        } catch (error) {
          console.error("Failed to save score to Firebase", error);
        }
      };
      saveToFirebase();
    }
  }, [gameState, user, score, highScore]);

  // Save settings when updated
  useEffect(() => {
    localStorage.setItem('racing_settings', JSON.stringify({
      soundEnabled, selectedCar, difficulty, theme
    }));
  }, [soundEnabled, selectedCar, difficulty, theme]);

  const startGame = () => {
    setScore(0);
    setGameState('playing');
  };

  const gameOver = (finalScore) => {
    setScore(finalScore);
    setGameState('gameover');
  };

  const pauseGame = () => {
    if (gameState === 'playing') setGameState('paused');
  };

  const resumeGame = () => {
    if (gameState === 'paused') setGameState('playing');
  };

  const resetToMenu = () => {
    setGameState('menu');
  };

  return (
    <GameContext.Provider value={{
      gameState, setGameState,
      score, setScore,
      highScore,
      soundEnabled, setSoundEnabled,
      selectedCar, setSelectedCar,
      difficulty, setDifficulty,
      theme, setTheme,
      startGame, gameOver, pauseGame, resumeGame, resetToMenu,
      user, isAuthLoading, loginWithGoogle, logout
    }}>
      {children}
    </GameContext.Provider>
  );
};
