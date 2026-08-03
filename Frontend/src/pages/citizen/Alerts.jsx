// frontend/src/pages/citizen/Alerts.jsx
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Siren, Wind, CheckCircle2, Info, Search, BellOff,
    Check, RefreshCw, ChevronDown, ChevronUp, Copy,
    AlertOctagon, Clock, Radio, Mail, Smartphone, Bell,
    CheckCheck, SlidersHorizontal, Droplets, Flame, MountainSnow,
    Building2, Stethoscope, FlaskConical, HelpCircle, TriangleAlert,
} from 'lucide-react';
import { getAlerts, acknowledgeAlert } from '../../api/alertApi';
import Loader from '../../components/common/Loader';

/* ── Severity config ── */
const SEV = {
    CRITICAL: { label: 'Critical', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', icon: AlertOctagon,  priority: 1 },
    HIGH:     { label: 'High',     color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', border: '#f97316', icon: Siren,         priority: 2 },
    MODERATE: { label: 'Moderate', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', border: '#eab308', icon: Wind,          priority: 3 },
    LOW:      { label: 'Low',      color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', border: '#22c55e', icon: CheckCircle2,  priority: 4 },
    UPDATE:   { label: 'Update',   color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', icon: CheckCircle2,  priority: 5 },
    DEFAULT:  { label: 'Info',     color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', border: '#8b5cf6', icon: Info,          priority: 6 },
};
const getSev = (s) => SEV[s?.toUpperCase()] ?? SEV.DEFAULT;

/* ── Channel icon map ── */
const ChannelIcon = ({ ch }) => {
    if (ch === 'sms')   return <Smartphone size={12} />;
    if (ch === 'email') return <Mail size={12} />;
    if (ch === 'radio') return <Radio size={12} />;
    return <Bell size={12} />;
};

/* ── Time helpers ── */
const relTime = (iso, fallbackIso) => {
    const validIso = iso || fallbackIso;
    if (!validIso) return 'Just now';
    const date = new Date(validIso);
    if (isNaN(date.getTime())) return 'Just now';
    
    const diff = Date.now() - date.getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)   return 'Just now';
    if (m < 60)  return `${m}m ago`;
    if (m < 1440) return `${Math.floor(m / 60)}h ago`;
    return `${Math.floor(m / 1440)}d ago`;
};

/* ── Disaster types with icons ── */
const DISASTER_TYPES = [
    { value: 'Flash Flood',       icon: Droplets,     color: '#3182ce', bg: '#ebf8ff', defaultSev: 'HIGH' },
    { value: 'Landslide',         icon: MountainSnow, color: '#dd6b20', bg: '#fffaf0', defaultSev: 'HIGH' },
    { value: 'Fire',              icon: Flame,        color: '#e53e3e', bg: '#fff5f5', defaultSev: 'CRITICAL' },
    { value: 'Cyclone / Winds',   icon: Wind,         color: '#805ad5', bg: '#faf5ff', defaultSev: 'HIGH' },
    { value: 'Building Collapse', icon: Building2,    color: '#744210', bg: '#fefcbf', defaultSev: 'CRITICAL' },
    { value: 'Medical Emergency', icon: Stethoscope,  color: '#319795', bg: '#e6fffa', defaultSev: 'HIGH' },
    { value: 'Chemical Spill',    icon: FlaskConical, color: '#2d3748', bg: '#edf2f7', defaultSev: 'CRITICAL' },
    { value: 'Earthquake',        icon: TriangleAlert,color: '#c05621', bg: '#fffaf0', defaultSev: 'CRITICAL' },
    { value: 'Other',             icon: HelpCircle,   color: '#718096', bg: '#f7fafc', defaultSev: 'MODERATE' },
];

const getDisasterType = (message) => {
    if (!message) return DISASTER_TYPES.find(d => d.value === 'Other');
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('flash flood') || lowerMsg.includes('flood')) return DISASTER_TYPES.find(d => d.value === 'Flash Flood');
    if (lowerMsg.includes('landslide')) return DISASTER_TYPES.find(d => d.value === 'Landslide');
    if (lowerMsg.includes('fire')) return DISASTER_TYPES.find(d => d.value === 'Fire');
    if (lowerMsg.includes('cyclone') || lowerMsg.includes('wind')) return DISASTER_TYPES.find(d => d.value === 'Cyclone / Winds');
    if (lowerMsg.includes('collapse')) return DISASTER_TYPES.find(d => d.value === 'Building Collapse');
    if (lowerMsg.includes('medical')) return DISASTER_TYPES.find(d => d.value === 'Medical Emergency');
    if (lowerMsg.includes('chemical')) return DISASTER_TYPES.find(d => d.value === 'Chemical Spill');
    if (lowerMsg.includes('earthquake')) return DISASTER_TYPES.find(d => d.value === 'Earthquake');
    return DISASTER_TYPES.find(d => d.value === 'Other');
};

const fullTime = (iso) =>
    new Date(iso).toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

/* ── Demo data ── */
const DEMO = [
    {
        alert_id: 1, severity: 'CRITICAL',
        message: 'Flash Flood Warning: Zone B4 – Immediate evacuation required for coastal residents. Water levels rising rapidly at creek junction. All Zone B4 residents must move to the Kandy Primary School evacuation center immediately.',
        sent_at: new Date(Date.now() - 120000).toISOString(),
        acknowledged: false, channel: 'app', target_role: 'user',
        location: 'Zone B4, Coastal District',
        instructions: 'Evacuate immediately via Main Road North. Do not use bridge access roads. Emergency shelters open at Kandy Primary School and Community Hall.',
    },
    {
        alert_id: 2, severity: 'HIGH',
        message: 'High Wind Warning: Gusts up to 60mph expected between 2:00 PM and 6:00 PM today. Secure loose outdoor items and avoid unnecessary travel.',
        sent_at: new Date(Date.now() - 2700000).toISOString(),
        acknowledged: false, channel: 'sms', target_role: 'user',
        location: 'City-wide',
        instructions: 'Secure all outdoor furniture and equipment. Avoid driving high-profile vehicles. Stay indoors during peak gusts.',
    },
    {
        alert_id: 3, severity: 'MODERATE',
        message: 'Landslide Risk: Northern hill sectors remain at elevated risk following overnight rainfall. Residents advised to avoid roads through Sector 12.',
        sent_at: new Date(Date.now() - 7200000).toISOString(),
        acknowledged: true, channel: 'email', target_role: 'user',
        location: 'Sector 12, Northern Hills',
        instructions: 'Avoid hill roads in Sector 12. Monitor official channels for updates. Report any ground movement to emergency services.',
    },
    {
        alert_id: 4, severity: 'UPDATE',
        message: 'Road Clearance Complete: Main Street is now open for public transit and emergency vehicles. Maintenance has been completed successfully.',
        sent_at: new Date(Date.now() - 10800000).toISOString(),
        acknowledged: true, channel: 'app', target_role: 'user',
        location: 'Main Street',
        instructions: 'Normal traffic flow has resumed. Emergency vehicles have priority access.',
    },
    {
        alert_id: 5, severity: 'LOW',
        message: 'Weather Advisory: Light rain expected this evening from 6 PM onward. No major disruptions anticipated. Carry umbrellas if commuting after 7 PM.',
        sent_at: new Date(Date.now() - 86400000).toISOString(),
        acknowledged: true, channel: 'app', target_role: 'user',
        location: 'District-wide',
        instructions: 'No action required. Stay updated via local weather services.',
    },
    {
        alert_id: 6, severity: 'HIGH',
        message: 'Chemical Plant Incident: Controlled fire reported at industrial complex near Zone C2. 500m exclusion zone enforced. Emergency teams on site.',
        sent_at: new Date(Date.now() - 5400000).toISOString(),
        acknowledged: false, channel: 'radio', target_role: 'user',
        location: 'Zone C2, Industrial Area',
        instructions: 'Stay at least 500m away from the industrial complex. Close windows and doors if in the vicinity. Follow instructions from emergency personnel.',
    },
];

/* ── Sort options ── */
const SORT_OPTIONS = [
    { value: 'newest',   label: 'Newest First' },
    { value: 'oldest',   label: 'Oldest First' },
    { value: 'severity', label: 'By Severity' },
];

/* ─────────────────────── */

const Alerts = () => {
    const [alerts, setAlerts]     = useState([]);
    const [loading, setLoading]   = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [tab, setTab]           = useState('ALL');       // ALL | UNREAD | ACKNOWLEDGED
    const [sevFilter, setSevFilter] = useState('ALL');
    const [search, setSearch]     = useState('');
    const [sort, setSort]         = useState('newest');
    const [expanded, setExpanded] = useState(null);        // alert_id
    const [copied, setCopied]     = useState(null);
    const [showSort, setShowSort] = useState(false);
    const [nowTick, setNowTick]   = useState(Date.now());

    // Live ticker for relative times
    useEffect(() => {
        const timer = setInterval(() => setNowTick(Date.now()), 60000);
        return () => clearInterval(timer);
    }, []);

    const fetchAlerts = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            const res = await getAlerts({ limit: 50 });
            const data = res.data?.data ?? res.data;
            if (Array.isArray(data) && data.length > 0) {
                setAlerts(data.map(a => ({ ...a, alert_id: a.id || a.alert_id })));
            } else {
                setAlerts(DEMO);
            }
        } catch {
            setAlerts(DEMO);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

    /* ── Acknowledge single ── */
    const handleAck = async (id, e) => {
        e.stopPropagation();
        try { await acknowledgeAlert(id); } catch { /* demo mode */ }
        setAlerts(prev => prev.map(a => a.alert_id === id ? { ...a, acknowledged: true } : a));
    };

    /* ── Acknowledge all visible unread ── */
    const handleAckAll = async () => {
        const unread = visible.filter(a => !a.acknowledged);
        await Promise.allSettled(unread.map(a => acknowledgeAlert(a.alert_id)));
        const ids = new Set(unread.map(a => a.alert_id));
        setAlerts(prev => prev.map(a => ids.has(a.alert_id) ? { ...a, acknowledged: true } : a));
    };

    /* ── Copy message ── */
    const handleCopy = (alert, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`[${alert.severity}] ${alert.message}`);
        setCopied(alert.alert_id);
        setTimeout(() => setCopied(null), 2000);
    };

    /* ── Counts ── */
    const getAlertFinalSev = (a) => {
        const disCfg = getDisasterType(a.message);
        const backendSevStr = (a.severity || a.priority || '').toUpperCase();
        const isValidSev = SEV[backendSevStr] && backendSevStr !== 'DEFAULT';
        return isValidSev ? backendSevStr : disCfg.defaultSev;
    };

    const total       = alerts.length;
    const unreadCount = alerts.filter(a => !a.acknowledged).length;
    const critCount   = alerts.filter(a => getAlertFinalSev(a) === 'CRITICAL' && !a.acknowledged).length;
    const highCount   = alerts.filter(a => getAlertFinalSev(a) === 'HIGH' && !a.acknowledged).length;

    /* ── Filter + sort pipeline ── */
    const visible = alerts
        .filter(a => {
            if (tab === 'UNREAD')        return !a.acknowledged;
            if (tab === 'ACKNOWLEDGED')  return  a.acknowledged;
            return true;
        })
        .filter(a => sevFilter === 'ALL' || getAlertFinalSev(a) === sevFilter)
        .filter(a => !search || a.message.toLowerCase().includes(search.toLowerCase()) || a.location?.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (a.acknowledged !== b.acknowledged) return a.acknowledged ? 1 : -1;
            const timeA = new Date(a.time || a.sent_at || a.created_at || a.timestamp);
            const timeB = new Date(b.time || b.sent_at || b.created_at || b.timestamp);
            if (sort === 'newest')   return timeB - timeA;
            if (sort === 'oldest')   return timeA - timeB;
            if (sort === 'severity') return getSev(getAlertFinalSev(a)).priority - getSev(getAlertFinalSev(b)).priority;
            return 0;
        });

    const { t } = useTranslation();
    const unreadVisible = visible.filter(a => !a.acknowledged).length;

    if (loading) return <Loader fullPage />;

    return (
        <div style={s.page}>

            {/* ── Page header ── */}
            <div style={s.pageHead}>
                <div>
                    <h1 style={s.title}>{t('citizen.alertsTitle', 'Alert Feed')}</h1>
                    <p style={s.sub}>{t('citizen.alertsSubtitle', 'Real-time emergency alerts and directives for your area.')}</p>
                </div>
                <div style={s.headerActions}>
                    {unreadVisible > 0 && (
                        <button onClick={handleAckAll} style={s.ackAllBtn}>
                            <CheckCheck size={14} />
                            Acknowledge All
                        </button>
                    )}
                    <button
                        onClick={() => fetchAlerts(true)}
                        style={s.refreshBtn}
                        disabled={refreshing}
                    >
                        <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                        {refreshing ? 'Refreshing…' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* ── Stats summary bar ── */}
            <div style={s.statsBar} className="card">
                {[
                    { label: 'Total',    value: total,      color: '#4a5568', bg: 'transparent' },
                    { label: 'Unread',   value: unreadCount, color: '#3182ce', bg: '#ebf8ff' },
                    { label: 'Critical', value: critCount,   color: '#e53e3e', bg: '#fff5f5' },
                    { label: 'High',     value: highCount,   color: '#dd6b20', bg: '#fffaf0' },
                ].map(({ label, value, color, bg }) => (
                    <div key={label} style={{ ...s.statItem, background: bg }}>
                        <span style={{ ...s.statVal, color }}>{value}</span>
                        <span style={s.statLbl}>{label}</span>
                    </div>
                ))}
            </div>

            {/* ── Tabs ── */}
            <div style={s.tabs}>
                {[
                    { key: 'ALL',          label: 'All Alerts',     count: total },
                    { key: 'UNREAD',       label: 'Unread',         count: unreadCount },
                    { key: 'ACKNOWLEDGED', label: 'Acknowledged',   count: total - unreadCount },
                ].map(({ key, label, count }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        style={{ ...s.tab, ...(tab === key ? s.tabActive : {}) }}
                    >
                        {label}
                        <span style={{ ...s.tabCount, ...(tab === key ? s.tabCountActive : {}) }}>
                            {count}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Toolbar: search + severity filter + sort ── */}
            <div style={s.toolbar} className="alerts-toolbar">
                {/* Search */}
                <div style={s.searchWrap}>
                    <Search size={14} color="#a0aec0" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search alerts or locations…"
                        style={s.searchInput}
                    />
                    {search && (
                        <button onClick={() => setSearch('')} style={s.clearBtn}>✕</button>
                    )}
                </div>

                {/* Severity filter pills */}
                <div style={s.filterRow} className="alerts-filter-row">
                    {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map(f => {
                        const cfg = f !== 'ALL' ? getSev(f) : null;
                        return (
                            <button
                                key={f}
                                onClick={() => setSevFilter(f)}
                                style={{
                                    ...s.filterBtn,
                                    ...(sevFilter === f ? {
                                        background: cfg ? cfg.color : '#1a2456',
                                        color: '#fff',
                                        borderColor: cfg ? cfg.color : '#1a2456',
                                    } : {}),
                                }}
                            >
                                {f}
                            </button>
                        );
                    })}
                </div>

                {/* Sort dropdown */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowSort(v => !v)}
                        style={s.sortBtn}
                    >
                        <SlidersHorizontal size={13} />
                        {SORT_OPTIONS.find(o => o.value === sort)?.label}
                        <ChevronDown size={12} />
                    </button>
                    {showSort && (
                        <div style={s.sortDropdown}>
                            {SORT_OPTIONS.map(o => (
                                <button
                                    key={o.value}
                                    onClick={() => { setSort(o.value); setShowSort(false); }}
                                    style={{ ...s.sortOption, ...(sort === o.value ? s.sortOptionActive : {}) }}
                                >
                                    {o.value === sort && <Check size={12} />}
                                    {o.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Results count ── */}
            <div style={s.resultsRow}>
                <span style={s.resultsCount}>
                    {visible.length} alert{visible.length !== 1 ? 's' : ''} shown
                    {search && ` for "${search}"`}
                </span>
                {(search || sevFilter !== 'ALL' || tab !== 'ALL') && (
                    <button
                        onClick={() => { setSearch(''); setSevFilter('ALL'); setTab('ALL'); }}
                        style={s.clearFilters}
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* ── Alert list ── */}
            {visible.length === 0 ? (
                <div style={s.empty}>
                    <BellOff size={40} color="#cbd5e0" />
                    <p style={s.emptyTitle}>No alerts found</p>
                    <p style={s.emptySub}>
                        {search ? `No results for "${search}"` : 'No alerts in this category.'}
                    </p>
                </div>
            ) : (
                <div style={s.list}>
                    {visible.map((alert) => {
                        const disCfg = getDisasterType(alert.message);
                        
                        // Determine severity: Use backend severity if valid, otherwise fallback to disaster type's default
                        const backendSevStr = (alert.severity || alert.priority || '').toUpperCase();
                        const isValidSev = SEV[backendSevStr] && backendSevStr !== 'DEFAULT';
                        const finalSevStr = isValidSev ? backendSevStr : disCfg.defaultSev;
                        const cfg = getSev(finalSevStr);
                        
                        const Icon = disCfg.icon;
                        const acked   = alert.acknowledged;
                        const isOpen  = expanded === alert.alert_id;

                        return (
                            <div
                                key={alert.alert_id}
                                style={{
                                    ...s.alertCard,
                                    borderLeftColor: acked ? '#cbd5e0' : cfg.color,
                                    opacity: acked ? 0.72 : 1,
                                }}
                                className="card"
                            >
                                {/* ── Main row ── */}
                                <div
                                    style={s.alertMain}
                                    onClick={() => setExpanded(isOpen ? null : alert.alert_id)}
                                    role="button"
                                >
                                    {/* Icon */}
                                    <div style={{ ...s.alertIconWrap, background: acked ? 'var(--bg-hover)' : cfg.bg }}>
                                        <Icon size={20} color={acked ? '#a0aec0' : cfg.color} />
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={s.alertTopRow}>
                                            <span style={{
                                                ...s.sevBadge,
                                                color: acked ? '#718096' : cfg.color,
                                                background: acked ? 'var(--bg-hover)' : cfg.bg,
                                                border: `1px solid ${acked ? 'var(--border)' : cfg.border}`,
                                            }}>
                                                {cfg.label}
                                            </span>
                                            <span style={s.channelChip}>
                                                <ChannelIcon ch={alert.channel} />
                                                {alert.channel?.toUpperCase() ?? 'APP'}
                                            </span>
                                            <span style={s.timeLabel}>
                                                <Clock size={11} />
                                                {relTime(alert.time, alert.sent_at || alert.created_at || alert.timestamp)}
                                            </span>
                                        </div>
                                        <p style={s.alertMsg}>{alert.message}</p>
                                        {alert.location && (
                                            <p style={s.locationLabel}>📍 {alert.location}</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div style={s.alertActions} onClick={e => e.stopPropagation()}>
                                        {/* Copy */}
                                        <button
                                            onClick={(e) => handleCopy(alert, e)}
                                            style={s.iconBtn}
                                            title="Copy alert"
                                        >
                                            {copied === alert.alert_id
                                                ? <Check size={14} color="#38a169" />
                                                : <Copy size={14} color="#a0aec0" />}
                                        </button>

                                        {/* Acknowledge */}
                                        {acked ? (
                                            <div style={s.ackedBadge}>
                                                <Check size={12} /> Done
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => handleAck(alert.alert_id, e)}
                                                style={s.ackBtn}
                                            >
                                                Acknowledge
                                            </button>
                                        )}

                                        {/* Expand toggle */}
                                        <button
                                            style={s.iconBtn}
                                            onClick={() => setExpanded(isOpen ? null : alert.alert_id)}
                                            title={isOpen ? 'Collapse' : 'Expand'}
                                        >
                                            {isOpen
                                                ? <ChevronUp size={16} color="#718096" />
                                                : <ChevronDown size={16} color="#718096" />}
                                        </button>
                                    </div>
                                </div>

                                {/* ── Expanded detail panel ── */}
                                {isOpen && (
                                    <div style={s.expandPanel}>
                                        <div style={s.expandGrid}>
                                            {/* Full timestamp */}
                                            <div style={s.expandItem}>
                                                <span style={s.expandLabel}>Issued At</span>
                                                <span style={s.expandValue}>{fullTime(alert.time || alert.sent_at || alert.created_at || alert.timestamp)}</span>
                                            </div>

                                            {/* Channel */}
                                            <div style={s.expandItem}>
                                                <span style={s.expandLabel}>Delivery Channel</span>
                                                <span style={s.expandValue} className="flex items-center gap-1">
                                                    <ChannelIcon ch={alert.channel} /> {alert.channel?.toUpperCase() ?? 'APP'}
                                                </span>
                                            </div>

                                            {/* Location */}
                                            {alert.location && (
                                                <div style={s.expandItem}>
                                                    <span style={s.expandLabel}>Affected Area</span>
                                                    <span style={s.expandValue}>{alert.location}</span>
                                                </div>
                                            )}

                                            {/* Status */}
                                            <div style={s.expandItem}>
                                                <span style={s.expandLabel}>Status</span>
                                                <span style={{
                                                    ...s.expandValue,
                                                    color: acked ? '#38a169' : cfg.color,
                                                    fontWeight: 700,
                                                }}>
                                                    {acked ? 'Acknowledged' : 'Awaiting Acknowledgement'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Safety instructions */}
                                        {alert.instructions && (
                                            <div style={s.instructionBox}>
                                                <div style={s.instructionTitle}>
                                                    📋 Safety Instructions
                                                </div>
                                                <p style={s.instructionText}>{alert.instructions}</p>
                                            </div>
                                        )}

                                        {/* Bottom actions */}
                                        <div style={s.expandActions}>
                                            <button
                                                onClick={(e) => handleCopy(alert, e)}
                                                style={s.expandCopyBtn}
                                            >
                                                {copied === alert.alert_id ? <Check size={13} /> : <Copy size={13} />}
                                                {copied === alert.alert_id ? 'Copied!' : 'Copy Alert Text'}
                                            </button>
                                            {!acked && (
                                                <button
                                                    onClick={(e) => handleAck(alert.alert_id, e)}
                                                    style={s.expandAckBtn}
                                                >
                                                    <CheckCheck size={13} />
                                                    Mark as Acknowledged
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Spin keyframe */}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

/* ── Styles ── */
const s = {
    page: { display: 'flex', flexDirection: 'column', gap: 20 },

    pageHead: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
    title: { fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 4 },
    sub: { color: 'var(--text-muted)', fontSize: 14 },
    headerActions: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },

    ackAllBtn: {
        display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
        background: '#1a9e7a', color: '#fff', border: 'none', borderRadius: 10,
        fontSize: 13, fontWeight: 700, cursor: 'pointer',
    },
    refreshBtn: {
        display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
        background: 'var(--bg-card)', color: 'var(--text-mid)', border: '1.5px solid var(--border)',
        borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
    },

    statsBar: { display: 'flex', gap: 0, padding: 0, overflow: 'hidden' },
    statItem: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 8px', borderRight: '1px solid var(--border)' },
    statVal: { fontSize: 22, fontWeight: 800, lineHeight: 1, marginBottom: 4 },
    statLbl: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.4px' },

    tabs: { display: 'flex', borderBottom: '2px solid var(--border)', gap: 0 },
    tab: {
        padding: '10px 20px', background: 'none', border: 'none', borderBottom: '2px solid transparent',
        marginBottom: -2, fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 8, transition: 'all .15s ease',
    },
    tabActive: { color: '#1a2456', borderBottomColor: '#1a2456' },
    tabCount: { padding: '1px 7px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: 'var(--bg-hover)', color: 'var(--text-muted)' },
    tabCountActive: { background: '#1a2456', color: '#fff' },

    toolbar: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
    searchWrap: { position: 'relative', flex: 1, minWidth: 220 },
    searchInput: {
        width: '100%', padding: '9px 36px 9px 36px', border: '1.5px solid var(--border)',
        borderRadius: 10, fontSize: 14, background: 'var(--bg-input)', color: 'var(--text-dark)', outline: 'none',
    },
    clearBtn: {
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0', fontSize: 14, padding: 2,
    },
    filterRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
    filterBtn: {
        padding: '7px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: '.3px',
        border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)',
        cursor: 'pointer', transition: 'all .15s ease', textTransform: 'uppercase',
    },
    sortBtn: {
        display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
        background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 10,
        fontSize: 13, fontWeight: 600, color: 'var(--text-mid)', cursor: 'pointer', whiteSpace: 'nowrap',
    },
    sortDropdown: {
        position: 'absolute', right: 0, top: 'calc(100% + 6px)', background: 'var(--bg-card)',
        border: '1px solid var(--border)', borderRadius: 12, padding: 6, zIndex: 100,
        boxShadow: 'var(--shadow-md)', minWidth: 160,
    },
    sortOption: {
        display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 14px',
        background: 'none', border: 'none', borderRadius: 8, fontSize: 13, color: 'var(--text-mid)',
        cursor: 'pointer', textAlign: 'left', fontWeight: 500,
    },
    sortOptionActive: { background: 'var(--bg-hover)', color: 'var(--text-dark)', fontWeight: 700 },

    resultsRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    resultsCount: { fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 },
    clearFilters: { fontSize: 13, fontWeight: 600, color: '#1a9e7a', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },

    list: { display: 'flex', flexDirection: 'column', gap: 12 },

    alertCard: { borderLeft: '4px solid transparent', overflow: 'hidden', transition: 'opacity .2s' },
    alertMain: { display: 'flex', gap: 14, padding: 18, alignItems: 'flex-start', cursor: 'pointer' },
    alertIconWrap: { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    alertTopRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
    sevBadge: { padding: '3px 10px', borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase' },
    channelChip: {
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
        background: 'var(--bg-hover)', color: 'var(--text-muted)', border: '1px solid var(--border)',
    },
    timeLabel: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-light)' },
    alertMsg: { fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.6, margin: '0 0 6px' },
    locationLabel: { fontSize: 12, color: 'var(--text-light)', margin: 0 },

    alertActions: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap' },
    iconBtn: { width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' },
    ackBtn: { padding: '7px 14px', background: '#1a2456', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
    ackedBadge: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#38a169', background: 'var(--success-bg)', border: '1px solid rgba(56,161,105,.3)', padding: '6px 10px', borderRadius: 8, whiteSpace: 'nowrap' },

    expandPanel: { borderTop: '1px solid var(--border)', padding: '16px 18px', background: 'var(--bg-hover)' },
    expandGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 24px', marginBottom: 14 },
    expandItem: { display: 'flex', flexDirection: 'column', gap: 3 },
    expandLabel: { fontSize: 10, fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '.5px' },
    expandValue: { fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' },
    instructionBox: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', marginBottom: 14 },
    instructionTitle: { fontSize: 12, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 6 },
    instructionText: { fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6, margin: 0 },
    expandActions: { display: 'flex', gap: 10 },
    expandCopyBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', cursor: 'pointer' },
    expandAckBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#1a9e7a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' },

    empty: { padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
    emptyTitle: { fontSize: 16, fontWeight: 700, color: 'var(--text-dark)', margin: 0 },
    emptySub: { fontSize: 13, color: 'var(--text-muted)', margin: 0 },
};

export default Alerts;
