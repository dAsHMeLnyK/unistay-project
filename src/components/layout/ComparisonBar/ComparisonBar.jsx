import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLayers, FiX, FiArrowRight } from 'react-icons/fi';
import { useListings } from '../../../context/ListingContext';
import styles from './ComparisonBar.module.css';

const ComparisonBar = () => {
    const { compareIds, compareListings, clearCompare, toggleCompare } = useListings();
    const navigate = useNavigate();

    // Якщо нічого не обрано, бар не відображається
    if (compareIds.length === 0) return null;

    const handleCompareClick = () => {
        if (compareIds.length === 2) {
            navigate(`/compare?id1=${compareIds[0]}&id2=${compareIds[1]}`);
        }
    };

    return (
        <div className={styles.barWrapper}>
            <div className={styles.barContainer}>
                <div className={styles.info}>
                    <div className={styles.iconBadge}>
                        <FiLayers />
                        <span className={styles.count}>{compareIds.length}</span>
                    </div>
                    <div className={styles.text}>
                        <h4>Порівняння об'єктів</h4>
                        <p>{compareIds.length === 1 
                            ? "Оберіть ще один об'єкт для порівняння" 
                            : "Об'єкти готові до порівняння"}
                        </p>
                    </div>
                </div>

                <div className={styles.selectedItems}>
                    {compareListings.map(item => (
                        <div key={item.id} className={styles.miniCard}>
                            <img src={item.listingImages?.[0]?.imageUrl} alt="" />
                            <button 
                                className={styles.removeMini} 
                                onClick={() => toggleCompare(item.id)}
                            >
                                <FiX />
                            </button>
                        </div>
                    ))}
                    {compareIds.length === 1 && <div className={styles.placeholderCard}>+</div>}
                </div>

                <div className={styles.actions}>
                    <button className={styles.clearBtn} onClick={clearCompare}>
                        Очистити
                    </button>
                    <button 
                        className={styles.compareBtn} 
                        disabled={compareIds.length < 2}
                        onClick={handleCompareClick}
                    >
                        Порівняти <FiArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComparisonBar;