import React, { useState, useMemo } from 'react';
import { FiPlus, FiMessageSquare, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import ReviewService from '../../../api/services/ReviewService';
import ReviewForm from './ReviewForm/ReviewForm';
import ReviewCard from "./ReviewCard/ReviewCard";
import ReviewStats from "./ReviewStats/ReviewStats";
import Button from '../../../components/common/Button/Button';
import styles from './ReviewSection.module.css';

const ReviewSection = ({ reviews: initialReviews, listingId, ownerId }) => {
    const { isAuthenticated, userId, userName } = useAuth();
    const [reviews, setReviews] = useState(initialReviews || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const isOwner = userId && ownerId && String(userId).toLowerCase() === String(ownerId).toLowerCase();

    const stats = useMemo(() => {
        if (!reviews.length) return { avg: "0.0", count: 0, distribution: [0, 0, 0, 0, 0] };
        const total = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
        const avg = (total / reviews.length).toFixed(1);
        const counts = [0, 0, 0, 0, 0];
        reviews.forEach(r => {
            const rating = Math.round(r.rating);
            if (rating >= 1 && rating <= 5) counts[rating - 1]++;
        });
        return { avg, count: reviews.length, distribution: counts.reverse().map(c => (c / reviews.length) * 100) };
    }, [reviews]);

    const handleAddReview = async (formData) => {
        setIsSubmitting(true);
        try {
            const result = await ReviewService.createForListing(listingId, formData);
            const newReview = {
                ...result,
                user: result.user || { id: userId, fullName: userName || "Користувач" },
                publicationDate: result.publicationDate || new Date().toISOString()
            };
            setReviews(prev => [newReview, ...prev]);
            setIsFormOpen(false);
        } catch (err) {
            alert("Помилка при додаванні відгуку.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.sectionContainer}>
            
            <div className={styles.headerGrid}>
                <ReviewStats {...stats} />

                <div className={styles.actionCard}>
                    {!isAuthenticated ? (
                        <div className={styles.statusBox}>
                            <FiLock className={styles.statusIcon} />
                            <p>Увійдіть, щоб залишити відгук</p>
                        </div>
                    ) : isOwner ? (
                        <div className={styles.statusBox}>
                            <FiAlertCircle className={styles.statusIcon} />
                            <p>Це ваше оголошення</p>
                        </div>
                    ) : (
                        <div className={styles.writeBox}>
                            <h4>Маєте що сказати?</h4>
                            <p>Ваша думка допоможе іншим студентам.</p>
                            <Button 
                                variant={isFormOpen ? 'secondary' : 'primary'}
                                onClick={() => setIsFormOpen(!isFormOpen)}
                            >
                                {isFormOpen ? 'Скасувати' : 'Написати відгук'}
                                {!isFormOpen && <FiPlus />}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {isFormOpen && (
                <div className={styles.formWrapper}>
                    <ReviewForm onSubmit={handleAddReview} isSubmitting={isSubmitting} />
                </div>
            )}

            <div className="cards-grid">
                {reviews.length > 0 ? (
                    reviews.map(review => <ReviewCard key={review.id} review={review} />)
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