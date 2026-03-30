import { createContext, RefObject, Dispatch, SetStateAction } from "react";

export interface PlayerContextType {
  audioRef: RefObject<HTMLAudioElement>;
  seekBg: RefObject<HTMLDivElement>;
  seekBar: RefObject<HTMLDivElement>;
  track: any;
  playStatus: boolean;
  setPlayStatus: Dispatch<SetStateAction<boolean>>;
  time: {
    currentTime: { second: number; minute: number };
    totalTime: { second: number; minute: number };
  };
  setTime: Dispatch<SetStateAction<{ currentTime: { second: number; minute: number }; totalTime: { second: number; minute: number } }>>;
  play: () => void;
  pause: () => void;
  playWithId: (id: string) => Promise<void>;
  previous: () => Promise<void>;
  next: () => Promise<void>;
  seekSong: (e: React.MouseEvent<HTMLDivElement>) => Promise<void>;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);
