import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

import { useAuth } from '../../context/AuthContext';
import { ListingService } from '../../api/services/ListingService';
import { getNoun } from '../../utils/wordDeclension';

import ListingCard from '../../components/listings/ListingCard/ListingCard';
import LoadingPage from '../LoadingPage/LoadingPage';
import Button from '../../components/common/Button/Button';
import ConfirmModal from '../../components/common/ConfirmModal/ConfirmModal';
import styles from './MyListingsPage.module.css';

const MyListingsPage = () => {
    const { isAuthenticated, userId, loading: authLoading } = useAuth();
    const [userListings, setUserListings] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
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

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setModalConfig({ isOpen: true, targetId: id });
    };

    const handleConfirmDelete = async () => {
        const id = modalConfig.targetId;
        if (!id) return;
        setDeletingId(id);
        try {
            await ListingService.delete(id);
            setUserListings(prev => prev.filter(l => l.id !== id));
            setModalConfig({ isOpen: false, targetId: null });
        } catch (err) {
            alert("Не вдалося видалити оголошення.");
        } finally {
            setDeletingId(null);
        }
    };

    if (authLoading || pageLoading) return <LoadingPage />;

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
                        {isAuthenticated && userListings.length > 0 && (
                            <Button
                                onClick={() => navigate('/add-listing')}
                                className={styles.addListingBtn}
                                variant="primary"
                            >
                                <FiPlus /> Додати оголошення
                            </Button>
                        )}
                    </div>
                    <div className={styles.headerSeparator}></div>
                </header>

                {userListings.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.houseIllustration}>
                            <div className={styles.roof}></div>
                            <div className={styles.base}>
                                <div className={styles.door}></div>
                            </div>
                        </div>
                        <h2 className="section-title" style={{justifyContent: 'center'}}>У вас ще немає оголошень</h2>
                        <p className="page-subtitle">
                            Тут з'являться об'єкти, які ви здаєте в оренду. Створіть своє перше оголошення, щоб студенти могли його знайти!
                        </p>
                        <Button 
                            variant="primary" 
                            onClick={() => navigate('/add-listing')}
                            className={styles.actionButton}
                        >
                            <FiPlus /> Додати перше оголошення
                        </Button>
                    </div>
                ) : (
                    <div className="cards-grid">
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

            <ConfirmModal 
                isOpen={modalConfig.isOpen}
                title="Видалити оголошення?"
                message="Ви впевнені? Цю дію неможливо буде скасувати."
                onConfirm={handleConfirmDelete}
                onCancel={() => setModalConfig({ isOpen: false, targetId: null })}
                isLoading={deletingId !== null}
            />
        </div>
    );
};

export default MyListingsPage;