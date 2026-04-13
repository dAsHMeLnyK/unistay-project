import React from 'react';
import { FiStar } from 'react-icons/fi';
import styles from "./ReviewStats.module.css";

const ReviewStats = ({ avg, count, distribution }) => {
    return (
        <div className={styles.statsCard}>
            <div className={styles.avgBlock}>
                <span className={styles.avgValue}>{avg}</span>
                <div className={styles.starsStatic}>
                    {[1, 2, 3, 4, 5].map(s => (
                        <FiStar 
                            key={s} 
                            className={s <= Math.round(Number(avg)) ? styles.filledStar : styles.emptyStar} 
                        />
                    ))}
                </div>
                <span className={styles.totalText}>{count} відгуків</span>
            </div>
            
            <div className={styles.distribution}>
                {distribution.map((percent, idx) => (
                    <div key={idx} className={styles.distRow}>
                        <span className={styles.distLabel}>{5 - idx}</span>
                        <div className={styles.barBg}>
                            <div className={styles.barFill} style={{ width: `${percent}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewStats;