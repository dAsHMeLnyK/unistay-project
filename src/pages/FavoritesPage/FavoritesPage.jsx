import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Для кнопки "Переглянути всі оголошення"
import ListingCard from '../../components/listings/ListingCard/ListingCard';
import styles from './FavoritesPage.module.css';
import Button from '../../components/common/Button/Button'; // Припускаємо, що у вас є такий компонент кнопки

const FavoritesPage = () => {
    const [favoriteListings, setFavoriteListings] = useState([]);
    const [loading, setLoading] = useState(true);

    // useCallback для мемоізації функції, щоб уникнути зайвих ре-рендерів та проблем з useEffect
    const fetchFavorites = useCallback(() => {
        setLoading(true);
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const allListings = JSON.parse(localStorage.getItem('listings')) || [];

        const foundFavoriteListings = allListings.filter(listing =>
            favorites.some(fav => fav.id === listing.id)
        );

        setFavoriteListings(foundFavoriteListings);
        setLoading(false);
    }, []); // Залежності відсутні, оскільки localStorage є глобальним

    useEffect(() => {
        fetchFavorites();

        // Слухач для localStorage, щоб оновлювати сторінку, якщо список обраних змінюється на інших сторінках
        const handleStorageChange = (e) => {
            if (e.key === 'favorites') {
                fetchFavorites();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [fetchFavorites]); // Додаємо fetchFavorites у залежності, оскільки це useCallback

    const handleClearFavorites = () => {
        localStorage.removeItem('favorites');
        setFavoriteListings([]); // Очищаємо локальний стан
        console.log('Список обраних оголошень очищено.');
    };

    if (loading) {
        return <div className={styles.loading}>Завантаження вибраних оголошень...</div>;
    }

    return (
        <div className={styles.favoritesPage}>
            <div className={styles.favoritesHeader}>
                <h1 className={styles.title}>Обране</h1> {/* Змінено на "Обране" згідно скріншоту */}
            </div>
            {favoriteListings.length === 0 ? (
                <p className={styles.noFavoritesMessage}>
                    У вас поки що немає обраних оголошень. Додайте щось, що вам подобається!
                </p>
            ) : (
                <>
                    <div className={styles.favoritesGrid}>
                        {favoriteListings.map(listing => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                    <div className={styles.favoritesActions}>
                        {/* Кнопка "Очистити список обраних" */}
                        {/* Припускаємо, що у вас є компонент Button, і він приймає пропс `variant` або `className` */}
                        <Button
                            onClick={handleClearFavorites}
                            className={styles.clearButton}
                        >
                            Очистити список обраних
                        </Button>
                        {/* Кнопка "Переглянути всі оголошення" */}
                        <Link to="/listings" className={styles.viewAllButton}>
                            Переглянути всі оголошення
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default FavoritesPage;