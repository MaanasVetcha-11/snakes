import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Position, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 150;

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  isGameOver: boolean;
  onGameOver: (score: number) => void;
  onRestart: () => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ 
  onScoreChange, 
  isGameOver, 
  onGameOver, 
  onRestart 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on snake
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setScore(0);
    setSpeed(INITIAL_SPEED);
    onScoreChange(0);
  }, [onScoreChange]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const update = useCallback((time: number) => {
    if (isGameOver) return;

    if (time - lastUpdateRef.current < speed) {
      gameLoopRef.current = requestAnimationFrame(update);
      return;
    }

    lastUpdateRef.current = time;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collision with walls
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        onGameOver(score);
        return prevSnake;
      }

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        onGameOver(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food caten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(prev - 2, 60)); // Speed up slightly
      } else {
        newSnake.pop();
      }

      return newSnake;
    });

    gameLoopRef.current = requestAnimationFrame(update);
  }, [direction, food, isGameOver, onGameOver, score, speed, onScoreChange, generateFood]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(update);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#ec4899' : '#22d3ee';
      ctx.shadowBlur = isHead ? 15 : 8;
      ctx.shadowColor = isHead ? '#ec4899' : '#22d3ee';
      
      // Rounded snake segments
      const x = segment.x * cellSize + 2;
      const y = segment.y * cellSize + 2;
      const size = cellSize - 4;
      const radius = 6;
      
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + size - radius, y);
      ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
      ctx.lineTo(x + size, y + size - radius);
      ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
      ctx.lineTo(x + radius, y + size);
      ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#facc15';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#facc15';
    const fx = food.x * cellSize + cellSize / 2;
    const fy = food.y * cellSize + cellSize / 2;
    ctx.beginPath();
    ctx.arc(fx, fy, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="max-w-full h-auto border-4 border-cyan-500/20 rounded-[2rem] shadow-[0_0_50px_rgba(34,211,238,0.1)] bg-[#111]"
      />
      {isGameOver && (
        <div className="absolute inset-0 flex rounded-[2rem] bg-black/80 flex flex-col items-center justify-center backdrop-blur-md z-10 transition-all">
          <h2 className="text-4xl font-display font-black tracking-tighter uppercase italic text-pink-500 mb-4">GAME OVER</h2>
          <p className="text-cyan-400 font-mono text-xl mb-6">DATA CORE LOST: {score}</p>
          <button
            onClick={() => {
              resetGame();
              onRestart();
            }}
            className="px-8 py-3 bg-cyan-500 text-black font-black uppercase italic rounded-lg hover:scale-110 active:scale-95 transition-transform shadow-[0_0_20px_rgba(34,211,238,0.5)] cursor-pointer"
          >
            REBOOT SYSTEM
          </button>
        </div>
      )}
    </div>
  );
};
