import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiUser, FiPhone, FiHeart } from 'react-icons/fi';

import { ListingService } from '../../api/services/ListingService';
import LoadingPage from '../LoadingPage/LoadingPage';
import Button from '../../components/common/Button/Button';
import AmenityDisplay from './AmenityDisplay/AmenityDisplay';
import ListingFeatures from './ListingFeatures/ListingFeatures';
import ReviewSection from './ReviewSection/ReviewSection';
import LocationMap from './LocationMap/LocationMap';

import styles from './ListingDetailsPage.module.css';

const ListingDetailsPage = () => {
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showPhone, setShowPhone] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await ListingService.getById(listingId);
                setListing(data);
            } catch (err) { 
                console.error("Помилка завантаження:", err); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchDetails();
    }, [listingId]);

    if (loading) return <LoadingPage />;
    if (!listing) return <div className={styles.error}>Оголошення не знайдено</div>;

    const formattedDate = new Date(listing.publicationDate).toLocaleDateString('uk-UA', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div className={styles.detailsPage}>
            <div className={`${styles.container} details-stack`}>
                
                {/* ВЕРХНЯ ЧАСТИНА: ГАЛЕРЕЯ ТА ГОЛОВНА КАРТКА */}
                <div className={styles.topSection}>
                    <div className={styles.galleryColumn}>
                        <div className={styles.mainFrame}>
                            {listing.listingImages?.length > 0 ? (
                                <img src={listing.listingImages[activeImage]?.imageUrl} alt={listing.title} />
                            ) : (
                                <div className={styles.placeholderImg}>Фото відсутні</div>
                            )}
                            
                            {/* Лічильник обраного поверх фото */}
                            <div className={styles.favoriteBadge}>
                                <FiHeart className={styles.heartIcon} />
                                <span>{listing.favoriteCount || 0}</span>
                            </div>
                        </div>
                        
                        <div className={styles.thumbRow}>
                            {listing.listingImages?.map((img, i) => (
                                <div 
                                    key={img.id} 
                                    className={`${styles.thumb} ${activeImage === i ? styles.activeThumb : ''}`}
                                    onClick={() => setActiveImage(i)}
                                >
                                    <img src={img.imageUrl} alt="thumb" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className={styles.actionCard}>
                        <div className={styles.headerInfo}>
                            <h1 className="page-title-left">{listing.title}</h1>
                            <div className={styles.locationBadge}>
                                <FiMapPin /> {listing.address}
                            </div>
                        </div>

                        <div className={styles.priceContainer}>
                            <div className={styles.priceLabel}>Вартість оренди</div>
                            <div className={styles.priceRow}>
                                <span className={styles.priceValue}>{listing.price} ₴</span>
                                <span className={styles.pricePeriod}>/ міс.</span>
                            </div>
                        </div>

                        <div className={styles.ownerBrief}>
                            <div className={styles.avatar}>
                                {listing.user?.fullName?.charAt(0) || <FiUser />}
                            </div>
                            <div className={styles.ownerText}>
                                <div className={styles.ownerName}>{listing.user?.fullName || "Власник"}</div>
                                <div className={styles.ownerStatus}>На зв'язку в Unistay</div>
                            </div>
                        </div>

                        {/* Логіка показу телефону */}
                        <Button 
                            className={styles.contactBtn} 
                            variant={showPhone ? "outline" : "primary"}
                            onClick={() => setShowPhone(!showPhone)}
                        >
                            <FiPhone /> {showPhone ? "+380 XX XXX XX XX" : "Показати телефон"}
                        </Button>

                        <div className={styles.metaInfo}>
                            <FiCalendar /> Опубліковано {formattedDate}
                        </div>
                    </aside>
                </div>

                {/* НИЖНЯ ЧАСТИНА: ДЕТАЛІ, ОПИС ТА ВІДГУКИ */}
                <div className="details-stack">
                    <div className="content-card">
                        <div className={styles.sectionGroup}>
                            <h3 className="section-title">Характеристики об'єкту</h3>
                            <ListingFeatures listing={listing} />
                        </div>
                        
                        <div className={styles.descriptionSection}>
                            <h3 className="section-title">Про це житло</h3>
                            <p className={styles.descriptionText}>{listing.description}</p>
                        </div>
                    </div>

                    <div className="content-card">
                        <h3 className="section-title">Зручності</h3>
                        <AmenityDisplay amenities={listing.amenities} />
                    </div>

                    {/* НОВИЙ БЛОК: КАРТА */}
                    <div className="content-card">
                        <h3 className="section-title">Розташування</h3>
                        <LocationMap 
                            lat={listing.latitude} 
                            lng={listing.longitude} 
                            address={listing.address} 
                        />
                    </div>

                    {/* Додаємо секцію відгуків з вашого DTO */}
                    <div className="content-card">
                        <h3 className="section-title">Відгуки</h3>
                        <ReviewSection 
                            reviews={listing.reviews} 
                            listingId={listing.id} 
                            ownerId={listing.userId}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ListingDetailsPage;