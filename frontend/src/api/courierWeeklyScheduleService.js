import { api } from './api'

export const courierWeeklyScheduleService = {
  create: (data) => api.post('/courier-weekly-schedule', data),
  getAll: (params) => api.get('/courier-weekly-schedule', { params }),
  getById: (id) => api.get(`/courier-weekly-schedule/${id}`),
  update: (id, data) => api.put(`/courier-weekly-schedule/${id}`, data),
  delete: (id) => api.delete(`/courier-weekly-schedule/${id}`),
};
