import { createContext } from "react";

export interface PlayerContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  seekBg: React.RefObject<HTMLDivElement>;
  seekBar: React.RefObject<HTMLDivElement>;
  track: any;
  playStatus: boolean;
  setPlayStatus: (status: boolean) => void;
  time: {
    currentTime: { second: number; minute: number };
    totalTime: { second: number; minute: number };
  };
  setTime: (time: any) => void;
  play: () => void;
  pause: () => void;
  playWithId: (id: string) => Promise<void>;
  previous: () => Promise<void>;
  next: () => Promise<void>;
  seekSong: (e: any) => Promise<void>;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);
