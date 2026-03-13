import api from "./apiConfig";

export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

export const getProfile = () => {
  return api.get("/auth/getprofile");
};