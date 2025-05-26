// src/components/listings/ReviewsList.jsx
import React from 'react';
import ReviewItem from './ReviewItem';
import styles from './ReviewsList.module.css';

const ReviewsList = ({ reviews }) => {
  return (
    <div className={styles.reviewsListContainer}>
      <h2 className={styles.sectionTitle}>Відгуки</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))
      ) : (
        <p className={styles.noReviews}>Поки що відгуків немає. Будьте першим!</p>
      )}
    </div>
  );
};

export default ReviewsList;