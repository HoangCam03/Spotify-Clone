import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const addSong = async (songData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/songs`, songData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Add song error:", error);
    throw error;
  }
};
