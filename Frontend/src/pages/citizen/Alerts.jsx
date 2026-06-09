// frontend/src/pages/citizen/Alerts.jsx
import { useState, useEffect } from 'react';
import { Siren, Wind, CheckCircle2, Info, Search, Filter, BellOff, Check } from 'lucide-react';
import { getAlerts, acknowledgeAlert } from '../../api/alertApi';
import Loader from '../../components/common/Loader';

/* ── Config ── */
const SEV = {
    CRITICAL: { label: 'Critical', color: '#e53e3e', bg: '#fff5f5', border: '#fed7d7', icon: Siren },
    HIGH: { label: 'High', color: '#dd6b20', bg: '#fffaf0', border: '#fbd38d', icon: Wind },
    MODERATE: { label: 'Moderate', color: '#d69e2e', bg: '#fffff0', border: '#faf089', icon: Info },
    LOW: { label: 'Low', color: '#38a169', bg: '#f0fff4', border: '#c6f6d5', icon: CheckCircle2 },
    UPDATE: { label: 'Update', color: '#38a169', bg: '#f0fff4', border: '#c6f6d5', icon: CheckCircle2 },
    DEFAULT: { label: 'Info', color: '#3182ce', bg: '#ebf8ff', border: '#bee3f8', icon: Info },
};

const getSev = (s) => SEV[s?.toUpperCase()] || SEV.DEFAULT;

const relTime = (iso) => {
    const diff = Date.now() - new Date(iso);
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    if (m < 1440) return `${Math.floor(m / 60)}h ago`;
    return new Date(iso).toLocaleDateString();
};

/* ── Demo data (used when API empty) ── */
const DEMO = [
    { alert_id: 1, severity: 'CRITICAL', message: 'Flash Flood Warning: Zone B4 – Immediate evacuation required for coastal residents. Water levels rising rapidly at creek junction.', sent_at: new Date(Date.now() - 120000).toISOString(), acknowledged: false, channel: 'app', target_role: 'user' },
    { alert_id: 2, severity: 'HIGH', message: 'High Wind Warning: Gusts up to 60mph expected between 2:00 PM and 6:00 PM today. Secure loose outdoor items and avoid travel.', sent_at: new Date(Date.now() - 2700000).toISOString(), acknowledged: false, channel: 'sms', target_role: 'user' },
    { alert_id: 3, severity: 'MODERATE', message: 'Landslide Risk: Northern hill sectors remain at elevated risk following overnight rainfall. Residents advised to avoid roads through Sector 12.', sent_at: new Date(Date.now() - 7200000).toISOString(), acknowledged: true, channel: 'email', target_role: 'user' },
    { alert_id: 4, severity: 'UPDATE', message: 'Road Clearance: Main Street is now open for public transit and emergency vehicles. Maintenance completed successfully.', sent_at: new Date(Date.now() - 10800000).toISOString(), acknowledged: true, channel: 'app', target_role: 'user' },
    { alert_id: 5, severity: 'LOW', message: 'Weather Advisory: Light rain expected this evening. No major disruptions anticipated. Carry umbrellas if commuting after 7 PM.', sent_at: new Date(Date.now() - 86400000).toISOString(), acknowledged: true, channel: 'app', target_role: 'user' },
];

/* ─────────────── */

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Use demo data directly - no backend needed
        setAlerts(DEMO);
        setLoading(false);
    }, []);

    const handleAck = async (id) => {
        try {
            await acknowledgeAlert(id);
            setAlerts(prev => prev.map(a => a.alert_id === id ? { ...a, acknowledged: true } : a));
        } catch (_) {
            // Demo mode – just mark locally
            setAlerts(prev => prev.map(a => a.alert_id === id ? { ...a, acknowledged: true } : a));
        }
    };

    const FILTERS = ['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'UPDATE'];
    const critical = alerts.filter(a => a.severity === 'CRITICAL' && !a.acknowledged).length;
    const active = alerts.filter(a => !a.acknowledged).length;

    const visible = alerts.filter(a => {
        const matchFilter = filter === 'ALL' || a.severity === filter;
        const matchSearch = !search || a.message.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    if (loading) return <Loader fullPage />;

    return (
        <div style={s.page}>

            {/* ── Page header ── */}
            <div style={s.pageHead}>
                <div>
                    <h1 style={s.title}>Active Response Feed</h1>
                    <p style={s.sub}>
                        Real-time mission directives and critical updates. Acknowledge receipt immediately upon reading.
                    </p>
                </div>
                <div style={s.counters}>
                    {critical > 0 && <span style={s.critTag}>{critical} Critical</span>}
                    <span style={s.activeTag}>{active} Active</span>
                </div>
            </div>

            {/* ── Search + filter ── */}
            <div style={s.toolbar}>
                <div style={s.searchWrap}>
                    <Search size={15} color="#a0aec0" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search alerts..."
                        style={s.searchInput}
                    />
                </div>
                <div style={s.filterRow}>
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Alert list ── */}
            {visible.length === 0 ? (
                <div style={s.empty}>
                    <BellOff size={36} color="#cbd5e0" />
                    <p style={{ marginTop: 12, color: '#a0aec0' }}>No alerts matching your filter.</p>
                </div>
            ) : (
                <div style={s.list} className="stagger">
                    {visible.map((alert) => {
                        const cfg = getSev(alert.severity);
                        const Icon = cfg.icon;
                        const acked = alert.acknowledged;
                        return (
                            <div
                                key={alert.alert_id}
                                style={{
                                    ...s.alertCard,
                                    borderLeftColor: cfg.color,
                                    opacity: acked ? .65 : 1,
                                }}
                                className="card fade-in"
                            >
                                {/* Icon */}
                                <div style={{ ...s.alertIconWrap, background: cfg.bg }}>
                                    <Icon size={20} color={cfg.color} />
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1 }}>
                                    <div style={s.alertTop}>
                                        <span style={{ ...s.sevBadge, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                                            {cfg.label}
                                        </span>
                                        <span style={s.timeLabel}>{relTime(alert.sent_at)}</span>
                                    </div>
                                    <p style={s.alertMsg}>{alert.message}</p>
                                    <div style={s.alertMeta2}>
                                        <span style={s.metaChip}>via {alert.channel?.toUpperCase()}</span>
                                    </div>
                                </div>

                                {/* Action */}
                                <div>
                                    {acked ? (
                                        <div style={s.ackedBadge}><Check size={12} /> Acknowledged</div>
                                    ) : (
                                        <button onClick={() => handleAck(alert.alert_id)} style={s.ackBtn}>
                                            Acknowledge
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const s = {
    page: { display: 'flex', flexDirection: 'column', gap: 24 },
    pageHead: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 },
    title: { fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: '#1a202c', marginBottom: 6 },
    sub: { color: '#718096', fontSize: 14 },
    counters: { display: 'flex', gap: 8, alignItems: 'center' },
    critTag: { padding: '5px 12px', borderRadius: 999, background: '#fff5f5', color: '#e53e3e', fontSize: 12, fontWeight: 700, border: '1px solid #fed7d7' },
    activeTag: { padding: '5px 12px', borderRadius: 999, background: '#ebf8ff', color: '#3182ce', fontSize: 12, fontWeight: 700, border: '1px solid #bee3f8' },
    toolbar: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
    searchWrap: { position: 'relative', flex: 1, minWidth: 200 },
    searchInput: { width: '100%', padding: '9px 12px 9px 36px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, background: '#fff', outline: 'none', fontFamily: "'DM Sans',sans-serif" },
    filterRow: { display: 'flex', gap: 6 },
    filterBtn: { padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: '1.5px solid #e2e8f0', background: '#fff', color: '#718096', cursor: 'pointer', transition: 'all .18s ease' },
    filterActive: { background: '#1a2456', color: '#fff', borderColor: '#1a2456' },
    list: { display: 'flex', flexDirection: 'column', gap: 14 },
    alertCard: { display: 'flex', gap: 16, padding: 20, borderLeft: '4px solid transparent', alignItems: 'flex-start' },
    alertIconWrap: { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    alertTop: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 },
    sevBadge: { padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase' },
    timeLabel: { fontSize: 12, color: '#a0aec0' },
    alertMsg: { fontSize: 14, color: '#2d3748', lineHeight: 1.6, marginBottom: 8 },
    alertMeta2: { display: 'flex', gap: 8 },
    metaChip: { fontSize: 11, fontWeight: 600, color: '#718096', background: '#f7fafc', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: 6 },
    ackBtn: { padding: '8px 16px', background: '#1a2456', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
    ackedBadge: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#38a169', background: '#f0fff4', border: '1px solid #c6f6d5', padding: '6px 12px', borderRadius: 8, whiteSpace: 'nowrap' },
    empty: { padding: 60, textAlign: 'center' },
};

export default Alerts;