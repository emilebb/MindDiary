import { create } from 'zustand';
import { projectAPI, ideaAPI } from '../utils/api';

export const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  ideas: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const response = await projectAPI.getAll();
      set({ projects: response.data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch projects', loading: false });
    }
  },

  createProject: async (projectData) => {
    try {
      const response = await projectAPI.create(projectData);
      set(state => ({
        projects: [response.data, ...state.projects]
      }));
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  getProjectById: async (id) => {
    set({ loading: true });
    try {
      const response = await projectAPI.getById(id);
      set({ currentProject: response.data, loading: false });
      return response.data;
    } catch (err) {
      set({ error: 'Failed to fetch project', loading: false });
    }
  },

  updateProject: async (id, data) => {
    try {
      const response = await projectAPI.update(id, data);
      set(state => ({
        projects: state.projects.map(p => p._id === id ? response.data : p),
        currentProject: state.currentProject?._id === id ? response.data : state.currentProject
      }));
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  deleteProject: async (id) => {
    try {
      await projectAPI.delete(id);
      set(state => ({
        projects: state.projects.filter(p => p._id !== id)
      }));
    } catch (err) {
      throw err;
    }
  },

  fetchIdeas: async (projectId) => {
    set({ loading: true });
    try {
      const response = await ideaAPI.getByProject(projectId);
      set({ ideas: response.data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch ideas', loading: false });
    }
  },

  captureIdea: async (ideaData) => {
    try {
      const response = await ideaAPI.capture(ideaData);
      set(state => ({
        ideas: [response.data, ...state.ideas]
      }));
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  updateIdea: async (id, data) => {
    try {
      const response = await ideaAPI.update(id, data);
      set(state => ({
        ideas: state.ideas.map(i => i._id === id ? response.data : i)
      }));
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  deleteIdea: async (id) => {
    try {
      await ideaAPI.delete(id);
      set(state => ({
        ideas: state.ideas.filter(i => i._id !== id)
      }));
    } catch (err) {
      throw err;
    }
  }
}));
