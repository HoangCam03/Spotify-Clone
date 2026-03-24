import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const deleteService = async (id: string, type: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${type}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};
