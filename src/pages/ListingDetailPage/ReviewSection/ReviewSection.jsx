import React, { useState, useMemo } from 'react';
import { FiStar, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import ReviewService from '../../../api/services/ReviewService';
import ReviewForm from './ReviewForm/ReviewForm';
import styles from './ReviewSection.module.css';

const ReviewSection = ({ reviews: initialReviews, listingId, ownerId, ownerName }) => {
    // Тепер дістаємо userName з оновленого AuthContext
    const { isAuthenticated, userId, userName } = useAuth();
    const [reviews, setReviews] = useState(initialReviews || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            // 1. Відправляємо на бекенд
            const result = await ReviewService.createForListing(listingId, formData);
            
            // 2. Формуємо об'єкт для миттєвого відображення.
            // Якщо бекенд повернув result.user === null, ми самі підставляємо дані з контексту.
            const newReview = {
                ...result,
                user: result.user || { 
                    id: userId, 
                    fullName: userName || "Мій відгук" 
                },
                userId: userId,
                // Використовуємо дату з сервера або поточну
                publicationDate: result.publicationDate || new Date().toISOString()
            };

            setReviews(prev => [newReview, ...prev]);
        } catch (err) {
            console.error("Review creation error:", err);
            alert("Помилка при додаванні відгуку. Можливо, ви вже залишали відгук для цього оголошення.");
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

            {/* Зона взаємодії: Форма або Попередження */}
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
                    reviews.map((review) => {
                        const reviewUserId = String(review.userId || "").toLowerCase();
                        
                        // Пріоритет імені: 
                        // 1. Те, що прийшло в об'єкті user (від сервера)
                        // 2. Якщо це поточний юзер — його ім'я з контексту
                        // 3. Якщо це власник оголошення — ownerName
                        let displayName = "Користувач";

                        if (review.user?.fullName) {
                            displayName = review.user.fullName;
                        } else if (reviewUserId === currentUserId && userName) {
                            displayName = userName;
                        } else if (reviewUserId === cleanOwnerId && ownerName) {
                            displayName = ownerName;
                        }

                        return (
                            <div key={review.id} className={styles.reviewCard}>
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