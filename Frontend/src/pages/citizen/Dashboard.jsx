// frontend/src/pages/citizen/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheck, Siren, Wind, CheckCircle2, ChevronRight,
    FileText, Map, Bell, TriangleAlert, Activity, Users,
    AlertOctagon, Info, UserCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAlerts } from '../../api/alertApi';
import { getMyReports } from '../../api/disasterApi';
import Loader from '../../components/common/Loader';

/* ── Demo data (used when API is unavailable) ── */
const DEMO_ALERTS = [
    {
        alert_id: 1, severity: 'CRITICAL',
        message: 'Flash Flood Warning: Zone B4 – Immediate evacuation required. Water levels rising rapidly at creek junction.',
        sent_at: new Date(Date.now() - 120000).toISOString(), acknowledged: false,
    },
    {
        alert_id: 2, severity: 'HIGH',
        message: 'High Wind Warning: Gusts up to 60mph expected between 2:00 PM and 6:00 PM. Secure loose outdoor items.',
        sent_at: new Date(Date.now() - 2700000).toISOString(), acknowledged: false,
    },
    {
        alert_id: 3, severity: 'UPDATE',
        message: 'Road Clearance Complete: Main Street is now open for transit and emergency vehicles.',
        sent_at: new Date(Date.now() - 10800000).toISOString(), acknowledged: true,
    },
];

const DEMO_REPORTS = [
    { id: 1, type: 'Flash Flood', status: 'Under Review', location: 'Zone B4' },
    { id: 2, type: 'Landslide', status: 'Resolved', location: 'Sector 12' },
    { id: 3, type: 'Road Hazard', status: 'Pending', location: 'Main Street' },
];

/* ── Severity config ── */
const SEV = {
    CRITICAL:  { color: '#e53e3e', bg: '#fff5f5',  border: '#fed7d7', dot: '#e53e3e', label: 'Critical',  icon: AlertOctagon },
    HIGH:      { color: '#dd6b20', bg: '#fffaf0',  border: '#fbd38d', dot: '#dd6b20', label: 'High',      icon: Siren },
    MODERATE:  { color: '#d69e2e', bg: '#fffff0',  border: '#faf089', dot: '#d69e2e', label: 'Moderate',  icon: Wind },
    LOW:       { color: '#38a169', bg: '#f0fff4',  border: '#c6f6d5', dot: '#38a169', label: 'Low',       icon: CheckCircle2 },
    UPDATE:    { color: '#38a169', bg: '#f0fff4',  border: '#c6f6d5', dot: '#38a169', label: 'Update',    icon: CheckCircle2 },
    DEFAULT:   { color: '#3182ce', bg: '#ebf8ff',  border: '#bee3f8', dot: '#3182ce', label: 'Info',      icon: Info },
};

const getSev = (s) => SEV[s?.toUpperCase()] ?? SEV.DEFAULT;

const relTime = (iso) => {
    const diff = Date.now() - new Date(iso);
    const m = Math.floor(diff / 60000);
    if (m < 1)   return 'Just now';
    if (m < 60)  return `${m} mins ago`;
    const h = Math.floor(m / 60);
    if (h < 24)  return `${h} hours ago`;
    return `${Math.floor(h / 24)} days ago`;
};

/* ── Overall area status derived from alerts ── */
const getAreaStatus = (alerts) => {
    if (alerts.some(a => !a.acknowledged && a.severity === 'CRITICAL'))
        return { level: 'CRITICAL', label: 'Critical Alert Active', color: '#e53e3e', bg: 'linear-gradient(135deg,#e53e3e,#c53030)', desc: 'Immediate action may be required in your area. Stay indoors and monitor updates.' };
    if (alerts.some(a => !a.acknowledged && a.severity === 'HIGH'))
        return { level: 'HIGH', label: 'High Alert', color: '#dd6b20', bg: 'linear-gradient(135deg,#dd6b20,#c05621)', desc: 'Elevated risk detected nearby. Follow official guidance and avoid affected zones.' };
    if (alerts.some(a => !a.acknowledged))
        return { level: 'MODERATE', label: 'Moderate Monitoring', color: '#d69e2e', bg: 'linear-gradient(135deg,#d69e2e,#b7791f)', desc: 'Minor activity reported in your area. Stay alert and keep emergency contacts ready.' };
    return { level: 'SAFE', label: 'Area Clear', color: '#38a169', bg: 'linear-gradient(135deg,#38a169,#276749)', desc: 'No active threats detected in your area. Continue monitoring for updates.' };
};

/* ─────────────────────── */

const Dashboard = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [alertRes, reportRes] = await Promise.allSettled([
                    getAlerts({ limit: 5 }),
                    getMyReports(),
                ]);
                setAlerts(
                    alertRes.status === 'fulfilled' && alertRes.value.data?.data?.length
                        ? alertRes.value.data.data
                        : DEMO_ALERTS
                );
                setReports(
                    reportRes.status === 'fulfilled' && reportRes.value.data?.data?.length
                        ? reportRes.value.data.data
                        : DEMO_REPORTS
                );
            } catch {
                setAlerts(DEMO_ALERTS);
                setReports(DEMO_REPORTS);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const firstName = user?.name?.split(' ')[0] ?? 'Citizen';

    const activeAlerts   = alerts.filter(a => !a.acknowledged);
    const criticalAlerts = alerts.filter(a => !a.acknowledged && a.severity === 'CRITICAL');
    const areaStatus     = getAreaStatus(alerts);

    if (loading) return <Loader fullPage />;

    return (
        <div style={s.page}>

            {/* ── Greeting ── */}
            <section style={s.greeting}>
                <div>
                    <h1 style={s.greetTitle}>{greeting}, {firstName}.</h1>
                    <p style={s.greetSub}>
                        Here's your emergency situation overview for today.
                    </p>
                </div>
                <div style={s.dateChip}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </section>

            {/* ── Disaster status banner ── */}
            <div style={{ ...s.statusBanner, background: areaStatus.bg }}>
                <div style={s.statusLeft}>
                    <div style={s.statusDot} />
                    <div>
                        <div style={s.statusLevel}>{areaStatus.label}</div>
                        <div style={s.statusDesc}>{areaStatus.desc}</div>
                    </div>
                </div>
                <div style={s.statusBadge}>{areaStatus.level}</div>
            </div>

            {/* ── Stats row ── */}
            <div style={s.statsRow} className="dash-stats-row">
                {[
                    {
                        icon: Bell, label: 'Active Alerts', value: activeAlerts.length,
                        color: activeAlerts.length > 0 ? '#e53e3e' : '#38a169',
                        bg: activeAlerts.length > 0 ? '#fff5f5' : '#f0fff4',
                        to: '/citizen/alerts',
                    },
                    {
                        icon: AlertOctagon, label: 'Critical', value: criticalAlerts.length,
                        color: '#dd6b20', bg: '#fffaf0', to: '/citizen/alerts',
                    },
                    {
                        icon: FileText, label: 'My Reports', value: reports.length,
                        color: '#3182ce', bg: '#ebf8ff', to: '/citizen/report',
                    },
                    {
                        icon: ShieldCheck, label: 'Trust Score', value: user?.trust_score ?? 84,
                        color: '#1a9e7a', bg: '#f0fff4', to: '/citizen/profile',
                    },
                ].map(({ icon: Icon, label, value, color, bg, to }) => (
                    <Link key={label} to={to} style={{ ...s.statCard, textDecoration: 'none' }} className="card">
                        <div style={{ ...s.statIcon, background: bg }}>
                            <Icon size={20} color={color} />
                        </div>
                        <div style={{ ...s.statValue, color }}>{String(value).padStart(2, '0')}</div>
                        <div style={s.statLabel}>{label}</div>
                    </Link>
                ))}
            </div>

            {/* ── Main grid: alerts feed + right column ── */}
            <div style={s.mainGrid} className="dash-main-grid">

                {/* Active alerts feed */}
                <section>
                    <div style={s.sectionHead}>
                        <h2 style={s.sectionTitle}>
                            <Bell size={16} color="#1a2456" style={{ marginRight: 8 }} />
                            Active Alerts
                            {activeAlerts.length > 0 && (
                                <span style={s.countBadge}>{activeAlerts.length}</span>
                            )}
                        </h2>
                        <Link to="/citizen/alerts" style={s.viewAll}>View all →</Link>
                    </div>

                    <div style={s.alertList}>
                        {alerts.length === 0 ? (
                            <div style={s.empty}>
                                <CheckCircle2 size={32} color="#c6f6d5" />
                                <p>No active alerts in your area.</p>
                            </div>
                        ) : (
                            alerts.slice(0, 4).map((alert) => {
                                const cfg = getSev(alert.severity);
                                const Icon = cfg.icon;
                                return (
                                    <div
                                        key={alert.alert_id}
                                        style={{
                                            ...s.alertCard,
                                            borderLeftColor: cfg.dot,
                                            opacity: alert.acknowledged ? 0.6 : 1,
                                        }}
                                        className="card"
                                    >
                                        <div style={{ ...s.alertIconWrap, background: cfg.bg }}>
                                            <Icon size={18} color={cfg.color} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={s.alertTop}>
                                                <span style={{ ...s.sevBadge, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                                                    {cfg.label}
                                                </span>
                                                <span style={s.alertTime}>{relTime(alert.sent_at)}</span>
                                            </div>
                                            <p style={s.alertMsg}>{alert.message}</p>
                                        </div>
                                        {alert.acknowledged && (
                                            <div style={s.ackedMark}>
                                                <CheckCircle2 size={14} color="#38a169" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Right column */}
                <div style={s.rightCol}>

                    {/* Quick actions */}
                    <section>
                        <h2 style={{ ...s.sectionTitle, marginBottom: 14 }}>
                            <Activity size={16} color="#1a2456" style={{ marginRight: 8 }} />
                            Quick Actions
                        </h2>
                        <div style={s.quickList}>
                            {[
                                {
                                    to: '/citizen/report',
                                    icon: TriangleAlert,
                                    label: 'Report Disaster',
                                    sub: 'Submit an emergency report',
                                    bg: '#fff5f5', color: '#e53e3e', urgent: true,
                                },
                                {
                                    to: '/citizen/alerts',
                                    icon: Bell,
                                    label: 'View Alerts',
                                    sub: `${activeAlerts.length} active alerts`,
                                    bg: '#ebf8ff', color: '#3182ce',
                                },
                                {
                                    to: '/citizen/map',
                                    icon: Map,
                                    label: 'Safety Map',
                                    sub: 'View hazard zones & shelters',
                                    bg: '#f0fff4', color: '#38a169',
                                },
                                {
                                    to: '/citizen/profile',
                                    icon: UserCircle,
                                    label: 'My Profile',
                                    sub: 'Manage your account',
                                    bg: '#e8eaf6', color: '#1a2456',
                                },
                            ].map(({ to, icon: Icon, label, sub, bg, color, urgent }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    style={{
                                        ...s.quickCard,
                                        ...(urgent ? s.quickUrgent : {}),
                                    }}
                                    className="card"
                                >
                                    <div style={{ ...s.quickIcon, background: bg }}>
                                        <Icon size={20} color={color} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={s.quickLabel}>{label}</div>
                                        <div style={s.quickSub}>{sub}</div>
                                    </div>
                                    <ChevronRight size={15} color="#a0aec0" />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* My recent reports */}
                    <section style={{ marginTop: 24 }}>
                        <div style={s.sectionHead}>
                            <h2 style={s.sectionTitle}>
                                <FileText size={16} color="#1a2456" style={{ marginRight: 8 }} />
                                My Reports
                            </h2>
                            <Link to="/citizen/report" style={s.viewAll}>Submit new →</Link>
                        </div>
                        <div style={s.reportList} className="card">
                            {reports.length === 0 ? (
                                <div style={{ ...s.empty, padding: '20px 0' }}>No reports filed yet.</div>
                            ) : (
                                reports.slice(0, 3).map((r, i) => (
                                    <div key={r.id ?? i} style={{ ...s.reportRow, borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={s.reportType}>{r.type}</div>
                                            <div style={s.reportLoc}>{r.location}</div>
                                        </div>
                                        <span style={{
                                            ...s.reportStatus,
                                            color: r.status === 'Resolved' ? '#38a169' : r.status === 'Under Review' ? '#3182ce' : '#dd6b20',
                                            background: r.status === 'Resolved' ? '#f0fff4' : r.status === 'Under Review' ? '#ebf8ff' : '#fffaf0',
                                        }}>
                                            {r.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Identity card */}
                    <section style={s.identityCard} className="card">
                        <div style={s.identityIcon}>
                            <ShieldCheck size={22} color="#1a2456" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={s.identityLabel}>Verified Citizen</div>
                            <div style={s.identityName}>{user?.name ?? 'Citizen User'}</div>
                            <div style={s.trustBarWrap}>
                                <div style={{ ...s.trustBarFill, width: `${user?.trust_score ?? 84}%` }} />
                            </div>
                            <div style={s.trustLabel}>
                                Trust Score: {user?.trust_score ?? 84}
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

/* ── Styles ── */
const s = {
    page: { display: 'flex', flexDirection: 'column', gap: 24 },

    greeting: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
    greetTitle: { fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 6 },
    greetSub: { color: 'var(--text-muted)', fontSize: 14 },
    dateChip: { padding: '6px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 99, fontSize: 13, color: 'var(--text-mid)', fontWeight: 500, whiteSpace: 'nowrap' },

    statusBanner: { borderRadius: 16, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
    statusLeft: { display: 'flex', alignItems: 'center', gap: 14 },
    statusDot: { width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,.8)', flexShrink: 0, boxShadow: '0 0 0 4px rgba(255,255,255,.3)' },
    statusLevel: { fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 2 },
    statusDesc: { fontSize: 13, color: 'rgba(255,255,255,.85)', maxWidth: 480 },
    statusBadge: { padding: '6px 16px', background: 'rgba(255,255,255,.2)', borderRadius: 99, fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '1px', border: '1px solid rgba(255,255,255,.3)', whiteSpace: 'nowrap' },

    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
    statCard: { padding: 20, textAlign: 'center', cursor: 'pointer', transition: 'transform .15s ease', display: 'block' },
    statIcon: { width: 46, height: 46, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' },
    statValue: { fontSize: 28, fontWeight: 800, marginBottom: 4, lineHeight: 1 },
    statLabel: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 },

    mainGrid: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' },

    sectionHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
    sectionTitle: { fontSize: 15, fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center' },
    countBadge: { marginLeft: 8, background: '#e53e3e', color: '#fff', borderRadius: 99, fontSize: 11, fontWeight: 700, padding: '1px 7px' },
    viewAll: { fontSize: 13, fontWeight: 600, color: '#1a9e7a', textDecoration: 'none' },

    alertList: { display: 'flex', flexDirection: 'column', gap: 12 },
    alertCard: { display: 'flex', gap: 14, padding: 16, borderLeft: '4px solid transparent', alignItems: 'flex-start', transition: 'opacity .2s' },
    alertIconWrap: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    alertTop: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' },
    sevBadge: { padding: '2px 9px', borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase' },
    alertTime: { fontSize: 12, color: 'var(--text-light)' },
    alertMsg: { fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.5, margin: 0 },
    ackedMark: { flexShrink: 0, paddingTop: 2 },

    empty: { padding: '32px 0', textAlign: 'center', color: 'var(--text-light)', fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },

    rightCol: { display: 'flex', flexDirection: 'column', gap: 0 },

    quickList: { display: 'flex', flexDirection: 'column', gap: 10 },
    quickCard: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', textDecoration: 'none', transition: 'transform .15s ease' },
    quickUrgent: { border: '1.5px solid rgba(229,62,62,.25)' },
    quickIcon: { width: 42, height: 42, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    quickLabel: { fontWeight: 600, fontSize: 14, color: 'var(--text-dark)', marginBottom: 2 },
    quickSub: { fontSize: 12, color: 'var(--text-muted)' },

    reportList: { overflow: 'hidden' },
    reportRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' },
    reportType: { fontWeight: 600, fontSize: 13, color: 'var(--text-dark)', marginBottom: 2 },
    reportLoc: { fontSize: 12, color: 'var(--text-muted)' },
    reportStatus: { padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' },

    identityCard: { display: 'flex', gap: 14, padding: 16, alignItems: 'flex-start', marginTop: 16 },
    identityIcon: { width: 44, height: 44, borderRadius: 12, background: 'rgba(26,36,86,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    identityLabel: { fontSize: 11, fontWeight: 600, color: 'var(--text-light)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 3 },
    identityName: { fontWeight: 700, fontSize: 15, color: 'var(--text-dark)', marginBottom: 8 },
    trustBarWrap: { height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 },
    trustBarFill: { height: '100%', background: 'linear-gradient(90deg, #1a2456, #1a9e7a)', borderRadius: 99, transition: 'width .5s ease' },
    trustLabel: { fontSize: 12, color: 'var(--text-muted)' },
};

export default Dashboard;
