import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ListingCard.module.css';

// SVG-іконка локації
const LocationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

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
    const imageUrl = listing?.listingImages?.[0]?.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
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
        setIsFavorite(!isFavorite);
    };

    return (
        <Link to={`/listings/${id}`} className={styles.cardLink}>
            <div className={styles.card}>
                <div className={styles.imageContainer}>
                    <img src={imageUrl} alt={title} className={styles.image} />
                </div>
                <div className={styles.info}>
                    <div className={styles.rating}>
                        {averageRating > 0 ? (
                            <span className={styles.filledStar}>★ {averageRating.toFixed(1)}</span>
                        ) : (
                            <span className={styles.noReviews}>Немає відгуків</span>
                        )}
                    </div>

                    <h3 className={styles.title}>{title}</h3>
                    
                    <p className={styles.address}>
                        <span className={styles.iconWrapper}><LocationIcon /></span>
                        {address}
                    </p>

                    <div className={styles.priceContainer}>
                        <p className={styles.price}>{price.toLocaleString()} грн</p>
                        
                        <button
                            className={`${styles.heartButton} ${isFavorite ? styles.favorited : ''}`}
                            onClick={handleFavoriteClick}
                        >
                            <svg viewBox="0 0 24 24" fill={isFavorite ? "#B17457" : "none"} stroke="#B17457" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ListingCard;