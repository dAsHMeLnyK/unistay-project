import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { FiMaximize2, FiMapPin } from 'react-icons/fi';
import styles from './LocationMap.module.css';

// Стандартні іконки Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const LocationMap = ({ lat, lng, address }) => {
    // Валідація координат
    const hasCoords = lat !== undefined && lng !== undefined;
    const position = hasCoords ? [lat, lng] : [50.4501, 30.5234]; // Default to Kyiv if error

    const openInGoogleMaps = () => {
        if (!hasCoords) return;
        // Виправлений формат посилання Google Maps
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    if (!hasCoords) return null;

    return (
        <div className={styles.mapWrapper}>
            <div className={styles.mapHeader}>
                <div className={styles.addressInfo}>
                    <FiMapPin className={styles.pinIcon} />
                    <span>{address || "Адреса уточнюється"}</span>
                </div>
                <button 
                    className={styles.googleBtn} 
                    onClick={openInGoogleMaps}
                    title="Відкрити в новому вікні"
                >
                    <FiMaximize2 /> Відкрити Google Maps
                </button>
            </div>

            <div className={styles.mapContainer}>
                <MapContainer 
                    center={position} 
                    zoom={15} 
                    scrollWheelZoom={false} 
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                >
                    <TileLayer 
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                    />
                    <Marker position={position} icon={DefaultIcon} />
                </MapContainer>
            </div>
        </div>
    );
};

export default LocationMap;