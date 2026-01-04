import api from '../api';

export const stylistService = {
  async getAll() {
    const response = await api.get('/api/v1/stylists');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/api/v1/stylists/${id}`);
    return response.data;
  },

  async getSchedules(stylistId) {
    const response = await api.get(`/api/v1/stylists/${stylistId}/schedules`);
    return response.data;
  },

  async getAvailableSlots(stylistId, date, duration) {
    const response = await api.get(`/api/v1/stylists/${stylistId}/available-slots`, {
      params: { date, duration }
    });
    return response.data;
  },
};
