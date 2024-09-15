import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  resumes: [], // Added resumes to the state
  resume: null, // Added resume to the state
  userProfile: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, { email, password, name });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/logout`);
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/verify-email`, { code });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/auth/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        error: error.response?.data?.message || "Error checking authentication",
      });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },

  // Admin functions
  fetchAllResumes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/admin/resumes`);
	  console.log("AAAAAAAAAAAAAAAAAAAAA : ", response.data);
	  
      set({ resumes: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching resumes", isLoading: false });
      throw error;
    }
  },

  fetchResumeById: async (resumeId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/admin/resume/${resumeId}`);
      set({ resume: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching resume", isLoading: false });
      throw error;
    }
  },

  updateResumeStatus: async (resumeId, status, feedback) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(`${API_URL}/admin/resume/${resumeId}/status`, { status, feedback });
      set({ resume: response.data.resume, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error updating resume status", isLoading: false });
      throw error;
    }
  },


  fetchUserProfile: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/admin/resume/${userId}`);
	  console.log("RRRRRRRRRRRRRRRRRRR : ", response.data);
	  
    await set({ userProfile: response.data, isLoading: false });
	  console.log("gggggggggggggggg:", response.data);
	  
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching user profile", isLoading: false });
      throw error;
    }
  },

  updateResumeStatus: async (resumeId, status, feedback) => {
    set({ isLoading: true, error: null });
    try {
        const response = await axios.patch(`${API_URL}/admin/resume/${resumeId}/status`, { status, feedback });
        // Update local state to reflect the new status
        set({ resume: response.data.resume, isLoading: false });
        return response.data;
    } catch (error) {
        set({ error: error.response?.data?.message || "Error updating resume status", isLoading: false });
        throw error;
    }
},

  
}));
