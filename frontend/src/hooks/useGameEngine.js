import { useState, useEffect, useRef, useCallback } from 'react';

// Game Constants
const ROAD_WIDTH = 300;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 70;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 70;
const INITIAL_SPEED = 5;

// Car Colors Map
const CAR_COLORS = {
  car1: '#e63946', // Racer (Red)
  car2: '#3b82f6', // Speedster (Blue)
  car3: '#a855f7', // Phantom (Purple)
};

export const useGameEngine = (gameState, setGameState, setScore, difficulty, selectedCar, theme) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  
  // Game State Refs
  const playerRef = useRef({ x: ROAD_WIDTH / 2 - CAR_WIDTH / 2, y: 0, speedX: 0 });
  const enemiesRef = useRef([]);
  const linesRef = useRef([0, 150, 300, 450, 600]);
  const speedRef = useRef(INITIAL_SPEED);
  const scoreRef = useRef(0);
  const keysRef = useRef({ ArrowLeft: false, ArrowRight: false, Space: false });
  const isNitroRef = useRef(false);

  // Wobble phase for AI
  const frameCountRef = useRef(0);

  const getDifficultyMultiplier = () => {
    switch (difficulty) {
      case 'easy': return 0.8;
      case 'hard': return 1.5;
      case 'medium':
      default: return 1.1;
    }
  };

  const spawnEnemy = useCallback(() => {
    const lanes = [
      ROAD_WIDTH * 0.16 - ENEMY_WIDTH/2, 
      ROAD_WIDTH * 0.5 - ENEMY_WIDTH/2, 
      ROAD_WIDTH * 0.84 - ENEMY_WIDTH/2
    ];
    const x = lanes[Math.floor(Math.random() * lanes.length)];
    
    const lastEnemy = enemiesRef.current[enemiesRef.current.length - 1];
    if (!lastEnemy || lastEnemy.y > 150) {
       enemiesRef.current.push({
         x,
         y: -ENEMY_HEIGHT,
         speed: speedRef.current * 0.5 + Math.random() * 2,
         wobbleOffset: Math.random() * 100 // for AI behavior
       });
    }
  }, []);

  const update = useCallback((canvasHeight) => {
    if (gameState !== 'playing') return;
    
    frameCountRef.current += 1;

    // Nitro Logic
    isNitroRef.current = keysRef.current.Space;
    const currentSpeedMultiplier = isNitroRef.current ? 2.5 : 1;
    const activeSpeed = speedRef.current * currentSpeedMultiplier;

    // Move player
    const moveSpeed = isNitroRef.current ? 7 : 5;
    if (keysRef.current.ArrowLeft && playerRef.current.x > 0) {
      playerRef.current.x -= moveSpeed;
    }
    if (keysRef.current.ArrowRight && playerRef.current.x < ROAD_WIDTH - CAR_WIDTH) {
      playerRef.current.x += moveSpeed;
    }
    
    playerRef.current.y = canvasHeight - CAR_HEIGHT - 20;

    // Move road lines
    linesRef.current = linesRef.current.map(y => {
      const newY = y + activeSpeed;
      return newY > canvasHeight ? -100 : newY;
    });

    // Move enemies & collision
    for (let i = 0; i < enemiesRef.current.length; i++) {
      const enemy = enemiesRef.current[i];
      // Wobble behavior (AI traffic slowly changing lane)
      enemy.x += Math.sin((frameCountRef.current + enemy.wobbleOffset) * 0.05) * 0.5;
      
      // keep enemy inside bounds
      if (enemy.x < 10) enemy.x = 10;
      if (enemy.x > ROAD_WIDTH - ENEMY_WIDTH - 10) enemy.x = ROAD_WIDTH - ENEMY_WIDTH - 10;

      enemy.y += activeSpeed - (speedRef.current * 0.4); 
      
      // Collision detection (slightly forgiving hitboxes)
      const p = playerRef.current;
      const margin = 5;
      if (
        p.x + margin < enemy.x + ENEMY_WIDTH - margin &&
        p.x + CAR_WIDTH - margin > enemy.x + margin &&
        p.y + margin < enemy.y + ENEMY_HEIGHT - margin &&
        p.y + CAR_HEIGHT - margin > enemy.y + margin
      ) {
        if (navigator.vibrate) navigator.vibrate(200); // Mobile vibration on crash
        setGameState('gameover');
        return;
      }
    }

    // Remove off-screen enemies & increase score
    enemiesRef.current = enemiesRef.current.filter(enemy => {
      if (enemy.y > canvasHeight) {
        // Bonus points for nitro passing
        const points = isNitroRef.current ? 20 : 10;
        scoreRef.current += points;
        setScore(scoreRef.current);
        
        speedRef.current = INITIAL_SPEED + Math.floor(scoreRef.current / 100) * 0.3 * getDifficultyMultiplier();
        return false;
      }
      return true;
    });

    // Spawn new enemies
    if (Math.random() < 0.02 * getDifficultyMultiplier() * currentSpeedMultiplier) {
      spawnEnemy();
    }

  }, [gameState, setGameState, setScore, spawnEnemy, difficulty]);

  // rounded rect helper
  const drawRoundedRect = (ctx, x, y, width, height, radius, color) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  const draw = useCallback((ctx, canvasHeight) => {
    // Day/Night Theme colors
    const isDark = theme === 'dark';
    const roadColor = isDark ? '#222' : '#888';
    const lineColor = isDark ? '#fff' : '#fff';
    const sideGrassColor = isDark ? '#0f0f0f' : '#4ade80';

    // Clear canvas (Side grass)
    ctx.fillStyle = sideGrassColor;
    ctx.fillRect(0, 0, ROAD_WIDTH, canvasHeight);

    // Draw Road
    ctx.fillStyle = roadColor;
    ctx.fillRect(10, 0, ROAD_WIDTH - 20, canvasHeight);

    // Draw road lines
    ctx.fillStyle = lineColor;
    linesRef.current.forEach(y => {
      ctx.fillRect(ROAD_WIDTH / 2 - 5, y, 10, 50);
      ctx.fillRect(15, y, 3, 50);
      ctx.fillRect(ROAD_WIDTH - 18, y, 3, 50);
    });

    // Draw Player
    const p = playerRef.current;
    const pColor = CAR_COLORS[selectedCar] || CAR_COLORS.car1;
    drawRoundedRect(ctx, p.x, p.y, CAR_WIDTH, CAR_HEIGHT, 8, pColor);
    
    // Windshield
    drawRoundedRect(ctx, p.x + 5, p.y + 15, CAR_WIDTH - 10, 20, 4, isDark ? '#111' : '#fff');
    // Rear Window
    drawRoundedRect(ctx, p.x + 8, p.y + CAR_HEIGHT - 15, CAR_WIDTH - 16, 10, 2, isDark ? '#111' : '#fff');
    
    // Lights
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(p.x + 4, p.y - 2, 8, 4);
    ctx.fillRect(p.x + CAR_WIDTH - 12, p.y - 2, 8, 4);

    // Nitro Flames
    if (isNitroRef.current) {
      const flameHeight = 15 + Math.random() * 15;
      ctx.fillStyle = '#f97316'; // orange flame
      ctx.beginPath();
      ctx.moveTo(p.x + 10, p.y + CAR_HEIGHT);
      ctx.lineTo(p.x + 15, p.y + CAR_HEIGHT + flameHeight);
      ctx.lineTo(p.x + 20, p.y + CAR_HEIGHT);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(p.x + CAR_WIDTH - 20, p.y + CAR_HEIGHT);
      ctx.lineTo(p.x + CAR_WIDTH - 15, p.y + CAR_HEIGHT + flameHeight);
      ctx.lineTo(p.x + CAR_WIDTH - 10, p.y + CAR_HEIGHT);
      ctx.fill();
    }

    // Draw Enemies
    enemiesRef.current.forEach(enemy => {
      drawRoundedRect(ctx, enemy.x, enemy.y, ENEMY_WIDTH, ENEMY_HEIGHT, 8, '#457b9d');
      // Windshield
      drawRoundedRect(ctx, enemy.x + 5, enemy.y + 35, ENEMY_WIDTH - 10, 20, 4, isDark ? '#111' : '#fff');
      // Rear Window
      drawRoundedRect(ctx, enemy.x + 8, enemy.y + 5, ENEMY_WIDTH - 16, 10, 2, isDark ? '#111' : '#fff');
      
      // Tail lights
      ctx.fillStyle = '#e63946';
      ctx.fillRect(enemy.x + 4, enemy.y + ENEMY_HEIGHT - 2, 8, 4);
      ctx.fillRect(enemy.x + ENEMY_WIDTH - 12, enemy.y + ENEMY_HEIGHT - 2, 8, 4);
    });

    // Night Mode overlay (darkens sides, creates headlight effect)
    if (isDark) {
      const gradient = ctx.createRadialGradient(
        p.x + CAR_WIDTH/2, p.y, 10,
        p.x + CAR_WIDTH/2, p.y - 100, 200
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, ROAD_WIDTH, canvasHeight);
    }

  }, [theme, selectedCar]);

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      update(canvas.height);
      draw(ctx, canvas.height);
    }
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(loop);
    }
  }, [update, draw, gameState]);

  // Start/Stop Loop
  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(loop);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, loop]);

  // Controls setup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.ArrowLeft = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.ArrowRight = true;
      if (e.key === ' ') keysRef.current.Space = true;
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keysRef.current.ArrowLeft = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keysRef.current.ArrowRight = false;
      if (e.key === ' ') keysRef.current.Space = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Touch controls
  const handleTouchLeftStart = () => { keysRef.current.ArrowLeft = true; };
  const handleTouchLeftEnd = () => { keysRef.current.ArrowLeft = false; };
  const handleTouchRightStart = () => { keysRef.current.ArrowRight = true; };
  const handleTouchRightEnd = () => { keysRef.current.ArrowRight = false; };
  const handleNitroStart = () => { keysRef.current.Space = true; };
  const handleNitroEnd = () => { keysRef.current.Space = false; };

  // Reset Engine state
  const resetEngine = () => {
    playerRef.current = { x: ROAD_WIDTH / 2 - CAR_WIDTH / 2, y: 0, speedX: 0 };
    enemiesRef.current = [];
    linesRef.current = [0, 150, 300, 450, 600];
    speedRef.current = INITIAL_SPEED;
    scoreRef.current = 0;
    frameCountRef.current = 0;
    setScore(0);
  };

  return {
    canvasRef,
    resetEngine,
    touchControls: {
      left: { start: handleTouchLeftStart, end: handleTouchLeftEnd },
      right: { start: handleTouchRightStart, end: handleTouchRightEnd },
      nitro: { start: handleNitroStart, end: handleNitroEnd }
    }
  };
};
