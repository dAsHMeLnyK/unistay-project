import React from 'react';
import { FiHome, FiZap, FiUsers, FiLayers } from 'react-icons/fi';
import { LISTING_TYPES, COMMUNAL_SERVICES, OWNERSHIP_TYPES, NEIGHBOUR_TYPES } from '../../../constants/listingEnums';
import styles from './ListingFeatures.module.css';

const ListingFeatures = ({ listing }) => {
    if (!listing) return null;

    const features = [
        { 
            icon: <FiHome />, 
            label: "Тип житла", 
            value: LISTING_TYPES[listing.type]?.label || "Не вказано"
        },
        { 
            icon: <FiZap />, 
            label: "Комунальні", 
            value: listing.communalServices?.length > 0 
                ? COMMUNAL_SERVICES[listing.communalServices[0]]?.label 
                : "Окремо" 
        },
        { 
            icon: <FiUsers />, 
            label: "Господарі", 
            value: OWNERSHIP_TYPES[listing.owners]?.label || "Не вказано"
        },
        { 
            icon: <FiLayers />, 
            label: "Сусіди", 
            value: NEIGHBOUR_TYPES[listing.neighbours]?.label || "Не вказано"
        }
    ];

    return (
        <div className={styles.featuresGrid}>
            {features.map((item, index) => (
                <div key={index} className={styles.featureItem}>
                    <div className={styles.iconWrapper}>{item.icon}</div>
                    <div className={styles.textWrapper}>
                        <span className={styles.label}>{item.label}</span>
                        <span className={styles.value}>{item.value}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListingFeatures;