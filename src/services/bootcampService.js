/**
 * BOOTCAMP API SERVICE
 * -------------------------------------------------------------------------
 * This service handles all frontend requests related to Bootcamp entities.
 * It serves as the bridge between the UI components and the Backend API.
 * 
 * Usage:
 * import { bootcampService } from '../services/bootcampService';
 * const data = await bootcampService.getBootcamps();
 */

import api from '../api/api';

export const bootcampService = {
  /**
   * Fetches all bootcamps (Requires Admin/Super Admin auth)
   */
  getBootcamps: async () => {
    const response = await api.get('/bootcamps');
    return response.data;
  },
  
  /**
   * Fetches only published bootcamps for the Landing Page (Public)
   */
  getPublicBootcamps: async () => {
    try {
      const response = await api.get('/bootcamps/public');
      return response.data;
    } catch (error) {
      // Backend may be offline in demo/dev environments. Provide safe fallback data.
      return {
        data: [
          {
            _id: 'demo-web',
            name: 'Web Development Bootcamp',
            description: 'Learn modern frontend + backend fundamentals and build real projects.',
          },
          {
            _id: 'demo-cyber',
            name: 'Cyber Security Bootcamp',
            description: 'Practice defensive security, networking, and core blue-team skills.',
          },
          {
            _id: 'demo-ai',
            name: 'AI & Data Science Bootcamp',
            description: 'Build data-driven applications and learn ML foundations.',
          },
        ],
        demoFallback: true,
        error: error?.message || 'Network Error',
      };
    }
  },

  /**
   * Fetches a single bootcamp by its unique ID
   */
  getBootcamp: async (id) => {
    const response = await api.get(`/bootcamps/${id}`);
    return response.data;
  },

  /**
   * Creates a new bootcamp node (Division Admin restricted)
   */
  createBootcamp: async (data) => {
    const response = await api.post('/bootcamps', data);
    return response.data;
  },

  updateBootcamp: async (id, data) => {
    const response = await api.put(`/bootcamps/${id}`, data);
    return response.data;
  },

  deleteBootcamp: async (id) => {
    const response = await api.delete(`/bootcamps/${id}`);
    return response.data;
  }
};
