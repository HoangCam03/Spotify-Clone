import { useState, useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";

interface UserData {
  username: string;
  email: string;
  role: string;
}

const Navbar: FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        setUserData(null);
      }
    }
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setUserData(null);
    navigate("/login", { replace: true });
  };

  return (
    <div className="navbar w-full border-b-2 border-gray-800 px-5 sm:px-12 py-4 text-lg flex justify-between items-center">
      <p>Admin panel</p>
      <div className="flex items-center space-x-4">
        {userData && <span className="text-shadow-gray-400">Xin chào, {userData.username}</span>}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Navbar;
