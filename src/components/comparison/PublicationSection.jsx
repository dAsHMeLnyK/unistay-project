import React from 'react';
import { FiClock } from 'react-icons/fi';
import styles from './PublicationSection.module.css';

const PublicationSection = ({ dateComp }) => {
    return (
        <section className={styles.section}>
            <h3 className={styles.sectionTitle}> Актуальність</h3>
            <div className={styles.grid}>
                <div className={styles.dateInfo}>
                    <span className={styles.dateLabel}>Опубліковано</span>
                    <span className={styles.dateValue}>
                        {new Date(dateComp.listing1Date).toLocaleDateString()}
                    </span>
                </div>
                
                <div className={styles.diffLabel}>
                    {dateComp.daysDifference === 0 
                        ? "Опубліковані в один день" 
                        : `Різниця в часі: ${dateComp.daysDifference} дн.`}
                </div>

                <div className={styles.dateInfo}>
                    <span className={styles.dateLabel}>Опубліковано</span>
                    <span className={styles.dateValue}>
                        {new Date(dateComp.listing2Date).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </section>
    );
};

export default PublicationSection;