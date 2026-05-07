/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { SnakeGame } from '@/src/components/SnakeGame';
import { GlitchHeader } from '@/src/components/GlitchHeader';
import { GlitchFooter } from '@/src/components/GlitchFooter';
import { SettingsMenu } from '@/src/components/SettingsMenu';
import { musicService } from '@/src/services/musicService';
import { highScoreService } from '@/src/services/scoreService';
import { settingsService } from '@/src/services/settingsService';
import { GameStatus, GameTheme } from '@/src/utils/types';

export default function App() {
  const tracks = musicService.getTracks();
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [theme, setTheme] = useState<GameTheme>(GameTheme.GLITCH);
  const [fontFamily, setFontFamily] = useState<string>('Theme default');
  const [isMuted, setIsMuted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const eatAudioRef = useRef<HTMLAudioElement>(null);
  const gameOverAudioRef = useRef<HTMLAudioElement>(null);
  
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const currentTrack = tracks[currentTrackIndex];
  const fontOptions = [
    { label: 'Theme default', value: 'Theme default' },
    { label: 'VT323', value: 'VT323' },
    { label: 'Space Grotesk', value: 'Space Grotesk' },
    { label: 'Press Start 2P', value: 'Press Start 2P' },
    { label: 'Inter', value: 'Inter' },
  ];
  const themeOptions = [
    { label: 'Glitch', value: GameTheme.GLITCH },
    { label: 'Cyber', value: GameTheme.CYBER },
    { label: 'Retro', value: GameTheme.RETRO },
    { label: 'Minimal', value: GameTheme.MINIMAL },
  ];
  const speedLevel = Math.floor(score / 50) + 1;

  useEffect(() => {
    const savedSettings = settingsService.getSettings();
    setTheme(savedSettings.theme);
    setFontFamily(savedSettings.fontFamily);
    setIsMuted(savedSettings.isMuted);
    setBestScore(highScoreService.getBestScore());
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      highScoreService.setBestScore(score);
    }
  }, [score, bestScore]);

  useEffect(() => {
    settingsService.saveSettings({
      theme,
      fontFamily,
      isMuted,
    });
  }, [theme, fontFamily, isMuted]);

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
  };

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

    if (isMuted) {
      audio.pause();
      return;
    }

    if (isPlaying) {
      audio.play().catch(e => console.error("Playback stopped:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack, isMuted]);

  useEffect(() => {
    if (isMuted) {
      setIsPlaying(false);
    }
  }, [isMuted]);

  useEffect(() => {
    const pauseIfPlaying = () => {
      setGameStatus((currentStatus) => (
        currentStatus === GameStatus.PLAYING ? GameStatus.PAUSED : currentStatus
      ));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        pauseIfPlaying();
      }
    };

    window.addEventListener('blur', pauseIfPlaying);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('blur', pauseIfPlaying);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('ended', handleNext);
    return () => {
      audio.removeEventListener('ended', handleNext);
    };
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 theme-${theme} grid-bg relative selection:bg-[var(--secondary)] selection:text-black overflow-x-hidden overflow-y-auto flex flex-col ${isGlitching ? 'glitch-heavy' : ''}`}
      style={{
        '--font-family': fontFamily === 'Theme default' ? undefined : `"${fontFamily}"`,
      } as React.CSSProperties}
    >
      <audio ref={audioRef} src={currentTrack.url} muted={isMuted} />
      <audio ref={eatAudioRef} src="https://raw.githubusercontent.com/rafael-m-silva/snake-game/master/assets/eat.mp3" />
      <audio ref={gameOverAudioRef} src="https://raw.githubusercontent.com/rafael-m-silva/snake-game/master/assets/die.mp3" />
      <SettingsMenu
        isOpen={isSettingsOpen}
        onToggleOpen={() => setIsSettingsOpen((prev) => !prev)}
        selectedFont={fontFamily}
        fontOptions={fontOptions}
        onFontChange={setFontFamily}
        selectedTheme={theme}
        themeOptions={themeOptions}
        onThemeChange={(nextTheme) => setTheme(nextTheme as GameTheme)}
        isMuted={isMuted}
        onToggleMuted={() => {
          setIsMuted((prev) => {
            const nextMuted = !prev;
            if (!nextMuted) {
              setIsPlaying(true);
            }
            return nextMuted;
          });
        }}
      />
      
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

      <div className="relative z-10 w-full flex flex-col">
        <GlitchHeader score={score} bestScore={bestScore} speedLevel={speedLevel} />

        {/* Main Interface */}
        <main className="flex-1 w-full max-w-7xl mx-auto flex min-h-0 px-4 md:px-6 py-3">
          <section className="w-full flex justify-center items-start lg:items-center h-full min-h-0 relative">
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

