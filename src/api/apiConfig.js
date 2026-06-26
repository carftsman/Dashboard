import axios from "axios";

const api = axios.create({
  baseURL: "https://dashboard-backend-cyrd.onrender.com",
});

 
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  console.log("INTERCEPTOR TOKEN:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;