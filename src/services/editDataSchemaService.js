import api from "../api/apiConfig"; // your axios instance

export const getColumns = async (dashboardId) => {
  try {
    const response = await api.get(`/api/dashboards/${dashboardId}/columns`);
    return response.data;
  } catch (error) {
    console.error("Error fetching columns:", error);
    throw error;
  }
};

export const updateColumn = async (dashboardId, columnId, payload) => {
  const response = await api.put(
    `/api/dashboards/${dashboardId}/columns/${columnId}`,
    payload
  );
  return response.data;
};

// ✅ ONLY CHANGE HERE
export const createColumn = async (dashboardId, payload) => {
  const response = await api.post(
    `/api/dashboards/${dashboardId}/columns`,
    {
      columns: [payload],
    }
  );
  return response; // ✅ changed
};

export const deleteColumn = async (dashboardId, columnId) => {
  const response = await api.delete(
    `/api/dashboards/${dashboardId}/columns/${columnId}`
  );
  return response.data;
};