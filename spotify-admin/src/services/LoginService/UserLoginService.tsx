import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const userLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem("adminAuth", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
