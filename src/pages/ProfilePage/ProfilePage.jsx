import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import UserService from '../../api/services/UserService';
import LoadingPage from '../LoadingPage/LoadingPage';
import Card from '../../components/common/Card/Card';

import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit2, FiLogOut, FiShield } from 'react-icons/fi';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return navigate('/signin');
                const decoded = jwtDecode(token);
                const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.sub;
                const data = await UserService.getById(userId);
                setUser(data);
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    if (isLoading) return <LoadingPage />;

    return (
        <div className={styles.profilePage}>
            <div className="page-content-container">
                
                <header className="page-header">
                    <h1 className="page-title">Мій профіль</h1>
                    <p className="page-subtitle">Персональні дані та налаштування безпеки</p>
                </header>

                <div className={styles.profileLayout}>
                    {/* САЙДБАР */}
                    <aside className={styles.sidebar}>
                        <Card padding="0" className={styles.sidebarCard}>
                            <div className={styles.avatarSection}>
                                <div className={styles.avatarWrapper}>
                                    {user?.profileImage ? (
                                        <img src={user.profileImage} alt="Profile" className={styles.avatar} />
                                    ) : (
                                        <div className={styles.avatarPlaceholder}><FiUser size={40} /></div>
                                    )}
                                    <button className={styles.photoEditBadge} title="Змінити фото">
                                        <FiEdit2 size={14} />
                                    </button>
                                </div>
                                <h3 className={styles.userName}>{user?.fullName}</h3>
                            </div>
                            
                            <div className={styles.sidebarFooter}>
                                <button onClick={handleLogout} className={styles.logoutActionBtn}>
                                    <FiLogOut /> <span>Вийти з акаунту</span>
                                </button>
                            </div>
                        </Card>
                    </aside>

                    {/* ОСНОВНИЙ БЛОК */}
                    <main className={styles.mainContent}>
                        <Card padding="0" className={styles.detailsCard}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.detailsTitle}>Особиста інформація</h2>
                                <p className={styles.detailsSubtitle}>Ці дані бачать власники житла при бронюванні</p>
                            </div>

                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}><FiMail /> Email</div>
                                    <div className={styles.infoValue}>{user?.email}</div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}><FiPhone /> Телефон</div>
                                    <div className={styles.infoValue}>{user?.phoneNumber || "Не вказано"}</div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}><FiCalendar /> На UniStay з</div>
                                    <div className={styles.infoValue}>
                                        {user?.registrationDate ? new Date(user.registrationDate).toLocaleDateString('uk-UA', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        }) : "-"}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardActions}>
                                <button className={styles.editBtn}>
                                    <FiEdit2 size={16} /> <span>Редагувати дані</span>
                                </button>
                                <button className={styles.passwordBtn}>
                                    <FiShield size={16} /> <span>Змінити пароль</span>
                                </button>
                            </div>
                        </Card>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;