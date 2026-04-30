/**
 * RECRUITMENT & PIPELINE API SERVICE
 * -------------------------------------------------------------------------
 * This service controls the admission funnels and candidate state machines.
 * It handles everything from application submission to final acceptance.
 */

import api from '../api/api';

export const recruitmentService = {
  /**
   * Fetches the dynamic application template for a specific bootcamp
   */
  getTemplate: async (bootcampId) => {
    const response = await api.get(`/recruitment/template/${bootcampId}`);
    return response.data;
  },
  
  /**
   * Fetches applications for the Admin Dashboard (filtered by bootcamp/stage)
   */
  getApplications: async (params) => {
    const response = await api.get('/recruitment', { params });
    return response.data;
  },
  
  /**
   * Fetches a single application by ID
   */
  getApplication: async (applicationId) => {
    const response = await api.get(`/recruitment/${applicationId}`);
    return response.data;
  },

  /**
   * Fetches applications specifically for the logged-in student
   */
  getMyApplications: async (params) => {
    const response = await api.get('/recruitment/my-applications', { params });
    return response.data;
  },

  /**
   * Saves the dynamic application template for a specific bootcamp
   */
  saveTemplate: async (templateData) => {
    const response = await api.put(`/recruitment/template/${templateData.bootcamp}`, templateData);
    return response.data;
  },

  /**
   * Publishes the template to make it visible to students
   */
  publishTemplate: async (bootcampId) => {
    const response = await api.patch(`/recruitment/template/${bootcampId}/publish`);
    return response.data;
  },

  /**
   * Unpublishes the template
   */
  unpublishTemplate: async (bootcampId) => {
    const response = await api.patch(`/recruitment/template/${bootcampId}/unpublish`);
    return response.data;
  },

  /**
   * Submits a new phase 1 application for a student
   */
  applyToBootcamp: async (bootcampId, answers) => {
    const response = await api.post('/recruitment/apply', { bootcampId, phase1Answers: answers });
    return response.data;
  },

  /**
   * Submits the technical task for Phase 2
   */
  submitTechnicalTask: async (applicationId, answers) => {
    const response = await api.post('/recruitment/application-submit', { applicationId, ...answers });
    return response.data;
  },

  /**
   * Submits the waitlist task
   */
  submitWaitlistTask: async (applicationId, answers) => {
    const response = await api.post('/recruitment/waitlist-application-submit', { applicationId, ...answers });
    return response.data;
  },

  /**
   * Triggers a state transition for a candidate (e.g., PASS, REJECT, ACCEPT)
   */
  makeDecision: async (id, decision) => {
    const response = await api.patch(`/recruitment/${id}/decision`, { decision });
    return response.data;
  }
};

export default recruitmentService;
