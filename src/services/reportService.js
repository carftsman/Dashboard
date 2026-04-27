import api from "../api/apiConfig";

export const uploadReport = async (formData) => {
  try {
    const response = await api.post("/api/reports/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};