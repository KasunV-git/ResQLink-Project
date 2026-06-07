// frontend/src/pages/citizen/MapPage.jsx
// Install: npm install leaflet react-leaflet
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Layers, Navigation, AlertTriangle, Shield,
    Building, Activity, X, ChevronRight,
} from 'lucide-react';
import { getNearbyHazards } from '../../api/disasterApi';

/* ── Fix Leaflet default icon broken in Webpack/Vite ── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* ── Custom SVG markers ── */
const makeIcon = (color, emoji) => L.divIcon({
    html: `<div style="
    width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
    background:${color};border:3px solid #fff;display:flex;align-items:center;
    justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.3);
  "><span style="transform:rotate(45deg);font-size:14px;line-height:1">${emoji}</span></div>`,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -36],
});

const icons = {
    flood: makeIcon('#3182ce', '🌊'),
    fire: makeIcon('#e53e3e', '🔥'),
    landslide: makeIcon('#dd6b20', '⛰️'),
    shelter: makeIcon('#38a169', '🏥'),
    hazard: makeIcon('#d69e2e', '⚠️'),
    user: makeIcon('#1a2456', '📍'),
};

/* ── Demo map markers ── */
const DEMO_MARKERS = [
    { id: 1, type: 'flood', lat: 7.2906, lng: 80.6337, title: 'Flash Flood Zone B4', severity: 'CRITICAL', desc: 'Water level rising at creek junction. Evacuation in progress.' },
    { id: 2, type: 'landslide', lat: 7.3050, lng: 80.6200, title: 'Landslide Risk Area', severity: 'HIGH', desc: 'Unstable slopes after overnight rainfall. Sector 12 roads closed.' },
    { id: 3, type: 'shelter', lat: 7.2800, lng: 80.6450, title: 'Safe Zone – School', severity: 'SAFE', desc: 'Kandy Primary School – 200 capacity evacuation center. Medical outpost active.' },
    { id: 4, type: 'shelter', lat: 7.2750, lng: 80.6150, title: 'Safe Zone – Community Hall', severity: 'SAFE', desc: 'Peradeniya Community Hall – 150 capacity.' },
    { id: 5, type: 'fire', lat: 7.3100, lng: 80.6500, title: 'Industrial Fire', severity: 'HIGH', desc: 'Chemical plant fire. 500m exclusion zone active.' },
    { id: 6, type: 'hazard', lat: 7.2950, lng: 80.6600, title: 'Road Hazard', severity: 'MODERATE', desc: 'Main Street partially blocked. Use alternate routes.' },
];

/* ── Auto-center helper ── */
const FlyTo = ({ center }) => {
    const map = useMap();
    useEffect(() => { if (center) map.flyTo(center, 14, { duration: 1.2 }); }, [center]);
    return null;
};

/* ─────────────────────── */

const LAYERS = [
    { key: 'ALL', label: 'All', icon: Layers },
    { key: 'flood', label: 'Floods', icon: Activity },
    { key: 'shelter', label: 'Shelters', icon: Shield },
    { key: 'fire', label: 'Fire', icon: AlertTriangle },
    { key: 'hazard', label: 'Hazards', icon: AlertTriangle },
];

const SEVERITY_COLOR = {
    CRITICAL: '#e53e3e',
    HIGH: '#dd6b20',
    MODERATE: '#d69e2e',
    SAFE: '#38a169',
};

const MapPage = () => {
    const [markers, setMarkers] = useState(DEMO_MARKERS);
    const [layer, setLayer] = useState('ALL');
    const [center, setCenter] = useState(null);
    const [active, setActive] = useState(null); // selected marker
    const [userPos, setUserPos] = useState(null);
    const [locating, setLocating] = useState(false);

    /* Load real hazards from API (falls back to demo) */
    useEffect(() => {
        if (userPos) {
            getNearbyHazards({ lat: userPos[0], lng: userPos[1], radius: 20 })
                .then(({ data }) => { if (data.data?.length) setMarkers(data.data); })
                .catch(() => { });
        }
    }, [userPos]);

    const locateMe = () => {
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const pos2 = [pos.coords.latitude, pos.coords.longitude];
                setUserPos(pos2);
                setCenter(pos2);
                setLocating(false);
            },
            () => setLocating(false),
        );
    };

    const visible = layer === 'ALL' ? markers : markers.filter(m => m.type === layer);

    return (
        <div style={s.page}>
            {/* ── Page title ── */}
            <div style={s.pageHead}>
                <div>
                    <h1 style={s.title}>Safety Map</h1>
                    <p style={s.sub}>Live hazard zones, safe shelters, and evacuation routes in your area.</p>
                </div>
                <button onClick={locateMe} style={s.locateBtn} disabled={locating}>
                    <Navigation size={14} />
                    {locating ? 'Locating…' : 'My Location'}
                </button>
            </div>

            {/* ── Layer filter ── */}
            <div style={s.filterBar}>
                {LAYERS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setLayer(key)}
                        style={{ ...s.layerBtn, ...(layer === key ? s.layerActive : {}) }}
                    >
                        <Icon size={13} />
                        {label}
                    </button>
                ))}
            </div>

            {/* ── Map + sidebar ── */}
            <div style={s.mapWrapper}>
                {/* Leaflet map */}
                <div style={s.mapContainer}>
                    <MapContainer
                        center={[7.2906, 80.6337]}
                        zoom={13}
                        style={{ height: '100%', width: '100%', borderRadius: active ? '16px 0 0 16px' : 16 }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="© OpenStreetMap contributors"
                        />
                        {center && <FlyTo center={center} />}

                        {/* User position */}
                        {userPos && (
                            <>
                                <Marker position={userPos} icon={icons.user}>
                                    <Popup>Your current location</Popup>
                                </Marker>
                                <Circle center={userPos} radius={500} pathOptions={{ color: '#1a2456', fillOpacity: .08 }} />
                            </>
                        )}

                        {/* Hazard / shelter markers */}
                        {visible.map((m) => (
                            <Marker
                                key={m.id}
                                position={[m.lat, m.lng]}
                                icon={icons[m.type] ?? icons.hazard}
                                eventHandlers={{ click: () => { setActive(m); setCenter([m.lat, m.lng]); } }}
                            >
                                <Popup>
                                    <strong>{m.title}</strong><br />
                                    <span style={{ color: SEVERITY_COLOR[m.severity] ?? '#718096' }}>{m.severity}</span>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Danger circle overlay for critical markers */}
                        {visible.filter(m => m.severity === 'CRITICAL').map(m => (
                            <Circle
                                key={`c-${m.id}`}
                                center={[m.lat, m.lng]}
                                radius={300}
                                pathOptions={{ color: '#e53e3e', fillColor: '#e53e3e', fillOpacity: .12 }}
                            />
                        ))}
                    </MapContainer>
                </div>

                {/* Detail panel */}
                {active && (
                    <div style={s.detailPanel} className="fade-in">
                        <button onClick={() => setActive(null)} style={s.closeBtn}><X size={16} /></button>
                        <div style={{ ...s.detailSev, background: SEVERITY_COLOR[active.severity] + '18', color: SEVERITY_COLOR[active.severity] ?? '#718096' }}>
                            {active.severity}
                        </div>
                        <h3 style={s.detailTitle}>{active.title}</h3>
                        <p style={s.detailDesc}>{active.desc}</p>
                        <div style={s.detailCoords}>
                            📍 {active.lat.toFixed(4)}, {active.lng.toFixed(4)}
                        </div>
                        {active.type === 'shelter' && (
                            <button
                                onClick={() => setCenter([active.lat, active.lng])}
                                style={s.navBtn}
                            >
                                <Navigation size={14} /> Navigate <ChevronRight size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ── Legend ── */}
            <div style={s.legend} className="card">
                <div style={s.legendTitle}>Map Legend</div>
                {[
                    { color: '#3182ce', emoji: '🌊', label: 'Flood Zone' },
                    { color: '#e53e3e', emoji: '🔥', label: 'Fire / Exclusion Zone' },
                    { color: '#dd6b20', emoji: '⛰️', label: 'Landslide Risk' },
                    { color: '#38a169', emoji: '🏥', label: 'Safe Shelter / Evacuation Center' },
                    { color: '#d69e2e', emoji: '⚠️', label: 'General Hazard' },
                    { color: '#1a2456', emoji: '📍', label: 'Your Location' },
                ].map(({ color, emoji, label }) => (
                    <div key={label} style={s.legendItem}>
                        <span style={{ ...s.legendDot, background: color }}>{emoji}</span>
                        <span style={s.legendLabel}>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const s = {
    page: { display: 'flex', flexDirection: 'column', gap: 20 },
    pageHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: '#1a202c', marginBottom: 4 },
    sub: { color: '#718096', fontSize: 14 },
    locateBtn: {
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
        background: '#1a2456', color: '#fff', border: 'none', borderRadius: 10,
        fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif"
    },
    filterBar: { display: 'flex', gap: 8 },
    layerBtn: {
        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
        borderRadius: 8, fontSize: 12, fontWeight: 600, border: '1.5px solid #e2e8f0',
        background: '#fff', color: '#718096', cursor: 'pointer', transition: 'all .18s ease'
    },
    layerActive: { background: '#1a2456', color: '#fff', borderColor: '#1a2456' },
    mapWrapper: { display: 'flex', height: 520, borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,.12)' },
    mapContainer: { flex: 1 },
    detailPanel: {
        width: 280, background: '#fff', padding: 24, display: 'flex', flexDirection: 'column',
        gap: 12, borderLeft: '1px solid #e2e8f0', position: 'relative', overflowY: 'auto'
    },
    closeBtn: {
        position: 'absolute', top: 12, right: 12, background: '#f7fafc', border: '1px solid #e2e8f0',
        borderRadius: 8, cursor: 'pointer', padding: 4, display: 'flex'
    },
    detailSev: {
        display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 11,
        fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', width: 'fit-content'
    },
    detailTitle: { fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, color: '#1a202c' },
    detailDesc: { fontSize: 13, color: '#718096', lineHeight: 1.6 },
    detailCoords: { fontSize: 12, color: '#a0aec0', fontFamily: 'monospace' },
    navBtn: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 0',
        background: 'linear-gradient(135deg, #1a9e7a, #147a5f)', color: '#fff', border: 'none',
        borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', marginTop: 'auto'
    },
    legend: { padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' },
    legendTitle: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: '#1a202c', marginRight: 8 },
    legendItem: { display: 'flex', alignItems: 'center', gap: 6 },
    legendDot: { width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 },
    legendLabel: { fontSize: 12, color: '#4a5568' },
};

export default MapPage;