import api from '../api';

export const bookingService = {
  async create(bookingData) {
    const response = await api.post('/api/v1/bookings', bookingData);
    return response.data;
  },

  async getMyBookings() {
    const response = await api.get('/api/v1/bookings');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/api/v1/bookings/${id}`);
    return response.data;
  },

  async cancel(id) {
    const response = await api.post(`/api/v1/bookings/${id}/cancel`);
    return response.data;
  },
};
