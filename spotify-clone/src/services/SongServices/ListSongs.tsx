import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getAllSongs = async () => {
  try {
    const response = await axios.get(`${API_URL}/songs`);
    return response.data;
  } catch (error) {
    console.error("Get songs error:", error);
    throw error;
  }
};

export const getSongById = async (songId: string) => {
  try {
    const response = await axios.get(`${API_URL}/songs/${songId}`);
    return response.data;
  } catch (error) {
    console.error("Get song error:", error);
    throw error;
  }
};
