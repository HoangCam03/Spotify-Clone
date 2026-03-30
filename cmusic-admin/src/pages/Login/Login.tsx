import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // Save auth info to localStorage
    localStorage.setItem("adminAuth", JSON.stringify({ email, role: "admin" }));
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="w-96 bg-gray-900 p-8 rounded-lg">
        <h1 className="text-2xl text-white mb-6">Admin Đăng Nhập</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            required
          />
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
