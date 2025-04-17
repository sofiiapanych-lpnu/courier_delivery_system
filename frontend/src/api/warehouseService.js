import { api } from './api'

export const warehouseService = {
  create: (data) => api.post('/warehouse', data),
  getAll: (params) => api.get('/warehouse', { params }),
  getById: (id) => api.get(`/warehouse/${id}`),
  update: (id, data) => api.put(`/warehouse/${id}`, data),
  delete: (id) => api.delete(`/warehouse/${id}`),
};