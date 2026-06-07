// frontend/src/components/common/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, FileText, Bell, Map,
    User, HelpCircle, LogOut, ShieldAlert,
} from 'lucide-react';

const navItems = [
    { to: '/citizen/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/citizen/report', icon: FileText, label: 'Report' },
    { to: '/citizen/alerts', icon: Bell, label: 'Alerts' },
    { to: '/citizen/map', icon: Map, label: 'Map' },
    { to: '/citizen/profile', icon: User, label: 'Profile' },
];

const Sidebar = () => {
    const { user, logout } = useAuth();

    return (
        <aside style={styles.sidebar}>
            {/* Brand */}
            <div style={styles.brand}>
                <div style={styles.brandIcon}><ShieldAlert size={20} color="#fff" /></div>
                <div>
                    <div style={styles.brandName}>ResQLink</div>
                    <div style={styles.brandSub}>CITIZEN PORTAL</div>
                </div>
            </div>

            {/* Nav */}
            <nav style={styles.nav}>
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        style={({ isActive }) => ({
                            ...styles.navItem,
                            ...(isActive ? styles.navItemActive : {}),
                        })}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom actions */}
            <div style={styles.bottom}>
                <NavLink to="/citizen/support" style={styles.navItem}>
                    <HelpCircle size={18} />
                    <span>Support</span>
                </NavLink>
                <button onClick={logout} style={styles.logoutBtn}>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

const styles = {
    sidebar: {
        width: 230,
        minHeight: '100vh',
        background: '#fff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 20px 24px',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: 12,
    },
    brandIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        background: 'linear-gradient(135deg, #1a2456, #1a9e7a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    brandName: {
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        fontSize: 15,
        color: '#1a2456',
        lineHeight: 1.2,
    },
    brandSub: {
        fontSize: 9,
        fontWeight: 600,
        color: '#718096',
        letterSpacing: '1px',
    },
    nav: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: '0 12px',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 500,
        color: '#4a5568',
        transition: 'all .18s ease',
        border: 'none',
        background: 'none',
        width: '100%',
        cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
    },
    navItemActive: {
        background: 'linear-gradient(135deg, rgba(26,36,86,.08), rgba(26,158,122,.08))',
        color: '#1a2456',
        fontWeight: 600,
    },
    bottom: {
        padding: '12px 12px 0',
        borderTop: '1px solid #e2e8f0',
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 500,
        color: '#e53e3e',
        transition: 'all .18s ease',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        width: '100%',
    },
};

export default Sidebar;