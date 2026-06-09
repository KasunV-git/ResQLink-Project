// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfile, logoutUser } from '../api/authApi';

const AuthContext = createContext(null);

// Demo user - remove this when backend login is ready
const DEMO_USER = {
    user_id: 1,
    name: 'Marcus Aurelius',
    email: 'm.aurelius@resqlink.org',
    phone_number: '+1 555-0123',
    role: 'user',
    primary_region: 'Metropolitan Sector 4',
    trust_score: 780,
    verified: true,
    reports_count: 12,
    active_alerts: 3,
    created_at: '2023-10-01',
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }
        getProfile()
            .then(({ data }) => setUser(data.data))
            .catch(() => localStorage.removeItem('token'))
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback((token, userData) => {
        localStorage.setItem('token', token);
        setUser(userData);
    }, []);

    const logout = useCallback(async () => {
        try { await logoutUser(); } catch (_) { }
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
    }, []);

    const refreshUser = useCallback(() =>
        getProfile().then(({ data }) => setUser(data.data)), []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
};