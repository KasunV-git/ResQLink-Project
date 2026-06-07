// frontend/src/pages/citizen/Profile.jsx
import { useState, useRef, useEffect } from 'react';
import {
    Mail, Phone, MapPin, Shield, Calendar, Edit2,
    Check, X, Camera, LogOut, FileText, Bell, Star,
    Award, Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, uploadAvatar } from '../../api/authApi';
import Loader from '../../components/common/Loader';

const Profile = () => {
    const { user, logout, refreshUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [form, setForm] = useState({
        name: '', email: '', phone_number: '', primary_region: '',
    });
    const fileRef = useRef();

    /* Sync form with user data */
    useEffect(() => {
        if (user) setForm({
            name: user.name ?? '',
            email: user.email ?? '',
            phone_number: user.phone_number ?? '',
            primary_region: user.primary_region ?? '',
        });
    }, [user]);

    const onChange = (e) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const save = async () => {
        setSaving(true);
        try {
            await updateProfile(form);
            await refreshUser();
            setEditing(false);
            setMsg('Profile updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch {
            setMsg('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    /* Avatar upload */
    const onAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('avatar', file);
        try {
            await uploadAvatar(fd);
            await refreshUser();
            setMsg('Avatar updated!');
            setTimeout(() => setMsg(''), 3000);
        } catch {
            setMsg('Avatar upload failed.');
        }
    };

    if (!user) return <Loader fullPage />;

    const joinDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        : 'October 2023';

    const stats = [
        { icon: FileText, label: 'Reports Filed', value: user.reports_count ?? 12, color: '#1a9e7a', bg: '#f0fff4' },
        { icon: Bell, label: 'Active Alerts', value: user.active_alerts ?? 3, color: '#3182ce', bg: '#ebf8ff' },
        { icon: Star, label: 'Trust Score', value: user.trust_score ?? 84, color: '#d69e2e', bg: '#fffff0' },
    ];

    return (
        <div style={s.page}>

            {/* ── Left column ── */}
            <div style={s.left}>

                {/* Profile card */}
                <div style={s.profileCard} className="card">
                    {/* Banner gradient */}
                    <div style={s.banner} />

                    {/* Avatar */}
                    <div style={s.avatarWrap}>
                        {user.avatar ? (
                            <img src={user.avatar} alt="avatar" style={s.avatarImg} />
                        ) : (
                            <div style={s.avatarFallback}>
                                {user.name?.[0]?.toUpperCase() ?? 'U'}
                            </div>
                        )}
                        <button style={s.cameraBtn} onClick={() => fileRef.current.click()} title="Change photo">
                            <Camera size={14} color="#fff" />
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onAvatarChange} />
                    </div>

                    {/* Name + role */}
                    <div style={s.nameRow}>
                        <div>
                            <h2 style={s.userName}>{user.name}</h2>
                            <div style={s.roleRow}>
                                <span style={s.roleBadge}>CITIZEN</span>
                                {user.verified && (
                                    <span style={s.verifiedBadge}>
                                        <Shield size={11} /> Verified Responder
                                    </span>
                                )}
                            </div>
                        </div>
                        {!editing ? (
                            <button onClick={() => setEditing(true)} style={s.editBtn}>
                                <Edit2 size={14} /> Edit Profile
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={save} disabled={saving} style={s.saveBtn}>
                                    <Check size={14} /> {saving ? 'Saving…' : 'Save'}
                                </button>
                                <button onClick={() => setEditing(false)} style={s.cancelBtn}>
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Success / error msg */}
                    {msg && (
                        <div style={s.msgBar}>
                            <Check size={13} color="#38a169" />{msg}
                        </div>
                    )}

                    {/* Info grid */}
                    <div style={s.infoGrid}>
                        {[
                            { icon: Mail, label: 'EMAIL ADDRESS', field: 'email', value: form.email },
                            { icon: Phone, label: 'CONTACT NUMBER', field: 'phone_number', value: form.phone_number },
                            { icon: MapPin, label: 'PRIMARY REGION', field: 'primary_region', value: form.primary_region },
                            { icon: Calendar, label: 'MEMBER SINCE', field: null, value: joinDate },
                        ].map(({ icon: Icon, label, field, value }) => (
                            <div key={label} style={s.infoTile}>
                                <div style={s.tileMeta}>
                                    <Icon size={14} color="#718096" />
                                    <span style={s.tileLabel}>{label}</span>
                                </div>
                                {editing && field ? (
                                    <input
                                        name={field}
                                        value={form[field]}
                                        onChange={onChange}
                                        style={s.tileInput}
                                    />
                                ) : (
                                    <div style={s.tileValue}>{value || '—'}</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Logout */}
                    <button onClick={logout} style={s.logoutBtn}>
                        <LogOut size={15} /> Log Out of ResQLink
                    </button>
                    <div style={s.version}>Version 4.2.1-Sentinel • Secure Session Encrypted</div>
                </div>
            </div>

            {/* ── Right column ── */}
            <div style={s.right}>

                {/* Stats row */}
                <div style={s.statsRow}>
                    {stats.map(({ icon: Icon, label, value, color, bg }) => (
                        <div key={label} style={s.statCard} className="card">
                            <div style={{ ...s.statIcon, background: bg }}>
                                <Icon size={20} color={color} />
                            </div>
                            <div style={{ ...s.statValue, color }}>{String(value).padStart(2, '0')}</div>
                            <div style={s.statLabel}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Trust score bar */}
                <div style={s.trustCard} className="card">
                    <div style={s.trustHead}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Award size={18} color="#d69e2e" />
                            <span style={s.trustTitle}>Citizen Trust Score</span>
                        </div>
                        <span style={s.trustNum}>{user.trust_score ?? 84}<span style={{ fontSize: 14, color: '#a0aec0' }}>/100</span></span>
                    </div>
                    <div style={s.trustBarWrap}>
                        <div style={{ ...s.trustBarFill, width: `${user.trust_score ?? 84}%` }} />
                    </div>
                    <div style={s.trustTiers}>
                        {['Newcomer', 'Active', 'Trusted', 'Elite', 'Master'].map((t, i) => (
                            <span key={t} style={{ ...s.tier, color: i <= 3 ? '#1a9e7a' : '#a0aec0' }}>{t}</span>
                        ))}
                    </div>
                    <p style={s.trustNote}>
                        Your trust score reflects verified reports, acknowledged alerts, and community contributions.
                    </p>
                </div>

                {/* Activity card */}
                <div style={s.actCard} className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Activity size={16} color="#1a2456" />
                        <span style={s.trustTitle}>Recent Activity</span>
                    </div>
                    {[
                        { label: 'Submitted flood report', time: '2 hours ago', dot: '#e53e3e' },
                        { label: 'Acknowledged Zone B4 alert', time: '3 hours ago', dot: '#dd6b20' },
                        { label: 'Updated primary region', time: 'Yesterday', dot: '#3182ce' },
                        { label: 'Profile photo updated', time: '2 days ago', dot: '#38a169' },
                    ].map((act, i) => (
                        <div key={i} style={s.actItem}>
                            <div style={{ ...s.actDot, background: act.dot }} />
                            <div style={{ flex: 1 }}>
                                <div style={s.actLabel}>{act.label}</div>
                                <div style={s.actTime}>{act.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const s = {
    page: { display: 'grid', gridTemplateColumns: '420px 1fr', gap: 24, alignItems: 'start' },
    left: {},
    right: { display: 'flex', flexDirection: 'column', gap: 20 },
    profileCard: { overflow: 'hidden', position: 'relative' },
    banner: { height: 140, background: 'linear-gradient(135deg, #111a3e 0%, #1a2456 55%, #1a9e7a 100%)', marginBottom: 0 },
    avatarWrap: { position: 'relative', display: 'inline-block', marginLeft: 28, marginTop: -52, marginBottom: 0 },
    avatarImg: { width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', display: 'block' },
    avatarFallback: {
        width: 96, height: 96, borderRadius: '50%',
        background: 'linear-gradient(135deg, #1a2456, #1a9e7a)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 32,
        border: '4px solid #fff'
    },
    cameraBtn: {
        position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: '50%',
        background: '#1a2456', border: '2px solid #fff', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    nameRow: {
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        padding: '12px 24px 0', flexWrap: 'wrap', gap: 12
    },
    userName: { fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: '#1a202c', marginBottom: 6 },
    roleRow: { display: 'flex', alignItems: 'center', gap: 8 },
    roleBadge: {
        padding: '3px 10px', borderRadius: 999, background: 'rgba(26,36,86,.1)', color: '#1a2456',
        fontSize: 10, fontWeight: 700, letterSpacing: '1px'
    },
    verifiedBadge: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#718096', fontWeight: 500 },
    editBtn: {
        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#1a9e7a',
        color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer'
    },
    saveBtn: {
        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#38a169',
        color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer'
    },
    cancelBtn: {
        padding: '8px 10px', background: '#f7fafc', border: '1.5px solid #e2e8f0',
        borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center'
    },
    msgBar: {
        margin: '8px 24px 0', display: 'flex', alignItems: 'center', gap: 6,
        background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#276749'
    },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '16px 24px' },
    infoTile: { background: '#f7fafc', borderRadius: 12, padding: '12px 14px', border: '1px solid #e2e8f0' },
    tileMeta: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 },
    tileLabel: { fontSize: 10, fontWeight: 700, color: '#a0aec0', letterSpacing: '.5px' },
    tileValue: { fontSize: 14, fontWeight: 600, color: '#1a202c' },
    tileInput: {
        fontSize: 14, fontWeight: 500, color: '#1a202c', border: 'none', background: 'transparent',
        borderBottom: '1.5px solid #1a9e7a', outline: 'none', width: '100%', padding: '2px 0',
        fontFamily: "'DM Sans',sans-serif"
    },
    logoutBtn: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%',
        padding: '14px', background: 'none', border: 'none', borderTop: '1px solid #e2e8f0',
        color: '#718096', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'color .2s'
    },
    version: { textAlign: 'center', fontSize: 11, color: '#a0aec0', padding: '4px 0 16px', letterSpacing: '.3px' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
    statCard: { padding: 20, textAlign: 'center' },
    statIcon: { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' },
    statValue: { fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 4 },
    statLabel: { fontSize: 12, color: '#718096', fontWeight: 500 },
    trustCard: { padding: 24 },
    trustHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    trustTitle: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, color: '#1a202c' },
    trustNum: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 28, color: '#1a202c' },
    trustBarWrap: { height: 8, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden', marginBottom: 8 },
    trustBarFill: { height: '100%', background: 'linear-gradient(90deg, #1a2456, #1a9e7a)', borderRadius: 99, transition: 'width .5s ease' },
    trustTiers: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
    tier: { fontSize: 10, fontWeight: 600 },
    trustNote: { fontSize: 12, color: '#a0aec0', lineHeight: 1.5 },
    actCard: { padding: 24 },
    actItem: { display: 'flex', alignItems: 'flex-start', gap: 12, paddingBottom: 14, borderBottom: '1px solid #f7fafc', marginBottom: 14 },
    actDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 4 },
    actLabel: { fontSize: 13, fontWeight: 500, color: '#2d3748', marginBottom: 2 },
    actTime: { fontSize: 12, color: '#a0aec0' },
};

export default Profile;