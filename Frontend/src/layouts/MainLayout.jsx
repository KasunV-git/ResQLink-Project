// frontend/src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const MainLayout = () => (
    <div className="page-wrapper">
        <Sidebar />
        <div className="main-content">
            <Navbar />
            <main className="page-body">
                <Outlet />
            </main>
        </div>
    </div>
);

export default MainLayout;