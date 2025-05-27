// src/pages/MyListingsPage/MyListingsPage.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useListings } from '../../context/ListingContext';
import ListingCard from '../../components/listings/ListingCard/ListingCard'; // <--- Імпорт ListingCard
import styles from './MyListingsPage.module.css'; // Створіть цей файл для стилів
import { useNavigate } from 'react-router-dom'; // Для навігації після видалення/редагування

const MyListingsPage = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const { listings, deleteListing } = useListings(); // Отримуємо всі оголошення та функцію видалення
    const navigate = useNavigate();

    // Якщо користувач не авторизований, або currentUser.id відсутній
    if (!isAuthenticated || !currentUser || !currentUser.id) {
        return (
            <div className={styles.myListingsPage}>
                <h1 className={styles.title}>Мої оголошення</h1>
                <p className={styles.message}>Будь ласка, увійдіть, щоб переглянути свої оголошення.</p>
                <button className={styles.loginButton} onClick={() => navigate('/signin')}>
                    Увійти
                </button>
            </div>
        );
    }

    const userListings = listings.filter(listing => String(listing.ownerId) === String(currentUser.id));

    const handleDelete = (listingId) => {
        if (window.confirm('Ви впевнені, що хочете видалити це оголошення?')) {
            deleteListing(listingId);
            // Можливо, оновити сторінку або просто дозволити React оновити список
        }
    };

    const handleEdit = (listingId) => {
        navigate(`/edit-listing/${listingId}`); // Перенаправляємо на сторінку редагування
    };

    return (
        <div className={styles.myListingsPage}>
            <h1 className={styles.title}>Мої оголошення</h1>
            {userListings.length === 0 ? (
                <div className={styles.noListings}>
                    <p>У вас ще немає оголошень.</p>
                    <button className={styles.addListingButton} onClick={() => navigate('/add-listing')}>
                        Додати перше оголошення
                    </button>
                </div>
            ) : (
                <div className={styles.listingsGrid}>
                    {userListings.map((listing) => (
                        <div key={listing.id} className={styles.listingItem}>
                            <ListingCard listing={listing} />
                            <div className={styles.actions}>
                                <button
                                    onClick={() => handleEdit(listing.id)}
                                    className={`${styles.actionButton} ${styles.editButton}`}
                                >
                                    Редагувати
                                </button>
                                <button
                                    onClick={() => handleDelete(listing.id)}
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                >
                                    Видалити
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyListingsPage;