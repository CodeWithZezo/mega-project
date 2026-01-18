// auth.js
import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Signup action
  signup: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/users/signup", data, {
        withCredentials: true, // important to allow cookie storage
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Signup failed",
        loading: false,
      });
    }
  },

  // Login action
  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/users/login", data, {
        withCredentials: true,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Login failed",
        loading: false,
      });
    }
  },

  // Logout action
  logout: async () => {
    try {
      // Clear backend cookies if you have an endpoint for it
      await axios.post("/api/users/logout", {}, { withCredentials: true });
    } catch (err) {
      console.warn("Logout request failed:", err);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
      });
      // Optionally remove cookies manually
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    }
  },

  // Check authentication status on app load
  checkAuth: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/api/users/me", {
        withCredentials: true,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));
