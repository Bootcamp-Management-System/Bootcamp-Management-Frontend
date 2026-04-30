import api from '../api/api';

const resourceService = {
  async getResourcesBySession(sessionId) {
    const response = await api.get(`/resources/session/${sessionId}`);
    return response.data;
  },

  async uploadResource(data) {
    const response = await api.post('/resources/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deleteResource(resourceId) {
    const response = await api.delete(`/resources/${resourceId}`);
    return response.data;
  },
};

export default resourceService;
