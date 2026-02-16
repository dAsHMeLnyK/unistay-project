import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiHeart, FiLayers } from 'react-icons/fi';
import { useListings } from '../../../context/ListingContext';
import styles from './ListingCard.module.css';

const ListingCard = ({ listing }) => {
    const { favoriteIds, toggleFavorite, compareIds, toggleCompare } = useListings();

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

    const isFavorite = favoriteIds.includes(id);
    const isComparing = compareIds?.includes(id);

    // Універсальний обробник для кнопок, щоб не переходити по лінку картки
    const handleAction = (e, callback) => {
        e.preventDefault();
        e.stopPropagation();
        callback(id);
    };

    return (
        <Link to={`/listings/${id}`} className={styles.cardLink}>
            <div className={`${styles.card} ${isComparing ? styles.cardComparing : ''}`}>
                <div className={styles.imageContainer}>
                    <img src={imageUrl} alt={title} className={styles.image} />
                    
                    <button
                        className={`${styles.compareButton} ${isComparing ? styles.compareActive : ''}`}
                        onClick={(e) => handleAction(e, toggleCompare)}
                        title={isComparing ? "Видалити з порівняння" : "Додати до порівняння"}
                    >
                        <FiLayers className={styles.compareIcon} />
                    </button>
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
                            className={styles.heartButton}
                            onClick={(e) => handleAction(e, toggleFavorite)}
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