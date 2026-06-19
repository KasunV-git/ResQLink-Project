// frontend/src/components/common/Navbar.jsx
import { Link } from 'react-router-dom';
import { Bell, Sun, Moon, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getAlerts } from '../../api/alertApi';

const Navbar = ({ tabs = [], onMenuClick }) => {
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        getAlerts({ limit: 50 })
            .then(res => {
                const alerts = res.data?.data ?? res.data ?? [];
                const count = Array.isArray(alerts)
                    ? alerts.filter(a => a.status !== 'ACKNOWLEDGED' && a.status !== 'acknowledged').length
                    : 0;
                setUnreadCount(count);
            })
            .catch(() => setUnreadCount(0));
    }, []);

    return (
        <header className="navbar-header">
            <div className="navbar-left">
                {/* Hamburger – visible on mobile */}
                <button
                    className="hamburger-btn"
                    onClick={onMenuClick}
                    aria-label="Toggle menu"
                >
                    <Menu size={20} />
                </button>

                {/* Tab navigation */}
                <nav className="navbar-tabs">
                    {tabs.map(({ to, label }) => (
                        <Link key={to} to={to} className="navbar-tab">{label}</Link>
                    ))}
                </nav>
            </div>

            <div className="navbar-right">
                {/* Dark / Light mode toggle */}
                <button
                    className="navbar-icon-btn"
                    onClick={toggleTheme}
                    aria-label="Toggle dark mode"
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {isDark
                        ? <Sun size={18} color="#f6c90e" />
                        : <Moon size={18} />
                    }
                </button>

                {/* Notification bell */}
                <Link to="/citizen/alerts" className="navbar-icon-btn" aria-label="Alerts">
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="navbar-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                    )}
                </Link>

                {/* Profile avatar – navigates to profile page */}
                <Link
                    to="/citizen/profile"
                    className="navbar-avatar-btn"
                    aria-label="My profile"
                >
                    {user?.avatar ? (
                        <img src={user.avatar} alt="avatar" className="navbar-avatar-img" />
                    ) : (
                        <div className="navbar-avatar-fallback">
                            {user?.name?.[0] ?? 'U'}
                        </div>
                    )}
                </Link>
            </div>
        </header>
    );
};

export default Navbar;