import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('resqlink_token') || sessionStorage.getItem('token') || localStorage.getItem('resqlink_token') || localStorage.getItem('token') || null;
  });
  const [user, setUser]   = useState(() => {
    try {
      const saved = sessionStorage.getItem('resqlink_user') || sessionStorage.getItem('resqlink_volunteer_user') || localStorage.getItem('resqlink_user') || localStorage.getItem('resqlink_volunteer_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse saved user:', e);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync token to axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // On initial mount: verify existing session with /api/auth/me if token exists
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = sessionStorage.getItem('resqlink_token') || sessionStorage.getItem('token') || localStorage.getItem('resqlink_token') || localStorage.getItem('token');
      if (!savedToken) return;

      setLoading(true);
      try {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        if (response.data?.success && response.data?.user) {
          setUser(response.data.user);
          const isAdmin = response.data.user?.role?.toLowerCase() === 'admin' || response.data.user?.role?.toLowerCase() === 'administrator';
          const storage = isAdmin ? sessionStorage : localStorage;
          storage.setItem('resqlink_user', JSON.stringify(response.data.user));
          storage.setItem('resqlink_volunteer_user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.warn('Session verification failed:', err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = (data) => {
    const userObj = data?.user ? data.user : data;
    const jwtToken = data?.token || null;
    const isAdmin = userObj?.role?.toLowerCase() === 'admin' || userObj?.role?.toLowerCase() === 'administrator';

    // Clear both to prevent crossover issues
    localStorage.removeItem('resqlink_token');
    localStorage.removeItem('token');
    localStorage.removeItem('resqlink_user');
    localStorage.removeItem('resqlink_volunteer_user');
    sessionStorage.removeItem('resqlink_token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('resqlink_user');
    sessionStorage.removeItem('resqlink_volunteer_user');

    const storage = isAdmin ? sessionStorage : localStorage;

    setUser(userObj);
    if (jwtToken) {
      setToken(jwtToken);
      storage.setItem('resqlink_token', jwtToken);
      storage.setItem('token', jwtToken);
    }
    storage.setItem('resqlink_user', JSON.stringify(userObj));
    storage.setItem('resqlink_volunteer_user', JSON.stringify(userObj));
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout').catch(() => {});
    } catch (e) {}

    setUser(null);
    setToken(null);
    localStorage.removeItem('resqlink_token');
    localStorage.removeItem('token');
    localStorage.removeItem('resqlink_user');
    localStorage.removeItem('resqlink_volunteer_user');
    sessionStorage.removeItem('resqlink_token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('resqlink_user');
    sessionStorage.removeItem('resqlink_volunteer_user');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/';
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newObj = { ...prev, ...updatedData };
      const isAdmin = newObj?.role?.toLowerCase() === 'admin' || newObj?.role?.toLowerCase() === 'administrator';
      const storage = isAdmin ? sessionStorage : localStorage;
      storage.setItem('resqlink_user', JSON.stringify(newObj));
      storage.setItem('resqlink_volunteer_user', JSON.stringify(newObj));
      return newObj;
    });
  };

  const role = user?.role ? (
    user.role.toLowerCase() === 'citizen' ? 'Citizen' :
    (user.role.toLowerCase() === 'admin' || user.role.toLowerCase() === 'administrator') ? 'Admin' : 'Volunteer'
  ) : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        updateUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;