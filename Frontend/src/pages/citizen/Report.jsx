// frontend/src/pages/citizen/Report.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin, Send, AlertCircle, CheckCircle2, Phone,
    ShieldAlert, Radio, Image as ImageIcon, X, ChevronRight,
    ChevronLeft, Users, FileText, Clock, RefreshCw,
    Droplets, Flame, MountainSnow, Wind, Building2,
    Stethoscope, FlaskConical, HelpCircle, TriangleAlert,
    Navigation, Check, Eye,
} from 'lucide-react';
import { submitReport, getMyReports } from '../../api/disasterApi';

/* ── Disaster types with icons ── */
const DISASTER_TYPES = [
    { value: 'Flash Flood',       label: 'Flash Flood',     icon: Droplets,     color: '#3182ce', bg: '#ebf8ff' },
    { value: 'Landslide',         label: 'Landslide',       icon: MountainSnow, color: '#dd6b20', bg: '#fffaf0' },
    { value: 'Fire',              label: 'Fire',            icon: Flame,        color: '#e53e3e', bg: '#fff5f5' },
    { value: 'Cyclone / Winds',   label: 'Cyclone/Winds',   icon: Wind,         color: '#805ad5', bg: '#faf5ff' },
    { value: 'Building Collapse', label: 'Collapse',        icon: Building2,    color: '#744210', bg: '#fefcbf' },
    { value: 'Medical Emergency', label: 'Medical',         icon: Stethoscope,  color: '#319795', bg: '#e6fffa' },
    { value: 'Chemical Spill',    label: 'Chemical Spill',  icon: FlaskConical, color: '#2d3748', bg: '#edf2f7' },
    { value: 'Earthquake',        label: 'Earthquake',      icon: TriangleAlert,color: '#c05621', bg: '#fffaf0' },
    { value: 'Other',             label: 'Other',           icon: HelpCircle,   color: '#718096', bg: '#f7fafc' },
];

/* ── Severity options ── */
const SEVERITIES = [
    { value: 'CRITICAL', label: 'Critical', desc: 'Immediate threat to life', color: '#e53e3e', bg: '#fff5f5', border: '#fed7d7' },
    { value: 'HIGH',     label: 'High',     desc: 'Serious risk, urgent action', color: '#dd6b20', bg: '#fffaf0', border: '#fbd38d' },
    { value: 'MODERATE', label: 'Moderate', desc: 'Developing situation', color: '#d69e2e', bg: '#fffff0', border: '#faf089' },
    { value: 'LOW',      label: 'Low',      desc: 'Minor incident or advisory', color: '#38a169', bg: '#f0fff4', border: '#c6f6d5' },
];

/* ── Demo past reports ── */
const DEMO_REPORTS = [
    { id: 'RPT-2847', type: 'Flash Flood', location: 'Zone B4, Coastal District', status: 'Under Review', submitted_at: new Date(Date.now() - 7200000).toISOString(), severity: 'CRITICAL' },
    { id: 'RPT-2831', type: 'Landslide',   location: 'Sector 12, Northern Hills',  status: 'Resolved',    submitted_at: new Date(Date.now() - 172800000).toISOString(), severity: 'HIGH' },
    { id: 'RPT-2819', type: 'Road Hazard', location: 'Main Street',               status: 'Pending',     submitted_at: new Date(Date.now() - 432000000).toISOString(), severity: 'MODERATE' },
];

const STATUS_STYLE = {
    'Under Review': { color: '#3182ce', bg: '#ebf8ff' },
    'Resolved':     { color: '#38a169', bg: '#f0fff4' },
    'Pending':      { color: '#dd6b20', bg: '#fffaf0' },
    'Rejected':     { color: '#e53e3e', bg: '#fff5f5' },
};

const SEV_COLOR = { CRITICAL: '#e53e3e', HIGH: '#dd6b20', MODERATE: '#d69e2e', LOW: '#38a169' };

const relTime = (iso) => {
    const m = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (m < 60)   return `${m}m ago`;
    if (m < 1440) return `${Math.floor(m / 60)}h ago`;
    return `${Math.floor(m / 1440)}d ago`;
};

const DRAFT_KEY = 'resqlink_report_draft';

/* ─────────────────────── */

const Report = () => {
    const [step, setStep]           = useState(1);   // 1 | 2 | 3
    const [submitted, setSubmitted] = useState(null); // report ID after success

    /* Form fields */
    const [form, setForm] = useState({
        type: '', severity: '', location: '', description: '',
        lat: '', lng: '', peopleAffected: '', landmark: '',
    });
    const [images, setImages]     = useState([]);   // File[]
    const [previews, setPreviews] = useState([]);   // string[]
    const [errors, setErrors]     = useState({});
    const [loading, setLoading]   = useState(false);
    const [locating, setLocating] = useState(false);
    const [gpsAccuracy, setGpsAccuracy] = useState(null);

    /* Past reports */
    const [myReports, setMyReports] = useState([]);
    const [reportsLoading, setReportsLoading] = useState(true);

    const fileRef = useRef();

    /* ── Load past reports ── */
    useEffect(() => {
        getMyReports()
            .then(res => {
                const data = res.data?.data ?? res.data;
                setMyReports(Array.isArray(data) ? data : []);
            })
            .catch(() => setMyReports([]))
            .finally(() => setReportsLoading(false));
    }, []);

    /* ── Draft save/restore ── */
    useEffect(() => {
        const draft = localStorage.getItem(DRAFT_KEY);
        if (draft) { try { setForm(JSON.parse(draft)); } catch { } }
    }, []);
    useEffect(() => {
        if (form.type || form.description)
            localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    }, [form]);

    const set = (field, val) => {
        setForm(prev => ({ ...prev, [field]: val }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    /* ── Geolocation ── */
    const pinGPS = () => {
        if (!navigator.geolocation) { setErrors(e => ({ ...e, location: 'Geolocation not supported.' })); return; }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setForm(prev => ({
                    ...prev,
                    lat: coords.latitude.toFixed(6),
                    lng: coords.longitude.toFixed(6),
                    location: `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`,
                }));
                setGpsAccuracy(Math.round(coords.accuracy));
                setErrors(e => ({ ...e, location: '' }));
                setLocating(false);
            },
            () => { setErrors(e => ({ ...e, location: 'Could not retrieve GPS location.' })); setLocating(false); },
            { enableHighAccuracy: true },
        );
    };

    /* ── Image upload (max 3) ── */
    const onFiles = (files) => {
        const valid = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 3 - images.length);
        if (!valid.length) return;
        setImages(prev => [...prev, ...valid].slice(0, 3));
        setPreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))].slice(0, 3));
    };
    const removeImage = (i) => {
        setImages(prev => prev.filter((_, idx) => idx !== i));
        setPreviews(prev => prev.filter((_, idx) => idx !== i));
    };

    /* ── Validation ── */
    const validateStep = (s) => {
        const errs = {};
        if (s === 1) {
            if (!form.type)     errs.type     = 'Please select a disaster type.';
            if (!form.severity) errs.severity = 'Please select a severity level.';
        }
        if (s === 2) {
            if (!form.location)    errs.location    = 'Please specify the location.';
            if (form.description && form.description.length < 20) errs.description = 'Description must be at least 20 characters.';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const nextStep = () => { if (validateStep(step)) setStep(s => s + 1); };
    const prevStep = () => setStep(s => s - 1);

    /* ── Submit ── */
    const handleSubmit = async () => {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
        images.forEach(img => fd.append('media', img));

        setLoading(true);
        try {
            const res = await submitReport(fd);
            const reportId = res.data?.id ?? `RPT-${Math.floor(1000 + Math.random() * 9000)}`;
            localStorage.removeItem(DRAFT_KEY);
            setSubmitted(reportId);
            // Add to local list immediately
            setMyReports(prev => [{
                id: reportId, type: form.type, location: form.location,
                status: 'Pending', submitted_at: new Date().toISOString(), severity: form.severity,
            }, ...prev]);
        } catch (err) {
            console.error('Error submitting report:', err);
            const msg = err.response?.data?.message || err.message || 'Failed to submit report. Please try again later.';
            setErrors({ location: msg });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ type: '', severity: '', location: '', description: '', lat: '', lng: '', peopleAffected: '', landmark: '' });
        setImages([]); setPreviews([]); setErrors({}); setStep(1); setSubmitted(null); setGpsAccuracy(null);
    };

    /* ── Success screen ── */
    if (submitted) return (
        <div style={s.page}>
            <div style={s.successWrap}>
                <div style={s.successCard} className="card">
                    <div style={s.successIcon}><CheckCircle2 size={48} color="#38a169" /></div>
                    <h2 style={s.successTitle}>Report Submitted</h2>
                    <p style={s.successSub}>Your report has been received by the emergency response team.</p>
                    <div style={s.reportIdBox}>
                        <span style={s.reportIdLabel}>Report ID</span>
                        <span style={s.reportIdVal}>{submitted}</span>
                    </div>
                    <div style={s.successSteps}>
                        {[
                            { icon: Clock,      label: 'Under review within 15 minutes' },
                            { icon: ShieldAlert, label: 'Responders alerted immediately' },
                            { icon: Phone,      label: 'You may be contacted for details' },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} style={s.successStep}>
                                <div style={s.successStepIcon}><Icon size={16} color="#1a9e7a" /></div>
                                <span style={s.successStepText}>{label}</span>
                            </div>
                        ))}
                    </div>
                    <div style={s.successBtns}>
                        <button onClick={resetForm} style={s.submitAnotherBtn}>
                            <FileText size={15} /> Submit Another Report
                        </button>
                        <Link to="/citizen/alerts" style={s.viewAlertsBtn}>
                            View Alerts <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={s.page}>
            <div style={s.layout} className="report-layout">

                {/* ── Left: wizard form ── */}
                <div style={s.formSide}>

                    {/* Header */}
                    <div style={s.header}>
                        <h1 style={s.title}>Submit Disaster Report</h1>
                        <p style={s.sub}>Provide incident details so responders can act quickly and effectively.</p>
                    </div>

                    {/* Step progress */}
                    <div style={s.stepBar}>
                        {[
                            { n: 1, label: 'Incident Type' },
                            { n: 2, label: 'Location & Details' },
                            { n: 3, label: 'Media & Review' },
                        ].map(({ n, label }, i, arr) => (
                            <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < arr.length ? 1 : 0 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <div style={{
                                        ...s.stepDot,
                                        background: step > n ? '#1a9e7a' : step === n ? '#1a2456' : 'var(--border)',
                                        color: step >= n ? '#fff' : 'var(--text-muted)',
                                    }}>
                                        {step > n ? <Check size={14} /> : n}
                                    </div>
                                    <span style={{ ...s.stepLabel, color: step === n ? '#1a2456' : 'var(--text-muted)' }}>
                                        {label}
                                    </span>
                                </div>
                                {i < arr.length - 1 && (
                                    <div style={{ ...s.stepLine, background: step > n ? '#1a9e7a' : 'var(--border)' }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── STEP 1: Incident Type & Severity ── */}
                    {step === 1 && (
                        <div style={s.stepContent} className="card">
                            <h3 style={s.stepTitle}>What type of disaster are you reporting?</h3>

                            {/* Type grid */}
                            <div>
                                <label style={s.fieldLabel}>Disaster Type</label>
                                <div style={s.typeGrid} className="report-type-grid">
                                    {DISASTER_TYPES.map(({ value, label, icon: Icon, color, bg }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => set('type', form.type === value ? '' : value)}
                                            style={{
                                                ...s.typeCard,
                                                ...(form.type === value ? { ...s.typeCardActive, borderColor: color } : {}),
                                            }}
                                        >
                                            <div style={{ ...s.typeIcon, background: form.type === value ? bg : 'var(--bg-hover)' }}>
                                                <Icon size={20} color={form.type === value ? color : 'var(--text-muted)'} />
                                            </div>
                                            <span style={{
                                                ...s.typeLabel,
                                                color: form.type === value ? color : 'var(--text-mid)',
                                                fontWeight: form.type === value ? 700 : 500,
                                            }}>
                                                {label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                {errors.type && <p style={s.fieldError}>{errors.type}</p>}
                            </div>

                            {/* Severity */}
                            <div>
                                <label style={s.fieldLabel}>Severity Level</label>
                                <div style={s.sevGrid}>
                                    {SEVERITIES.map(({ value, label, desc, color, bg, border }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => set('severity', form.severity === value ? '' : value)}
                                            style={{
                                                ...s.sevCard,
                                                background: form.severity === value ? bg : 'var(--bg-card)',
                                                border: `1.5px solid ${form.severity === value ? color : 'var(--border)'}`,
                                            }}
                                        >
                                            <div style={{ ...s.sevDot, background: color }} />
                                            <div style={{ textAlign: 'left' }}>
                                                <div style={{ ...s.sevLabel, color: form.severity === value ? color : 'var(--text-dark)' }}>
                                                    {label}
                                                </div>
                                                <div style={s.sevDesc}>{desc}</div>
                                            </div>
                                            {form.severity === value && <Check size={14} color={color} style={{ marginLeft: 'auto' }} />}
                                        </button>
                                    ))}
                                </div>
                                {errors.severity && <p style={s.fieldError}>{errors.severity}</p>}
                            </div>

                            <button onClick={nextStep} style={s.nextBtn}>
                                Continue <ChevronRight size={16} />
                            </button>
                        </div>
                    )}

                    {/* ── STEP 2: Location & Details ── */}
                    {step === 2 && (
                        <div style={s.stepContent} className="card">
                            <h3 style={s.stepTitle}>Where and what happened?</h3>

                            {/* Summary Badges */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '4px 12px',
                                    borderRadius: '16px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    background: DISASTER_TYPES.find(d => d.value === form.type)?.bg || 'var(--bg-hover)',
                                    color: DISASTER_TYPES.find(d => d.value === form.type)?.color || 'var(--text-dark)',
                                    border: `1px solid ${DISASTER_TYPES.find(d => d.value === form.type)?.color}40` || '1px solid var(--border)'
                                }}>
                                    {form.type}
                                </span>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '4px 12px',
                                    borderRadius: '16px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    background: SEVERITIES.find(sev => sev.value === form.severity)?.bg || '#fff5f5',
                                    color: SEVERITIES.find(sev => sev.value === form.severity)?.color || '#e53e3e',
                                    border: `1px solid ${SEVERITIES.find(sev => sev.value === form.severity)?.border || '#fed7d7'}`
                                }}>
                                    Severity: {SEVERITIES.find(sev => sev.value === form.severity)?.label || form.severity}
                                </span>
                            </div>

                            {/* Location */}
                            <div className="form-group">
                                <label style={s.fieldLabel}>Location / Address *</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={15} color="#a0aec0" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        value={form.location}
                                        onChange={e => set('location', e.target.value)}
                                        placeholder="Enter address, landmark, or zone"
                                        style={{ ...s.input, paddingLeft: 36, borderColor: errors.location ? '#e53e3e' : 'var(--border)' }}
                                    />
                                </div>
                                {/* GPS button */}
                                <button onClick={pinGPS} disabled={locating} style={s.gpsBtn}>
                                    <Navigation size={13} />
                                    {locating ? 'Getting GPS…' : 'Use My GPS Location'}
                                    {gpsAccuracy && <span style={s.gpsBadge}>±{gpsAccuracy}m accuracy</span>}
                                </button>
                                {form.lat && (
                                    <div style={s.coordsRow}>
                                        <span style={s.coordsText}>📍 {form.lat}, {form.lng}</span>
                                        <button onClick={() => { setForm(p => ({ ...p, lat: '', lng: '' })); setGpsAccuracy(null); }} style={s.clearCoords}>clear</button>
                                    </div>
                                )}
                                {errors.location && <p style={s.fieldError}>{errors.location}</p>}
                            </div>

                            {/* Landmark */}
                            <div className="form-group">
                                <label style={s.fieldLabel}>Nearest Landmark (optional)</label>
                                <input
                                    value={form.landmark}
                                    onChange={e => set('landmark', e.target.value)}
                                    placeholder="e.g. Near Kandy Market, 100m from bridge"
                                    style={s.input}
                                />
                            </div>

                            {/* Description */}
                            <div className="form-group">
                                <label style={s.fieldLabel}>Description (optional)</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => set('description', e.target.value)}
                                    rows={5}
                                    maxLength={600}
                                    placeholder="Describe the situation clearly — what you see, dangers present, number of people affected, any casualties..."
                                    style={{
                                        ...s.input, resize: 'vertical', minHeight: 120,
                                        borderColor: errors.description ? '#e53e3e' : 'var(--border)',
                                    }}
                                />
                                <div style={s.charCount}>
                                    <span style={{ color: form.description.length < 20 ? '#e53e3e' : 'var(--text-light)' }}>
                                        {form.description.length} / 600
                                    </span>
                                    {errors.description && <span style={{ color: '#e53e3e' }}>{errors.description}</span>}
                                </div>
                            </div>

                            {/* People affected */}
                            <div className="form-group">
                                <label style={s.fieldLabel}>Estimated People Affected (optional)</label>
                                <div style={{ position: 'relative', maxWidth: 200 }}>
                                    <Users size={15} color="#a0aec0" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text"
                                        value={form.peopleAffected}
                                        onChange={e => set('peopleAffected', e.target.value)}
                                        placeholder="e.g. 50 or 100+"
                                        style={{ ...s.input, paddingLeft: 36 }}
                                    />
                                </div>
                            </div>

                            <div style={s.stepNavRow}>
                                <button onClick={prevStep} style={s.backBtn}>
                                    <ChevronLeft size={16} /> Back
                                </button>
                                <button onClick={nextStep} style={s.nextBtn}>
                                    Continue <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Media & Review ── */}
                    {step === 3 && (
                        <div style={s.stepContent} className="card">
                            <h3 style={s.stepTitle}>Add photos and review your report</h3>

                            {/* Image upload */}
                            <div className="form-group">
                                <label style={s.fieldLabel}>
                                    Photos (optional — up to 3)
                                    <span style={s.imgCount}>{images.length}/3</span>
                                </label>

                                {/* Preview grid */}
                                {previews.length > 0 && (
                                    <div style={s.previewGrid}>
                                        {previews.map((src, i) => (
                                            <div key={i} style={s.previewItem}>
                                                <img src={src} alt={`preview-${i}`} style={s.previewImg} />
                                                <button onClick={() => removeImage(i)} style={s.removeBtn}>
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Drop zone (shown if < 3 images) */}
                                {images.length < 3 && (
                                    <div
                                        style={s.dropZone}
                                        onClick={() => fileRef.current.click()}
                                        onDragOver={e => e.preventDefault()}
                                        onDrop={e => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
                                    >
                                        <div style={s.uploadIconWrap}><ImageIcon size={24} color="#718096" /></div>
                                        <div style={s.uploadText}>Click to upload or drag & drop</div>
                                        <div style={s.uploadHint}>PNG, JPG, HEIC — max 10MB each</div>
                                    </div>
                                )}
                                <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => onFiles(e.target.files)} />
                            </div>

                            {/* Review summary */}
                            <div style={s.reviewBox}>
                                <div style={s.reviewTitle}>
                                    <Eye size={14} color="#1a2456" /> Review Your Report
                                </div>
                                <div style={s.reviewGrid}>
                                    {[
                                        { label: 'Type',        value: form.type },
                                        { label: 'Severity',    value: form.severity,
                                          style: { color: SEV_COLOR[form.severity], fontWeight: 700 } },
                                        { label: 'Location',    value: form.location },
                                        { label: 'Coordinates', value: form.lat ? `${form.lat}, ${form.lng}` : 'Not provided' },
                                        { label: 'People',      value: form.peopleAffected || 'Not specified' },
                                        { label: 'Photos',      value: `${images.length} attached` },
                                    ].map(({ label, value, style }) => (
                                        <div key={label} style={s.reviewRow}>
                                            <span style={s.reviewLabel}>{label}</span>
                                            <span style={{ ...s.reviewValue, ...style }}>{value || '—'}</span>
                                        </div>
                                    ))}
                                    <div style={{ ...s.reviewRow, gridColumn: '1 / -1' }}>
                                        <span style={s.reviewLabel}>Description</span>
                                        <span style={{ ...s.reviewValue, lineHeight: 1.5 }}>{form.description}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={s.privacyNote}>
                                🔒 Your report is encrypted and sent directly to emergency services
                            </div>
                            
                            {errors.location && (
                                <div style={{ color: '#e53e3e', fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
                                    {errors.location}
                                </div>
                            )}

                            <div style={s.stepNavRow}>
                                <button onClick={prevStep} style={s.backBtn}>
                                    <ChevronLeft size={16} /> Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
                                >
                                    {loading
                                        ? <><RefreshCw size={15} style={{ animation: 'spin .8s linear infinite' }} /> Submitting…</>
                                        : <><Send size={15} /> Submit Report</>
                                    }
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Emergency info cards */}
                    <div style={s.infoRow} className="report-info-row">
                        {[
                            { icon: Phone,     color: '#3182ce', bg: '#ebf8ff', title: 'Emergency?',    body: 'Call 119 immediately if lives are at risk.' },
                            { icon: ShieldAlert, color: '#38a169', bg: '#f0fff4', title: 'Safe Zones',  body: 'Find nearest evacuation centers on the map.' },
                            { icon: Radio,     color: '#dd6b20', bg: '#fffaf0', title: 'Live Alerts',   body: 'Monitor real-time alerts from command center.' },
                        ].map(({ icon: Icon, color, bg, title, body }) => (
                            <div key={title} style={s.infoCard} className="card">
                                <div style={{ ...s.infoIcon, background: bg }}><Icon size={16} color={color} /></div>
                                <div>
                                    <div style={s.infoTitle}>{title}</div>
                                    <div style={s.infoBody}>{body}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right: My Reports history ── */}
                <div style={s.historySide}>
                    <div style={s.historyHeader}>
                        <h3 style={s.historyTitle}>My Reports</h3>
                        <span style={s.historyCount}>{myReports.length} total</span>
                    </div>

                    {reportsLoading ? (
                        <div style={s.historyLoading}>Loading reports…</div>
                    ) : myReports.length === 0 ? (
                        <div style={s.historyEmpty}>
                            <FileText size={28} color="#cbd5e0" />
                            <p>No reports submitted yet.</p>
                        </div>
                    ) : (
                        <div style={s.historyList} className="history-scroll">
                            {myReports.map((r, i) => {
                                const st = STATUS_STYLE[r.status] ?? STATUS_STYLE['Pending'];
                                const sc = SEV_COLOR[r.severity] ?? '#718096';
                                return (
                                    <div key={r.id ?? i} style={s.historyCard} className="card">
                                        <div style={s.historyTop}>
                                            <span style={s.historyId}>{r.id}</span>
                                            <span style={{ ...s.historyStatus, color: st.color, background: st.bg }}>
                                                {r.status}
                                            </span>
                                        </div>
                                        <div style={s.historyType}>{r.type}</div>
                                        <div style={s.historyLoc}>📍 {r.location}</div>
                                        <div style={s.historyMeta}>
                                            <span style={{ color: sc, fontSize: 11, fontWeight: 700 }}>{r.severity}</span>
                                            <span style={s.historyTime}><Clock size={10} /> {relTime(r.submitted_at || r.created_at || r.createdAt)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Emergency contact */}
                    <div style={s.emergencyBox}>
                        <div style={s.emergencyTitle}>🆘 Emergency Hotline</div>
                        <a href="tel:119" style={s.emergencyNumber}>119</a>
                        <p style={s.emergencyNote}>Available 24/7 for life-threatening situations</p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .history-scroll::-webkit-scrollbar { width: 6px; }
                .history-scroll::-webkit-scrollbar-track { background: transparent; }
                .history-scroll::-webkit-scrollbar-thumb { background: rgba(160, 174, 192, 0.3); border-radius: 10px; }
                .history-scroll::-webkit-scrollbar-thumb:hover { background: rgba(160, 174, 192, 0.5); }
            `}</style>
        </div>
    );
};

/* ── Styles ── */
const s = {
    page: { display: 'flex', flexDirection: 'column' },
    layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, alignItems: 'start' },

    /* Form side */
    formSide: { display: 'flex', flexDirection: 'column', gap: 20 },
    header: {},
    title: { fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 6 },
    sub: { color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.5 },

    /* Step bar */
    stepBar: { display: 'flex', alignItems: 'flex-start', gap: 0 },
    stepDot: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },
    stepLabel: { fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' },
    stepLine: { flex: 1, height: 2, marginTop: 15, marginBottom: 0 },

    /* Step content */
    stepContent: { padding: 24, display: 'flex', flexDirection: 'column', gap: 20 },
    stepTitle: { fontSize: 16, fontWeight: 700, color: 'var(--text-dark)', margin: 0 },
    fieldLabel: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8 },
    fieldError: { margin: '4px 0 0', fontSize: 12, color: '#e53e3e', fontWeight: 500 },

    /* Type grid */
    typeGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 },
    typeCard: { outline: 'none', WebkitTapHighlightColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 8px', border: '1.5px solid var(--border)', borderRadius: 12, background: 'var(--bg-card)', cursor: 'pointer', transition: 'all .15s ease' },
    typeCardActive: { background: 'var(--bg-hover)' },
    typeIcon: { width: 44, height: 44, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    typeLabel: { fontSize: 12, textAlign: 'center' },

    /* Severity */
    sevGrid: { display: 'flex', flexDirection: 'column', gap: 8 },
    sevCard: { outline: 'none', WebkitTapHighlightColor: 'transparent', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, cursor: 'pointer', transition: 'all .15s ease', textAlign: 'left' },
    sevDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
    sevLabel: { fontSize: 14, fontWeight: 600, marginBottom: 2 },
    sevDesc: { fontSize: 12, color: 'var(--text-muted)' },

    /* Step nav */
    stepNavRow: { display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 4 },
    nextBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '12px 24px', background: '#1a2456', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' },
    backBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '12px 20px', background: 'var(--bg-hover)', color: 'var(--text-mid)', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
    submitBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: 'linear-gradient(135deg,#1a9e7a,#147a5f)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(26,158,122,.3)' },

    /* Inputs */
    input: { width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, background: 'var(--bg-input)', color: 'var(--text-dark)', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter,sans-serif' },
    charCount: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 },
    gpsBtn: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '9px 14px', background: '#1a2456', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' },
    gpsBadge: { padding: '2px 8px', background: 'rgba(255,255,255,.2)', borderRadius: 99, fontSize: 10 },
    coordsRow: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 },
    coordsText: { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' },
    clearCoords: { fontSize: 11, color: '#3182ce', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 },

    /* Image upload */
    imgCount: { marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '1px 8px', borderRadius: 99 },
    previewGrid: { display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' },
    previewItem: { position: 'relative' },
    previewImg: { width: 90, height: 90, objectFit: 'cover', borderRadius: 10, display: 'block' },
    removeBtn: { position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,.55)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
    dropZone: { border: '2px dashed var(--border-mid)', borderRadius: 12, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-hover)', transition: 'border-color .2s' },
    uploadIconWrap: { width: 46, height: 46, borderRadius: 12, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' },
    uploadText: { fontWeight: 600, fontSize: 13, color: 'var(--text-mid)', marginBottom: 4 },
    uploadHint: { fontSize: 12, color: 'var(--text-light)' },

    /* Review box */
    reviewBox: { background: 'var(--bg-hover)', borderRadius: 12, padding: '14px 16px', border: '1px solid var(--border)' },
    reviewTitle: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 12 },
    reviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px' },
    reviewRow: { display: 'flex', flexDirection: 'column', gap: 2 },
    reviewLabel: { fontSize: 10, fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '.4px' },
    reviewValue: { fontSize: 13, fontWeight: 500, color: 'var(--text-dark)' },
    privacyNote: { textAlign: 'center', fontSize: 11, color: 'var(--text-light)', letterSpacing: '.3px', fontWeight: 600 },

    /* Info row */
    infoRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
    infoCard: { padding: 14, display: 'flex', gap: 10, alignItems: 'flex-start' },
    infoIcon: { width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    infoTitle: { fontWeight: 700, fontSize: 12, color: 'var(--text-dark)', marginBottom: 3 },
    infoBody: { fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 },

    /* History sidebar */
    historySide: { display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 20 },
    historyHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    historyTitle: { fontSize: 15, fontWeight: 700, color: 'var(--text-dark)', margin: 0 },
    historyCount: { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '2px 8px', borderRadius: 99, border: '1px solid var(--border)' },
    historyList: { display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: 'calc(100vh - 220px)', paddingRight: 6 },
    historyCard: { padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 5 },
    historyTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    historyId: { fontSize: 11, fontWeight: 700, color: 'var(--text-light)', fontFamily: 'monospace' },
    historyStatus: { fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '.3px' },
    historyType: { fontSize: 13, fontWeight: 700, color: 'var(--text-dark)' },
    historyLoc: { fontSize: 12, color: 'var(--text-muted)' },
    historyMeta: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
    historyTime: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-light)' },
    historyLoading: { fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' },
    historyEmpty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '28px 0', color: 'var(--text-muted)', fontSize: 13 },

    /* Emergency box */
    emergencyBox: { background: 'linear-gradient(135deg,#fff5f5,#fff)', border: '1.5px solid #fed7d7', borderRadius: 14, padding: '16px 18px', textAlign: 'center' },
    emergencyTitle: { fontSize: 13, fontWeight: 700, color: '#c53030', marginBottom: 8 },
    emergencyNumber: { display: 'block', fontSize: 36, fontWeight: 900, color: '#e53e3e', textDecoration: 'none', lineHeight: 1, marginBottom: 6 },
    emergencyNote: { fontSize: 11, color: '#c53030', margin: 0, opacity: .8 },

    /* Success screen */
    successWrap: { display: 'flex', justifyContent: 'center', padding: '20px 0' },
    successCard: { width: '100%', maxWidth: 480, padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' },
    successIcon: { width: 80, height: 80, borderRadius: '50%', background: 'rgba(56, 161, 105, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    successTitle: { fontSize: 24, fontWeight: 800, color: 'var(--text-dark)', margin: 0 },
    successSub: { fontSize: 14, color: 'var(--text-muted)', margin: 0 },
    reportIdBox: { display: 'flex', flexDirection: 'column', gap: 4, background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 24px', width: '100%' },
    reportIdLabel: { fontSize: 11, fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '.5px' },
    reportIdVal: { fontSize: 22, fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'monospace' },
    successSteps: { display: 'flex', flexDirection: 'column', gap: 10, width: '100%' },
    successStep: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(56, 161, 105, 0.08)', borderRadius: 10, border: '1px solid rgba(56, 161, 105, 0.2)', textAlign: 'left' },
    successStepIcon: { width: 32, height: 32, borderRadius: 8, background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    successStepText: { fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' },
    successBtns: { display: 'flex', gap: 12, width: '100%', flexWrap: 'wrap' },
    submitAnotherBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', background: 'linear-gradient(135deg,#1a9e7a,#147a5f)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(26,158,122,.2)' },
    viewAlertsBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', background: 'var(--bg-hover)', color: 'var(--text-dark)', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' },
};

export default Report;
