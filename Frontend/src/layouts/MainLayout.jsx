import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const MainLayout = ({ children, user, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="citizen-portal page-wrapper" style={{ display: 'flex', height: '100vh', overflow: 'hidden', width: '100%' }}>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} onLogout={onLogout} />
            <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                <Navbar onMenuClick={() => setSidebarOpen(prev => !prev)} user={user} onLogout={onLogout} />
                <main className="page-body" style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;