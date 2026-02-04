import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ListingCard from '../../components/listings/ListingCard/ListingCard';
import { useListings } from '../../context/ListingContext';
import styles from './HomePage.module.css';
import backgroundImage from '../../assets/images/bg.jpg';

const HomePage = () => {
  const { listings, fetchListings, loading, error } = useListings();

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Розрахунок топ-5 оголошень за рейтингом
  const topListings = useMemo(() => {
    if (!listings) return [];

    const getAvgRating = (l) => {
      if (!l.reviews || l.reviews.length === 0) return 0;
      return l.reviews.reduce((acc, r) => acc + r.rating, 0) / l.reviews.length;
    };

    return [...listings]
      .sort((a, b) => getAvgRating(b) - getAvgRating(a))
      .slice(0, 5);
  }, [listings]);

  return (
    <div className={styles.homePage}>
      <section className={styles.heroSection} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1>ЗНАЙДИ ІДЕАЛЬНЕ<br />ЖИТЛО В ОСТРОЗІ</h1>
            <p>Переглядай актуальні оголошення,<br />обирай і зв'язуйся з власниками напряму.</p>
          </div>
        </div>
      </section>

      <section className={styles.topListingsSection}>
        <div className={styles.topListingsContainer}>
          <h2>Найкращі пропозиції</h2>
          
          {loading && <p className={styles.loading}>Завантаження даних...</p>}
          {error && <p className={styles.error}>Не вдалося завантажити оголошення.</p>}
          
          <div className={styles.listingsGrid}>
            {!loading && topListings.length > 0 ? (
              topListings.map((listing) => (
                <div key={listing.id} className={styles.listingItem}> 
                  <ListingCard listing={listing} />
                </div>
              ))
            ) : (
              !loading && <p>Наразі оголошень немає</p>
            )}
          </div>

          <div className={styles.viewMoreButtonContainer}>
            <Link to="/listings" className={styles.viewAllListingsLink}>
              Переглянути всі варіанти &gt;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;