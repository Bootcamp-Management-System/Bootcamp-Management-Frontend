import api from '../api/api';

export const announcementService = {
  getAnnouncements: async () => {
    return await api.get('/announcements');
  },
  createAnnouncement: async (data) => {
    return await api.post('/announcements', data);
  },
  deleteAnnouncement: async (id) => {
    return await api.delete(`/announcements/${id}`);
  }
};
