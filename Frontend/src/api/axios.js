// frontend/src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token') || sessionStorage.getItem('resqlink_token') || localStorage.getItem('token') || localStorage.getItem('resqlink_token');
    if (token) {
        if (typeof config.headers.set === 'function') {
            config.headers.set('Authorization', `Bearer ${token}`);
        } else {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle 401 – redirect to login
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('resqlink_token');
            localStorage.removeItem('resqlink_user');
            localStorage.removeItem('resqlink_volunteer_user');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('resqlink_token');
            sessionStorage.removeItem('resqlink_user');
            sessionStorage.removeItem('resqlink_volunteer_user');
            
            if (!window.location.pathname.includes('login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(err);
    }
);

export default api;