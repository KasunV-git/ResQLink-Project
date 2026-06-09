// frontend/src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import Dashboard from '../pages/citizen/Dashboard'
import Report from '../pages/citizen/Report'
import Alerts from '../pages/citizen/Alerts'
import Profile from '../pages/citizen/Profile'
import MapPage from '../pages/citizen/MapPage'

const AppRoutes = () => {
    return (
        <Routes>
            {/* Default → dashboard */}
            <Route path="/" element={<Navigate to="/citizen/dashboard" replace />} />

            {/* Auth routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<div style={{ padding: 40 }}>Login Page</div>} />
                <Route path="/register" element={<div style={{ padding: 40 }}>Register Page</div>} />
            </Route>

            {/* Citizen routes - no protection for demo */}
            <Route path="/citizen" element={<MainLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="report" element={<Report />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="map" element={<MapPage />} />
                <Route path="profile" element={<Profile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/citizen/dashboard" replace />} />
        </Routes>
    )
}

export default AppRoutes