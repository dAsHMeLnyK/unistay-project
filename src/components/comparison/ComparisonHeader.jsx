import React from 'react';
import styles from './ComparisonHeader.module.css';

const ComparisonHeader = ({ listing1, listing2 }) => {
    return (
        <div className={styles.stickyHeader}>
            <div className={styles.headerGrid}>
                <div className={styles.headerCard}>
                    <div className={styles.imageWrapper}>
                        <img src={listing1?.listingImages?.[0]?.imageUrl || '/placeholder.jpg'} alt="" />
                        <span className={styles.cardBadge}>Об'єкт №1</span>
                    </div>
                    <div className={styles.headerContent}>
                        <h4>{listing1?.title}</h4>
                        <p>{listing1?.address}</p>
                    </div>
                </div>

                <div className={styles.vsDivider}>VS</div>

                <div className={styles.headerCard}>
                    <div className={styles.imageWrapper}>
                        <img src={listing2?.listingImages?.[0]?.imageUrl || '/placeholder.jpg'} alt="" />
                        <span className={styles.cardBadge}>Об'єкт №2</span>
                    </div>
                    <div className={styles.headerContent}>
                        <h4>{listing2?.title}</h4>
                        <p>{listing2?.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComparisonHeader;