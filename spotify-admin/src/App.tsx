import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AddSong from "./pages/AddSong";
import AddPlaylist from "./pages/AddPlaylist";
import ListSongs from "./pages/ListSongs";
import ListPlaylists from "./pages/ListPlaylists";
import ListUsers from "./pages/Users/ListUsers";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Login from "./pages/Login/Login";

interface UserData {
  role: string;
  username: string;
  email: string;
  _id: string;
}

const checkAdminAuth = (): boolean => {
  console.log("Checking admin authentication...");
  const accessToken = localStorage.getItem("accessToken");
  const userData = localStorage.getItem("userData");

  console.log("Access Token in localStorage:", accessToken ? "Found" : "Not Found");
  console.log("User Data in localStorage:", userData ? "Found" : "Not Found");

  if (!accessToken || !userData) {
    console.log("Authentication failed: Missing token or user data.");
    return false;
  }

  try {
    const user: UserData = JSON.parse(userData);
    console.log("Parsed User Data:", user);
    console.log("User Role:", user.role);
    const isAdmin = user.role === "admin";
    console.log("Is Admin:", isAdmin);
    return isAdmin;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return false;
  }
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAdminAuthenticated = checkAdminAuth();
  if (!isAdminAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex h-screen bg-black">
      <ToastContainer />
      {!isLoginPage && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {!isLoginPage && <Navbar />}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/add-song"
              element={
                <ProtectedRoute>
                  <AddSong />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list-songs"
              element={
                <ProtectedRoute>
                  <ListSongs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-playlist"
              element={
                <ProtectedRoute>
                  <AddPlaylist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list-playlists"
              element={
                <ProtectedRoute>
                  <ListPlaylists />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list-users"
              element={
                <ProtectedRoute>
                  <ListUsers />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/add-song" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
