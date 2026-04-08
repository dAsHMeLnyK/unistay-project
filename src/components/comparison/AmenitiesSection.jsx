import React from 'react';
import { FiCheck, FiMinus, FiStar } from 'react-icons/fi';
import styles from './AmenitiesSection.module.css';

const AmenitiesSection = ({ amenitiesComparison }) => {
    const { commonAmenities, onlyInListing1, onlyInListing2 } = amenitiesComparison;

    // Створюємо унікальний список усіх зручностей
    const allAmenities = Array.from(new Set([
        ...commonAmenities,
        ...onlyInListing1,
        ...onlyInListing2
    ]));

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h3 className={styles.sectionTitle}>
                    Зручності та особливості
                </h3>
            </div>

            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    <span>Об'єкт №1</span>
                    <span className={styles.centerLabel}>Назва зручності</span>
                    <span>Об'єкт №2</span>
                </div>

                {allAmenities.map((amenity) => {
                    const in1 = commonAmenities.includes(amenity) || onlyInListing1.includes(amenity);
                    const in2 = commonAmenities.includes(amenity) || onlyInListing2.includes(amenity);
                    const isExclusive = onlyInListing1.includes(amenity) || onlyInListing2.includes(amenity);

                    return (
                        <div key={amenity} className={`${styles.row} ${isExclusive ? styles.exclusiveRow : ''}`}>
                            <div className={`${styles.status} ${in1 ? styles.has : styles.hasNot}`}>
                                {in1 ? <FiCheck /> : <FiMinus />}
                            </div>
                            
                            <div className={styles.name}>{amenity}</div>
                            
                            <div className={`${styles.status} ${in2 ? styles.has : styles.hasNot}`}>
                                {in2 ? <FiCheck /> : <FiMinus />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default AmenitiesSection;