// frontend/src/api/authApi.js
import api from './axios';

export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (data) => api.put('/auth/profile', data);
export const uploadAvatar = (form) => api.post('/auth/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
});
export const logoutUser = () => api.post('/auth/logout');

export const getZones = () => api.get('/auth/zones');
export const addZone = (data) => api.post('/auth/zones', data);
export const toggleZoneStatus = (id, active) => api.put(`/auth/zones/${id}`, { active });
export const removeZone = (id) => api.delete(`/auth/zones/${id}`);

// Password Reset
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const verifyResetCode = (data) => api.post('/auth/verify-reset-code', data);
export const resetPassword = (data) => api.post('/auth/reset-password', data);