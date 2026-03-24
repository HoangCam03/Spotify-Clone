import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const listUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("List users error:", error);
    throw error;
  }
};
