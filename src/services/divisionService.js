import api from '../api/api';

export const divisionService = {
  async getDivisions() {
    const response = await api.get('/divisions');
    return response.data;
  },
};
