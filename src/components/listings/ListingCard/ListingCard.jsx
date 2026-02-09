import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiHeart } from 'react-icons/fi'; // Використовуємо лише необхідні іконки
import styles from './ListingCard.module.css';

const ListingCard = ({ listing }) => {
    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
        return sum / reviews.length;
    };

    const id = listing?.id;
    const title = listing?.title || 'Без назви';
    const address = listing?.address || 'Адреса не вказана';
    const price = listing?.price || 0;
    const imageUrl = listing?.listingImages?.[0]?.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image';
    const averageRating = calculateAverageRating(listing?.reviews);

    const [isFavorite, setIsFavorite] = useState(() => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.some(fav => fav.id === id);
    });

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        if (isFavorite) {
            favorites = favorites.filter(fav => fav.id !== id);
        } else {
            favorites.push({ id, title, address, price, imageUrl, rating: averageRating });
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        window.dispatchEvent(new Event('favoritesUpdated'));
        setIsFavorite(!isFavorite);
    };

    return (
        <Link to={`/listings/${id}`} className={styles.cardLink}>
            <div className={styles.card}>
                <div className={styles.imageContainer}>
                    <img src={imageUrl} alt={title} className={styles.image} />
                </div>

                <div className={styles.info}>
                    <div className={styles.topInfo}>
                        <div className={styles.rating}>
                            {averageRating > 0 ? (
                                <span className={styles.filledStar}>★ {averageRating.toFixed(1)}</span>
                            ) : (
                                <span className={styles.noReviews}>Немає відгуків</span>
                            )}
                        </div>

                        <h3 className={styles.title}>{title}</h3>
                        
                        <p className={styles.address}>
                            <FiMapPin className={styles.locationIcon} /> {address}
                        </p>
                    </div>

                    <div className={styles.priceContainer}>
                        <p className={styles.price}>{price.toLocaleString()} грн</p>
                        
                        <button
                            className={`${styles.heartButton} ${isFavorite ? styles.favorited : ''}`}
                            onClick={handleFavoriteClick}
                        >
                            <FiHeart 
                                className={styles.heartIcon} 
                                fill={isFavorite ? "var(--accent-color)" : "none"} 
                            />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ListingCard;