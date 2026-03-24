import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const deleteAlbum = async (albumId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/albums/${albumId}`);
    return response.data;
  } catch (error) {
    console.error("Delete album error:", error);
    throw error;
  }
};
