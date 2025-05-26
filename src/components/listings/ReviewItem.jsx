// src/components/listings/ReviewItem.jsx
import React from 'react';
import styles from './ReviewItem.module.css';

const ReviewItem = ({ review }) => {
  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const emptyStars = totalStars - filledStars;
    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(<span key={`filled-${i}`} className={styles.filledStar}>&#9733;</span>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className={styles.emptyStar}>&#9733;</span>);
    }
    return stars;
  };

  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <img src={review.avatarUrl} alt={review.author} className={styles.avatar} />
        <div className={styles.authorInfo}>
          <p className={styles.authorName}>{review.author}</p>
          <p className={styles.reviewDate}>{review.date}</p>
        </div>
        <div className={styles.reviewStars}>
          {renderStars(review.rating)}
        </div>
      </div>
      <p className={styles.reviewComment}>{review.comment}</p>
    </div>
  );
};

export default ReviewItem;