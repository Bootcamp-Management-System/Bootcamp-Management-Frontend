import api from '../api/api';

const submissionService = {
  // POST /api/v1/submissions/:taskId  — student submits a task
  async submitTask(taskId, data) {
    const response = await api.post(`/submissions/${taskId}`, data);
    return response.data;
  },

  // GET /api/v1/submissions  — filtered submissions
  async getSubmissions(filters = {}) {
    const params = new URLSearchParams();
    if (filters.taskId) params.append('taskId', filters.taskId);
    if (filters.studentId) params.append('studentId', filters.studentId);
    const response = await api.get(`/submissions?${params.toString()}`);
    return response.data;
  },

  // PATCH /api/v1/submissions/review/:id  — instructor grades submission
  async reviewSubmission(id, data) {
    const response = await api.patch(`/submissions/review/${id}`, data);
    return response.data;
  },

  // PUT /api/v1/submissions/:id  — student edits their submission
  async updateSubmission(id, data) {
    const response = await api.put(`/submissions/${id}`, data);
    return response.data;
  },
};

export default submissionService;
