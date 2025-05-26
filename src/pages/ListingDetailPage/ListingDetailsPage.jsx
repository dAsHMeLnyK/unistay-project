import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ListingDetailsPage.module.css';

// ... (Ваші компоненти-заглушки залишаються незмінними, якщо ви їх ще не замінили)
// Заглушки для відсутніх компонентів
const AverageRating = ({ rating, totalReviews }) => (
    <div className={styles.reviewsListContainer} style={{ textAlign: 'center', padding: '20px', border: '1px dashed #ccc', margin: '20px 0' }}>
        <h3>Середній рейтинг: {rating.toFixed(1)} ({totalReviews} відгуків)</h3>
        <p>Компонент AverageRating тут</p>
    </div>
);
const ListingAmenities = ({ amenities }) => (
    <div className={styles.amenitiesBlock} style={{ textAlign: 'center', padding: '20px', border: '1px dashed #ccc', margin: '20px 0' }}>
        <h3>Зручності:</h3>
        {amenities && amenities.length > 0 ? (
            <ul>{amenities.map((a, i) => <li key={i}>{a}</li>)}</ul>
        ) : (
            <p>Немає зручностей</p>
        )}
        <p>Компонент ListingAmenities тут</p>
    </div>
);
const ContactOwner = ({ owner }) => (
    <div className={styles.ownerContactBlock} style={{ textAlign: 'center', padding: '20px', border: '1px dashed #ccc', margin: '20px 0' }}>
        <h3>Зв'язатися з власником</h3>
        <p>Ім'я: {owner?.name || 'Невідомо'}</p>
        <p>Контакт: {owner?.contact || 'Невідомо'}</p>
        <p>Компонент ContactOwner тут</p>
    </div>
);
const ReviewForm = ({ listingId, onAddReview }) => (
    <div className={styles.reviewsListContainer} style={{ textAlign: 'center', padding: '20px', border: '1px dashed #ccc', margin: '20px 0' }}>
        <h3>Додати відгук</h3>
        <p>Компонент ReviewForm тут (для оголошення ID: {listingId})</p>
        <button onClick={() => onAddReview({ id: Date.now(), author: 'Test User', text: 'Це тестовий відгук.', rating: 4, date: new Date().toISOString().split('T')[0] })}>Додати тестовий відгук</button>
    </div>
);
const ReviewsList = ({ reviews }) => (
    <div className={styles.reviewsListContainer} style={{ textAlign: 'center', padding: '20px', border: '1px dashed #ccc', margin: '20px 0' }}>
        <h3>Відгуки</h3>
        {reviews && reviews.length > 0 ? (
            <ul>
                {reviews.map((review, index) => (
                    <li key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <strong>{review.author}</strong> ({review.rating} зірок): {review.text}
                    </li>
                ))}
            </ul>
        ) : (
            <p>Поки що немає відгуків.</p>
        )}
        <p>Компонент ReviewsList тут</p>
    </div>
);

const ListingDetailsPage = () => {
    // ЗМІНЕНО ТУТ: Використовуємо listingId
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // ЗМІНЕНО ТУТ: Використовуємо listingId в console.log
        console.log('ListingDetailsPage useEffect triggered for ID:', listingId);

        const storedListings = JSON.parse(localStorage.getItem('listings')) || [];
        console.log('Listings from localStorage:', storedListings);

        // ЗМІНЕНО ТУТ: Порівнюємо з listingId
        const foundListing = storedListings.find((item) => String(item.id) === listingId);

        if (foundListing) {
            console.log('Listing found:', foundListing);
            setListing(foundListing);

            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            // ЗМІНЕНО ТУТ: Порівнюємо з listingId
            setIsFavorite(favorites.some(fav => String(fav.id) === listingId));
        } else {
            // ЗМІНЕНО ТУТ: Використовуємо listingId в console.error
            console.error('Оголошення не знайдено в localStorage для ID:', listingId);
        }
    }, [listingId]); // ЗМІНЕНО ТУТ: Залежність від listingId

    const handleFavoriteClick = () => {
        if (!listing) return;

        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        if (isFavorite) {
            favorites = favorites.filter(fav => String(fav.id) !== String(listing.id));
            console.log(`Listing ${listing.title} removed from favorites.`);
        } else {
            favorites.push(listing);
            console.log(`Listing ${listing.title} added to favorites.`);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        setIsFavorite(!isFavorite);
    };

    if (!listing) {
        return <div className={styles.loading}>Завантаження...</div>;
    }

    // ... (решта коду компонента залишається без змін)
    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? listing.allImages.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === listing.allImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleAddReview = (newReview) => {
        const updatedReviews = [...(listing.reviews || []), newReview];

        const updatedListing = { ...listing, reviews: updatedReviews };
        setListing(updatedListing);

        const storedListings = JSON.parse(localStorage.getItem('listings')) || [];
        // ЗМІНЕНО ТУТ: Порівнюємо з listingId
        const updatedListingsData = storedListings.map(item =>
            String(item.id) === String(listing.id) ? updatedListing : item
        );
        localStorage.setItem('listings', JSON.stringify(updatedListingsData));
        console.log('Відгук додано:', newReview);
    };

    const renderStars = (avgRating) => {
        const totalStars = 5;
        const filledStars = Math.floor(avgRating);
        const halfStar = avgRating - filledStars >= 0.5;
        const stars = [];

        for (let i = 0; i < filledStars; i++) {
            stars.push(<span key={`filled-${i}`} className={styles.filledStar}>&#9733;</span>);
        }
        if (halfStar) {
            stars.push(<span key="half" className={styles.halfStar}>&#9733;</span>);
        }
        for (let i = stars.length; i < totalStars; i++) {
            stars.push(<span key={`empty-${i}`} className={styles.emptyStar}>&#9733;</span>);
        }
        return stars;
    };

    return (
        <div className={styles.listingDetailsPage}>
            <div className={styles.mainContent}>
                <div className={styles.imageGallery}>
                    {/* Перевірка на існування allImages та його довжину */}
                    {listing.allImages && listing.allImages.length > 0 ? (
                         <img
                            src={listing.allImages[currentImageIndex]}
                            alt={listing.title}
                            className={styles.mainImage}
                        />
                    ) : (
                        <div className={styles.noImagePlaceholder}>Немає зображень</div>
                    )}

                    {listing.allImages && listing.allImages.length > 1 && (
                        <>
                            <button className={`${styles.galleryButton} ${styles.prevButton}`} onClick={handlePrevImage}>
                                &lt;
                            </button>
                            <button className={`${styles.galleryButton} ${styles.nextButton}`} onClick={handleNextImage}>
                                &gt;
                            </button>
                        </>
                    )}
                    {listing.allImages && listing.allImages.length > 0 && (
                        <div className={styles.imagePagination}>
                            {listing.allImages.map((_, index) => (
                                <span
                                    key={index}
                                    className={`${styles.paginationDot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                ></span>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.ratingInfo}>
                        <span className={styles.ratingValue}>{listing.rating ? listing.rating.toFixed(1) : '0.0'}</span> {/* Перевірка на існування rating */}
                        <div className={styles.starsContainer}>
                            {renderStars(listing.rating || 0)} {/* Передаємо 0, якщо rating відсутній */}
                        </div>
                        <span className={styles.reviewCount}>({listing.reviews ? listing.reviews.length : 0} відгуків)</span> {/* Перевірка на існування reviews */}
                    </div>
                    <h1 className={styles.title}>{listing.title}</h1>
                    <p className={styles.price}>{listing.price} грн</p>
                    <p className={styles.address}>
                        <span className={styles.locationIcon}>&#x2302;</span> {listing.address}
                    </p>
                    <div className={styles.buttonsContainer}>
                        <button className={styles.showOnMapButton}>Показати на мапі</button>
                        <button
                            className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
                            onClick={handleFavoriteClick}
                            aria-label="Додати в обране"
                        >
                            <span>{isFavorite ? '♥' : '♡'}</span>
                        </button>
                    </div>

                    <div className={styles.detailsGrid}>
                        <p className={styles.detailItem}>
                            <span className={styles.detailLabel}>Тип житла:</span>
                            {listing.type === 'Квартира' ? 'Квартира' :
                             listing.type === 'Кімната' ? 'Кімната' :
                             listing.type === 'Будинок' ? 'Будинок' :
                             listing.type?.name || 'Не вказано'}
                        </p>
                        <p className={styles.detailItem}>
                            <span className={styles.detailLabel}>Власники:</span>
                            {listing.ownerOccupancy === 'with-owner' ? 'Проживання з господарями' :
                             listing.ownerOccupancy === 'without-owner' ? 'Без господарів' :
                             listing.ownerOccupancy?.type === 'with-owner' ? 'Проживання з господарями' :
                             listing.ownerOccupancy?.type === 'without-owner' ? 'Без господарів' :
                             'Не вказано'}
                        </p>
                        <p className={styles.detailItem}>
                            <span className={styles.detailLabel}>Сусіди:</span>
                            {listing.neighborInfo === 'with-roommates' ? 'Проживання з сусідами' :
                             listing.neighborInfo === 'no-roommates' ? 'Без сусідів' :
                             listing.neighborInfo?.type === 'with-roommates' ? 'Проживання з сусідами' :
                             listing.neighborInfo?.type === 'no-roommates' ? 'Без сусідів' :
                             'Не вказано'}
                        </p>
                        <p className={styles.detailItem}>
                            <span className={styles.detailLabel}>Оплата за комунальні послуги:</span>
                            {listing.utilityPaymentType === 'separate' ? 'Окремо' :
                             listing.utilityPaymentType === 'included' ? 'Включено в ціну' :
                             listing.utilityPaymentType?.type === 'separate' ? 'Окремо' :
                             listing.utilityPaymentType?.type === 'included' ? 'Включено в ціну' :
                             'Не вказано'}
                        </p>
                    </div>
                    <p className={styles.publishedDate}>Опубліковано: {listing.publishedDate || 'Не вказано'}</p>
                </div>
            </div>

            <div className={styles.twoColumnGrid}>
                <div className={styles.descriptionAmenities}>
                    <div className={styles.descriptionBlock}>
                        <h2 className={styles.sectionTitle}>Опис</h2>
                        <p>{listing.fullDescription || 'Опис відсутній.'}</p>
                    </div>
                    <ListingAmenities amenities={listing.amenities || []} />
                </div>

                <div className={styles.ownerMap}>
                    <ContactOwner owner={listing.owner || {}} />
                    <div className={styles.mapPlaceholder}>Мапа тут</div>
                </div>
            </div>

            <div className={styles.fullWidthGrid}>
                <AverageRating rating={listing.rating || 0} totalReviews={listing.reviews ? listing.reviews.length : 0} />
                <ReviewForm listingId={listing.id} onAddReview={handleAddReview} />
            </div>

            <ReviewsList reviews={listing.reviews || []} />
        </div>
    );
};

export default ListingDetailsPage;