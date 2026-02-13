import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import { ListingService } from '../../api/services/ListingService';
import { COMPARISON_RESULT } from '../../constants/listingEnums'; // Пам'ятаєте, ми його створювали?
import styles from './ComparePage.module.css';

const ComparePage = () => {
    const [searchParams] = useSearchParams();
    const [comparisonData, setComparisonData] = useState(null);
    const [loading, setLoading] = useState(true);
    const id1 = searchParams.get('id1');
    const id2 = searchParams.get('id2');

    useEffect(() => {
        const fetchComparison = async () => {
            if (id1 && id2) {
                try {
                    setLoading(true);
                    const data = await ListingService.compare(id1, id2);
                    setComparisonData(data);
                } catch (err) {
                    console.error("Помилка завантаження порівняння:", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchComparison();
    }, [id1, id2]);

    if (loading) return <div className={styles.loading}>Аналізуємо варіанти...</div>;
    if (!comparisonData) return <div className={styles.error}>Не вдалося завантажити дані для порівняння.</div>;

    const { priceComparison, amenitiesComparison, reviewsComparison, locationComparison } = comparisonData;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link to="/listings" className={styles.backLink}><FiArrowLeft /> Назад до пошуку</Link>
                <h1 className={styles.pageTitle}>Порівняння об'єктів</h1>
            </header>

            <div className={styles.compareGrid}>
                {/* 1. Секція цін */}
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Вартість</h3>
                    <div className={styles.row}>
                        <div className={`${styles.cell} ${priceComparison.cheaper === 0 ? styles.winner : ''}`}>
                            <span className={styles.priceValue}>{priceComparison.listing1Price.toLocaleString()} грн</span>
                            {priceComparison.cheaper === 0 && <span className={styles.badge}>Дешевше</span>}
                        </div>
                        <div className={styles.label}>Ціна</div>
                        <div className={`${styles.cell} ${priceComparison.cheaper === 1 ? styles.winner : ''}`}>
                            <span className={styles.priceValue}>{priceComparison.listing2Price.toLocaleString()} грн</span>
                            {priceComparison.cheaper === 1 && <span className={styles.badge}>Дешевше</span>}
                        </div>
                    </div>
                </section>

                {/* 2. Секція зручностей */}
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Зручності</h3>
                    <div className={styles.row}>
                        <div className={styles.cell}>
                            <ul className={styles.amenityList}>
                                {amenitiesComparison.commonAmenities.map(a => <li key={a} className={styles.common}><FiCheck/> {a}</li>)}
                                {amenitiesComparison.onlyInListing1.map(a => <li key={a} className={styles.exclusive}><FiCheck/> {a}</li>)}
                            </ul>
                        </div>
                        <div className={styles.label}>Перелік</div>
                        <div className={styles.cell}>
                            <ul className={styles.amenityList}>
                                {amenitiesComparison.commonAmenities.map(a => <li key={a} className={styles.common}><FiCheck/> {a}</li>)}
                                {amenitiesComparison.onlyInListing2.map(a => <li key={a} className={styles.exclusive}><FiCheck/> {a}</li>)}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 3. Локація (Відстані до орієнтирів) */}
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Інфраструктура (відстань до об'єктів)</h3>
                    {locationComparison.landmarkComparisons.map((landmark, idx) => (
                        <div className={styles.row} key={idx}>
                            <div className={`${styles.cell} ${landmark.closerListing === 0 ? styles.winner : ''}`}>
                                {landmark.listing1DistanceKm} км
                            </div>
                            <div className={styles.label}>{landmark.landmarkName}</div>
                            <div className={`${styles.cell} ${landmark.closerListing === 1 ? styles.winner : ''}`}>
                                {landmark.listing2DistanceKm} км
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default ComparePage;