import React, { useContext, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import Header from "./components/Header";
import { PlayerContext } from "./context/PlayerContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchSongs } from "./store/slices/songSlice";
import { fetchPlaylists } from "./store/slices/playlistSlice";
import Register from "./components/Register/Register.tsx";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import { RootState, AppDispatch } from "./store/store";

const App: React.FC = () => {
  const playerContext = useContext(PlayerContext);
  const audioRef = playerContext?.audioRef;
  const track = playerContext?.track;

  const dispatch = useDispatch<AppDispatch>();
  const { status: songsStatus } = useSelector((state: RootState) => state.songs);
  const { items: playlistsState } = useSelector((state: RootState) => state.playlists);

  useEffect(() => {
    if (songsStatus === "idle") {
      dispatch(fetchSongs());
    }
    if (playlistsState.status === "idle") {
      dispatch(fetchPlaylists());
    }
  }, [songsStatus, playlistsState.status, dispatch]);

  return (
    <div className="h-screen bg-black">
      <Routes>
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <>
              <Header className="sticky top-0 left-0 right-0 z-50" />
              <div className="h-[80%] flex">
                <Sidebar />
                <Display />
              </div>
              <Player />
              {track && <audio ref={audioRef} src={track.file} preload="auto"></audio>}
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
