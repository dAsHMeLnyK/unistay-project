import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ListingService } from '../../api/services/ListingService';
import styles from './ListingDetailsPage.module.css';

// Компонент зручностей (виправлено a.name -> a.title)
const ListingAmenities = ({ amenities }) => (
    <div className={styles.amenitiesBlock}>
        <h3 className={styles.sectionTitle}>Зручності</h3>
        <div className={styles.amenitiesGrid}>
            {amenities && amenities.length > 0 ? (
                amenities.map((a) => (
                    <div key={a.id} className={styles.amenityItem}>
                        <span className={styles.amenityIcon}>✔</span> {a.title}
                    </div>
                ))
            ) : (
                <p>Зручності не вказані</p>
            )}
        </div>
    </div>
);

const ContactOwner = ({ user }) => (
    <div className={styles.ownerContactBlock}>
        <h3 className={styles.sectionTitle}>Зв'язатися з власником</h3>
        <div className={styles.ownerInfo}>
            <div className={styles.ownerAvatar}>{user?.fullName?.charAt(0) || 'U'}</div>
            <div>
                <p className={styles.ownerName}>{user?.fullName || 'Власник житла'}</p>
                <button className={styles.contactButton}>Написати повідомлення</button>
            </div>
        </div>
    </div>
);

const ListingDetailsPage = () => {
    const { listingId } = useParams(); // Переконайтеся, що в App.js шлях /listings/:listingId
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    const loadListingData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await ListingService.getById(listingId);
            setListing(data);

            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            setIsFavorite(favorites.some(fav => String(fav.id) === String(listingId)));
        } catch (err) {
            console.error('Помилка завантаження:', err);
            // navigate('/listings'); // Розкоментуйте після перевірки
        } finally {
            setLoading(false);
        }
    }, [listingId]);

    useEffect(() => {
        if (listingId) loadListingData();
    }, [loadListingData, listingId]);

    const averageRating = listing?.reviews?.length 
        ? listing.reviews.reduce((acc, r) => acc + r.rating, 0) / listing.reviews.length 
        : 0;

    const handleFavoriteClick = () => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (isFavorite) {
            favorites = favorites.filter(fav => String(fav.id) !== String(listingId));
        } else {
            favorites.push({ 
                id: listing.id, 
                title: listing.title, 
                price: listing.price, 
                imageUrl: listing.listingImages?.[0]?.imageUrl 
            });
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        setIsFavorite(!isFavorite);
    };

    if (loading) return <div className={styles.loading}>Завантаження деталей...</div>;
    if (!listing) return <div className={styles.error}>Оголошення не знайдено.</div>;

    return (
        <div className={styles.listingDetailsPage}>
            <div className={styles.mainContent}>
                <div className={styles.imageGallery}>
                    {listing.listingImages?.length > 0 ? (
                        <img
                            src={listing.listingImages[currentImageIndex].imageUrl}
                            alt={listing.title}
                            className={styles.mainImage}
                        />
                    ) : (
                        <div className={styles.noImagePlaceholder}>Немає зображень</div>
                    )}

                    {listing.listingImages?.length > 1 && (
                        <>
                            <button className={`${styles.galleryButton} ${styles.prevButton}`} 
                                onClick={() => setCurrentImageIndex(prev => prev === 0 ? listing.listingImages.length - 1 : prev - 1)}>
                                &lt;
                            </button>
                            <button className={`${styles.galleryButton} ${styles.nextButton}`} 
                                onClick={() => setCurrentImageIndex(prev => prev === listing.listingImages.length - 1 ? 0 : prev + 1)}>
                                &gt;
                            </button>
                        </>
                    )}
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.ratingHeader}>
                        <span className={styles.ratingStars}>★ {averageRating.toFixed(1)}</span>
                        <span className={styles.reviewCount}>({listing.reviews?.length || 0} відгуків)</span>
                    </div>
                    
                    <h1 className={styles.title}>{listing.title}</h1>
                    <p className={styles.price}>{listing.price} грн / міс</p>
                    <p className={styles.address}>📍 {listing.address}</p>

                    <div className={styles.actionButtons}>
                        <button className={styles.favoriteBtn} onClick={handleFavoriteClick}>
                            {isFavorite ? '❤️ В обраному' : '🤍 В обране'}
                        </button>
                        <button className={styles.shareBtn}>Поділитися</button>
                    </div>

                    <div className={styles.quickDetails}>
                        <div className={styles.detailCard}>
                            <span>Тип</span>
                            <strong>{listing.type === 1 ? 'Квартира' : listing.type === 0 ? 'Будинок' : 'Кімната'}</strong>
                        </div>
                        <div className={styles.detailCard}>
                            <span>Комунальні</span>
                            <strong>{listing.communalServices?.includes(0) ? 'Включено' : 'Окремо'}</strong>
                        </div>
                        <div className={styles.detailCard}>
                            <span>Власники</span>
                            <strong>{listing.owners === 1 ? 'Без господарів' : 'З господарями'}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.descriptionLayout}>
                <div className={styles.leftCol}>
                    <div className={styles.descriptionBlock}>
                        <h2 className={styles.sectionTitle}>Опис</h2>
                        <p>{listing.description || 'Опис відсутній.'}</p>
                    </div>
                    <ListingAmenities amenities={listing.amenities} />
                </div>
                
                <div className={styles.rightCol}>
                    <ContactOwner user={listing.user} />
                    <div className={styles.mapContainer}>
                        <div className={styles.mapPlaceholder}>
                            <p>Місцезнаходження на мапі</p>
                            <small>Координати: {listing.latitude.toFixed(4)}, {listing.longitude.toFixed(4)}</small>
                        </div>
                    </div>
                </div>
            </div>

            <section className={styles.reviewsSection}>
                <h2 className={styles.sectionTitle}>Відгуки користувачів</h2>
                {listing.reviews?.length > 0 ? (
                    listing.reviews.map(review => (
                        <div key={review.id} className={styles.reviewCard}>
                            <div className={styles.reviewUser}>
                                <strong>{review.user?.fullName || 'Анонім'}</strong>
                                <div className={styles.reviewRating}>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                            </div>
                            <p>{review.comment}</p>
                            <small>{new Date(review.publicationDate).toLocaleDateString()}</small>
                        </div>
                    ))
                ) : (
                    <p className={styles.noReviews}>Відгуків ще немає. Будьте першим!</p>
                )}
            </section>
        </div>
    );
};

export default ListingDetailsPage;