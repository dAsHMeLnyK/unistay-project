import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

import { useAuth } from '../../context/AuthContext';
import { ListingService } from '../../api/services/ListingService';
import { getNoun } from '../../utils/wordDeclension';

import ListingCard from '../../components/listings/ListingCard/ListingCard';
import LoadingPage from '../LoadingPage/LoadingPage';
import Button from '../../components/common/Button/Button';
import ConfirmModal from '../../components/common/ConfirmModal/ConfirmModal'; // Імпорт нової модалки
import styles from './MyListingsPage.module.css';

const MyListingsPage = () => {
    const { isAuthenticated, userId, loading: authLoading } = useAuth();
    const [userListings, setUserListings] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    
    // Стан для керування модальним вікном
    const [modalConfig, setModalConfig] = useState({ isOpen: false, targetId: null });
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyListings = async () => {
            if (authLoading) return;
            if (!isAuthenticated || !userId) {
                setPageLoading(false);
                return;
            }
            try {
                setPageLoading(true);
                const data = await ListingService.getByUserId(userId);
                setUserListings(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Помилка завантаження:", err);
                setUserListings([]);
            } finally {
                setPageLoading(false);
            }
        };
        fetchMyListings();
    }, [isAuthenticated, userId, authLoading]);

    // Тільки відкриває модалку
    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setModalConfig({ isOpen: true, targetId: id });
    };

    // Реальне видалення після підтвердження
    const handleConfirmDelete = async () => {
        const id = modalConfig.targetId;
        if (!id) return;

        setDeletingId(id);
        try {
            await ListingService.delete(id);
            setUserListings(prev => prev.filter(l => l.id !== id));
            setModalConfig({ isOpen: false, targetId: null });
        } catch (err) {
            console.error("Помилка видалення:", err);
            alert("Не вдалося видалити оголошення.");
        } finally {
            setDeletingId(null);
        }
    };

    if (authLoading || pageLoading) return <LoadingPage />;

    const EmptyState = ({ title, text, btnText, onBtnClick, restricted = false }) => (
        <div className={styles.emptyState}>
            <div className={styles.houseIllustration}>
                <div className={styles.roof}></div>
                <div className={styles.base}><div className={styles.door}></div></div>
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
            <Button onClick={onBtnClick} variant={restricted ? "outline" : "primary"}>
                {btnText}
            </Button>
        </div>
    );

    return (
        <div className={styles.myListingsPage}>
            <div className={styles.pageContentWrapper}>
                <header className={styles.pageHeader}>
                    <div className={styles.headerTopLine}>
                        <div className={styles.titleWrapper}>
                            <h1 className="page-title" style={{ textAlign: 'left', margin: 0 }}>
                                Мої оголошення
                            </h1>
                            {isAuthenticated && userListings.length > 0 && (
                                <span className={styles.countBadge}>
                                    {userListings.length} {getNoun(userListings.length, "об'єкт", "об'єкти", "об'єктів")}
                                </span>
                            )}
                        </div>
                        {isAuthenticated && (
                            <Button
                                onClick={() => navigate('/add-listing')}
                                className={styles.addListingBtn}
                            >
                                <FiPlus /> Додати оголошення
                            </Button>
                        )}
                    </div>
                    <div className={styles.headerSeparator}></div>
                </header>

                {!isAuthenticated ? (
                    <EmptyState 
                        title="Доступ обмежено"
                        text="Будь ласка, увійдіть, щоб керувати вашими оголошеннями."
                        btnText="Увійти до кабінету"
                        onBtnClick={() => navigate('/signin')}
                        restricted
                    />
                ) : userListings.length === 0 ? (
                    <EmptyState 
                        title="У вас ще немає оголошень"
                        text="Опублікуйте своє перше оголошення, щоб почати пошук орендарів."
                        btnText="Створити перше оголошення"
                        onBtnClick={() => navigate('/add-listing')}
                    />
                ) : (
                    <div className={styles.listingsGrid}>
                        {userListings.map((listing) => (
                            <div 
                                key={listing.id} 
                                className={`${styles.listingWrapper} ${deletingId === listing.id ? styles.isDeleting : ''}`}
                            >
                                <div className={styles.cardInternalWrapper}>
                                    <ListingCard listing={listing} />
                                </div>
                                <div className={styles.adminActions}>
                                    <button 
                                        className={styles.editBtn} 
                                        onClick={() => navigate(`/edit-listing/${listing.id}`)}
                                        disabled={deletingId === listing.id}
                                    >
                                        <FiEdit2 size={16} />
                                        <span>Редагувати</span>
                                    </button>
                                    <button 
                                        className={styles.deleteBtn} 
                                        onClick={(e) => handleDeleteClick(e, listing.id)}
                                        disabled={deletingId === listing.id}
                                    >
                                        <FiTrash2 size={16} />
                                        <span>Видалити</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Додаємо компонент модалки в кінець */}
            <ConfirmModal 
                isOpen={modalConfig.isOpen}
                title="Видалити оголошення?"
                message="Ви впевнені? Цю дію неможливо буде скасувати, і оголошення назавжди зникне з бази даних."
                onConfirm={handleConfirmDelete}
                onCancel={() => setModalConfig({ isOpen: false, targetId: null })}
                isLoading={deletingId !== null}
            />
        </div>
    );
};

export default MyListingsPage;