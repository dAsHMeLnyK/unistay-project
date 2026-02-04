import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useListings } from '../../context/ListingContext';
import ListingCard from '../../components/listings/ListingCard/ListingCard';
import { ListingService } from '../../api/services/ListingService';
import styles from './MyListingsPage.module.css';
import { useNavigate } from 'react-router-dom';

const MyListingsPage = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const { deleteListing } = useListings(); 
    const [userListings, setUserListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Завантажуємо оголошення тільки поточного користувача
    useEffect(() => {
        const fetchMyListings = async () => {
            if (isAuthenticated && currentUser?.id) {
                try {
                    setLoading(true);
                    // Використовуємо ендпоінт api/listings/user/{userId}
                    const data = await ListingService.getByUserId(currentUser.id);
                    setUserListings(data);
                } catch (err) {
                    console.error("Помилка при завантаженні ваших оголошень:", err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchMyListings();
    }, [isAuthenticated, currentUser]);

    // 2. Обробка видалення з локальним оновленням списку
    const handleDelete = async (listingId) => {
        if (window.confirm('Ви впевнені, що хочете видалити це оголошення?')) {
            try {
                await deleteListing(listingId);
                // Оновлюємо локальний стейт, щоб оголошення зникло відразу
                setUserListings(prev => prev.filter(l => l.id !== listingId));
            } catch (err) {
                alert("Не вдалося видалити оголошення.");
            }
        }
    };

    if (!isAuthenticated || !currentUser) {
        return (
            <div className={styles.myListingsPage}>
                <h1 className={styles.title}>Мої оголошення</h1>
                <p className={styles.message}>Будь ласка, увійдіть, щоб керувати своїми оголошеннями.</p>
                <button className={styles.loginButton} onClick={() => navigate('/signin')}>Увійти</button>
            </div>
        );
    }

    if (loading) return <div className={styles.loading}>Завантаження ваших оголошень...</div>;

    return (
        <div className={styles.myListingsPage}>
            <div className={styles.headerRow}>
                <h1 className={styles.title}>Мої оголошення</h1>
                <button className={styles.addListingButton} onClick={() => navigate('/add-listing')}>
                    + Додати нове
                </button>
            </div>

            {userListings.length === 0 ? (
                <div className={styles.noListings}>
                    <p>Ви ще не опублікували жодного оголошення.</p>
                </div>
            ) : (
                <div className={styles.listingsGrid}>
                    {userListings.map((listing) => (
                        <div key={listing.id} className={styles.listingWrapper}>
                            <ListingCard listing={listing} />
                            <div className={styles.adminActions}>
                                <button
                                    onClick={() => navigate(`/edit-listing/${listing.id}`)}
                                    className={styles.editBtn}
                                >
                                    Редагувати
                                </button>
                                <button
                                    onClick={() => handleDelete(listing.id)}
                                    className={styles.deleteBtn}
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