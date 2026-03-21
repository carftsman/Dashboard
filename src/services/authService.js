import api from "../api/apiConfig";

// Login user
export const loginUser = async (data) => {
  try {
    const response = await api.post("/auth/login", data);

    // ✅ Correct token path
    if (response.data?.data?.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get logged-in user profile
export const getProfile = async () => {
  try {
    const response = await api.get("/auth/getprofile");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
};