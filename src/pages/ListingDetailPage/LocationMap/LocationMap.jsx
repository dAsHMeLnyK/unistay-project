import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { FiMaximize2, FiMapPin } from 'react-icons/fi';
import styles from './LocationMap.module.css';

// Використовуємо ті ж налаштування іконок, що і в AddressPicker
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const LocationMap = ({ lat, lng, address }) => {
    const position = [lat, lng];

    const openInGoogleMaps = () => {
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    };

    return (
        <div className={styles.mapWrapper}>
            <div className={styles.mapHeader}>
                <div className={styles.addressInfo}>
                    <FiMapPin className={styles.pinIcon} />
                    <span>{address}</span>
                </div>
                <button className={styles.googleBtn} onClick={openInGoogleMaps}>
                    <FiMaximize2 /> Відкрити Google Maps
                </button>
            </div>

            <div className={styles.mapContainer}>
                <MapContainer 
                    center={position} 
                    zoom={16} 
                    scrollWheelZoom={false} 
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={position} icon={DefaultIcon} />
                </MapContainer>
            </div>
        </div>
    );
};

export default LocationMap;