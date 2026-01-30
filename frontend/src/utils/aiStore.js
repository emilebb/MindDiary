import { create } from 'zustand';
import { aiAPI } from '../utils/api';

export const useAIStore = create((set) => ({
  suggestions: null,
  loading: false,
  error: null,

  generateQuestions: async (topic, context = '') => {
    set({ loading: true, error: null });
    try {
      const response = await aiAPI.generateQuestions({ topic, context });
      set({ suggestions: response.data, loading: false });
      return response.data;
    } catch (err) {
      set({ error: 'Failed to generate questions', loading: false });
    }
  },

  expandIdea: async (content, question = '') => {
    set({ loading: true, error: null });
    try {
      const response = await aiAPI.expandIdea({ content, question });
      set({ suggestions: response.data, loading: false });
      return response.data;
    } catch (err) {
      set({ error: 'Failed to expand idea', loading: false });
      throw err;
    }
  },

  detectMood: async (content) => {
    try {
      const response = await aiAPI.detectMood({ content });
      return response.data.mood;
    } catch (err) {
      return 'neutral';
    }
  },

  generateExercise: async (blockType) => {
    set({ loading: true });
    try {
      const response = await aiAPI.generateExercise({ blockType });
      set({ suggestions: response.data, loading: false });
      return response.data;
    } catch (err) {
      set({ error: 'Failed to generate exercise', loading: false });
    }
  },

  findConnections: async (mainIdea, otherIdeas) => {
    try {
      const response = await aiAPI.findConnections({ mainIdea, otherIdeas });
      return response.data.connections;
    } catch (err) {
      return [];
    }
  }
}));
