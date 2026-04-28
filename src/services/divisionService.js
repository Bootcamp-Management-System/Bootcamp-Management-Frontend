import api from '../api/api';

export const divisionService = {
  async getDivisions() {
    const response = await api.get('/divisions');
    return response.data;
  },
  async createDivision(payload) {
    const response = await api.post('/divisions', payload);
    return response.data;
  },
  async assignDivisionAdmin({ divisionId, userId }) {
    const response = await api.post(`/divisions/${divisionId}/assign-admin`, { userId });
    return response.data;
  },
  async getUsersByDivision(divisionId) {
    const response = await api.get(`/divisions/${divisionId}/users`);
    return response.data;
  },
  async deleteDivision(divisionId) {
    const response = await api.delete(`/divisions/${divisionId}`);
    return response.data;
  },
};
