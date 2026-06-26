import api from "../api/apiConfig";

// Login user
export const loginUser = async (data) => {
  try {
    const response = await api.post("/api/auth/login", data);


    const result = response.data;
    console.log("LOGIN API FULL RESPONSE:", response.data);
    if (result?.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);
    }

    return result;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get logged-in user profile
export const getProfile = async () => {
  try {
    const response = await api.get('/api/users/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Logout user
export const logoutUser = () => {
  ["token", "user", "role", "lastDashboardId"].forEach((key) =>
    localStorage.removeItem(key)
  );
};