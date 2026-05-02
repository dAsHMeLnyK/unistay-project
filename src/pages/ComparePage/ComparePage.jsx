import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Замінили Link на useNavigate
import { FiArrowLeft, FiMap } from 'react-icons/fi'; // Додали іконку карти
import { ListingService } from '../../api/services/ListingService';
import ComparisonHeader from '../../components/comparison/ComparisonHeader/ComparisonHeader';
import PriceSection from '../../components/comparison/PriceSection/PriceSection';
import InfrastructureSection from '../../components/comparison/InfrastructureSection/InfrastructureSection';
import AmenitiesSection from '../../components/comparison/AmenitiesSection/AmenitiesSection';
import PublicationSection from '../../components/comparison/PublicationSection/PublicationSection';
import styles from './ComparePage.module.css';

const ComparePage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // Хук для навігації
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
                {/* Верхній рядок з навігацією */}
                <div className={styles.headerNavigation}>
                    <button onClick={() => navigate(-1)} className={styles.backLink}>
                        <FiArrowLeft /> Назад
                    </button>
                    
                    {/* Кнопка переходу на карту */}
                    <button 
                        onClick={() => navigate('/explore-map')} 
                        className={styles.mapActionBtn}
                        title="Інтерактивне порівняння відстаней"
                    >
                        <FiMap size={18} />
                        <span>На карті</span>
                    </button>
                </div>
                
                <h1 className={styles.pageTitle}>Порівняльний аналіз</h1>
            </header>

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