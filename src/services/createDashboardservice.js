import api from '../api/apiConfig'

export const deleteColumn = async (dashboardId, columnId) => {
  const response = await api.delete(
    `/api/dashboards/${dashboardId}/columns/${columnId}`
  );
  return response.data;
};
 