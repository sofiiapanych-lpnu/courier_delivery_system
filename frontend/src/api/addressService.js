import { api } from './api'

export const addressService = {
  create: (data) => api.post('/address', data),
  getAll: (params) => api.get('/address', { params }),
  getById: (id) => api.get(`/address/${id}`),
  update: (id, data) => api.put(`/address/${id}`, data),
  delete: (id) => api.delete(`/address/${id}`),
};
