import api from '../api/api';

export const userService = {
  async createUser(payload) {
    const response = await api.post('/users', payload);
    return response.data;
  },
  async getUsers() {
    const response = await api.get('/users');
    return response.data;
  },
  async updateUser(userId, payload) {
    const response = await api.put(`/users/${userId}`, payload);
    return response.data;
  },
};
