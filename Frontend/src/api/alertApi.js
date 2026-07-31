// frontend/src/api/alertApi.js
import api from './axios';

export const getAlerts = (params) => api.get('/alerts', { params });
export const acknowledgeAlert = (id) => api.post(`/alerts/${id}/acknowledge`);
export const getAlertById = (id) => api.get(`/alerts/${id}`);