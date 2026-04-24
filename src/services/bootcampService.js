import api from '../api/api';

export const bootcampService = {
  getBootcamps: async () => {
    const response = await api.get('/bootcamps');
    return response.data;
  },
  
  getPublicBootcamps: async () => {
    const response = await api.get('/bootcamps/public');
    return response.data;
  },

  getBootcamp: async (id) => {
    const response = await api.get(`/bootcamps/${id}`);
    return response.data;
  },

  createBootcamp: async (data) => {
    const response = await api.post('/bootcamps', data);
    return response.data;
  }
};
