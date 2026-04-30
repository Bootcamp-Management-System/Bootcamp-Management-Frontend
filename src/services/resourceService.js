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

  async openResource(resource) {
    if (resource.resource_type === 'link') {
      const response = await api.get(`/resources/${resource._id}/download`);
      if (response.data?.url) {
        window.open(response.data.url, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    const response = await api.get(`/resources/${resource._id}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(response.data);
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => window.URL.revokeObjectURL(url), 30000);
  },

  async deleteResource(resourceId) {
    const response = await api.delete(`/resources/${resourceId}`);
    return response.data;
  },
};

export default resourceService;
