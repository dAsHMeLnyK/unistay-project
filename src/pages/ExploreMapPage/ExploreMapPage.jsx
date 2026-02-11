import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { ListingService } from '../../api/services/ListingService'; // перевірте шлях до сервісу
import ListingCard from '../../components/listings/ListingCard/ListingCard'; // перевірте шлях до картки
import LoadingPage from '../LoadingPage/LoadingPage';
import styles from './ExploreMapPage.module.css';
import { useNavigate } from 'react-router-dom';
import { FiList } from 'react-icons/fi';

const ExploreMapPage = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // Координати центру Острога
    const center = [50.3291, 26.5126];

    useEffect(() => {
        const fetchAllListings = async () => {
            try {
                // Використовуємо ваш метод getAll для отримання всіх оголошень
                const data = await ListingService.getAll();
                setListings(data);
            } catch (err) {
                console.error("Не вдалося завантажити оголошення для карти:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllListings();
    }, []);

    // Створюємо вигляд маркера (цінника)
    const createPriceIcon = (price) => {
        return L.divIcon({
            className: styles.customMarkerContainer, // порожній клас-обгортка Leaflet
            html: `<div class="${styles.priceTag}">${price.toLocaleString()} ₴</div>`,
            iconSize: [60, 30],
            iconAnchor: [30, 15]
        });
    };

    if (loading) return <LoadingPage />;

    return (
        <div className={styles.explorePage}>
            <button 
                className={styles.listFloatingBtn}
                onClick={() => navigate('/listings')}
            >
                <FiList /> Список
            </button>

            <MapContainer 
                center={center} 
                zoom={15} 
                zoomControl={false} // прибираємо стандартні кнопки, щоб поставити свої
                className={styles.mapCanvas}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Кнопки масштабу в зручному місці */}
                <ZoomControl position="bottomright" />

                {listings.map(listing => (
                    <Marker 
                        key={listing.id}
                        position={[listing.latitude, listing.longitude]}
                        icon={createPriceIcon(listing.price)}
                    >
                        {/* При натисканні на маркер вискочить ваша картка */}
                        <Popup className={styles.mapPopup}>
                            <div className={styles.popupCardWrapper}>
                                <ListingCard listing={listing} />
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default ExploreMapPage;