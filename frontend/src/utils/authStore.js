import { create } from 'zustand';
import { authAPI } from '../utils/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },

  register: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register({ email, password, name });
      set({
        user: response.data.user,
        token: response.data.token,
        loading: false
      });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err) {
      const error = err.response?.data?.error || 'Registration failed';
      set({ error, loading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      set({
        user: response.data.user,
        token: response.data.token,
        loading: false
      });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err) {
      const error = err.response?.data?.error || 'Login failed';
      set({ error, loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, error: null });
  },

  getProfile: async () => {
    try {
      const response = await authAPI.getProfile();
      set({ user: response.data });
      return response.data;
    } catch (err) {
      set({ user: null, token: null });
      localStorage.removeItem('token');
      throw err;
    }
  }
}));
