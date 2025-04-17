import { api } from './api'

export const orderService = {
  create: (data) => api.post('/order', data),
  getAll: (params) => api.get('/order', { params }),
  getById: (id) => api.get(`/order/${id}`),
  update: (id, data) => api.put(`/order/${id}`, data),
  delete: (id) => api.delete(`/order/${id}`),
};
