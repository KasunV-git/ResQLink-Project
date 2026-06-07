// frontend/src/pages/citizen/Report.jsx
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin, Upload, Send, AlertCircle, CheckCircle2,
    Phone, ShieldAlert, Radio, Image as ImageIcon, X,
} from 'lucide-react';
import { submitReport } from '../../api/disasterApi';

const DISASTER_TYPES = [
    'Flash Flood', 'Landslide', 'Earthquake', 'Cyclone / High Winds',
    'Tsunami Warning', 'Fire', 'Building Collapse', 'Medical Emergency',
    'Chemical Spill', 'Other',
];

const Report = () => {
    const [form, setForm] = useState({ type: '', location: '', description: '', lat: '', lng: '' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const fileRef = useRef();

    const onChange = (e) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const onFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
        fileRef.current.value = '';
    };

    /* Use browser geolocation to auto-fill coords */
    const pinOnMap = () => {
        if (!navigator.geolocation) { setError('Geolocation not supported.'); return; }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setForm(prev => ({
                    ...prev,
                    lat: pos.coords.latitude.toFixed(6),
                    lng: pos.coords.longitude.toFixed(6),
                    location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
                }));
                setSuccess('Location pinned from GPS.');
                setTimeout(() => setSuccess(''), 3000);
            },
            () => setError('Could not retrieve location.'),
        );
    };

    const handleSubmit = async () => {
        setError(''); setSuccess('');
        if (!form.type) { setError('Please select a disaster type.'); return; }
        if (!form.location) { setError('Please specify the disaster location.'); return; }

        const fd = new FormData();
        fd.append('type', form.type);
        fd.append('location', form.location);
        fd.append('description', form.description);
        fd.append('lat', form.lat);
        fd.append('lng', form.lng);
        if (image) fd.append('media', image);

        setLoading(true);
        try {
            await submitReport(fd);
            setSuccess('Report successfully submitted to Command Center');
            setForm({ type: '', location: '', description: '', lat: '', lng: '' });
            setImage(null); setPreview(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={s.page}>
            <div style={s.inner}>
                {/* Header */}
                <div style={s.header}>
                    <h1 style={s.title}>Submit Report</h1>
                    <p style={s.sub}>
                        Provide critical incident details to help first responders prioritize and
                        coordinate emergency efforts in your area.
                    </p>
                </div>

                {/* Feedback banners */}
                {success && (
                    <div style={{ ...s.banner, ...s.bannerSuccess }}>
                        <CheckCircle2 size={16} color="#38a169" />
                        <span>{success}</span>
                    </div>
                )}
                {error && (
                    <div style={{ ...s.banner, ...s.bannerError }}>
                        <AlertCircle size={16} color="#e53e3e" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form card */}
                <div style={s.formCard} className="card">
                    {/* Row 1: type + location */}
                    <div style={s.row}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Disaster Type</label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={onChange}
                                className="form-input"
                                style={{ appearance: 'none', background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23718096' d='M0 0l6 8 6-8z'/%3E%3C/svg%3E\") no-repeat right 14px center / 10px, #fff" }}
                            >
                                <option value="">Select emergency type</option>
                                {DISASTER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Location</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <MapPin size={16} color="#a0aec0" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        name="location"
                                        value={form.location}
                                        onChange={onChange}
                                        placeholder="Enter address or landmark"
                                        className="form-input"
                                        style={{ paddingLeft: 36, width: '100%' }}
                                    />
                                </div>
                            </div>
                            {/* Map pin button */}
                            <button onClick={pinOnMap} style={s.mapPinBtn}>
                                <MapPin size={14} />
                                TAP TO PIN ON MAP (GPS)
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={onChange}
                            rows={5}
                            maxLength={500}
                            placeholder="Describe the situation, number of people involved, and immediate dangers..."
                            className="form-input"
                            style={{ resize: 'vertical', minHeight: 120 }}
                        />
                        <div style={{ textAlign: 'right', fontSize: 12, color: '#a0aec0' }}>
                            {form.description.length} / 500 characters
                        </div>
                    </div>

                    {/* Image upload */}
                    <div className="form-group">
                        <label className="form-label">Optional Image Upload</label>
                        {preview ? (
                            <div style={s.previewWrap}>
                                <img src={preview} alt="preview" style={s.previewImg} />
                                <button onClick={removeImage} style={s.removeBtn}><X size={14} /></button>
                            </div>
                        ) : (
                            <div
                                style={s.dropZone}
                                onClick={() => fileRef.current.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => { e.preventDefault(); onFile({ target: { files: e.dataTransfer.files } }); }}
                            >
                                <div style={s.uploadIcon}><ImageIcon size={28} color="#4a5568" /></div>
                                <div style={s.uploadText}>Click to upload or drag and drop</div>
                                <div style={s.uploadHint}>PNG, JPG or HEIC (max. 10MB)</div>
                            </div>
                        )}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={onFile}
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{ ...s.submitBtn, opacity: loading ? .7 : 1 }}
                    >
                        {loading ? 'Submitting...' : <><Send size={16} /> Submit Report</>}
                    </button>

                    <div style={s.privacyNote}>
                        🔒 YOUR DATA IS ENCRYPTED AND SENT DIRECTLY TO EMERGENCY SERVICES
                    </div>
                </div>

                {/* Info cards */}
                <div style={s.infoGrid}>
                    {[
                        { icon: Phone, color: '#3182ce', bg: '#ebf8ff', title: 'Need Immediate Help?', body: 'If you are in life-threatening danger, call 119 immediately.' },
                        { icon: ShieldAlert, color: '#38a169', bg: '#f0fff4', title: 'Safe Zones', body: 'View the nearest evacuation centers and medical outposts.' },
                        { icon: Radio, color: '#dd6b20', bg: '#fffaf0', title: 'Live Alerts', body: 'Stay updated with real-time broadcast messages from HQ.' },
                    ].map(({ icon: Icon, color, bg, title, body }) => (
                        <div key={title} style={s.infoCard} className="card">
                            <div style={{ ...s.infoIcon, background: bg }}>
                                <Icon size={18} color={color} />
                            </div>
                            <div>
                                <div style={s.infoTitle}>{title}</div>
                                <div style={s.infoBody}>{body}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const s = {
    page: { display: 'flex', justifyContent: 'center' },
    inner: { width: '100%', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 24 },
    header: { textAlign: 'center', paddingBottom: 8 },
    title: { fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: '#1a202c', marginBottom: 8 },
    sub: { color: '#718096', fontSize: 14, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 },
    banner: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, fontSize: 14, fontWeight: 500 },
    bannerSuccess: { background: '#f0fff4', border: '1px solid #c6f6d5', color: '#276749' },
    bannerError: { background: '#fff5f5', border: '1px solid #fed7d7', color: '#9b2335' },
    formCard: { padding: 28, display: 'flex', flexDirection: 'column', gap: 20 },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
    mapPinBtn: {
        display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '10px 0', background: '#1a2456',
        color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 700,
        letterSpacing: '.5px', justifyContent: 'center'
    },
    dropZone: {
        border: '2px dashed #cbd5e0', borderRadius: 12, padding: '36px 20px', textAlign: 'center',
        cursor: 'pointer', transition: 'all .2s ease', background: '#fafbfc'
    },
    uploadIcon: {
        width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #e2e8f0, #edf2f7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
    },
    uploadText: { fontWeight: 600, fontSize: 14, color: '#4a5568', marginBottom: 4 },
    uploadHint: { fontSize: 12, color: '#a0aec0' },
    previewWrap: { position: 'relative', display: 'inline-block' },
    previewImg: { width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10 },
    removeBtn: {
        position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,.5)', color: '#fff',
        border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    submitBtn: {
        padding: '15px 0', background: 'linear-gradient(135deg, #1a9e7a, #147a5f)', color: '#fff',
        border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: "'DM Sans',sans-serif", boxShadow: '0 4px 14px rgba(26,158,122,.3)'
    },
    privacyNote: { textAlign: 'center', fontSize: 11, color: '#a0aec0', letterSpacing: '.5px', fontWeight: 600 },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
    infoCard: { padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' },
    infoIcon: { width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    infoTitle: { fontWeight: 700, fontSize: 13, color: '#1a202c', marginBottom: 4 },
    infoBody: { fontSize: 12, color: '#718096', lineHeight: 1.5 },
};

export default Report;