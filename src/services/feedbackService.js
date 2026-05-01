import api from '../api/api';

const submitFeedback = async (data) => {
  const response = await api.post('/feedback', data);
  return response.data;
};

const getFeedback = async (params) => {
  const response = await api.get('/feedback', { params });
  return response.data;
};

const getSessionStats = async (sessionId) => {
  const response = await api.get(`/feedback/session/${sessionId}/stats`);
  return response.data;
};

export default {
  submitFeedback,
  getFeedback,
  getSessionStats
};
