import api from '../api/api';

const submitFeedback = async (data) => {
  const response = await api.post('/feedback', data);
  return response.data;
};

const getFeedback = async (params) => {
  const response = await api.get('/feedback', { params });
  return response.data?.data || [];
};

const getSessionStats = async (sessionId) => {
  const response = await api.get(`/feedback/stats/${sessionId}`);
  return response.data?.data || { averageRating: 0, totalFeedbacks: 0 };
};

export default {
  submitFeedback,
  getFeedback,
  getSessionStats
};
