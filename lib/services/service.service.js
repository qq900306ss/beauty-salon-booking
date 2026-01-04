import api from '../api';

export const serviceService = {
  async getAll() {
    const response = await api.get('/api/v1/services');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/api/v1/services/${id}`);
    return response.data;
  },
};
