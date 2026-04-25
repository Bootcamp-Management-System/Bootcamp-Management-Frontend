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
    const response = await api.get('/bootcamps/public');
    return response.data;
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
  }
};
