// frontend/src/layouts/AuthLayout.jsx
import { Outlet } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const AuthLayout = () => (
    <div style={styles.wrapper}>
        {/* Left decorative panel */}
        <div style={styles.left}>
            <div style={styles.leftInner}>
                <div style={styles.logo}>
                    <ShieldAlert size={32} color="#fff" />
                    <span style={styles.logoText}>ResQLink</span>
                </div>
                <h1 style={styles.heroText}>
                    Connecting Communities.<br />Coordinating Response.
                </h1>
                <p style={styles.heroSub}>
                    Real-time disaster reporting, alerts, and resource coordination for a safer Sri Lanka.
                </p>
                <div style={styles.dots}>
                    {[...Array(9)].map((_, i) => (
                        <div key={i} style={{
                            ...styles.dot,
                            opacity: .2 + (i % 3) * .2,
                        }} />
                    ))}
                </div>
            </div>
        </div>

        {/* Right form area */}
        <div style={styles.right}>
            <Outlet />
        </div>
    </div>
);

const styles = {
    wrapper: {
        display: 'flex',
        minHeight: '100vh',
    },
    left: {
        flex: 1,
        background: 'linear-gradient(145deg, #111a3e 0%, #1a2456 50%, #1a9e7a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        position: 'relative',
        overflow: 'hidden',
    },
    leftInner: {
        maxWidth: 420,
        position: 'relative',
        zIndex: 1,
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 48,
    },
    logoText: {
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        fontSize: 24,
        color: '#fff',
    },
    heroText: {
        fontFamily: "'Syne', sans-serif",
        fontSize: 36,
        fontWeight: 800,
        color: '#fff',
        lineHeight: 1.25,
        marginBottom: 20,
    },
    heroSub: {
        fontSize: 16,
        color: 'rgba(255,255,255,.7)',
        lineHeight: 1.7,
    },
    dots: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginTop: 48,
        width: 60,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#fff',
    },
    right: {
        width: 480,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        background: '#f7fafc',
    },
};

export default AuthLayout;