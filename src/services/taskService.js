import api from '../api/api';

const taskService = {
  // GET /api/v1/tasks
  async getTasks(filters = {}) {
    const params = new URLSearchParams();
    if (filters.division) params.append('division', filters.division);
    if (filters.session) params.append('session', filters.session);
    if (filters.bootcamp) params.append('bootcamp', filters.bootcamp);
    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  // GET /api/v1/tasks/:id
  async getTaskById(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // POST /api/v1/tasks
  async createTask(data) {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  // PUT /api/v1/tasks/:id
  async updateTask(id, data) {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data;
  },

  // DELETE /api/v1/tasks/:id
  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default taskService;
