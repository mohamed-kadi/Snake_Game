import { motion } from 'motion/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GRID_SIZE } from '@/src/utils/constants';
import { Direction, GameStatus } from '@/src/utils/types';
import { useSnakeGame } from '@/src/hooks/useSnakeGame';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  onEat?: () => void;
  status: GameStatus;
  onStatusChange: (status: GameStatus) => void;
  accentColor: string;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ 
  onScoreChange, 
  onEat,
  status, 
  onStatusChange,
  accentColor 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);

  const { snake, food, score, digestingIndices, resetGame, queueDirection, tick } = useSnakeGame({
    onScoreChange,
    onEat,
    status,
    onStatusChange
  });

  const handleStart = useCallback(() => {
    if (status === GameStatus.IDLE) {
      resetGame();
      return;
    }

    if (status === GameStatus.PAUSED) {
      onStatusChange(GameStatus.PLAYING);
    }
  }, [status, resetGame, onStatusChange]);

  const handlePauseToggle = useCallback(() => {
    if (status === GameStatus.PLAYING) {
      onStatusChange(GameStatus.PAUSED);
    } else if (status === GameStatus.PAUSED) {
      onStatusChange(GameStatus.PLAYING);
    }
  }, [status, onStatusChange]);

  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleDirectionTap = useCallback((nextDirection: Direction) => {
    queueDirection(nextDirection);
  }, [queueDirection]);

  const update = useCallback((time: number) => {
    tick(time);
    if (status === GameStatus.PLAYING) {
      gameLoopRef.current = requestAnimationFrame(update);
    }
  }, [status, tick]);

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      gameLoopRef.current = requestAnimationFrame(update);
    } else {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [status, update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cellSize = w / GRID_SIZE;

    const styles = window.getComputedStyle(document.body);
    const primary = styles.getPropertyValue('--primary').trim() || '#00ffff';
    const secondary = styles.getPropertyValue('--secondary').trim() || '#ff00ff';
    const accent = styles.getPropertyValue('--accent').trim() || '#00ff41';
    const text = styles.getPropertyValue('--text').trim() || '#ffffff';

    ctx.clearRect(0, 0, w, h);

    // Draw Grid (Subtle)
    ctx.strokeStyle = primary + '26'; // adds transparency
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(w, i * cellSize);
      ctx.stroke();
    }

    // Draw Food (DATA_CLUSTER)
    ctx.fillStyle = secondary;
    ctx.shadowBlur = 10;
    ctx.shadowColor = secondary;
    const foodSize = cellSize * 0.8;
    ctx.fillRect(
      food.x * cellSize + (cellSize - foodSize) / 2,
      food.y * cellSize + (cellSize - foodSize) / 2,
      foodSize,
      foodSize
    );

    // Draw Snake (SYNAPTIC_STREAM)
    snake.forEach((segment, i) => {
      const isHead = i === 0;
      const isDigesting = digestingIndices.includes(i);
      
      // Random glitch jitter for head or digesting segments
      const jitterX = (isHead || isDigesting) ? (Math.random() - 0.5) * 4 : 0;
      const jitterY = (isHead || isDigesting) ? (Math.random() - 0.5) * 4 : 0;

      // Color logic: Head is Cyan/Primary, Body is Pink/Secondary, Digesting is White/Glitch
      if (isDigesting) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#ffffff';
      } else {
        ctx.fillStyle = isHead ? primary : secondary;
        ctx.shadowBlur = isHead ? 15 : 0;
        ctx.shadowColor = primary;
      }
      
      const padding = isHead ? 1 : (isDigesting ? -1 : 3);
      ctx.fillRect(
        segment.x * cellSize + padding + jitterX,
        segment.y * cellSize + padding + jitterY,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
      
      // Line connectors for a stream feel
      if (i > 0) {
        ctx.strokeStyle = primary;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(segment.x * cellSize + cellSize/2, segment.y * cellSize + cellSize/2);
        ctx.lineTo(snake[i-1].x * cellSize + cellSize/2, snake[i-1].y * cellSize + cellSize/2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

  }, [snake, food, digestingIndices, accentColor]);

  return (
    <div className="relative group w-full max-w-[500px] min-h-[300px]">
      <div className="relative aspect-square glass-panel neon-border overflow-hidden p-0 border-[var(--primary)] shadow-[0_0_20px_var(--primary)_inset,0_0_20px_var(--primary)]">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-full block relative z-10"
          id="game-canvas"
        />
        
        {status === GameStatus.IDLE && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-30">
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="px-10 py-5 border-4 border-double border-[var(--primary)] font-bold text-[var(--primary)] tracking-[0.3em] transition-all hover:bg-[var(--primary)] hover:text-black shadow-[4px_4px_0px_var(--secondary)]"
              id="start-button"
            >
              INITIALIZE_NEURAL_LINK
            </motion.button>
          </div>
        )}

        {status === GameStatus.PAUSED && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md z-30">
            <p className="text-[var(--primary)] text-xl tracking-[0.2em] mb-4">PAUSED</p>
            <p className="text-[var(--text)]/80 text-xs tracking-[0.15em]">PRESS START OR SPACE TO RESUME</p>
          </div>
        )}

        {status === GameStatus.GAME_OVER && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-30 border-4 border-[var(--secondary)]">
            <h2 className="text-4xl font-black text-[var(--secondary)] mb-2 tracking-tighter glitch-text">SIGNAL_LOST_CORE_CRITICAL</h2>
            <p className="text-[var(--primary)] mb-8 font-mono">INTEGRITY_INDEX: {score.toString().padStart(5, '0')}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="px-10 py-5 border-4 border-double border-[var(--primary)] bg-black text-[var(--primary)] font-bold tracking-[0.2em] shadow-[4px_4px_0px_var(--secondary)]"
              id="restart-button"
            >
              RECONSTRUCT_SYNAPSE
            </motion.button>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleStart}
          disabled={status === GameStatus.PLAYING}
          className="px-4 py-2 border-2 border-[var(--primary)] text-[var(--primary)] font-bold text-xs tracking-[0.15em] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--primary)] hover:text-black transition-colors"
        >
          START
        </button>
        <button
          type="button"
          onClick={handlePauseToggle}
          disabled={status === GameStatus.IDLE || status === GameStatus.GAME_OVER}
          className="px-4 py-2 border-2 border-[var(--secondary)] text-[var(--secondary)] font-bold text-xs tracking-[0.15em] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--secondary)] hover:text-black transition-colors"
        >
          {status === GameStatus.PAUSED ? 'RESUME' : 'PAUSE'}
        </button>
        <button
          type="button"
          onClick={handleRestart}
          className="px-4 py-2 border-2 border-[var(--text)] text-[var(--text)] font-bold text-xs tracking-[0.15em] hover:bg-[var(--text)] hover:text-black transition-colors"
        >
          RESTART
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 max-w-[220px] mx-auto select-none">
        <div />
        <button
          type="button"
          onClick={() => handleDirectionTap('UP')}
          disabled={status !== GameStatus.PLAYING}
          className="px-3 py-2 border-2 border-[var(--primary)] text-[var(--primary)] font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          UP
        </button>
        <div />
        <button
          type="button"
          onClick={() => handleDirectionTap('LEFT')}
          disabled={status !== GameStatus.PLAYING}
          className="px-3 py-2 border-2 border-[var(--primary)] text-[var(--primary)] font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          LEFT
        </button>
        <button
          type="button"
          onClick={() => handleDirectionTap('DOWN')}
          disabled={status !== GameStatus.PLAYING}
          className="px-3 py-2 border-2 border-[var(--primary)] text-[var(--primary)] font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          DOWN
        </button>
        <button
          type="button"
          onClick={() => handleDirectionTap('RIGHT')}
          disabled={status !== GameStatus.PLAYING}
          className="px-3 py-2 border-2 border-[var(--primary)] text-[var(--primary)] font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          RIGHT
        </button>
      </div>
    </div>
  );
};
