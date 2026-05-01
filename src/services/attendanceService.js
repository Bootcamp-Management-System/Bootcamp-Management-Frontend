import api from '../api/api';

const attendanceService = {
  // GET /api/v1/attendance
  async getAttendance(input) {
    const sessionId = typeof input === 'object' ? input.sessionId : input;
    const response = await api.get('/attendance', { params: { sessionId } });
    return response.data;
  },

  // POST /api/v1/attendance/mark
  async markAttendance(input, studentId, status) {
    const payload = typeof input === 'object' ? input : { sessionId: input, studentId, status };
    const response = await api.post('/attendance/mark', payload);
    return response.data;
  },

  async submitAttendance(sessionId, records) {
    const response = await api.post('/attendance/submit', { sessionId, records });
    return response.data;
  },

  // GET /api/v1/attendance/qr-token/:sessionId
  async generateQRCode(sessionId) {
    const response = await api.get(`/attendance/qr-token/${sessionId}`);
    return response.data;
  },

  // POST /api/v1/attendance/scan
  async scanQRCode(qrToken) {
    const response = await api.post('/attendance/scan', { token: qrToken });
    return response.data;
  },
};

export default attendanceService;
