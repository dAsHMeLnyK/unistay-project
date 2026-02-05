import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ListingService } from '../../api/services/ListingService';
import ListingCard from '../../components/listings/ListingCard/ListingCard';
import LoadingPage from '../LoadingPage/LoadingPage';
import styles from './MyListingsPage.module.css';
import { useNavigate } from 'react-router-dom';
import { getNoun } from '../../utils/wordDeclension';

const Icons = {
    Edit: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    ),
    Delete: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    )
};

const MyListingsPage = () => {
    const { isAuthenticated, userId, loading: authLoading } = useAuth();
    const [userListings, setUserListings] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
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

    if (authLoading || pageLoading) return <LoadingPage />;

    return (
        <div className={styles.myListingsPage}>
            <div className={styles.pageContentWrapper}>
                <header className={styles.header}>
                    <div className={styles.titleGroup}>
                        <h1 className={styles.title}>Мої оголошення</h1>
                        <span className={styles.countBadge}>
                            {userListings.length} {getNoun(userListings.length, "об'єкт", "об'єкти", "об'єктів")}
                        </span>
                    </div>
                    <button className={styles.addListingButton} onClick={() => navigate('/add-listing')}>
                        + Додати оголошення
                    </button>
                </header>

                {!isAuthenticated ? (
                    <div className={styles.emptyState}>
                        <div className={styles.houseIllustration}>
                            <div className={styles.roof}></div>
                            <div className={styles.base}><div className={styles.door}></div></div>
                        </div>
                        <h3>Доступ обмежено</h3>
                        <p>Будь ласка, увійдіть, щоб керувати вашими оголошеннями.</p>
                        <button className={styles.primaryBtn} onClick={() => navigate('/login')}>Увійти</button>
                    </div>
                ) : userListings.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.houseIllustration}>
                            <div className={styles.roof}></div>
                            <div className={styles.base}><div className={styles.door}></div></div>
                        </div>
                        <h3>У вас ще немає оголошень</h3>
                        <p>Опублікуйте своє перше оголошення, щоб почати пошук орендарів.</p>
                        <button className={styles.primaryBtn} onClick={() => navigate('/add-listing')}>
                            Створити оголошення
                        </button>
                    </div>
                ) : (
                    <div className={styles.listingsGrid}>
                        {userListings.map((listing) => (
                            <div key={listing.id} className={styles.listingWrapper}>
                                <div className={styles.cardInternalWrapper}>
                                    <ListingCard listing={listing} />
                                </div>
                                <div className={styles.adminActions}>
                                    <button 
                                        className={styles.editBtn} 
                                        onClick={(e) => { e.preventDefault(); navigate(`/edit-listing/${listing.id}`); }}
                                    >
                                        <Icons.Edit />
                                        <span>Редагувати</span>
                                    </button>
                                    <button 
                                        className={styles.deleteBtn} 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if(window.confirm('Видалити це оголошення?')) {
                                                setDeletingId(listing.id);
                                                ListingService.delete(listing.id)
                                                    .then(() => {
                                                        setUserListings(prev => prev.filter(l => l.id !== listing.id));
                                                    })
                                                    .finally(() => setDeletingId(null));
                                            }
                                        }}
                                        disabled={deletingId === listing.id}
                                    >
                                        <Icons.Delete />
                                        <span>{deletingId === listing.id ? '...' : 'Видалити'}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyListingsPage;