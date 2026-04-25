/**
 * RECRUITMENT & PIPELINE API SERVICE
 * -------------------------------------------------------------------------
 * This service controls the admission funnels and candidate state machines.
 * It handles everything from application submission to final acceptance.
 */

import api from '../api/api';

export const recruitmentService = {
  /**
   * Submits a new phase 1 application for a student
   */
  submitApplication: async (payload) => {
    const response = await api.post('/recruitment/apply', payload);
    return response.data;
  },

  /**
   * Fetches applications for the Admin Dashboard (filtered by bootcamp/stage)
   */
  getApplications: async (params) => {
    const response = await api.get('/recruitment/applications', { params });
    return response.data;
  },

  /**
   * Triggers a state transition for a candidate (e.g., PASS, REJECT, ACCEPT)
   */
  makeDecision: async (id, decision) => {
    const response = await api.post(`/recruitment/applications/${id}/decision`, { decision });
    return response.data;
  }
};
