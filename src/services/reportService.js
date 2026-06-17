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

export const getReportSummary = async (fileId) => {
  const response = await api.get(`/api/summary/${fileId}`);
  return response.data;
};

// UPDATE Summary
export const updateReportSummary = async (data) => {
  const response = await api.patch("/api/summary", data);
  return response.data;
};

export const saveReportSummary = async (data) => {
  const response = await api.post("/api/save-summary", data);
  return response.data;
};