import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { ListingService } from '../../api/services/ListingService';
import ComparisonHeader from '../../components/comparison/ComparisonHeader';
import PriceSection from '../../components/comparison/PriceSection';
import InfrastructureSection from '../../components/comparison/InfrastructureSection';
import AmenitiesSection from '../../components/comparison/AmenitiesSection';
import PublicationSection from '../../components/comparison/PublicationSection';
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
                    console.error("Помилка:", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchComparison();
    }, [id1, id2]);

    if (loading) return <div className={styles.loading}>Проводимо глибокий аналіз...</div>;
    if (!comparisonData) return <div className={styles.error}>Помилка завантаження.</div>;

    // ВСІ ДАНІ З ВАШОГО C# DTO
    const { 
        listing1, 
        listing2, 
        priceComparison, 
        locationComparison, 
        amenitiesComparison,
        communalServicesComparison,
        publicationDateComparison 
    } = comparisonData;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link to="/listings" className={styles.backLink}><FiArrowLeft /> Назад</Link>
                <h1 className={styles.pageTitle}>Порівняльний аналіз</h1>
            </header>

            {/* Використовуємо об'єкти прямо з бекенду */}
            <ComparisonHeader listing1={listing1} listing2={listing2} />

            <div className={styles.compareGrid}>
                <PriceSection 
                    priceComparison={priceComparison} 
                    communalComp={communalServicesComparison} 
                />
                
                <PublicationSection dateComp={publicationDateComparison} />

                <InfrastructureSection locationComparison={locationComparison} />
                
                <AmenitiesSection amenitiesComparison={amenitiesComparison} />
            </div>
        </div>
    );
};

export default ComparePage;