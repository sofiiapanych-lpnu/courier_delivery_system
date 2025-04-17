import { api } from './api'

export const deliveryService = {
  create: (data) => api.post('/delivery', data),
  getAll: (params) => api.get('/delivery', { params }),
  getById: (id) => api.get(`/delivery/${id}`),
  update: (id, data) => api.put(`/delivery/${id}`, data),
  delete: (id) => api.delete(`/delivery/${id}`),
};
