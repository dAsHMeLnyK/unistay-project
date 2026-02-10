import React, { useState, useMemo } from 'react';
import { FiStar, FiMessageSquare, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import ReviewService from '../../../api/services/ReviewService';
import ReviewForm from './ReviewForm/ReviewForm';
import styles from './ReviewSection.module.css';

const ReviewSection = ({ reviews: initialReviews, listingId, ownerId, ownerName }) => {
    const { isAuthenticated, userId, userName } = useAuth();
    const [reviews, setReviews] = useState(initialReviews || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Приводимо ID до одного формату для порівняння
    const currentUserId = String(userId || "").toLowerCase();
    const cleanOwnerId = String(ownerId || "").toLowerCase();

    const isOwner = useMemo(() => {
        if (!userId || !ownerId) return false;
        return currentUserId === cleanOwnerId;
    }, [currentUserId, cleanOwnerId]);

    const averageRating = useMemo(() => {
        if (!reviews.length) return "0.0";
        const total = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
        return (total / reviews.length).toFixed(1);
    }, [reviews]);

    const handleAddReview = async (formData) => {
        setIsSubmitting(true);
        try {
            const result = await ReviewService.createForListing(listingId, formData);
            
            // Створюємо об'єкт нового відгуку з актуальним ім'ям з контексту
            const newReview = {
                ...result,
                user: { fullName: userName || "Я" }, 
                userId: userId,
                publicationDate: new Date().toISOString()
            };

            setReviews(prev => [newReview, ...prev]);
        } catch (err) {
            alert("Помилка при додаванні відгуку");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.sectionContainer}>
            {/* Блок рейтингу */}
            <div className={styles.ratingSummary}>
                <div className={styles.bigRating}>
                    <span className={styles.ratingValue}>{averageRating}</span>
                    <div className={styles.starsWrapper}>
                        <div className={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <FiStar 
                                    key={s} 
                                    className={s <= Math.round(Number(averageRating)) ? styles.filledStar : styles.emptyStar} 
                                />
                            ))}
                        </div>
                        <span className={styles.reviewsCount}>На основі {reviews.length} відгуків</span>
                    </div>
                </div>
            </div>

            {/* Форма відгуку */}
            <div className={styles.interactionZone}>
                {!isAuthenticated ? (
                    <div className={styles.infoBox}>
                        <FiLock className={styles.infoIcon} />
                        <p>Будь ласка, увійдіть, щоб залишити відгук.</p>
                    </div>
                ) : isOwner ? (
                    <div className={`${styles.infoBox} ${styles.ownerBox}`}>
                        <FiAlertCircle className={styles.infoIcon} />
                        <p>Ви не можете залишати відгуки до власного оголошення.</p>
                    </div>
                ) : (
                    <ReviewForm onSubmit={handleAddReview} isSubmitting={isSubmitting} />
                )}
            </div>

            {/* Список відгуків */}
            <div className={styles.reviewsGrid}>
                {reviews.length > 0 ? (
                    reviews.map((review, index) => {
                        const reviewUserId = String(review.userId || "").toLowerCase();
                        
                        // ЛОГІКА ВИЗНАЧЕННЯ ІМЕНІ (точно як у власника):
                        let displayName = "Користувач";

                        if (review.user?.fullName) {
                            displayName = review.user.fullName;
                        } else if (reviewUserId === currentUserId && userName) {
                            // Якщо це ВАШ відгук
                            displayName = userName;
                        } else if (reviewUserId === cleanOwnerId && ownerName) {
                            // Якщо відгук залишив ВЛАСНИК оголошення
                            displayName = ownerName;
                        }

                        return (
                            <div key={review.id || index} className={styles.reviewCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.authorAvatar}>
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={styles.authorMeta}>
                                        <h4 className={styles.authorName}>{displayName}</h4>
                                        <span className={styles.reviewDate}>
                                            {new Date(review.publicationDate).toLocaleDateString('uk-UA', {
                                                month: 'long', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className={styles.cardRating}>
                                        <FiStar /> <span>{review.rating}</span>
                                    </div>
                                </div>
                                <p className={styles.commentText}>{review.comment}</p>
                            </div>
                        );
                    })
                ) : (
                    <div className={styles.emptyState}>
                        <p>Відгуків ще немає. Будьте першим!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;