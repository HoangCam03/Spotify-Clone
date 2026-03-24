import { FC } from "react";

interface Song {
  _id: string;
  title: string;
  artist?: string;
}

interface SongDataProps {
  song?: Song;
  onClick?: () => void;
}

const SongData: FC<SongDataProps> = ({ song, onClick }) => {
  return (
    <div onClick={onClick} className="p-4 bg-gray-800 rounded cursor-pointer hover:bg-gray-700">
      <h3 className="text-white text-lg">{song?.title}</h3>
      {song?.artist && <p className="text-gray-400">{song.artist}</p>}
    </div>
  );
};

export default SongData;
