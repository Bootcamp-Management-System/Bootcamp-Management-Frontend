import api from '../api/api.js';

const enrollmentService = {
  // Get user's enrollments
  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/me');
    return response.data;
  },

  // Activate enrollment with OTP
  activateEnrollment: async (otp) => {
    const response = await api.post('/enrollments/activate', { otp });
    return response.data;
  }
};

export default enrollmentService;