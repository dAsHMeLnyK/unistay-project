import React from 'react';
import { FiStar } from 'react-icons/fi';
import styles from "./ReviewCard.module.css";

const ReviewCard = ({ review }) => {
    const displayName = review.user?.fullName || "Користувач";
    const date = new Date(review.publicationDate).toLocaleDateString('uk-UA', { 
        month: 'long', 
        year: 'numeric' 
    });

    return (
        <div className={styles.reviewCard}>
            <div className={styles.cardHeader}>
                <div className={styles.authorAvatar}>
                    {displayName.charAt(0).toUpperCase()}
                </div>
                <div className={styles.authorMeta}>
                    <h4 className={styles.authorName}>{displayName}</h4>
                    <span className={styles.reviewDate}>{date}</span>
                </div>
                <div className="inner-badge" style={{ marginLeft: 'auto', gap: '6px' }}>
                    <FiStar style={{ color: '#FFB800', fill: '#FFB800' }} />
                    <span>{review.rating}</span>
                </div>
            </div>
            <p className={styles.commentText}>{review.comment}</p>
        </div>
    );
};

export default ReviewCard;