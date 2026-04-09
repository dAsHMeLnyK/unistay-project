import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingCard from '../../components/listings/ListingCard/ListingCard';
import LoadingPage from '../LoadingPage/LoadingPage';
import Button from '../../components/common/Button/Button';
import ConfirmModal from '../../components/common/ConfirmModal/ConfirmModal';
import { useListings } from '../../context/ListingContext';
import styles from './FavoritesPage.module.css';

const FavoritesPage = () => {
    const { favoriteListings, loading, clearFavorites } = useListings();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const navigate = useNavigate();

    const handleClearConfirm = async () => {
        setIsClearing(true);
        await clearFavorites();
        setIsClearing(false);
        setIsModalOpen(false);
    };

    if (loading) return <LoadingPage />;

    return (
        /* ВАЖЛИВО: Додано обгортку styles.favoritesPage для коректної роботи падінгів та фону */
        <div className={styles.favoritesPage}>
            <div className="container">
                <header className="page-header">
                    <h1 className="page-title">Мої обрані оголошення</h1>
                    <p className="page-subtitle">Тут зібрані варіанти житла в Острозі, які ви зберегли</p>
                    
                    {favoriteListings.length > 0 && (
                        <button 
                            className={styles.clearMiniButton} 
                            onClick={() => setIsModalOpen(true)}
                        >
                            Очистити список
                        </button>
                    )}
                </header>

                {favoriteListings.length > 0 ? (
                    <div className="cards-grid">
                        {favoriteListings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.houseIllustration}>
                            <div className={styles.roof}></div>
                            <div className={styles.base}>
                                <div className={styles.door}></div>
                            </div>
                        </div>
                        <h2 className="section-title" style={{justifyContent: 'center'}}>Тут поки порожньо</h2>
                        <p className="page-subtitle">
                            Ви ще не додали жодного оголошення до обраного.
                        </p>
                        <Button 
                            variant="primary" 
                            onClick={() => navigate('/listings')}
                            className={styles.actionButton}
                        >
                            Переглянути оголошення
                        </Button>
                    </div>
                )}
            </div>

            <ConfirmModal 
                isOpen={isModalOpen}
                title="Очистити обране?"
                message="Ви впевнені, що хочете видалити всі оголошення зі списку обраних? Цю дію неможливо скасувати."
                onConfirm={handleClearConfirm}
                onCancel={() => setIsModalOpen(false)}
                isLoading={isClearing}
            />
        </div>
    );
};

export default FavoritesPage;