export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  genre: string;
  color: string;
  url: string;
}

export type Point = { x: number; y: number };

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export enum GameTheme {
  GLITCH = 'GLITCH',
  CYBER = 'CYBER',
  RETRO = 'RETRO',
  MINIMAL = 'MINIMAL',
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
