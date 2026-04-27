import api from "../api/apiConfig";

/**
 * Upload sales file for a specific dashboard
 * @param {string|number} dashboardId - The ID of the dashboard
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - The server response
 */
export const uploadSalesFile = async (dashboardId, file, onProgress) => {
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
    const response = await api.post("/api/upload/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  onUploadProgress: (progressEvent) => {
    if (progressEvent.total) {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress?.(percent); // 🔥 send progress to component
    }
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

/**
 * Get dashboard columns and uploaded file columns for mapping
 * @param {string} fileId - The ID of the file
 * @returns {Promise<Object>} - The column mapping data
 */
export const getMappingData = async (fileId) => {
  if (!fileId) {
    throw new Error("File ID is required to get mapping data.");
  }

  try {
    const response = await api.get(`/api/upload/mapping/${fileId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Save column mappings for the uploaded file
 * @param {Object} mappingData - The mapping data containing fileId and mappings array
 * @returns {Promise<Object>} - The server response
 */
export const postManualMapping = async (mappingData) => {
  if (!mappingData?.fileId || !mappingData?.mappings) {
    throw new Error("Invalid mapping data provided.");
  }

  try {
    const response = await api.post("/api/upload/map", mappingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get validation results for the mapped file
 * @param {string} fileId - The ID of the file
 * @returns {Promise<Object>} - The validation results
 */
export const getValidationResults = async (fileId) => {
  if (!fileId) {
    throw new Error("File ID is required to get validation results.");
  }

  try {
    const response = await api.get(`/api/upload/validation/${fileId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Process the uploaded file after mapping and validation
 * @param {string} fileId - The ID of the file to process
 * @returns {Promise<Object>} - The server response
 */
export const processFile = async (fileId) => {
  if (!fileId) {
    throw new Error("File ID is required to process the file.");
  }

  try {
    const response = await api.post("/api/upload/process", { fileId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
