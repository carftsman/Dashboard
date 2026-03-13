import axios from "axios";

const api = axios.create({
  baseURL: "https://dashboard-backend-cyrd.onrender.com",
});

export default api;