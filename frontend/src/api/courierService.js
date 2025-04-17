import { api } from './api'

export const courierService = {
  create: (data) => api.post('/courier', data),
  getAll: (params) => api.get('/courier', { params }),
  getById: (id) => api.get(`/courier/${id}`),
  update: (id, data) => api.put(`/courier/${id}`, data),
  delete: (id) => api.delete(`/courier/${id}`),
  getDeliveries: (courierId) => api.get(`/courier/${courierId}/deliveries`),
};
