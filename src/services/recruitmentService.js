import api from '../api/api';

export const recruitmentService = {
  // Template Management (Admin)
  getTemplate: async (bootcampId) => {
    const response = await api.get(`/recruitment/template/${bootcampId}`);
    return response.data;
  },

  saveTemplate: async (templateData) => {
    const response = await api.post('/recruitment/template', templateData);
    return response.data;
  },

  // Application Management (Admin)
  getApplications: async (params) => {
    const response = await api.get('/recruitment/applications', { params });
    return response.data;
  },

  makeDecision: async (applicationId, decision, note) => {
    const response = await api.patch(`/recruitment/decide/${applicationId}`, { decision, note });
    return response.data;
  },

  // Student Actions
  applyToBootcamp: async (bootcampId, phase1Answers) => {
    const response = await api.post('/recruitment/apply', { bootcampId, phase1Answers });
    return response.data;
  },

  submitPhase2: async (applicationId, phase2Answers) => {
    const response = await api.patch(`/recruitment/submit-phase2/${applicationId}`, { phase2Answers });
    return response.data;
  }
};
