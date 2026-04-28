import api from '../api/api';

export const userService = {
  async getMemberPool() {
    const response = await api.get('/users/pool');
    return response.data;
  },
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
   * Fetches a specific user by ID
   */
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
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
   * Deletes a user from the system
   */
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  /**
   * Elevates a student to an instructor role
   */
  promoteUser: async (userId, payload) => {
    const response = await api.patch(`/users/${userId}/promote`, payload);
    return response.data;
  },

  /**
   * Demotes a user to a lower role (admin to instructor, instructor to student)
   */
  demoteUser: async (userId, payload) => {
    const response = await api.patch(`/users/${userId}/demote`, payload);
    return response.data;
  },
};
