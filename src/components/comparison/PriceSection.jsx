import React from 'react';
import { FiTrendingDown } from 'react-icons/fi';
import styles from './PriceSection.module.css';

const PriceSection = ({ priceComparison, communalComp }) => {
    const { listing1Price, listing2Price, cheaper, priceDifference } = priceComparison;
    
    const maxPrice = Math.max(listing1Price, listing2Price);
    const diffPercent = maxPrice > 0 ? (priceDifference / maxPrice) * 100 : 0;

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h3 className={styles.sectionTitle}>Фінансові умови</h3>
                {priceDifference > 0 && (
                    <div className={styles.diffBadge}>
                        <FiTrendingDown /> Різниця {priceDifference.toLocaleString()} ₴
                    </div>
                )}
            </div>

            <div className={styles.priceContainer}>
                <div className={`${styles.priceBlock} ${cheaper === 0 ? styles.isCheaper : ''}`}>
                    <span className={styles.label}>Ціна Об'єкта №1</span>
                    <span className={styles.value}>{listing1Price.toLocaleString()} ₴</span>
                    <div className={styles.utilityStatus}>
                        {communalComp?.hasIncluded1 ? 'Комунальні включені' : 'Комунальні окремо'}
                    </div>
                </div>

                <div className={styles.visualScale}>
                    <div className={styles.track}>
                        <div 
                            className={styles.diffFill} 
                            style={{ 
                                width: `${diffPercent}%`,
                                left: cheaper === 1 ? '0' : 'auto',
                                right: cheaper === 0 ? '0' : 'auto'
                            }} 
                        />
                    </div>
                    <div className={styles.scaleLabels}>
                        <span>Вигідніше</span>
                        <span>Дорожче</span>
                    </div>
                </div>

                <div className={`${styles.priceBlock} ${cheaper === 1 ? styles.isCheaper : ''}`}>
                    <span className={styles.label}>Ціна Об'єкта №2</span>
                    <span className={styles.value}>{listing2Price.toLocaleString()} ₴</span>
                    <div className={styles.utilityStatus}>
                        {communalComp?.hasIncluded2 ? 'Комунальні включені' : 'Комунальні окремо'}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PriceSection;