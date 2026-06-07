// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Demo user - no backend needed
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
    const [user, setUser] = useState(DEMO_USER);

    const login = (token, userData) => setUser(userData);
    const logout = () => setUser(null);
    const refreshUser = () => { };

    return (
        <AuthContext.Provider value={{ user, loading: false, login, logout, refreshUser, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
};