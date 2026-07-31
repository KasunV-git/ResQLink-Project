// frontend/src/api/disasterApi.js
import api from './axios';

export const submitReport = (form) => api.post('/disasters/report', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
});
export const getMyReports = () => api.get('/disasters/my-reports');
export const getReportById = (id) => api.get(`/disasters/report/${id}`);
export const getDisasters = (params) => api.get('/disasters', { params });
export const getNearbyHazards = (params) => api.get('/disasters/nearby', { params });