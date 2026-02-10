import React, { useState } from 'react';
import { FiStar, FiSend } from 'react-icons/fi';
import Button from '../../../../components/common/Button/Button'; 
import styles from './ReviewForm.module.css';

const ReviewForm = ({ onSubmit, isSubmitting }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const MAX_COMMENT_LENGTH = 1000;

    const ratingLabels = {
        1: "Жахливо",
        2: "Погано",
        3: "Задовільно",
        4: "Добре",
        5: "Чудово"
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) return;
        onSubmit({ rating, comment });
        setRating(0);
        setComment('');
    };

    // ... (імпорти без змін)
    return (
        <form className={styles.reviewForm} onSubmit={handleSubmit}>
            <div className={styles.formHeader}>
                <h4 className={styles.formTitle}>Залишити свій відгук</h4>
                <div className={styles.starRatingGroup}>
                    <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`${styles.starBtn} ${star <= (hover || rating) ? styles.active : ''}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                <FiStar fill={star <= (hover || rating) ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>
                    { (hover || rating) > 0 && (
                        <span className={styles.ratingText}>
                            {ratingLabels[hover || rating]}
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.textAreaContainer}>
                <textarea
                    className={styles.commentInput}
                    placeholder="Розкажіть про ваш досвід..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    maxLength={MAX_COMMENT_LENGTH}
                />
                <div className={styles.formFooter}>
                    <span className={styles.charCounter}>
                        {comment.length} / {MAX_COMMENT_LENGTH}
                    </span>
                    <Button 
                        type="submit" 
                        variant="primary" 
                        className={styles.submitBtn}
                        disabled={isSubmitting || rating === 0 || !comment.trim()}
                    >
                        {isSubmitting ? "Надсилаємо..." : <><FiSend /> Опублікувати</>}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default ReviewForm;