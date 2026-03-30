import { FC, useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

const Player: FC = () => {
  const playerContext = useContext(PlayerContext);

  return (
    <div className="h-[10%] bg-black text-white p-4 flex items-center justify-between">
      <p className="w-[30%]">{playerContext?.track?.title || "No track"}</p>
      <div className="w-[40%] flex justify-center gap-4">
        <button onClick={playerContext?.previous}>⏮</button>
        <button onClick={playerContext?.playStatus ? playerContext.pause : playerContext?.play}>
          {playerContext?.playStatus ? "⏸" : "▶"}
        </button>
        <button onClick={playerContext?.next}>⏭</button>
      </div>
      <div ref={playerContext?.seekBg} className="w-[20%] h-1 bg-gray-700 cursor-pointer" onClick={playerContext?.seekSong}>
        <div ref={playerContext?.seekBar} className="h-full bg-green-500"></div>
      </div>
    </div>
  );
};

export default Player;
