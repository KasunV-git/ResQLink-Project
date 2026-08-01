// frontend/src/pages/citizen/MapPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    MapContainer, TileLayer, Marker, Popup,
    Circle, Polyline, useMap, useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Layers, Navigation, AlertTriangle, Shield, Activity,
    X, ChevronRight, Search, Satellite, Map as MapIcon,
    Phone, Users, Clock, Info, Maximize2, RefreshCw,
    Flame, Droplets, MountainSnow, TriangleAlert,
} from 'lucide-react';
import { getNearbyHazards } from '../../api/disasterApi';

/* ── Fix Leaflet default icon (Vite breaks it) ── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* ── Marker config ── */
const TYPE_CONFIG = {
    flood:     { color: '#3182ce', emoji: '🌊', label: 'Flood Zone',      bg: '#ebf8ff' },
    fire:      { color: '#e53e3e', emoji: '🔥', label: 'Fire Zone',       bg: '#fff5f5' },
    landslide: { color: '#dd6b20', emoji: '⛰️', label: 'Landslide Risk',  bg: '#fffaf0' },
    shelter:   { color: '#38a169', emoji: '🏥', label: 'Safe Shelter',    bg: '#f0fff4' },
    hazard:    { color: '#d69e2e', emoji: '⚠️', label: 'General Hazard',  bg: '#fffff0' },
    user:      { color: '#1a2456', emoji: '📍', label: 'Your Location',   bg: '#e8eaf6' },
};

const SEV_COLOR = {
    CRITICAL: '#e53e3e',
    HIGH:     '#dd6b20',
    MODERATE: '#d69e2e',
    LOW:      '#38a169',
    SAFE:     '#38a169',
};

const SEV_RADIUS = { CRITICAL: 350, HIGH: 250, MODERATE: 150 };
const SEV_OPACITY = { CRITICAL: 0.18, HIGH: 0.12, MODERATE: 0.08 };

/* ── Build a pin-drop divIcon ── */
const makeIcon = (color, emoji, pulse = false) => L.divIcon({
    html: `
        ${pulse ? `<div style="position:absolute;inset:-6px;border-radius:50%;background:${color};opacity:.25;animation:pulse 1.8s ease-out infinite;"></div>` : ''}
        <div style="
            position:relative;width:34px;height:34px;border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);background:${color};border:3px solid #fff;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 3px 10px rgba(0,0,0,.35);
        ">
            <span style="transform:rotate(45deg);font-size:14px;line-height:1">${emoji}</span>
        </div>`,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -38],
});

/* ── Demo markers ── */
const DEMO_MARKERS = [
    {
        id: 1, type: 'flood', lat: 7.2906, lng: 80.6337,
        title: 'Flash Flood Zone B4', severity: 'CRITICAL',
        desc: 'Water level rising at creek junction. Evacuation in progress.',
        instructions: 'Evacuate immediately via Main Road North. Do not use bridge access roads.',
        status: 'Active', updated: '12 mins ago',
    },
    {
        id: 2, type: 'landslide', lat: 7.3050, lng: 80.6200,
        title: 'Landslide Risk Area', severity: 'HIGH',
        desc: 'Unstable slopes after overnight rainfall. Sector 12 roads closed.',
        instructions: 'Avoid hill roads in Sector 12. Monitor official channels.',
        status: 'Active', updated: '1 hour ago',
    },
    {
        id: 3, type: 'shelter', lat: 7.2800, lng: 80.6450,
        title: 'Safe Zone – Kandy Primary School', severity: 'SAFE',
        desc: 'Fully operational evacuation center. Medical outpost active.',
        instructions: 'Open 24/7. Bring ID and essential documents.',
        capacity: 200, occupied: 87, contact: '+94 81 2234567',
        status: 'Open', updated: '5 mins ago',
    },
    {
        id: 4, type: 'shelter', lat: 7.2750, lng: 80.6150,
        title: 'Safe Zone – Community Hall', severity: 'SAFE',
        desc: 'Peradeniya Community Hall. Food and water available.',
        instructions: 'Registration required at entrance.',
        capacity: 150, occupied: 42, contact: '+94 81 2345678',
        status: 'Open', updated: '20 mins ago',
    },
    {
        id: 5, type: 'fire', lat: 7.3100, lng: 80.6500,
        title: 'Industrial Complex Fire', severity: 'HIGH',
        desc: 'Chemical plant fire. 500m exclusion zone enforced.',
        instructions: 'Stay at least 500m away. Close windows if nearby.',
        status: 'Active', updated: '30 mins ago',
    },
    {
        id: 6, type: 'hazard', lat: 7.2950, lng: 80.6600,
        title: 'Road Hazard – Main St', severity: 'MODERATE',
        desc: 'Partial road blockage. Alternate routes advised.',
        instructions: 'Use Peradeniya Road as alternate route.',
        status: 'Ongoing', updated: '2 hours ago',
    },
    {
        id: 7, type: 'flood', lat: 7.3200, lng: 80.6100,
        title: 'River Overflow – North Bank', severity: 'MODERATE',
        desc: 'River levels above threshold. Monitoring in progress.',
        instructions: 'Avoid low-lying areas along the north bank.',
        status: 'Monitoring', updated: '45 mins ago',
    },
];

/* ── Evacuation routes (polylines from hazard to shelter) ── */
const EVAC_ROUTES = [
    { id: 'r1', points: [[7.2906, 80.6337], [7.2853, 80.6390], [7.2800, 80.6450]], color: '#38a169', label: 'Evac Route A' },
    { id: 'r2', points: [[7.3050, 80.6200], [7.2900, 80.6180], [7.2750, 80.6150]], color: '#38a169', label: 'Evac Route B' },
];

/* ── Map tile sources ── */
const TILES = {
    standard: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attr: '© OpenStreetMap contributors',
        label: 'Standard',
    },
    satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attr: '© Esri',
        label: 'Satellite',
    },
};

/* ── Haversine distance (km) ── */
const distKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
};

/* ── Leaflet helpers (must be inside MapContainer) ── */
const FlyTo = ({ center, zoom = 14 }) => {
    const map = useMap();
    useEffect(() => { if (center) map.flyTo(center, zoom, { duration: 1 }); }, [center]);
    return null;
};

const ZoomToBounds = ({ markers, trigger }) => {
    const map = useMap();
    useEffect(() => {
        if (!trigger || markers.length === 0) return;
        const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
        map.fitBounds(bounds, { padding: [40, 40] });
    }, [trigger]);
    return null;
};

const MapClickClose = ({ onClose }) => {
    useMapEvents({ click: onClose });
    return null;
};

/* ── Layer filter config ── */
const LAYER_BTNS = [
    { key: 'ALL',       label: 'All',       Icon: Layers },
    { key: 'flood',     label: 'Floods',    Icon: Droplets },
    { key: 'fire',      label: 'Fire',      Icon: Flame },
    { key: 'landslide', label: 'Landslide', Icon: MountainSnow },
    { key: 'shelter',   label: 'Shelters',  Icon: Shield },
    { key: 'hazard',    label: 'Hazards',   Icon: TriangleAlert },
];

/* ─────────────────────────── */

const MapPage = () => {
    const [markers, setMarkers]       = useState(DEMO_MARKERS);
    const [layer, setLayer]           = useState('ALL');
    const [flyTarget, setFlyTarget]   = useState(null);
    const [active, setActive]         = useState(null);
    const [userPos, setUserPos]       = useState(null);
    const [locating, setLocating]     = useState(false);
    const [tileStyle, setTileStyle]   = useState('standard');
    const [showRoutes, setShowRoutes] = useState(true);
    const [search, setSearch]         = useState('');
    const [zoomTrigger, setZoomTrigger] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    /* ── Fetch from API ── */
    const fetchMarkers = useCallback(async (pos, isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            const { data } = await getNearbyHazards({ lat: pos[0], lng: pos[1], radius: 30 });
            if (data?.data?.length) setMarkers(data.data);
        } catch { /* use demo */ }
        finally { setRefreshing(false); }
    }, []);

    /* ── Geolocate ── */
    const locateMe = () => {
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const pos = [coords.latitude, coords.longitude];
                setUserPos(pos);
                setFlyTarget({ center: pos, zoom: 14 });
                setLocating(false);
                fetchMarkers(pos);
            },
            () => setLocating(false),
        );
    };

    /* ── Filtered visible markers ── */
    const visible = markers
        .filter(m => layer === 'ALL' || m.type === layer)
        .filter(m => !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.type.includes(search.toLowerCase()));

    /* ── Sidebar list (same filter + search, sorted by severity) ── */
    const sevOrder = { CRITICAL: 0, HIGH: 1, MODERATE: 2, LOW: 3, SAFE: 4 };
    const listItems = [...visible].sort((a, b) => (sevOrder[a.severity] ?? 5) - (sevOrder[b.severity] ?? 5));

    /* ── Counts for stats strip ── */
    const critCount    = markers.filter(m => m.severity === 'CRITICAL').length;
    const shelterCount = markers.filter(m => m.type === 'shelter').length;
    const hazardCount  = markers.filter(m => m.type !== 'shelter').length;

    const focusMarker = (m) => {
        setActive(m);
        setFlyTarget({ center: [m.lat, m.lng], zoom: 15 });
    };

    const { t } = useTranslation();

    return (
        <div style={s.page}>

            {/* ── Page header ── */}
            <div style={s.pageHead}>
                <div>
                    <h1 style={s.title}>{t('citizen.mapTitle', 'Safety Map')}</h1>
                    <p style={s.sub}>{t('citizen.mapSubtitle', 'Live disaster zones, evacuation routes, and safe shelters.')}</p>
                </div>
                <div style={s.headerBtns}>
                    <button
                        onClick={() => setZoomTrigger(t => t + 1)}
                        style={s.headerBtn}
                        title="Zoom to fit all markers"
                    >
                        <Maximize2 size={14} /> Fit All
                    </button>
                    <button
                        onClick={locateMe}
                        style={{ ...s.headerBtn, ...s.locateBtn }}
                        disabled={locating}
                    >
                        <Navigation size={14} />
                        {locating ? 'Locating…' : 'My Location'}
                    </button>
                </div>
            </div>

            {/* ── Stats strip ── */}
            <div style={s.statsStrip}>
                {[
                    { label: 'Critical Zones', value: critCount,    color: '#e53e3e', bg: '#fff5f5', border: '#fed7d7' },
                    { label: 'Safe Shelters',  value: shelterCount, color: '#38a169', bg: '#f0fff4', border: '#c6f6d5' },
                    { label: 'Hazard Reports', value: hazardCount,  color: '#dd6b20', bg: '#fffaf0', border: '#fbd38d' },
                    { label: 'Total Markers',  value: markers.length, color: '#3182ce', bg: '#ebf8ff', border: '#bee3f8' },
                ].map(({ label, value, color, bg, border }) => (
                    <div key={label} style={{ ...s.statCard, background: bg, border: `1px solid ${border}` }}>
                        <span style={{ ...s.statVal, color }}>{value}</span>
                        <span style={s.statLbl}>{label}</span>
                    </div>
                ))}
            </div>

            {/* ── Controls row ── */}
            <div style={s.controls}>
                {/* Layer filter */}
                <div style={s.layerRow}>
                    {LAYER_BTNS.map(({ key, label, Icon }) => {
                        const count = key === 'ALL' ? markers.length : markers.filter(m => m.type === key).length;
                        return (
                            <button
                                key={key}
                                onClick={() => setLayer(key)}
                                style={{ ...s.layerBtn, ...(layer === key ? s.layerActive : {}) }}
                            >
                                <Icon size={13} />
                                {label}
                                <span style={{ ...s.layerCount, ...(layer === key ? s.layerCountActive : {}) }}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Right controls */}
                <div style={s.rightControls}>
                    {/* Tile toggle */}
                    <div style={s.tileToggle}>
                        {Object.entries(TILES).map(([key, t]) => (
                            <button
                                key={key}
                                onClick={() => setTileStyle(key)}
                                style={{ ...s.tileBtn, ...(tileStyle === key ? s.tileBtnActive : {}) }}
                            >
                                {key === 'standard' ? <MapIcon size={13} /> : <Satellite size={13} />}
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Evacuation routes toggle */}
                    <button
                        onClick={() => setShowRoutes(v => !v)}
                        style={{ ...s.routeToggle, ...(showRoutes ? s.routeToggleActive : {}) }}
                    >
                        <Activity size={13} />
                        Evac Routes
                    </button>
                </div>
            </div>

            {/* ── Map + sidebar layout ── */}
            <div style={s.mapLayout} className="map-layout">

                {/* Marker list sidebar */}
                <div style={s.sidebar}>
                    <div style={s.sidebarSearch}>
                        <Search size={13} color="#a0aec0" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search locations…"
                            style={s.sidebarInput}
                        />
                    </div>
                    <div style={s.sidebarCount}>
                        {listItems.length} location{listItems.length !== 1 ? 's' : ''}
                    </div>
                    <div style={s.sidebarList}>
                        {listItems.length === 0 ? (
                            <div style={s.sidebarEmpty}>No locations match your filter.</div>
                        ) : (
                            listItems.map(m => {
                                const tc  = TYPE_CONFIG[m.type] ?? TYPE_CONFIG.hazard;
                                const sc  = SEV_COLOR[m.severity] ?? '#718096';
                                const isSelected = active?.id === m.id;
                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => focusMarker(m)}
                                        style={{
                                            ...s.listItem,
                                            ...(isSelected ? s.listItemActive : {}),
                                        }}
                                    >
                                        <div style={{ ...s.listEmoji, background: tc.bg }}>{tc.emoji}</div>
                                        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                            <div style={s.listTitle}>{m.title}</div>
                                            <div style={s.listMeta}>
                                                <span style={{ ...s.listSev, color: sc }}>{m.severity}</span>
                                                {userPos && (
                                                    <span style={s.listDist}>
                                                        {distKm(userPos[0], userPos[1], m.lat, m.lng)} km
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight size={14} color="#a0aec0" />
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Map */}
                <div style={s.mapBox}>
                    <MapContainer
                        center={[7.2906, 80.6337]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                    >
                        <TileLayer
                            key={tileStyle}
                            url={TILES[tileStyle].url}
                            attribution={TILES[tileStyle].attr}
                        />

                        {/* Fly animation */}
                        {flyTarget && <FlyTo center={flyTarget.center} zoom={flyTarget.zoom} />}

                        {/* Zoom to fit */}
                        <ZoomToBounds markers={visible} trigger={zoomTrigger} />

                        {/* Close panel on map click */}
                        <MapClickClose onClose={() => setActive(null)} />

                        {/* Evacuation routes */}
                        {showRoutes && EVAC_ROUTES.map(r => (
                            <Polyline
                                key={r.id}
                                positions={r.points}
                                pathOptions={{ color: r.color, weight: 3, dashArray: '8 6', opacity: 0.8 }}
                            />
                        ))}

                        {/* Danger zone circles */}
                        {visible.filter(m => SEV_RADIUS[m.severity]).map(m => (
                            <Circle
                                key={`z-${m.id}`}
                                center={[m.lat, m.lng]}
                                radius={SEV_RADIUS[m.severity]}
                                pathOptions={{
                                    color: SEV_COLOR[m.severity],
                                    fillColor: SEV_COLOR[m.severity],
                                    fillOpacity: SEV_OPACITY[m.severity],
                                    weight: 1,
                                }}
                            />
                        ))}

                        {/* User position */}
                        {userPos && (
                            <>
                                <Marker position={userPos} icon={makeIcon('#1a2456', '📍')}>
                                    <Popup><strong>Your Location</strong></Popup>
                                </Marker>
                                <Circle
                                    center={userPos}
                                    radius={600}
                                    pathOptions={{ color: '#1a2456', fillOpacity: 0.05, weight: 1, dashArray: '4 4' }}
                                />
                            </>
                        )}

                        {/* Hazard / shelter markers */}
                        {visible.map(m => {
                            const tc   = TYPE_CONFIG[m.type] ?? TYPE_CONFIG.hazard;
                            const pulse = m.severity === 'CRITICAL';
                            return (
                                <Marker
                                    key={m.id}
                                    position={[m.lat, m.lng]}
                                    icon={makeIcon(tc.color, tc.emoji, pulse)}
                                    eventHandlers={{ click: (e) => { e.originalEvent.stopPropagation(); focusMarker(m); } }}
                                >
                                    <Popup>
                                        <div style={{ fontFamily: 'Inter,sans-serif', minWidth: 160 }}>
                                            <strong style={{ fontSize: 13 }}>{m.title}</strong><br />
                                            <span style={{ color: SEV_COLOR[m.severity] ?? '#718096', fontSize: 11, fontWeight: 700 }}>
                                                {m.severity}
                                            </span>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>

                    {/* ── Detail overlay panel ── */}
                    {active && (
                        <div style={s.detailPanel} className="fade-in">
                            <div style={s.detailHeader}>
                                <div style={{
                                    ...s.detailEmoji,
                                    background: (TYPE_CONFIG[active.type] ?? TYPE_CONFIG.hazard).bg,
                                }}>
                                    {(TYPE_CONFIG[active.type] ?? TYPE_CONFIG.hazard).emoji}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        ...s.detailSev,
                                        color: SEV_COLOR[active.severity] ?? '#718096',
                                        background: (SEV_COLOR[active.severity] ?? '#718096') + '18',
                                    }}>
                                        {active.severity}
                                    </div>
                                    <h3 style={s.detailTitle}>{active.title}</h3>
                                </div>
                                <button onClick={() => setActive(null)} style={s.closeBtn}>
                                    <X size={15} />
                                </button>
                            </div>

                            <p style={s.detailDesc}>{active.desc}</p>

                            {/* Info grid */}
                            <div style={s.detailGrid}>
                                <div style={s.detailItem}>
                                    <span style={s.detailLabel}>Status</span>
                                    <span style={{ ...s.detailValue, color: active.type === 'shelter' ? '#38a169' : '#e53e3e', fontWeight: 700 }}>
                                        {active.status ?? 'Active'}
                                    </span>
                                </div>
                                <div style={s.detailItem}>
                                    <span style={s.detailLabel}>Updated</span>
                                    <span style={s.detailValue}>{active.updated ?? 'Recently'}</span>
                                </div>
                                {active.capacity && (
                                    <>
                                        <div style={s.detailItem}>
                                            <span style={s.detailLabel}>Capacity</span>
                                            <span style={s.detailValue}>{active.capacity} people</span>
                                        </div>
                                        <div style={s.detailItem}>
                                            <span style={s.detailLabel}>Occupied</span>
                                            <span style={s.detailValue}>{active.occupied} / {active.capacity}</span>
                                        </div>
                                    </>
                                )}
                                {userPos && (
                                    <div style={s.detailItem}>
                                        <span style={s.detailLabel}>Distance</span>
                                        <span style={s.detailValue}>
                                            {distKm(userPos[0], userPos[1], active.lat, active.lng)} km away
                                        </span>
                                    </div>
                                )}
                                <div style={s.detailItem}>
                                    <span style={s.detailLabel}>Coordinates</span>
                                    <span style={{ ...s.detailValue, fontFamily: 'monospace', fontSize: 11 }}>
                                        {active.lat.toFixed(4)}, {active.lng.toFixed(4)}
                                    </span>
                                </div>
                            </div>

                            {/* Capacity bar for shelters */}
                            {active.capacity && (
                                <div style={s.capacityBar}>
                                    <div style={s.capacityHead}>
                                        <span style={s.detailLabel}>Shelter Capacity</span>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#38a169' }}>
                                            {Math.round((active.occupied / active.capacity) * 100)}% Full
                                        </span>
                                    </div>
                                    <div style={s.capacityTrack}>
                                        <div style={{
                                            ...s.capacityFill,
                                            width: `${(active.occupied / active.capacity) * 100}%`,
                                        }} />
                                    </div>
                                </div>
                            )}

                            {/* Instructions */}
                            {active.instructions && (
                                <div style={s.instructBox}>
                                    <span style={s.instructTitle}>📋 Instructions</span>
                                    <p style={s.instructText}>{active.instructions}</p>
                                </div>
                            )}

                            {/* Contact */}
                            {active.contact && (
                                <a href={`tel:${active.contact}`} style={s.contactBtn}>
                                    <Phone size={14} /> {active.contact}
                                </a>
                            )}

                            {/* Navigate button */}
                            <button
                                onClick={() => {
                                    const url = `https://www.google.com/maps/dir/?api=1&destination=${active.lat},${active.lng}`;
                                    window.open(url, '_blank', 'noopener');
                                }}
                                style={s.navBtn}
                            >
                                <Navigation size={14} />
                                Get Directions
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Legend ── */}
            <div style={s.legend} className="card">
                <span style={s.legendTitle}>Legend</span>
                <div style={s.legendItems}>
                    {Object.entries(TYPE_CONFIG).filter(([k]) => k !== 'user').map(([, cfg]) => (
                        <div key={cfg.label} style={s.legendItem}>
                            <span style={{ ...s.legendDot, background: cfg.bg }}>{cfg.emoji}</span>
                            <span style={s.legendLabel}>{cfg.label}</span>
                        </div>
                    ))}
                    <div style={s.legendItem}>
                        <span style={{ display: 'flex', gap: 2 }}>
                            {['#e53e3e', '#dd6b20', '#d69e2e'].map(c => (
                                <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: .5 }} />
                            ))}
                        </span>
                        <span style={s.legendLabel}>Danger Radius</span>
                    </div>
                    <div style={s.legendItem}>
                        <span style={{ width: 24, borderTop: '2px dashed #38a169', display: 'inline-block' }} />
                        <span style={s.legendLabel}>Evac Route</span>
                    </div>
                </div>
            </div>

            {/* Pulse keyframe */}
            <style>{`
                @keyframes pulse {
                    0%   { transform: scale(1);   opacity: .25; }
                    70%  { transform: scale(2.2); opacity: 0;   }
                    100% { transform: scale(1);   opacity: 0;   }
                }
                .leaflet-container { font-family: 'Inter', sans-serif; }
            `}</style>
        </div>
    );
};

/* ── Styles ── */
const s = {
    page: { display: 'flex', flexDirection: 'column', gap: 18 },

    pageHead: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
    title: { fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 4 },
    sub: { color: 'var(--text-muted)', fontSize: 14 },
    headerBtns: { display: 'flex', gap: 10 },
    headerBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'var(--text-mid)', cursor: 'pointer' },
    locateBtn: { background: '#1a2456', color: '#fff', border: 'none' },

    statsStrip: { display: 'flex', gap: 12, flexWrap: 'wrap' },
    statCard: { flex: 1, minWidth: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 10px', borderRadius: 12 },
    statVal: { fontSize: 22, fontWeight: 800, lineHeight: 1, marginBottom: 4 },
    statLbl: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.4px', textAlign: 'center' },

    controls: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
    layerRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
    layerBtn: { display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all .15s ease' },
    layerActive: { background: '#1a2456', color: '#fff', borderColor: '#1a2456' },
    layerCount: { padding: '1px 6px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: 'var(--bg-hover)', color: 'var(--text-muted)' },
    layerCountActive: { background: 'rgba(255,255,255,.2)', color: '#fff' },
    rightControls: { display: 'flex', gap: 10, alignItems: 'center' },
    tileToggle: { display: 'flex', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' },
    tileBtn: { display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', border: 'none', background: 'none', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', transition: 'all .15s' },
    tileBtnActive: { background: '#1a2456', color: '#fff' },
    routeToggle: { display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', border: '1.5px solid var(--border)', background: 'var(--bg-card)', borderRadius: 10, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer' },
    routeToggleActive: { background: '#f0fff4', color: '#38a169', borderColor: '#c6f6d5' },

    mapLayout: { display: 'flex', height: 560, borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' },

    sidebar: { width: 240, background: 'var(--bg-card)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 },
    sidebarSearch: { position: 'relative', padding: '12px 12px 8px' },
    sidebarInput: { width: '100%', padding: '8px 10px 8px 30px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 12, background: 'var(--bg-input)', color: 'var(--text-dark)', outline: 'none', boxSizing: 'border-box' },
    sidebarCount: { padding: '0 14px 8px', fontSize: 11, fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '.4px' },
    sidebarList: { flex: 1, overflowY: 'auto' },
    sidebarEmpty: { padding: 20, fontSize: 13, color: 'var(--text-light)', textAlign: 'center' },
    listItem: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background .15s' },
    listItemActive: { background: 'var(--bg-hover)' },
    listEmoji: { width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
    listTitle: { fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    listMeta: { display: 'flex', alignItems: 'center', gap: 8 },
    listSev: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px' },
    listDist: { fontSize: 10, color: 'var(--text-light)', fontWeight: 500 },

    mapBox: { flex: 1, position: 'relative', minWidth: 0 },

    detailPanel: {
        position: 'absolute', top: 10, right: 10, width: 280, maxHeight: 'calc(100% - 20px)',
        background: 'var(--bg-card)', borderRadius: 14, boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border)', zIndex: 1000, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 12, padding: 16,
    },
    detailHeader: { display: 'flex', alignItems: 'flex-start', gap: 10 },
    detailEmoji: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
    detailSev: { display: 'inline-block', padding: '2px 9px', borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 4 },
    detailTitle: { fontSize: 14, fontWeight: 800, color: 'var(--text-dark)', margin: 0, lineHeight: 1.3 },
    closeBtn: { width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: 7, cursor: 'pointer', flexShrink: 0, color: 'var(--text-mid)', marginLeft: 'auto' },
    detailDesc: { fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 },
    detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' },
    detailItem: { display: 'flex', flexDirection: 'column', gap: 2 },
    detailLabel: { fontSize: 10, fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '.4px' },
    detailValue: { fontSize: 12, fontWeight: 600, color: 'var(--text-dark)' },
    capacityBar: { display: 'flex', flexDirection: 'column', gap: 6 },
    capacityHead: { display: 'flex', justifyContent: 'space-between' },
    capacityTrack: { height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' },
    capacityFill: { height: '100%', background: 'linear-gradient(90deg, #38a169, #1a9e7a)', borderRadius: 99, transition: 'width .4s ease' },
    instructBox: { background: 'var(--bg-hover)', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--border)' },
    instructTitle: { fontSize: 11, fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: 5 },
    instructText: { fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 },
    contactBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', textDecoration: 'none' },
    navBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 0', background: 'linear-gradient(135deg,#1a9e7a,#147a5f)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' },

    legend: { padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
    legendTitle: { fontSize: 12, fontWeight: 700, color: 'var(--text-dark)' },
    legendItems: { display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' },
    legendItem: { display: 'flex', alignItems: 'center', gap: 6 },
    legendDot: { width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 },
    legendLabel: { fontSize: 12, color: 'var(--text-mid)' },
};

export default MapPage;
