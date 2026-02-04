import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ListingCard.module.css';

const ListingCard = ({ listing }) => {
  // 1. Обчислюємо середній рейтинг на основі відгуків (Reviews)
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  // 2. Отримуємо дані з DTO або використовуємо значення за замовчуванням
  const id = listing?.id || 'default-id';
  const title = listing?.title || 'Заголовок оголошення';
  const address = listing?.address || 'Адреса житла';
  const price = listing?.price || 0;
  
  // Беремо першу картинку з масиву ListingImages
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

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating - filledStars >= 0.5;
    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(<span key={`filled-${i}`} className={styles.filledStar}>&#9733;</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className={styles.halfStar}>&#9733;</span>);
    }
    for (let i = stars.length; i < totalStars; i++) {
      stars.push(<span key={`empty-${i}`} className={styles.emptyStar}>&#9733;</span>);
    }
    return stars;
  };

  return (
    <Link to={`/listings/${id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img src={imageUrl} alt={title} className={styles.image} />
        </div>
        <div className={styles.info}>
          <div className={styles.rating}>
            {averageRating > 0 ? renderStars(averageRating) : <span className={styles.noReviews}>Немає відгуків</span>}
          </div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.address}>
            <span className={styles.locationIcon}>&#x2302;</span> {address}
          </p>
          <div className={styles.priceContainer}>
            <p className={styles.price}>{price} грн</p>
            <button
              className={`${styles.heartIconOnly} ${isFavorite ? styles.favorited : ''}`}
              onClick={handleFavoriteClick}
            >
              <span>{isFavorite ? '♥' : '♡'}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;