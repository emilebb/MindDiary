import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Project endpoints
export const projectAPI = {
  create: (data) => api.post('/projects', data),
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`)
};

// Idea endpoints
export const ideaAPI = {
  capture: (data) => api.post('/ideas', data),
  getByProject: (projectId) => api.get(`/ideas/project/${projectId}`),
  update: (id, data) => api.put(`/ideas/${id}`, data),
  delete: (id) => api.delete(`/ideas/${id}`),
  expand: (id, data) => api.post(`/ideas/${id}/expand`, data)
};

// AI endpoints
export const aiAPI = {
  generateQuestions: (data) => api.post('/ai/questions', data),
  expandIdea: (data) => api.post('/ai/expand', data),
  detectMood: (data) => api.post('/ai/mood', data),
  generateExercise: (data) => api.post('/ai/exercise', data),
  findConnections: (data) => api.post('/ai/connections', data),
  generateMindMap: (data) => api.post('/ai/mindmap', data),
  analyzeImage: (data) => api.post('/ai/analyze-image', data)
};

export default api;
