import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getAllPlaylists = async () => {
  try {
    const response = await axios.get(`${API_URL}/playlists`);
    return response.data;
  } catch (error) {
    console.error("Get playlists error:", error);
    throw error;
  }
};

export const getUserPlaylists = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/playlists/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Get user playlists error:", error);
    throw error;
  }
};
