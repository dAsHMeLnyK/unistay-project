import React from 'react';
import { FiCheck } from 'react-icons/fi';
import styles from './AmenityDisplay.module.css';

const AmenityDisplay = ({ amenities }) => {
    if (!amenities || amenities.length === 0) return null;

    return (
        <div className={styles.container}>
            <div className={styles.amenitiesGrid}>
                {amenities.map((amenity) => (
                    <div key={amenity.id} className={styles.amenityItem}>
                        <div className={styles.checkbox}>
                            <FiCheck className={styles.checkIcon} />
                        </div>
                        <span className={styles.title}>{amenity.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AmenityDisplay;