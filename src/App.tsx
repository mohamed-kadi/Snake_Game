/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { SnakeGame } from '@/src/components/SnakeGame';
import { GlitchHeader } from '@/src/components/GlitchHeader';
import { GlitchFooter } from '@/src/components/GlitchFooter';
import { SonicLog } from '@/src/components/SonicLog';
import { musicService } from '@/src/services/musicService';
import { GameStatus, GameTheme, Track } from '@/src/utils/types';

export default function App() {
  const tracks = musicService.getTracks();
  const [score, setScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState<GameTheme>(GameTheme.GLITCH);
  const [isGlitching, setIsGlitching] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const eatAudioRef = useRef<HTMLAudioElement>(null);
  const gameOverAudioRef = useRef<HTMLAudioElement>(null);
  
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const currentTrack = tracks[currentTrackIndex];

  // Handle Game Status Changes (Stop music on crash)
  useEffect(() => {
    if (gameStatus === GameStatus.GAME_OVER) {
      setIsPlaying(false);
      if (gameOverAudioRef.current) {
        gameOverAudioRef.current.currentTime = 0;
        gameOverAudioRef.current.play().catch(e => console.error("Game over audio failed:", e));
      }
    }
  }, [gameStatus]);

  const handleNext = () => {
    setCurrentTrackIndex(prev => (prev + 1) % tracks.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex(prev => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const handleEat = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 150);
    if (eatAudioRef.current) {
      eatAudioRef.current.currentTime = 0;
      eatAudioRef.current.play().catch(e => console.error("Eat audio failed:", e));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(e => console.error("Playback stopped:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNext);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNext);
    };
  }, []);

  return (
    <div className={`h-screen transition-colors duration-500 theme-${theme} grid-bg relative selection:bg-[var(--secondary)] selection:text-black overflow-hidden flex flex-col ${isGlitching ? 'glitch-heavy' : ''}`}>
      <audio ref={audioRef} src={currentTrack.url} />
      <audio ref={eatAudioRef} src="https://raw.githubusercontent.com/rafael-m-silva/snake-game/master/assets/eat.mp3" />
      <audio ref={gameOverAudioRef} src="https://raw.githubusercontent.com/rafael-m-silva/snake-game/master/assets/die.mp3" />
      
      {/* Glitch Infrastructure */}
      {theme === GameTheme.GLITCH && (
        <>
          <div className="scanline-overlay"></div>
          <div className="static-noise"></div>
        </>
      )}

      {/* Atmospheric Artifacts */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20"
          style={{ background: 'var(--secondary)' }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20"
          style={{ background: 'var(--primary)' }}
        />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
        <GlitchHeader score={score} />

        {/* Main Interface */}
        <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-6 min-h-0 overflow-hidden px-4 md:px-6">
          
          {/* Sidebar: Sonic Log + Music + Themes */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 lg:order-1 order-2 flex flex-col h-full min-h-0">
            <SonicLog 
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              progress={progress}
              onTogglePlay={handleTogglePlay}
              onNext={handleNext}
              onPrev={handlePrev}
              currentTheme={theme}
              onThemeChange={setTheme}
            />
          </div>

          {/* Main Content Area: Snake */}
          <section className="col-span-12 lg:col-span-8 xl:col-span-9 lg:order-2 order-1 flex justify-center items-center h-full min-h-0 relative">
             <div className="absolute top-0 left-0 text-[8px] opacity-20 pointer-events-none p-2 uppercase tracking-widest leading-none">STREAMING_LIVE_FEED</div>
             <div className="w-full max-w-[600px] aspect-square flex items-center justify-center">
               <SnakeGame 
                onScoreChange={setScore} 
                onEat={handleEat}
                status={gameStatus}
                onStatusChange={setGameStatus}
                accentColor="#00FFFF"
              />
             </div>
          </section>
        </main>

        <GlitchFooter />
      </div>
    </div>
  );
}

