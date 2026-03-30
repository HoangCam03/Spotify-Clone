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
    <div className="h-screen bg-black flex flex-col p-2 gap-2 font-sans overflow-hidden text-[#b3b3b3]">
      <Routes>
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <>
              {/* Top Navigation */}
              <Header />

              {/* Main Content Area */}
              <div className="flex-1 flex gap-2 overflow-hidden">
                <Sidebar />
                <Display />
              </div>

              {/* Bottom Promotional Bar for logged-out users */}
              <div className="h-[75px] w-full px-6 py-3 flex justify-between items-center bg-gradient-to-r from-[#af2896] to-[#509bf5] cursor-pointer hover:scale-[1.01] transition-transform rounded-lg">
                <div className="text-white">
                  <p className="text-sm font-bold uppercase tracking-wider mb-1">Xem trước Spotify</p>
                  <p className="font-semibold text-[15px]">Đăng ký để nghe không giới hạn các bài hát và podcast với quảng cáo không thường xuyên. Không cần thẻ tín dụng.</p>
                </div>
                <button className="bg-white text-black text-base font-bold py-3 px-8 rounded-full hover:scale-105 transition hover:-mb-[2px]">
                  Đăng ký miễn phí
                </button>
              </div>

              {/* Keep existing player mechanics around behind scenes or conditionally rendered */}
              {playerContext?.playStatus && <Player />}
              {track && <audio ref={audioRef} src={track.file} preload="auto"></audio>}
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
