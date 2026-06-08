// frontend/src/pages/citizen/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheck, Siren, Wind, CheckCircle2,
    ChevronRight, FileText, Map, BookOpen, TriangleAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAlerts } from '../../api/alertApi';
import { getMyReports } from '../../api/disasterApi';
import Loader from '../../components/common/Loader';

/* ── Severity config ── */
const severityConfig = {
    'EXTREME SEVERITY': { color: '#e53e3e', bg: '#fff5f5', dot: '#e53e3e' },
    'MODERATE ALERT': { color: '#dd6b20', bg: '#fffaf0', dot: '#dd6b20' },
    UPDATE: { color: '#38a169', bg: '#f0fff4', dot: '#38a169' },
    DEFAULT: { color: '#3182ce', bg: '#ebf8ff', dot: '#3182ce' },
};

const getSeverityStyle = (s) => severityConfig[s?.toUpperCase()] || severityConfig.DEFAULT;

/* ── Relative time helper ── */
const relTime = (iso) => {
    const diff = Date.now() - new Date(iso);
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m} mins ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hours ago`;
    return `${Math.floor(h / 24)} days ago`;
};

/* ── Alert icon map ── */
const alertIcon = (severity) => {
    if (severity === 'EXTREME SEVERITY') return <Siren size={18} color="#e53e3e" />;
    if (severity === 'MODERATE ALERT') return <Wind size={18} color="#dd6b20" />;
    return <CheckCircle2 size={18} color="#38a169" />;
};

/* ─────────────────────────── */

const Dashboard = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load data - if backend offline, just show demo data
        Promise.allSettled([getAlerts({ limit: 3 }), getMyReports()])
            .then(([alertRes, repRes]) => {
                if (alertRes.status === 'fulfilled') {
                    setAlerts(alertRes.value.data.data || []);
                }
                if (repRes.status === 'fulfilled') {
                    setReports(repRes.value.data.data || []);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    if (loading) return <Loader fullPage />;

    return (
        <div style={s.page}>

            {/* ── Hero greeting ── */}
            <section style={s.hero}>
                <div>
                    <h1 style={s.heroTitle}>{greeting}, Citizen {user?.name?.split(' ')[0] ?? 'User'}.</h1>
                    <p style={s.heroSub}>
                        The sentinel is active. Your local area is currently under moderate observation.
                        Stay informed, stay safe.
                    </p>
                </div>
            </section>

            {/* ── Action strip ── */}
            <div style={s.actionStrip}>
                {/* Report disaster CTA */}
                <div style={s.reportCard} className="card">
                    <div>
                        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, color: '#1a202c', marginBottom: 4 }}>
                            Immediate Assistance
                        </h3>
                        <p style={{ color: '#718096', fontSize: 13 }}>
                            Spotted a hazard or emergency? Inform the network instantly.
                        </p>
                    </div>
                    <Link to="/citizen/report" style={s.reportBtn}>
                        <TriangleAlert size={20} />
                        Report Disaster
                    </Link>
                </div>

                {/* Identity card */}
                <div style={s.identityCard} className="card">
                    <div style={s.identityIcon}><ShieldCheck size={22} color="#1a2456" /></div>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#718096', letterSpacing: '.5px', marginBottom: 2 }}>
                            Verified Identity
                        </div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, color: '#1a202c' }}>
                            {user?.name ?? 'Marcus Aurelius'}
                        </div>
                        <div style={s.trustBar}>
                            <div style={s.trustFill} />
                        </div>
                        <div style={{ fontSize: 12, color: '#718096', marginTop: 4 }}>
                            Trust Score: {user?.trustScore ?? 780} (Elite Respondee)
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom grid: alerts + quick nav ── */}
            <div style={s.grid}>

                {/* Recent Alerts */}
                <section>
                    <div style={s.sectionHeader}>
                        <h2 style={s.sectionTitle}>Recent Alerts</h2>
                        <Link to="/citizen/alerts" style={s.viewAll}>View All →</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {alerts.length === 0 && (
                            <div style={s.empty}>No active alerts in your area.</div>
                        )}
                        {alerts.map((alert) => {
                            const cfg = getSeverityStyle(alert.severity);
                            return (
                                <div key={alert.alert_id} style={{ ...s.alertCard, borderLeftColor: cfg.dot }} className="card fade-in">
                                    <div style={{ ...s.alertIconWrap, background: cfg.bg }}>
                                        {alertIcon(alert.severity)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={s.alertMeta}>
                                            <span style={{ ...s.severityLabel, color: cfg.color }}>{alert.severity}</span>
                                            <span style={s.alertTime}>{relTime(alert.sent_at)}</span>
                                        </div>
                                        <div style={s.alertTitle}>{alert.message?.split('.')[0]}</div>
                                        <div style={s.alertBody}>{alert.message}</div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Demo alerts when API is empty */}
                        {alerts.length === 0 && [
                            { id: 1, severity: 'EXTREME SEVERITY', title: 'River Level Alert: Zone B4', body: 'Immediate evacuation required for coastal residents in Zone B4. Water levels rising rapidly.', time: '2 mins ago' },
                            { id: 2, severity: 'MODERATE ALERT', title: 'High Wind Warning', body: 'Gusts up to 60mph expected between 2:00 PM and 6:00 PM today. Secure loose outdoor items.', time: '45 mins ago' },
                            { id: 3, severity: 'UPDATE', title: 'Road Clearance: Main St', body: 'Maintenance completed. Main Street is now open for public transit and emergency vehicles.', time: '3 hours ago' },
                        ].map((a) => {
                            const cfg = getSeverityStyle(a.severity);
                            return (
                                <div key={a.id} style={{ ...s.alertCard, borderLeftColor: cfg.dot }} className="card fade-in">
                                    <div style={{ ...s.alertIconWrap, background: cfg.bg }}>
                                        {alertIcon(a.severity)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={s.alertMeta}>
                                            <span style={{ ...s.severityLabel, color: cfg.color }}>{a.severity}</span>
                                            <span style={s.alertTime}>{a.time}</span>
                                        </div>
                                        <div style={s.alertTitle}>{a.title}</div>
                                        <div style={s.alertBody}>{a.body}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Quick Navigation */}
                <section>
                    <h2 style={{ ...s.sectionTitle, marginBottom: 16 }}>Quick Navigation</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { to: '/citizen/report', icon: FileText, label: 'My Reports', sub: `Track status of your ${reports.length || 3} reports`, bg: '#e8eaf6' },
                            { to: '/citizen/map', icon: Map, label: 'Safety Map', sub: 'Explore safe zones and hazards', bg: '#e3f2fd' },
                            { to: '/citizen/resources', icon: BookOpen, label: 'Resources', sub: 'Guides, supply kits, and kits', bg: '#fff3e0' },
                        ].map(({ to, icon: Icon, label, sub, bg }) => (
                            <Link key={to} to={to} style={s.quickCard} className="card">
                                <div style={{ ...s.quickIcon, background: bg }}>
                                    <Icon size={20} color="#1a2456" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={s.quickLabel}>{label}</div>
                                    <div style={s.quickSub}>{sub}</div>
                                </div>
                                <ChevronRight size={16} color="#a0aec0" />
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

/* ── Styles ── */
const s = {
    page: { display: 'flex', flexDirection: 'column', gap: 24 },
    hero: {},
    heroTitle: { fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: '#1a202c', marginBottom: 8 },
    heroSub: { color: '#718096', fontSize: 15, maxWidth: 560 },
    actionStrip: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 20 },
    reportCard: { padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' },
    reportBtn: {
        display: 'flex', alignItems: 'center', gap: 8, padding: '13px 24px',
        background: 'linear-gradient(135deg, #1a9e7a, #147a5f)', color: '#fff',
        borderRadius: 12, fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans',sans-serif",
        whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(26,158,122,.35)',
        transition: 'all .2s ease',
    },
    identityCard: { padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start', minWidth: 240 },
    identityIcon: { width: 48, height: 48, borderRadius: 12, background: 'rgba(26,36,86,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    trustBar: { height: 3, background: '#e2e8f0', borderRadius: 99, marginTop: 6, overflow: 'hidden' },
    trustFill: { height: '100%', width: '78%', background: 'linear-gradient(90deg, #1a2456, #1a9e7a)', borderRadius: 99 },
    grid: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' },
    sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    sectionTitle: { fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: '#1a202c' },
    viewAll: { fontSize: 13, fontWeight: 600, color: '#1a9e7a' },
    alertCard: { display: 'flex', gap: 14, padding: 16, borderLeft: '4px solid transparent', alignItems: 'flex-start' },
    alertIconWrap: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    alertMeta: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    severityLabel: { fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' },
    alertTime: { fontSize: 12, color: '#a0aec0' },
    alertTitle: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: '#1a202c', marginBottom: 4 },
    alertBody: { fontSize: 13, color: '#718096', lineHeight: 1.5 },
    quickCard: { display: 'flex', alignItems: 'center', gap: 14, padding: 16 },
    quickIcon: { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    quickLabel: { fontWeight: 600, fontSize: 14, color: '#1a202c', marginBottom: 2 },
    quickSub: { fontSize: 12, color: '#718096' },
    empty: { padding: 20, textAlign: 'center', color: '#a0aec0', fontSize: 14 },
};

export default Dashboard;