import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const MainLayout = ({ children, user, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="page-wrapper">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} onLogout={onLogout} />
            <div className="main-content">
                <Navbar onMenuClick={() => setSidebarOpen(prev => !prev)} user={user} onLogout={onLogout} />
                <main className="page-body">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;