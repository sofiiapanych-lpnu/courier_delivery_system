import { api } from './api'

export const vehicleService = {
  create: (data) => api.post('/vehicle', data),
  getAll: (params) => api.get('/vehicle', { params }),
  getById: (id) => api.get(`/vehicle/${id}`),
  update: (id, data) => api.put(`/vehicle/${id}`, data),
  delete: (id) => api.delete(`/vehicle/${id}`),
};