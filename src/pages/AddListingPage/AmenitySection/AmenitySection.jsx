import React from 'react';
import { FiCheck } from 'react-icons/fi';
import styles from './AmenitySection.module.css';

const AmenitySection = ({ amenities, selectedIds, toggleAmenity }) => {
    return (
        <div className={styles.container}>
            <div className={styles.amenitiesGrid}>
                {amenities.map((amenity) => {
                    const isSelected = selectedIds.includes(amenity.id);
                    return (
                        <div 
                            key={amenity.id} 
                            className={`${styles.amenityItem} ${isSelected ? styles.selected : ''}`}
                            onClick={() => toggleAmenity(amenity.id)}
                        >
                            <div className={styles.checkbox}>
                                {isSelected && <FiCheck className={styles.checkIcon} />}
                            </div>
                            <span className={styles.title}>{amenity.title}</span>
                        </div>
                    );
                })}
            </div>
            {amenities.length === 0 && <p className={styles.loadingText}>Завантаження зручностей...</p>}
        </div>
    );
};

export default AmenitySection;