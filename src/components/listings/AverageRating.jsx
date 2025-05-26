// src/components/listings/AverageRating.jsx
import React from 'react';
import styles from './AverageRating.module.css';

const AverageRating = ({ rating, totalReviews }) => {
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

  // Розподіл відгуків за зірками
  const getRatingDistribution = (reviews) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviews) {
      reviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          distribution[review.rating]++;
        }
      });
    }
    return distribution;
  };

  const reviewsData = JSON.parse(localStorage.getItem('listings'))?.find(l => l.id === window.location.pathname.split('/').pop())?.reviews || [];
  const ratingDistribution = getRatingDistribution(reviewsData);

  return (
    <div className={styles.averageRating}>
      <h2 className={styles.sectionTitle}>Середній рейтинг</h2>
      <div className={styles.mainRating}>
        <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
        <div className={styles.starsContainer}>
          {renderStars(rating)}
        </div>
        <span className={styles.totalReviews}>
          {totalReviews} відгук{totalReviews === 1 ? '' : (totalReviews >= 2 && totalReviews <= 4 ? 'и' : 'ів')}
        </span>
      </div>

      <div className={styles.distribution}>
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className={styles.progressBarWrapper}>
            <span className={styles.starLabel}>{star}.0</span>
            <div className={styles.progressBarBackground}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${(ratingDistribution[star] / totalReviews) * 100 || 0}%` }}
              ></div>
            </div>
            <span className={styles.reviewCount}>{ratingDistribution[star]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AverageRating;