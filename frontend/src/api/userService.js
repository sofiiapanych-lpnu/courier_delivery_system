import { api } from './api'

export const userService = {
  create: (data) => api.post('/user', data),
  getAll: (params) => api.get('/user', { params }),
  getById: (id) => api.get(`/user/${id}`),
  update: (id, data) => api.put(`/user/${id}`, data),
  delete: (id) => api.delete(`/user/${id}`),
};
