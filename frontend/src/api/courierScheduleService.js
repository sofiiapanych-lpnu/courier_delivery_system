import { api } from './api'

export const courierScheduleService = {
  create: (data) => api.post('/courier-schedule', data),
  getAll: (params) => api.get('/courier-schedule', { params }),
  getById: (id) => api.get(`/courier-schedule/${id}`),
  update: (id, data) => api.put(`/courier-schedule/${id}`, data),
  delete: (id) => api.delete(`/courier-schedule/${id}`),
};
