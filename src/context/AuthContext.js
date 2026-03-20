import React, { createContext, useState, useEffect } from "react";
import { loginUser, getProfile, logoutUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token and load user when app starts
  useEffect(() => {
    const loadUser = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (error) {
        console.error("Profile fetch failed", error);
        localStorage.removeItem("token");
        setUser(null);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // Login function
  const login = async (credentials) => {

    try {

      const loginResponse = await loginUser(credentials);

      if (loginResponse?.token) {
        localStorage.setItem("token", loginResponse.token);
      }

      const profile = await getProfile();
      setUser(profile);

      return profile;

    } catch (error) {
      throw error;
    }

  };

  // Logout function
  const logout = () => {
    logoutUser();
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};