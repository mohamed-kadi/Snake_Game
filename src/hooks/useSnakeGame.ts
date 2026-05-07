import { useCallback, useEffect, useRef, useState } from 'react';
import { GRID_SIZE, INITIAL_SNAKE } from '@/src/utils/constants';
import { Direction, GameStatus, Point } from '@/src/utils/types';

interface UseSnakeGameProps {
  onScoreChange: (score: number) => void;
  onEat?: () => void;
  status: GameStatus;
  onStatusChange: (status: GameStatus) => void;
}

export const useSnakeGame = ({ onScoreChange, onEat, status, onStatusChange }: UseSnakeGameProps) => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [score, setScore] = useState(0);
  const [digestingIndices, setDigestingIndices] = useState<number[]>([]);
  const lastUpdateRef = useRef<number>(0);
  const nextDirectionRef = useRef<Direction>('UP');

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let attempts = 0;
    while (attempts < 100) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        return newFood;
      }
      attempts++;
    }
    return { x: 0, y: 0 };
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection('UP');
    nextDirectionRef.current = 'UP';
    setScore(0);
    setDigestingIndices([]);
    onScoreChange(0);
    setFood(generateFood(INITIAL_SNAKE));
    onStatusChange(GameStatus.PLAYING);
  }, [onScoreChange, onStatusChange, generateFood]);

  const moveSnake = useCallback(() => {
    if (status !== GameStatus.PLAYING) return;

    const currentDir = nextDirectionRef.current;
    setDirection(currentDir);

    const head = snake[0];
    const newHead = { ...head };

    if (currentDir === 'UP') newHead.y -= 1;
    if (currentDir === 'DOWN') newHead.y += 1;
    if (currentDir === 'LEFT') newHead.x -= 1;
    if (currentDir === 'RIGHT') newHead.x += 1;

    // Check wall collision
    if (
      newHead.x < 0 || newHead.x >= GRID_SIZE ||
      newHead.y < 0 || newHead.y >= GRID_SIZE
    ) {
      onStatusChange(GameStatus.GAME_OVER);
      return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      onStatusChange(GameStatus.GAME_OVER);
      return;
    }

    // Check food
    if (newHead.x === food.x && newHead.y === food.y) {
      const ns = score + 10;
      setScore(ns);
      onScoreChange(ns);
      onEat?.();
      
      const newSnake = [newHead, ...snake];
      setSnake(newSnake);
      setFood(generateFood(newSnake));
      
      // The new head is the eaten pixel
      setDigestingIndices(prev => [...prev.map(i => i + 1), 0]);
    } else {
      setSnake([newHead, ...snake.slice(0, -1)]);
      setDigestingIndices(prev => 
        prev.map(i => i + 1).filter(i => i < snake.length)
      );
    }
  }, [snake, food, score, onScoreChange, onEat, onStatusChange, generateFood, status]);

  useEffect(() => {
    if (status !== GameStatus.PLAYING) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (['ARROWUP', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT', ' ', 'W', 'A', 'S', 'D'].includes(key)) {
        e.preventDefault();
      }

      switch (key) {
        case 'ARROWUP':
        case 'W': if (direction !== 'DOWN') nextDirectionRef.current = 'UP'; break;
        case 'ARROWDOWN':
        case 'S': if (direction !== 'UP') nextDirectionRef.current = 'DOWN'; break;
        case 'ARROWLEFT':
        case 'A': if (direction !== 'RIGHT') nextDirectionRef.current = 'LEFT'; break;
        case 'ARROWRIGHT':
        case 'D': if (direction !== 'LEFT') nextDirectionRef.current = 'RIGHT'; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, status]);

  const tick = useCallback((time: number) => {
    if (status !== GameStatus.PLAYING) {
      lastUpdateRef.current = 0;
      return;
    }

    if (!lastUpdateRef.current) {
      lastUpdateRef.current = time;
    }

    if (time - lastUpdateRef.current > 120) {
      moveSnake();
      lastUpdateRef.current = time;
    }
  }, [status, moveSnake]);

  return {
    snake,
    food,
    score,
    digestingIndices,
    resetGame,
    tick
  };
};
