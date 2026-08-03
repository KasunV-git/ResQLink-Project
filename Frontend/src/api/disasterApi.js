// frontend/src/api/disasterApi.js
import api from './axios';

export const submitReport = (data) => {
    return api.post('/disasters/report', data);
};
export const getMyReports = () => api.get('/disasters/my-reports');
export const getReportById = (id) => api.get(`/disasters/report/${id}`);
export const getDisasters = (params) => api.get('/disasters', { params });
export const getNearbyHazards = (params) => api.get('/disasters/nearby', { params });