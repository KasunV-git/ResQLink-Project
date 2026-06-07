// frontend/src/components/common/Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Settings, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ tabs = [] }) => {
    const { user } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <header style={styles.header}>
            {/* Tab navigation (used in dashboard, etc.) */}
            <nav style={styles.tabs}>
                {tabs.map(({ to, label }) => (
                    <Link key={to} to={to} style={styles.tab}>{label}</Link>
                ))}
            </nav>

            <div style={styles.right}>
                {/* Notification bell */}
                <Link to="/citizen/alerts" style={styles.iconBtn}>
                    <Bell size={18} />
                    <span style={styles.badge}>3</span>
                </Link>

                {/* Settings */}
                <Link to="/citizen/profile" style={styles.iconBtn}>
                    <Settings size={18} />
                </Link>

                {/* Avatar */}
                <button
                    style={styles.avatarBtn}
                    onClick={() => setShowMenu(!showMenu)}
                >
                    {user?.avatar ? (
                        <img src={user.avatar} alt="avatar" style={styles.avatar} />
                    ) : (
                        <div style={styles.avatarFallback}>
                            {user?.name?.[0] ?? 'U'}
                        </div>
                    )}
                </button>
            </div>
        </header>
    );
};

const styles = {
    header: {
        height: 56,
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    tabs: {
        display: 'flex',
        gap: 24,
    },
    tab: {
        fontSize: 14,
        fontWeight: 500,
        color: '#4a5568',
        padding: '4px 0',
        transition: 'color .18s ease',
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#4a5568',
        background: '#f7fafc',
        position: 'relative',
        transition: 'all .18s ease',
        border: '1px solid #e2e8f0',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        background: '#e53e3e',
        color: '#fff',
        fontSize: 9,
        fontWeight: 700,
        width: 16,
        height: 16,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
    },
    avatar: {
        width: 34,
        height: 34,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #1a9e7a',
    },
    avatarFallback: {
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #1a2456, #1a9e7a)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 14,
        fontFamily: "'Syne', sans-serif",
    },
};

export default Navbar;