// src/components/listings/ReviewForm.jsx
import React, { useState } from 'react';
import styles from './ReviewForm.module.css';

const ReviewForm = ({ listingId, onAddReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      alert('Будь ласка, залиште оцінку та коментар.');
      return;
    }

    const newReview = {
      id: `rev${Date.now()}`, // Простий унікальний ID
      author: 'Ваше ім\'я', // Тут має бути реальне ім'я користувача
      date: new Date().toLocaleDateString('uk-UA'),
      rating: rating,
      comment: comment.trim(),
      avatarUrl: 'https://via.placeholder.com/40x40/D8D2C2/FFFFFF?text=Ви',
    };

    onAddReview(newReview);
    setRating(0);
    setComment('');
    setHoverRating(0);
  };

  const renderStars = (currentRating) => {
    const totalStars = 5;
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <span
          key={i}
          className={`${styles.star} ${i <= (hoverRating || currentRating) ? styles.filled : styles.empty}`}
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
        >
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className={styles.reviewForm}>
      <h2 className={styles.sectionTitle}>Залишити свій відгук</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.ratingSelect}>
          <label className={styles.ratingLabel}>Залиште свою оцінку</label>
          <div className={styles.starsContainer}>
            {renderStars(rating)}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="reviewComment">Напишіть свій відгук</label>
          <textarea
            id="reviewComment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Відгук"
            rows="4"
            className={styles.textarea}
          ></textarea>
        </div>
        <button type="submit" className={styles.submitButton}>
          Залишити відгук
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;