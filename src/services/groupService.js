import api from './api';

export const groupService = {
  getGroups: async (divisionId = '') => {
    const url = divisionId ? `/groups?division=${divisionId}` : '/groups';
    const response = await api.get(url);
    return response.data;
  },

  createGroup: async (groupData) => {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  updateGroup: async (id, groupData) => {
    const response = await api.put(`/groups/${id}`, groupData);
    return response.data;
  },

  deleteGroup: async (id) => {
    const response = await api.delete(`/groups/${id}`);
    return response.data;
  }
};
