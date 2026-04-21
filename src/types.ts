export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  duration: number;
}

export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
