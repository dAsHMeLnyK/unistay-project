import React from 'react';
import styles from './InfrastructureSection.module.css';

const InfrastructureSection = ({ locationComparison }) => {
    return (
        <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Інфраструктура та відстані</h3>
            <div className={styles.locationGrid}>
                {locationComparison.landmarkComparisons.map((landmark, idx) => {
                    // Рахуємо відсоткове співвідношення для бару (чим менша відстань, тим довший бар)
                    const maxDist = Math.max(landmark.listing1DistanceKm, landmark.listing2DistanceKm, 1);
                    const width1 = (1 - landmark.listing1DistanceKm / (maxDist * 1.2)) * 100;
                    const width2 = (1 - landmark.listing2DistanceKm / (maxDist * 1.2)) * 100;

                    return (
                        <div key={idx} className={styles.landmarkRow}>
                            <div className={styles.landmarkName}>{landmark.landmarkName}</div>
                            <div className={styles.barsContainer}>
                                {/* Об'єкт 1 */}
                                <div className={styles.barWrapper}>
                                    <span className={styles.distValue}>{landmark.listing1DistanceKm} км</span>
                                    <div className={styles.track}>
                                        <div 
                                            className={`${styles.fill} ${landmark.closerListing === 0 ? styles.winnerFill : ''}`} 
                                            style={{ width: `${width1}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Об'єкт 2 */}
                                <div className={`${styles.barWrapper} ${styles.reverse}`}>
                                    <span className={styles.distValue}>{landmark.listing2DistanceKm} км</span>
                                    <div className={styles.track}>
                                        <div 
                                            className={`${styles.fill} ${landmark.closerListing === 1 ? styles.winnerFill : ''}`} 
                                            style={{ width: `${width2}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default InfrastructureSection;