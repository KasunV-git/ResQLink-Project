// frontend/src/components/common/Loader.jsx
const Loader = ({ size = 40, fullPage = false }) => {
    const spinner = (
        <div style={{
            width: size,
            height: size,
            border: `3px solid #e2e8f0`,
            borderTop: `3px solid #1a9e7a`,
            borderRadius: '50%',
            animation: 'spin .7s linear infinite',
        }} />
    );

    if (fullPage) return (
        <div style={{
            position: 'fixed', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,.8)', zIndex: 9999,
        }}>
            {spinner}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <>
            {spinner}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
    );
};

export default Loader;