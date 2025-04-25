import { api } from './api'

export const clientService = {
  create: (data) => api.post('/client', data),
  getAll: (params) => api.get('/client', { params }),
  getById: (id) => api.get(`/client/${id}`),
  update: (id, data) => api.put(`/client/${id}`, data),
  delete: (id) => api.delete(`/client/${id}`),
  getDeliveries: (clientId, params) => api.get(`/client/${clientId}/deliveries`, { params }),
  getFeedbacks: (clientId, params) => api.get(`/client/${clientId}/feedbacks`, { params }),
  updateAddress: (clientId, addressDto) => api.put(`/client/${clientId}/address`, addressDto),
};
