import { FC } from "react";

interface Playlist {
  _id: string;
  name: string;
}

interface DisplayPlaylistProps {
  playlist?: Playlist;
}

const DisplayPlaylist: FC<DisplayPlaylistProps> = ({ playlist }) => {
  return (
    <div className="w-[75%] h-full bg-gray-900 text-white p-4 overflow-y-auto">
      <h1 className="text-3xl mb-4">{playlist?.name || "Playlist"}</h1>
      <p>Hiển thị các bài hát trong playlist</p>
    </div>
  );
};

export default DisplayPlaylist;
