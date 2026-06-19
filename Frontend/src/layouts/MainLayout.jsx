// frontend/src/layouts/MainLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="page-wrapper">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="main-content">
                <Navbar onMenuClick={() => setSidebarOpen(prev => !prev)} />
                <main className="page-body">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;