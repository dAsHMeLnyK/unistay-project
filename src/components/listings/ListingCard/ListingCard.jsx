import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <--- ДОДАНО: Імпорт Link
import styles from './ListingCard.module.css';

const ListingCard = ({ listing }) => {
  const data = listing || {
    // ВАЖЛИВО: Додайте `id` до мокових даних, якщо його немає,
    // він потрібен для маршрутизації та LocalStorage.
    id: 'default-listing-id',
    imageUrl: 'https://images.unsplash.com/photo-1598917822765-a8626f286884?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 3.5,
    title: 'Заголовок оголошення',
    address: 'Адреса житла',
    price: 2500,
  };

  // Використовуємо useEffect для синхронізації isFavorite з LocalStorage при завантаженні
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.id === data.id); // Перевіряємо, чи поточне оголошення вже є в обраних
  });

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // <--- ДОДАНО: Запобігає переходу на сторінку деталізації
    e.stopPropagation(); // <--- ДОДАНО: Зупиняє спливання події, щоб клік по сердечку не активував Link
    
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (isFavorite) {
      // Видалити з обраного
      favorites = favorites.filter(fav => fav.id !== data.id);
      console.log(`Listing ${data.title} removed from favorites.`);
    } else {
      // Додати до обраного
      favorites.push(data); // Зберігаємо всю інформацію про оголошення
      console.log(`Listing ${data.title} added to favorites.`);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite); // Перемикаємо локальний стан
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const halfStar = rating - filledStars >= 0.5;
    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(<span key={`filled-${i}`} className={styles.filledStar}>&#9733;</span>);
    }
    if (halfStar) {
      stars.push(<span key="half" className={styles.halfStar}>&#9733;</span>);
    }
    for (let i = stars.length; i < totalStars; i++) {
      stars.push(<span key={`empty-${i}`} className={styles.emptyStar}>&#9733;</span>);
    }
    return stars;
  };

  return (
    // <--- ДОДАНО: Link обгортка навколо всієї картки
    <Link to={`/listings/${data.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img src={data.imageUrl} alt={data.title} className={styles.image} />
        </div>
        <div className={styles.info}>
          <div className={styles.rating}>
            {renderStars(data.rating)}
          </div>
          <h3 className={styles.title}>{data.title}</h3>
          <p className={styles.address}>
            <span className={styles.locationIcon}>&#x2302;</span>
            {data.address}
          </p>
          <div className={styles.priceContainer}>
            <p className={styles.price}>{data.price} грн</p>
            <button
              className={`${styles.heartIconOnly} ${isFavorite ? styles.favorited : ''}`}
              onClick={handleFavoriteClick}
              aria-label="Додати в обране"
            >
              <span>{isFavorite ? '♥' : '♡'}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;