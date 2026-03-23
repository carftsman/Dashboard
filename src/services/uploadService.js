import api from "../api/apiConfig";

/**
 * Upload sales file for a specific dashboard
 * @param {string|number} dashboardId - The ID of the dashboard
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - The server response
 */
export const uploadSalesFile = async (dashboardId, file) => {
  if (!dashboardId) {
    throw new Error("Dashboard ID is required for file upload.");
  }
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  const formData = new FormData();
  formData.append("dashboardId", dashboardId);
  formData.append("file", file);

  try {
    const response = await api.post("/api/dashboard/upload/sales", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get validation summary for a uploaded file
 * @param {string|number} fileId - The ID of the file
 * @returns {Promise<Object>} - The validation summary
 */
export const getValidationSummary = async (fileId) => {
  if (!fileId) {
    throw new Error("File ID is required to get validation summary.");
  }

  try {
    const response = await api.get(`/api/dashboard/file/${fileId}/validation-summary`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get file preview with optional status filter
 * @param {string|number} fileId - The ID of the file
 * @param {string} status - Filter status (e.g., 'VALID')
 * @returns {Promise<Object>} - The file preview data
 */
export const getFilePreview = async (fileId, status = "VALID") => {
  if (!fileId) {
    throw new Error("File ID is required to get file preview.");
  }

  try {
    const response = await api.get(`/api/files/${fileId}/preview`, {
      params: { status },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
