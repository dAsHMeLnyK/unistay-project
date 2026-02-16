import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import ListingCard from '../../components/listings/ListingCard/ListingCard';
import Button from '../../components/common/Button/Button';
import { useListings } from '../../context/ListingContext';
import styles from './HomePage.module.css';
import backgroundImage from '../../assets/images/bg.jpg';

const HomePage = () => {
  const { listings, fetchListings, loading, error } = useListings();
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const topListings = useMemo(() => {
    if (!listings) return [];
    const getAvgRating = (l) => {
      if (!l.reviews || l.reviews.length === 0) return 0;
      return l.reviews.reduce((acc, r) => acc + r.rating, 0) / l.reviews.length;
    };
    return [...listings].sort((a, b) => getAvgRating(b) - getAvgRating(a)).slice(0, 8);
  }, [listings]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section 
        className={styles.heroSection} 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className={styles.heroOverlay}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>ЗНАЙДИ ІДЕАЛЬНЕ<br />ЖИТЛО В ОСТРОЗІ</h1>
              
              <p className={`page-subtitle ${styles.heroSubtitle}`}>
                Переглядай актуальні оголошення, обирай і зв'язуйся з власниками напряму.
              </p>
              
              <div className={styles.heroBtnWrapper}>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/listings')}
                  className={styles.mainActionBtn}
                >
                  Почати пошук
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Секція "Найкращі пропозиції" */}
      <section className={styles.topListingsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            {/* Глобальна типографіка без інлайнових стилів */}
            <h2 className="section-title">Найкращі пропозиції</h2>
            
            <div className={styles.carouselControls}>
              <button onClick={() => scroll('left')} className={styles.scrollBtn} aria-label="Назад">
                <FiChevronLeft />
              </button>
              <button onClick={() => scroll('right')} className={styles.scrollBtn} aria-label="Вперед">
                <FiChevronRight />
              </button>
            </div>
          </div>
          
          <div className={styles.listingsCarousel} ref={scrollRef}>
            {!loading && topListings.map((listing) => (
              <div key={listing.id} className={styles.listingItem}> 
                <ListingCard listing={listing} />
              </div>
            ))}
            
            {loading && <p className="page-subtitle">Завантаження...</p>}
            
            {error && (
              <p className="page-subtitle" style={{ color: 'var(--danger-color)' }}>
                Помилка завантаження даних
              </p>
            )}
          </div>

          <div className={styles.viewMoreContainer}>
            <Button 
              variant="outline" 
              onClick={() => navigate('/listings')}
              className={styles.viewAllBtn}
            >
              Дивитися всі оголошення <FiArrowRight className={styles.btnIcon} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;