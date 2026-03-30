import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const userSignUp = async (userData: { username: string; email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/users/signup`, userData);
    if (response.data.token) {
      localStorage.setItem("userAuth", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};
