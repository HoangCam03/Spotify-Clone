import { FC } from "react";
import { Link } from "react-router-dom";

const Sidebar: FC = () => {
  return (
    <div className="w-[25%] h-full bg-black text-gray-400 p-4">
      <nav>
        <Link to="/" className="block mb-4 text-white hover:text-gray-200">
          Home
        </Link>
        <Link to="/playlists" className="block mb-4 hover:text-gray-200">
          Playlists
        </Link>
        <Link to="/search" className="block mb-4 hover:text-gray-200">
          Search
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
