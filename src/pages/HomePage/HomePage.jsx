import React from 'react';
import { Link } from 'react-router-dom'; // <--- ДОДАНО: Імпорт Link
import ListingCard from '../../components/listings/ListingCard/ListingCard'; // Ваш поточний шлях до компонента
import Button from '../../components/common/Button/Button'; // Якщо цей компонент використовується для інших кнопок
import styles from './HomePage.module.css';
import backgroundImage from '../../assets/images/bg.jpg'; // Переконайтеся, що шлях правильний

const HomePage = () => {
  // Mock дані для прикладу з реальними зображеннями з Unsplash
  // ВАЖЛИВО: ДОДАНО УНІКАЛЬНІ `id` ДЛЯ КОЖНОГО ОГОЛОШЕННЯ
  const topListings = [
    { id: '1', title: 'Квартира в центрі', address: 'вул. Центральна, 1', price: 3000, rating: 4.8, imageUrl: 'https://www.wilderkaiser.info/feratel/hotel/soell-appartement-vorderlaiming-ferienwohnung.jpg' },
    { id: '2', title: 'Затишна кімната', address: 'пр. Миру, 25', price: 1800, rating: 4.5, imageUrl: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/550326020.jpg?k=450508e036040c2cdde54984edd1d4e03d6d48f55a082cd55fcc56fc454789bc&o=&hp=1' },
    { id: '3', title: 'Будинок біля парку', address: 'вул. Паркова, 7', price: 5000, rating: 4.9, imageUrl: 'https://media.admagazine.fr/photos/65300bdda7dee5dd8ac5e683/16:9/w_2560%2Cc_limit/18th%2520apartment%2520-%2520wiercinski-studio%252016.jpg' },
    { id: '4', title: 'Сучасні апартаменти', address: 'бул. Незалежності, 100', price: 3500, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1601671507746-b33334e320f8?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: '5', title: 'Студія для одного', address: 'пров. Студентський, 3', price: 2200, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1549479344-0c2134ed7287?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ];

  return (
    <div className={styles.homePage}>
      <section className={styles.heroSection} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1>
              ЗНАЙДИ ІДЕАЛЬНЕ<br />
              ЖИТЛО В ОСТРОЗІ
            </h1>
            <p>
              Переглядай актуальні оголошення,<br />
              обирай і зв'язуйся з власниками напряму.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.topListingsSection}>
        <div className={styles.topListingsContainer}>
          <h2>Оголошення з найвищим рейтингом</h2>
          <div className={styles.listingsGrid}>
            {topListings.map((listing) => (
              // <--- БЕЗ ЗМІН в обгортці ListingCard
              <div key={listing.id} className={styles.listingItem}> 
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
          <div className={styles.viewMoreButtonContainer}>
            {/* <--- ДОДАНО: Використання Link замість Button для навігації */}
            <Link to="/listings" className={styles.viewAllListingsLink}>
              Переглянути більше &gt;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;