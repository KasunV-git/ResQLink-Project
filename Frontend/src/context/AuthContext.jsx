// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfile, logoutUser } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from token on mount
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