import { useState } from 'react';
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
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
                    <button onClick={() => setShowLogoutConfirm(true)} className="sidebar-logout-btn">
                        <LogOut size={18} />
                        <span>{t('sidebar.signOut', 'Sign Out')}</span>
                    </button>
                </div>
            </aside>
            {showLogoutConfirm && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'var(--bg-card, #fff)', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '320px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', color: 'var(--text-dark, #1a202c)' }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>{t('common.confirmLogoutTitle', 'Sign Out')}</h3>
                        <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-muted, #4a5568)' }}>{t('common.confirmLogout', 'Are you sure you want to sign out?')}</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowLogoutConfirm(false)} style={{ padding: '8px 16px', border: '1px solid var(--border, #e2e8f0)', background: 'transparent', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-dark, #1a202c)', fontWeight: '600' }}>{t('common.cancel', 'Cancel')}</button>
                            <button onClick={logout} style={{ padding: '8px 16px', border: 'none', background: '#e53e3e', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>{t('sidebar.signOut', 'Sign Out')}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;