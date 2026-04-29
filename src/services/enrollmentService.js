import api from '../api/api';

const enrollmentService = {
  activateEnrollment: async (otp) => {
    const response = await api.post('/enrollments/activate', { otp });
    return response.data;
  },

  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/me');
    return response.data;
  },

  getBootcampEnrollments: async (bootcampId) => {
    const response = await api.get(`/enrollments/bootcamp/${bootcampId}`);
    return response.data;
  }
};

export default enrollmentService;