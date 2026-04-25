/**
 * FOCUS GROUP API SERVICE
 * -------------------------------------------------------------------------
 * This service manages research clusters and mentored focus groups.
 * It ensures that Division Admins can organize their students into smaller,
 * specialized learning nodes.
 */

import api from '../api/api';

export const groupService = {
  /**
   * Fetches all groups, optionally filtered by division
   */
  getGroups: async (divisionId = '') => {
    const url = divisionId ? `/groups?division=${divisionId}` : '/groups';
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Initializes a new specialized research group
   */
  createGroup: async (groupData) => {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  /**
   * Updates group configuration or membership
   */
  updateGroup: async (id, groupData) => {
    const response = await api.put(`/groups/${id}`, groupData);
    return response.data;
  },

  /**
   * Permanently removes a group node
   */
  deleteGroup: async (id) => {
    const response = await api.delete(`/groups/${id}`);
    return response.data;
  }
};
