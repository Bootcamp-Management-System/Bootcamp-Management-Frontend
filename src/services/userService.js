/**
 * USER & IDENTITY API SERVICE
 * -------------------------------------------------------------------------
 * This service handles all user-related data, including creation,
 * role promotion, and identity verification.
 */

import api from '../api/api';

export const userService = {
  /**
   * Registers a new user manually (Admin only)
   */
  createUser: async (payload) => {
    const response = await api.post('/users', payload);
    return response.data;
  },

  /**
   * Fetches the global or division-specific user directory
   */
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  /**
   * Updates core user profile information
   */
  updateUser: async (userId, payload) => {
    const response = await api.put(`/users/${userId}`, payload);
    return response.data;
  },

  /**
   * Elevates a student to an instructor role
   */
  promoteUser: async (userId, payload) => {
    const response = await api.patch(`/users/${userId}/promote`, payload);
    return response.data;
  }
};
