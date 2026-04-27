import api from '../api/api';

const sessionService = {
  // GET /api/v1/sessions
  async getSessions(filters = {}) {
    const params = new URLSearchParams();
    if (filters.bootcampId) params.append('bootcampId', filters.bootcampId);
    if (filters.division) params.append('division', filters.division);
    const response = await api.get(`/sessions?${params.toString()}`);
    return response.data;
  },

  // POST /api/v1/sessions
  async createSession(data) {
    const response = await api.post('/sessions', data);
    return response.data;
  },

  // PATCH /api/v1/sessions/:id
  async updateSession(id, data) {
    const response = await api.patch(`/sessions/${id}`, data);
    return response.data;
  },

  // DELETE /api/v1/sessions/:id
  async deleteSession(id) {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  },
};

export default sessionService;
