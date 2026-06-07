// frontend/src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Layouts
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'

// Auth pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Citizen pages
import Dashboard from '../pages/citizen/Dashboard'
import Report from '../pages/citizen/Report'
import Alerts from '../pages/citizen/Alerts'
import Profile from '../pages/citizen/Profile'
import MapPage from '../pages/citizen/MapPage'

import Loader from '../components/common/Loader'

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) return <Loader fullPage />
    if (!user) return <Navigate to="/login" replace />
    return children
}

const AppRoutes = () => {
    return (
        <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Auth routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Citizen protected routes */}
            <Route
                path="/citizen"
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="report" element={<Report />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="map" element={<MapPage />} />
                <Route path="profile" element={<Profile />} />
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}

export default AppRoutes