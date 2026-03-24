import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const updateSong = async (songId: string, songData: any) => {
  try {
    const response = await axios.put(`${API_URL}/songs/${songId}`, songData);
    return response.data;
  } catch (error) {
    console.error("Update song error:", error);
    throw error;
  }
};
