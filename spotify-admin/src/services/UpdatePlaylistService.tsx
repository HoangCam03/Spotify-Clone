import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const updatePlaylist = async (playlistId: string, playlistData: any) => {
  try {
    const response = await axios.put(`${API_URL}/playlists/${playlistId}`, playlistData);
    return response.data;
  } catch (error) {
    console.error("Update playlist error:", error);
    throw error;
  }
};
