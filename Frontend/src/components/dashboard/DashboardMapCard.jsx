import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MOCK_MARKERS = [
  { id: 1, position: [6.9271, 79.8612], title: 'Flood in Colombo', severity: 'high' },
  { id: 2, position: [7.2906, 80.6337], title: 'Landslide in Kandy', severity: 'critical' },
  { id: 3, position: [6.0535, 80.2210], title: 'Storm Warning Galle', severity: 'medium' }
];

const DashboardMapCard = ({ delay = 0 }) => {
  // Fix for map rendering glitch in React strict mode/flex containers
  const [mapRendered, setMapRendered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMapRendered(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col h-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-foreground">Live Disaster Map</h3>
        <span className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full text-xs font-semibold">
          3 Active Incidents
        </span>
      </div>
      
      <div className="flex-1 w-full min-h-[400px] rounded-lg overflow-hidden border border-border relative z-0">
        {mapRendered ? (
          <MapContainer 
            center={[7.8731, 80.7718]} 
            zoom={7} 
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {MOCK_MARKERS.map((marker) => (
              <Marker key={marker.id} position={marker.position}>
                <Popup>
                  <div className="p-1">
                    <p className="font-bold text-gray-900">{marker.title}</p>
                    <p className="text-sm capitalize text-gray-600 mt-1">
                      Severity: <span className={marker.severity === 'critical' ? 'text-red-600 font-bold' : marker.severity === 'high' ? 'text-orange-500 font-bold' : 'text-yellow-600 font-bold'}>{marker.severity}</span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="w-full h-full bg-border/20 flex items-center justify-center animate-pulse">
            <span className="text-foreground/50">Loading map...</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardMapCard;
