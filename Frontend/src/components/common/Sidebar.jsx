// frontend/src/components/common/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard, FileText, Bell, Map,
    User, HelpCircle, LogOut, ShieldAlert, X,
} from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';

const Sidebar = ({ open, onClose }) => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    const navItems = [
        { to: '/citizen/dashboard', icon: LayoutDashboard, label: t('sidebar.dashboard', 'Dashboard') },
        { to: '/citizen/report', icon: FileText, label: t('sidebar.report', 'Report') },
        { to: '/citizen/alerts', icon: Bell, label: t('sidebar.alerts', 'Alerts') },
        { to: '/citizen/map', icon: Map, label: t('sidebar.map', 'Map') },
        { to: '/citizen/profile', icon: User, label: t('sidebar.profile', 'Profile') },
    ];

    return (
        <>
            {/* Overlay on mobile */}
            {open && (
                <div className="sidebar-overlay" onClick={onClose} />
            )}

            <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
                {/* Brand + mobile close */}
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon"><ShieldAlert size={20} color="#fff" /></div>
                    <div className="sidebar-brand-text">
                        <div className="sidebar-brand-name">ResQLink</div>
                        <div className="sidebar-brand-sub">CITIZEN PORTAL</div>
                    </div>
                    {/* Close button – mobile only */}
                    <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
                        <X size={18} />
                    </button>
                </div>

                {/* Nav items */}
                <nav className="sidebar-nav">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `sidebar-nav-item${isActive ? ' sidebar-nav-active' : ''}`
                            }
                            onClick={onClose}
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom actions */}
                <div className="sidebar-bottom" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ padding: '4px 12px' }}>
                        <LanguageSwitcher />
                    </div>
                    <NavLink to="/citizen/support" className="sidebar-nav-item" onClick={onClose}>
                        <HelpCircle size={18} />
                        <span>{t('footer.support', 'Support')}</span>
                    </NavLink>
                    <button onClick={logout} className="sidebar-logout-btn">
                        <LogOut size={18} />
                        <span>{t('sidebar.signOut', 'Sign Out')}</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;