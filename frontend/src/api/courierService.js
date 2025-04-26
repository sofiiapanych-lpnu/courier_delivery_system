import { api } from './api'

export const courierService = {
  create: (data) => api.post('/courier', data),
  getAll: (params) => api.get('/courier', { params }),
  getById: (id) => api.get(`/courier/${id}`),
  update: (id, data) => api.put(`/courier/${id}`, data),
  delete: (id) => api.delete(`/courier/${id}`),
  getDeliveries: (courierId, params) => api.get(`/courier/${courierId}/deliveries`, { params }),
  getFeedbacks: (courierId, params) => api.get(`/courier/${courierId}/feedbacks`, { params }),
  getSchedule: (courierId, params) => api.get(`/courier/${courierId}/schedule`, { params }),
  getStatistics: (params) => api.get(`/courier/statistics`, { params }),
};
