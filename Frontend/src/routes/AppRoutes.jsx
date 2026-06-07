// Change this line in ProtectedRoute
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) return <Loader fullPage />
    // Temporarily comment out redirect for demo
    // if (!user) return <Navigate to="/login" replace />
    return children
}