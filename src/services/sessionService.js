import api from '../api/api';

export const sessionService = {
  // GET /api/v1/sessions
  async getSessions(filters = {}) {
    const params = new URLSearchParams();
    if (filters.bootcampId) params.append('bootcamp', filters.bootcampId);
    if (filters.bootcamp) params.append('bootcamp', filters.bootcamp);
    if (filters.division) params.append('division', filters.division);
    const response = await api.get(`/sessions?${params.toString()}`);
    return response.data;
  },

  async getSessionById(id) {
    const response = await api.get(`/sessions/${id}`);
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

  // PATCH /api/v1/sessions/:id/assign-instructor
  async assignInstructor(sessionId, instructorId) {
    const response = await api.patch(`/sessions/${sessionId}/assign-instructor`, { instructorId });
    return response.data;
  },

  // GET /api/v1/sessions/available-instructors/:divisionId
  async getAvailableInstructors(divisionId, filters = {}) {
    const params = new URLSearchParams();
    if (filters.startTime) params.append('startTime', filters.startTime);
    if (filters.endTime) params.append('endTime', filters.endTime);
    if (filters.sessionId) params.append('sessionId', filters.sessionId);
    const query = params.toString();
    const response = await api.get(`/sessions/available-instructors/${divisionId}${query ? `?${query}` : ''}`);
    return response.data;
  },
};

export default sessionService;
