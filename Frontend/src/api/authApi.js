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