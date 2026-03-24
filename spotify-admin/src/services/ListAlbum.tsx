import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const listAlbum = async () => {
  try {
    const response = await axios.get(`${API_URL}/albums`);
    return response.data;
  } catch (error) {
    console.error("List album error:", error);
    throw error;
  }
};
