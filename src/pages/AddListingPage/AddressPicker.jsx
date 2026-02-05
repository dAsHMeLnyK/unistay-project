import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import styles from './AddListingPage.module.css';

// Іконки Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom || 16);
    return null;
}

const AddressPicker = ({ onAddressChange, lat, lng }) => {
    const [position, setPosition] = useState([lat, lng]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);

    const OSTROH_BOUNDS = "26.4819,50.3121,26.5542,50.3475";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = useCallback(async (query) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }
        const fullQuery = query.toLowerCase().includes("острог") ? query : `Острог, ${query}`;
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${fullQuery}&viewbox=${OSTROH_BOUNDS}&bounded=1&limit=5`
            );
            const data = await response.json();
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Nominatim error:", error);
        }
    }, [OSTROH_BOUNDS]);

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        fetchSuggestions(e.target.value);
    };

    const selectSuggestion = (item) => {
        const nLat = parseFloat(item.lat);
        const nLon = parseFloat(item.lon);
        setPosition([nLat, nLon]);
        
        const parts = item.display_name.split(',');
        const shortName = parts[0] + (parts[1] ? ', ' + parts[1] : '');
        
        setSearchQuery(shortName);
        onAddressChange(shortName, nLat, nLon);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // ВАЖЛИВО: щоб не сабмітити форму
            if (suggestions.length > 0) selectSuggestion(suggestions[0]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const updateLocation = async (newLat, newLng) => {
        setPosition([newLat, newLng]);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18`
            );
            const data = await response.json();
            if (data && data.address) {
                const street = data.address.road || '';
                const house = data.address.house_number || '';
                const display = street ? `${street}${house ? ', ' + house : ''}` : data.display_name;
                onAddressChange(display, newLat, newLng);
                setSearchQuery(display);
            }
        } catch (err) { console.error(err); }
    };

    const MapEvents = () => {
        useMapEvents({ click(e) { updateLocation(e.latlng.lat, e.latlng.lng); } });
        return null;
    };

    const RenderMap = ({ zoomLevel }) => (
        <MapContainer center={position} zoom={zoomLevel} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position} draggable={true} eventHandlers={{
                dragend: (e) => updateLocation(e.target.getLatLng().lat, e.target.getLatLng().lng)
            }} />
            <MapEvents />
            <ChangeView center={position} zoom={zoomLevel} />
        </MapContainer>
    );

    return (
        <div className={styles.addressPickerWrapper}>
            <div className={styles.searchBarContainer} ref={suggestionsRef}>
                <input 
                    type="text" 
                    className={styles.mapInput}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchQuery.length >= 3 && setShowSuggestions(true)}
                    placeholder="Введіть вулицю та номер будинку..."
                />
                {showSuggestions && suggestions.length > 0 && (
                    <ul className={styles.suggestionsList}>
                        {suggestions.map((item, i) => (
                            <li key={i} onClick={() => selectSuggestion(item)}>📍 {item.display_name}</li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={styles.mapControls}>
                <p className={styles.mapHint}>* Клікніть на будівлю для точності</p>
                <button type="button" className={styles.expandBtn} onClick={() => setIsModalOpen(true)}>На весь екран ⤢</button>
            </div>
            
            <div className={styles.mapContainerStyle}>
                <RenderMap zoomLevel={15} />
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitleBlock}>
                                <h3>Локація в Острозі</h3>
                                <p className={styles.currentAddressPreview}>{searchQuery || "Оберіть точку"}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className={styles.closeModal}>&times;</button>
                        </div>
                        <div className={styles.fullScreenMap}>
                            <RenderMap zoomLevel={18} />
                        </div>
                        <div className={styles.modalFooter}>
                            <button type="button" onClick={() => setIsModalOpen(false)} className={styles.confirmBtn}>Готово</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(AddressPicker);