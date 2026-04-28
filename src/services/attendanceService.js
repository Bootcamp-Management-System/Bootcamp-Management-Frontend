import api from '../api/api';

const attendanceService = {
  // GET /api/v1/attendance
  async getAttendance(sessionId) {
    const response = await api.get('/attendance', { params: { sessionId } });
    return response.data;
  },

  // POST /api/v1/attendance/mark
  async markAttendance(sessionId, studentId, status) {
    const response = await api.post('/attendance/mark', { sessionId, studentId, status });
    return response.data;
  },

  // GET /api/v1/attendance/qr-token/:sessionId
  async generateQRCode(sessionId) {
    const response = await api.get(`/attendance/qr-token/${sessionId}`);
    return response.data;
  },

  // POST /api/v1/attendance/scan
  async scanQRCode(qrToken) {
    const response = await api.post('/attendance/scan', { qrToken });
    return response.data;
  },
};

export default attendanceService;