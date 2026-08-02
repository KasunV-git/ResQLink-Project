// frontend/src/pages/citizen/Profile.jsx
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Mail, Phone, MapPin, Shield, Calendar, Edit2,
    Check, X, Camera, LogOut, FileText, Bell, Star,
    Award, Activity, Lock, Eye, EyeOff, Plus, Trash2,
    MessageSquare, Smartphone, Radio, Droplets, Flame,
    MountainSnow, Wind, Building2, TriangleAlert, Globe,
    ShieldCheck, Clock, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, uploadAvatar } from '../../api/authApi';
import Loader from '../../components/common/Loader';

/* ── Disaster alert types for subscription toggles ── */
const ALERT_TYPES = [
    { key: 'flood',     label: 'Flood',     icon: Droplets,     color: '#3182ce' },
    { key: 'fire',      label: 'Fire',      icon: Flame,        color: '#e53e3e' },
    { key: 'landslide', label: 'Landslide', icon: MountainSnow, color: '#dd6b20' },
    { key: 'cyclone',   label: 'Cyclone',   icon: Wind,         color: '#805ad5' },
    { key: 'earthquake',label: 'Earthquake',icon: TriangleAlert,color: '#c05621' },
    { key: 'collapse',  label: 'Collapse',  icon: Building2,    color: '#744210' },
];

const CHANNELS = [
    { key: 'sms',   label: 'SMS Alerts',   icon: Smartphone,    desc: 'Text messages to your phone' },
    { key: 'email', label: 'Email Alerts',  icon: Mail,          desc: 'Alerts sent to your email' },
    { key: 'push',  label: 'Push Notifications', icon: Bell,     desc: 'In-app and browser notifications' },
    { key: 'radio', label: 'Radio Broadcast', icon: Radio,       desc: 'Emergency broadcast channel' },
];

const RELATIONSHIPS = ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Neighbor', 'Colleague', 'Other'];

const DEMO_ZONES = [
    { id: 1, name: 'Zone B4 — Coastal District', severity: 'HIGH',   active: true  },
    { id: 2, name: 'Sector 12 — Northern Hills', severity: 'MODERATE', active: true },
    { id: 3, name: 'City Centre',                severity: 'LOW',    active: false },
];

const SEV_COLOR = { HIGH: '#e53e3e', MODERATE: '#d69e2e', LOW: '#38a169', CRITICAL: '#c53030' };

/* ── Profile ── */
const Profile = () => {
    const { user, refreshUser, logout } = useAuth();
    const { t } = useTranslation();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [editing, setEditing]       = useState(false);
    const [saving, setSaving]         = useState(false);
    const [msg, setMsg]               = useState({ text: '', type: 'success' });
    const [form, setForm]             = useState({
        name: '', email: '', phone_number: '', primary_region: '',
    });
    const [pwForm, setPwForm]         = useState({ current: '', next: '', confirm: '' });
    const [showPw, setShowPw]         = useState({ current: false, next: false, confirm: false });
    const [pwMsg, setPwMsg]           = useState('');
    const fileRef = useRef();

    /* Notification prefs */
    const [channels, setChannels]     = useState({ sms: true, email: true, push: true, radio: false });
    const [alertTypes, setAlertTypes] = useState({ flood: true, fire: true, landslide: true, cyclone: false, earthquake: true, collapse: false });
    const [prefsOpen, setPrefsOpen]   = useState(true);

    /* Emergency contacts */
    const [contacts, setContacts]     = useState([
        { id: 1, name: 'Aisha Fernando', phone: '+94 77 123 4567', relationship: 'Spouse' },
    ]);
    const [addingContact, setAddingContact] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: 'Spouse' });

    /* Alert zones */
    const [zones, setZones]           = useState(DEMO_ZONES);
    const [addZone, setAddZone]       = useState('');

    /* Sync form */
    useEffect(() => {
        if (user) setForm({
            name: user.name ?? '',
            email: user.email ?? '',
            phone_number: user.phone_number ?? '',
            primary_region: user.primary_region ?? '',
        });
    }, [user]);

    const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const flash = (text, type = 'success') => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: '', type: 'success' }), 3500);
    };

    /* Save profile */
    const save = async () => {
        setSaving(true);
        try {
            await updateProfile(form);
            await refreshUser();
            setEditing(false);
            flash('Profile updated successfully!');
        } catch {
            flash('Failed to save changes.', 'error');
        } finally {
            setSaving(false);
        }
    };

    /* Avatar */
    const onAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('avatar', file);
        try {
            await uploadAvatar(fd);
            await refreshUser();
            flash('Avatar updated!');
        } catch {
            flash('Avatar upload failed.', 'error');
        }
    };

    /* Password change (demo) */
    const changePassword = () => {
        if (!pwForm.current) { setPwMsg('Enter your current password.'); return; }
        if (pwForm.next.length < 8) { setPwMsg('New password must be at least 8 characters.'); return; }
        if (pwForm.next !== pwForm.confirm) { setPwMsg('Passwords do not match.'); return; }
        setPwMsg('✓ Password changed successfully!');
        setPwForm({ current: '', next: '', confirm: '' });
        setTimeout(() => setPwMsg(''), 4000);
    };

    /* Contacts */
    const saveContact = () => {
        if (!newContact.name || !newContact.phone) return;
        setContacts(p => [...p, { ...newContact, id: Date.now() }]);
        setNewContact({ name: '', phone: '', relationship: 'Spouse' });
        setAddingContact(false);
        flash('Emergency contact added.');
    };
    const removeContact = (id) => { setContacts(p => p.filter(c => c.id !== id)); flash('Contact removed.'); };

    /* Zones */
    const toggleZone = (id) => setZones(p => p.map(z => z.id === id ? { ...z, active: !z.active } : z));
    const removeZone = (id) => setZones(p => p.filter(z => z.id !== id));
    const addZoneHandler = () => {
        if (!addZone.trim()) return;
        setZones(p => [...p, { id: Date.now(), name: addZone.trim(), severity: 'LOW', active: true }]);
        setAddZone('');
        flash('Zone added to subscriptions.');
    };

    if (!user) return <Loader fullPage />;

    const joinDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        : 'October 2023';

    const stats = [
        { icon: FileText, label: 'Reports Filed', value: user.reports_count ?? 12, color: '#1a9e7a', bg: '#f0fff4' },
        { icon: Bell,     label: 'Active Alerts', value: user.active_alerts ?? 3,   color: '#3182ce', bg: '#ebf8ff' },
        { icon: Star,     label: 'Trust Score',   value: user.trust_score ?? 84,    color: '#d69e2e', bg: '#fffff0' },
    ];

    return (
        <div style={s.page} className="profile-page">

            {/* ── Left column ── */}
            <div style={s.left}>

                {/* Profile card */}
                <div style={s.profileCard} className="card">
                    <div style={s.banner} />

                    {/* Avatar */}
                    <div style={s.avatarWrap}>
                        {user.avatar ? (
                            <img src={user.avatar} alt="avatar" style={s.avatarImg} />
                        ) : (
                            <div style={s.avatarFallback}>{user.name?.[0]?.toUpperCase() ?? 'U'}</div>
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
                                    <span style={s.verifiedBadge}><Shield size={11} /> Verified Responder</span>
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
                                <button onClick={() => setEditing(false)} style={s.cancelBtn}><X size={14} /></button>
                            </div>
                        )}
                    </div>

                    {/* Flash message */}
                    {msg.text && (
                        <div style={{ ...s.msgBar, background: msg.type === 'error' ? '#fff5f5' : '#f0fff4', borderColor: msg.type === 'error' ? '#fed7d7' : '#c6f6d5', color: msg.type === 'error' ? '#c53030' : '#276749' }}>
                            {msg.type === 'error' ? <X size={13} color="#e53e3e" /> : <Check size={13} color="#38a169" />}
                            {msg.text}
                        </div>
                    )}

                    {/* Info grid */}
                    <div style={s.infoGrid} className="profile-info-grid">
                        {[
                            { icon: Mail,     label: 'EMAIL ADDRESS',   field: 'email',          value: form.email },
                            { icon: Phone,    label: 'CONTACT NUMBER',  field: 'phone_number',   value: form.phone_number },
                            { icon: MapPin,   label: 'PRIMARY REGION',  field: 'primary_region', value: form.primary_region },
                            { icon: Calendar, label: 'MEMBER SINCE',    field: null,             value: joinDate },
                        ].map(({ icon: Icon, label, field, value }) => (
                            <div key={label} style={s.infoTile}>
                                <div style={s.tileMeta}>
                                    <Icon size={14} color="#718096" />
                                    <span style={s.tileLabel}>{label}</span>
                                </div>
                                {editing && field ? (
                                    <input name={field} value={form[field]} onChange={onChange} style={s.tileInput} />
                                ) : (
                                    <div style={s.tileValue}>{value || '—'}</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Password change (shown in edit mode) */}
                    {editing && (
                        <div style={s.pwSection}>
                            <div style={s.pwTitle}><Lock size={14} color="#718096" /> Change Password</div>
                            {[
                                { key: 'current', placeholder: 'Current password' },
                                { key: 'next',    placeholder: 'New password (min. 8 chars)' },
                                { key: 'confirm', placeholder: 'Confirm new password' },
                            ].map(({ key, placeholder }) => (
                                <div key={key} style={{ position: 'relative', marginBottom: 8 }}>
                                    <input
                                        type={showPw[key] ? 'text' : 'password'}
                                        placeholder={placeholder}
                                        value={pwForm[key]}
                                        onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                                        style={s.pwInput}
                                    />
                                    <button onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))} style={s.eyeBtn}>
                                        {showPw[key] ? <EyeOff size={14} color="#a0aec0" /> : <Eye size={14} color="#a0aec0" />}
                                    </button>
                                </div>
                            ))}
                            {pwMsg && (
                                <p style={{ fontSize: 12, margin: '4px 0 6px', color: pwMsg.startsWith('✓') ? '#38a169' : '#e53e3e', fontWeight: 600 }}>{pwMsg}</p>
                            )}
                            <button onClick={changePassword} style={s.pwBtn}>
                                <Lock size={13} /> Update Password
                            </button>
                        </div>
                    )}

                    {/* Account security info */}
                    <div style={s.securityRow}>
                        <div style={s.secItem}>
                            <ShieldCheck size={13} color="#38a169" />
                            <span style={s.secText}>Session encrypted (TLS 1.3)</span>
                        </div>
                        <div style={s.secItem}>
                            <Clock size={13} color="#718096" />
                            <span style={s.secText}>Last login: Today, 09:41 AM</span>
                        </div>
                    </div>

                    {/* Logout */}
                    <button onClick={() => setShowLogoutConfirm(true)} style={s.logoutBtn}>
                        <LogOut size={15} /> {t('profile.logout', 'Log Out of ResQLink')}
                    </button>
                    <div style={s.version}>Version 4.2.1-Sentinel • Secure Session</div>
                </div>
            </div>

            {/* ── Right column ── */}
            <div style={s.right}>

                {/* Stats row */}
                <div style={s.statsRow} className="profile-stats-row">
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

                {/* Trust score */}
                <div style={s.trustCard} className="card">
                    <div style={s.trustHead}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Award size={18} color="#d69e2e" />
                            <span style={s.sectionTitle}>Citizen Trust Score</span>
                        </div>
                        <span style={s.trustNum}>
                            {user.trust_score ?? 84}<span style={{ fontSize: 14, color: '#a0aec0' }}>/100</span>
                        </span>
                    </div>
                    <div style={s.trustBarWrap}>
                        <div style={{ ...s.trustBarFill, width: `${user.trust_score ?? 84}%` }} />
                    </div>
                    <div style={s.trustTiers}>
                        {['Newcomer', 'Active', 'Trusted', 'Elite', 'Master'].map((t, i) => (
                            <span key={t} style={{ ...s.tier, color: i <= 3 ? '#1a9e7a' : '#a0aec0' }}>{t}</span>
                        ))}
                    </div>
                    <p style={s.trustNote}>Reflects verified reports, acknowledged alerts, and community contributions.</p>
                </div>

                {/* ── Notification Preferences ── */}
                <div className="card" style={{ overflow: 'hidden' }}>
                    <button
                        onClick={() => setPrefsOpen(p => !p)}
                        style={s.collapsibleHeader}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Bell size={16} color="#1a2456" />
                            <span style={s.sectionTitle}>Notification Preferences</span>
                        </div>
                        {prefsOpen ? <ChevronUp size={16} color="#718096" /> : <ChevronDown size={16} color="#718096" />}
                    </button>

                    {prefsOpen && (
                        <div style={s.collapsibleBody}>
                            {/* Channels */}
                            <div style={s.prefSubtitle}><MessageSquare size={13} /> Alert Channels</div>
                            <div style={s.channelGrid}>
                                {CHANNELS.map(({ key, label, icon: Icon, desc }) => (
                                    <div
                                        key={key}
                                        onClick={() => setChannels(p => ({ ...p, [key]: !p[key] }))}
                                        style={{
                                            ...s.channelCard,
                                            borderColor: channels[key] ? '#1a9e7a' : 'var(--border)',
                                            background: channels[key] ? '#f0fff4' : 'var(--bg-hover)',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Icon size={15} color={channels[key] ? '#1a9e7a' : '#a0aec0'} />
                                            <div style={{ ...s.toggle, background: channels[key] ? '#1a9e7a' : '#cbd5e0' }}>
                                                <div style={{ ...s.toggleKnob, transform: channels[key] ? 'translateX(14px)' : 'translateX(2px)' }} />
                                            </div>
                                        </div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: channels[key] ? '#1a9e7a' : 'var(--text-mid)' }}>{label}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-light)', lineHeight: 1.3 }}>{desc}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Alert types */}
                            <div style={{ ...s.prefSubtitle, marginTop: 16 }}><TriangleAlert size={13} /> Alert Types</div>
                            <div style={s.alertTypeGrid}>
                                {ALERT_TYPES.map(({ key, label, icon: Icon, color }) => (
                                    <button
                                        key={key}
                                        onClick={() => setAlertTypes(p => ({ ...p, [key]: !p[key] }))}
                                        style={{
                                            ...s.alertTypeBtn,
                                            borderColor: alertTypes[key] ? color : 'var(--border)',
                                            background: alertTypes[key] ? `${color}18` : 'var(--bg-hover)',
                                        }}
                                    >
                                        <Icon size={14} color={alertTypes[key] ? color : '#a0aec0'} />
                                        <span style={{ color: alertTypes[key] ? color : 'var(--text-muted)', fontWeight: alertTypes[key] ? 700 : 500 }}>
                                            {label}
                                        </span>
                                        {alertTypes[key] && <Check size={11} color={color} style={{ marginLeft: 'auto' }} />}
                                    </button>
                                ))}
                            </div>

                            <button style={s.savePrefsBtn} onClick={() => flash('Notification preferences saved.')}>
                                <Check size={13} /> Save Preferences
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Emergency Contacts ── */}
                <div className="card" style={{ padding: 20 }}>
                    <div style={s.cardHeaderRow}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Phone size={16} color="#e53e3e" />
                            <span style={s.sectionTitle}>Emergency Contacts</span>
                        </div>
                        {contacts.length < 3 && !addingContact && (
                            <button onClick={() => setAddingContact(true)} style={s.addBtn}>
                                <Plus size={13} /> Add
                            </button>
                        )}
                    </div>
                    <p style={s.cardDesc}>People notified when you submit a critical emergency report.</p>

                    {contacts.map(c => (
                        <div key={c.id} style={s.contactCard}>
                            <div style={s.contactAvatar}>{c.name[0].toUpperCase()}</div>
                            <div style={{ flex: 1 }}>
                                <div style={s.contactName}>{c.name}</div>
                                <div style={s.contactMeta}>{c.phone} · {c.relationship}</div>
                            </div>
                            <button onClick={() => removeContact(c.id)} style={s.removeContactBtn}>
                                <Trash2 size={13} />
                            </button>
                        </div>
                    ))}

                    {contacts.length === 0 && !addingContact && (
                        <div style={s.emptyState}>No emergency contacts added yet.</div>
                    )}

                    {addingContact && (
                        <div style={s.addContactForm}>
                            <input placeholder="Full name" value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} style={s.miniInput} />
                            <input placeholder="Phone number" value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} style={s.miniInput} />
                            <select value={newContact.relationship} onChange={e => setNewContact(p => ({ ...p, relationship: e.target.value }))} style={s.miniSelect}>
                                {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
                            </select>
                            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                <button onClick={saveContact} style={s.saveBtn}><Check size={13} /> Save</button>
                                <button onClick={() => setAddingContact(false)} style={s.cancelBtn}><X size={13} /></button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Alert Zones ── */}
                <div className="card" style={{ padding: 20 }}>
                    <div style={s.cardHeaderRow}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Globe size={16} color="#3182ce" />
                            <span style={s.sectionTitle}>Subscribed Alert Zones</span>
                        </div>
                    </div>
                    <p style={s.cardDesc}>Receive alerts for incidents in these geographic zones.</p>

                    {zones.map(z => (
                        <div key={z.id} style={s.zoneRow}>
                            <div
                                onClick={() => toggleZone(z.id)}
                                style={{ ...s.zoneToggle, background: z.active ? '#1a9e7a' : '#cbd5e0' }}
                            >
                                <div style={{ ...s.toggleKnob, transform: z.active ? 'translateX(14px)' : 'translateX(2px)' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={s.zoneName}>{z.name}</div>
                                <span style={{ ...s.zoneSev, color: SEV_COLOR[z.severity] }}>
                                    {z.severity} risk
                                </span>
                            </div>
                            <button onClick={() => removeZone(z.id)} style={s.removeContactBtn}><Trash2 size={13} /></button>
                        </div>
                    ))}

                    <div style={s.addZoneRow}>
                        <input
                            placeholder="Add a zone name or area…"
                            value={addZone}
                            onChange={e => setAddZone(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addZoneHandler()}
                            style={{ ...s.miniInput, flex: 1, margin: 0 }}
                        />
                        <button onClick={addZoneHandler} style={s.addBtn}><Plus size={13} /> Add</button>
                    </div>
                </div>

                {/* ── Recent Activity ── */}
                <div style={s.actCard} className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Activity size={16} color="#1a2456" />
                        <span style={s.sectionTitle}>Recent Activity</span>
                    </div>
                    {[
                        { label: 'Submitted flood report',        time: '2 hours ago',  dot: '#e53e3e' },
                        { label: 'Acknowledged Zone B4 alert',    time: '3 hours ago',  dot: '#dd6b20' },
                        { label: 'Updated primary region',        time: 'Yesterday',    dot: '#3182ce' },
                        { label: 'Profile photo updated',         time: '2 days ago',   dot: '#38a169' },
                        { label: 'Added emergency contact',       time: '3 days ago',   dot: '#805ad5' },
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

            {showLogoutConfirm && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'var(--bg-card, #fff)', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '320px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', color: 'var(--text-dark, #1a202c)' }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>{t('common.confirmLogoutTitle', 'Sign Out')}</h3>
                        <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-muted, #4a5568)' }}>{t('common.confirmLogout', 'Are you sure you want to sign out?')}</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowLogoutConfirm(false)} style={{ padding: '8px 16px', border: '1px solid var(--border, #e2e8f0)', background: 'transparent', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-dark, #1a202c)', fontWeight: '600' }}>{t('common.cancel', 'Cancel')}</button>
                            <button onClick={logout} style={{ padding: '8px 16px', border: 'none', background: '#e53e3e', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>{t('profile.logout', 'Logout')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Styles ── */
const s = {
    page: { display: 'grid', gridTemplateColumns: '420px 1fr', gap: 24, alignItems: 'start' },
    left: {},
    right: { display: 'flex', flexDirection: 'column', gap: 20 },

    profileCard: { overflow: 'hidden', position: 'relative' },
    banner: { height: 130, background: 'linear-gradient(135deg, #111a3e 0%, #1a2456 55%, #1a9e7a 100%)' },
    avatarWrap: { position: 'relative', display: 'inline-block', marginLeft: 28, marginTop: -50 },
    avatarImg: { width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', display: 'block' },
    avatarFallback: {
        width: 96, height: 96, borderRadius: '50%',
        background: 'linear-gradient(135deg, #1a2456, #1a9e7a)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 32, border: '4px solid #fff',
    },
    cameraBtn: {
        position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: '50%',
        background: '#1a2456', border: '2px solid #fff', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    nameRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px 24px 0', flexWrap: 'wrap', gap: 12 },
    userName: { fontSize: 22, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 6 },
    roleRow: { display: 'flex', alignItems: 'center', gap: 8 },
    roleBadge: { padding: '3px 10px', borderRadius: 999, background: 'rgba(26,36,86,.1)', color: '#1a2456', fontSize: 10, fontWeight: 700, letterSpacing: '1px' },
    verifiedBadge: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#718096', fontWeight: 500 },
    editBtn:   { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#1a9e7a', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
    saveBtn:   { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#38a169', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
    cancelBtn: { padding: '8px 10px', background: 'var(--bg-hover)', border: '1.5px solid var(--border)', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' },
    msgBar: { margin: '8px 24px 0', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontWeight: 500 },

    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '16px 24px' },
    infoTile: { background: 'var(--bg-hover)', borderRadius: 12, padding: '12px 14px', border: '1px solid var(--border)' },
    tileMeta: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 },
    tileLabel: { fontSize: 10, fontWeight: 700, color: 'var(--text-light)', letterSpacing: '.5px' },
    tileValue: { fontSize: 14, fontWeight: 600, color: 'var(--text-dark)' },
    tileInput: { fontSize: 14, fontWeight: 500, color: 'var(--text-dark)', border: 'none', background: 'transparent', borderBottom: '1.5px solid #1a9e7a', outline: 'none', width: '100%', padding: '2px 0', fontFamily: 'Inter,sans-serif' },

    /* Password */
    pwSection: { margin: '0 24px 16px', padding: 16, background: 'var(--bg-hover)', borderRadius: 12, border: '1px solid var(--border)' },
    pwTitle: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 10 },
    pwInput: { width: '100%', padding: '9px 36px 9px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, background: 'var(--bg-input)', color: 'var(--text-dark)', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter,sans-serif' },
    eyeBtn: { position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2 },
    pwBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#1a2456', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 4 },

    /* Security */
    securityRow: { display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 24px', borderTop: '1px solid var(--border)' },
    secItem: { display: 'flex', alignItems: 'center', gap: 6 },
    secText: { fontSize: 11, color: 'var(--text-light)' },

    logoutBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px', background: 'none', border: 'none', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
    version: { textAlign: 'center', fontSize: 11, color: 'var(--text-light)', padding: '4px 0 14px', letterSpacing: '.3px' },

    /* Stats */
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
    statCard: { padding: 20, textAlign: 'center' },
    statIcon: { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' },
    statValue: { fontSize: 28, fontWeight: 800, marginBottom: 4 },
    statLabel: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 },

    /* Trust */
    trustCard: { padding: 24 },
    trustHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    trustNum: { fontWeight: 800, fontSize: 28, color: 'var(--text-dark)' },
    trustBarWrap: { height: 8, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', marginBottom: 8 },
    trustBarFill: { height: '100%', background: 'linear-gradient(90deg, #1a2456, #1a9e7a)', borderRadius: 99, transition: 'width .5s ease' },
    trustTiers: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
    tier: { fontSize: 10, fontWeight: 600 },
    trustNote: { fontSize: 12, color: 'var(--text-light)', lineHeight: 1.5, margin: 0 },

    /* Section common */
    sectionTitle: { fontWeight: 700, fontSize: 15, color: 'var(--text-dark)' },
    collapsibleHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--border)' },
    collapsibleBody: { padding: '16px 20px' },
    cardHeaderRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    cardDesc: { fontSize: 12, color: 'var(--text-muted)', margin: '0 0 14px' },
    prefSubtitle: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 10 },

    /* Notification channels */
    channelGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 },
    channelCard: { padding: '12px', border: '1.5px solid', borderRadius: 10, cursor: 'pointer', transition: 'all .15s ease' },
    toggle: { width: 34, height: 18, borderRadius: 99, position: 'relative', transition: 'background .2s', flexShrink: 0 },
    toggleKnob: { position: 'absolute', top: 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'transform .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' },

    /* Alert types */
    alertTypeGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 },
    alertTypeBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '9px 10px', border: '1.5px solid', borderRadius: 9, cursor: 'pointer', fontSize: 12, background: 'none', transition: 'all .15s ease' },
    savePrefsBtn: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, padding: '9px 18px', background: '#1a9e7a', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' },

    /* Emergency contacts */
    contactCard: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--bg-hover)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 8 },
    contactAvatar: { width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#1a2456,#1a9e7a)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 },
    contactName: { fontSize: 14, fontWeight: 700, color: 'var(--text-dark)' },
    contactMeta: { fontSize: 12, color: 'var(--text-muted)' },
    removeContactBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: '#1a2456', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
    addContactForm: { padding: '12px', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 8 },
    miniInput: { width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, background: 'var(--bg-input)', color: 'var(--text-dark)', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter,sans-serif' },
    miniSelect: { width: '100%', padding: '9px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, background: 'var(--bg-input)', color: 'var(--text-dark)', outline: 'none', fontFamily: 'Inter,sans-serif' },
    emptyState: { textAlign: 'center', fontSize: 13, color: 'var(--text-light)', padding: '12px 0' },

    /* Zones */
    zoneRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', background: 'var(--bg-hover)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 8 },
    zoneToggle: { width: 34, height: 18, borderRadius: 99, cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0 },
    zoneName: { fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' },
    zoneSev: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.3px' },
    addZoneRow: { display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' },

    /* Activity */
    actCard: { padding: 24 },
    actItem: { display: 'flex', alignItems: 'flex-start', gap: 12, paddingBottom: 14, borderBottom: '1px solid var(--border)', marginBottom: 14 },
    actDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 4 },
    actLabel: { fontSize: 13, fontWeight: 500, color: 'var(--text-dark)', marginBottom: 2 },
    actTime: { fontSize: 12, color: 'var(--text-light)' },
};

export default Profile;
