import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import UserService from '../../api/services/UserService';
import LoadingPage from '../LoadingPage/LoadingPage';
import Card from '../../components/common/Card/Card';

import { 
    FiUser, FiMail, FiPhone, FiCalendar, FiEdit2, 
    FiLogOut, FiShield, FiCheck, FiX, FiCamera, FiLoader 
} from 'react-icons/fi';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        profileImage: '',
        role: null
    });

    // Твої дані Cloudinary
    const CLOUD_NAME = "dmgawz7me";
    const UPLOAD_PRESET = "listing_images";

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

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", UPLOAD_PRESET);

        try {
            setIsUploading(true);
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, 
                { method: "POST", body: data }
            );
            
            const fileData = await response.json();
            
            if (fileData.secure_url) {
                // Відразу зберігаємо нове фото в базі через update
                const updatedUser = await UserService.update(user.id, {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phoneNumber: user.phoneNumber,
                    profileImage: fileData.secure_url,
                    role: user.role
                });
                setUser(updatedUser);
            }
        } catch (error) {
            console.error("Помилка завантаження фото:", error);
            alert("Не вдалося завантажити фото профілю");
        } finally {
            setIsUploading(false);
        }
    };

    const startEditing = () => {
        setEditForm({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phoneNumber: user.phoneNumber || '',
            profileImage: user.profileImage || '',
            role: user.role
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const updatedUser = await UserService.update(user.id, editForm);
            setUser(updatedUser);
            setIsEditing(false);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Не вдалося оновити дані.");
        } finally {
            setIsLoading(false);
        }
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
                    <aside className={styles.sidebar}>
                        <Card padding="0" className={styles.sidebarCard}>
                            <div className={styles.avatarSection}>
                                <div className={styles.avatarWrapper}>
                                    {isUploading ? (
                                        <div className={styles.avatarLoader}>
                                            <FiLoader className={styles.spinIcon} />
                                        </div>
                                    ) : user?.profileImage ? (
                                        <img src={user.profileImage} alt="Profile" className={styles.avatar} />
                                    ) : (
                                        <div className={styles.avatarPlaceholder}><FiUser size={40} /></div>
                                    )}
                                    
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        hidden 
                                        accept="image/*" 
                                        onChange={handleFileUpload}
                                    />
                                    
                                    <button 
                                        className={styles.photoEditBadge} 
                                        onClick={handlePhotoClick}
                                        disabled={isUploading}
                                        title="Змінити фото"
                                    >
                                        <FiCamera size={16} />
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

                    <main className={styles.mainContent}>
                        <Card padding="0" className={styles.detailsCard}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.detailsTitle}>Особиста інформація</h2>
                            </div>

                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}><FiMail /> Email</div>
                                    <div className={styles.infoValueMuted}>{user?.email}</div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}><FiUser /> Ім'я</div>
                                    <div className={styles.infoValue}>
                                        {isEditing ? (
                                            <input 
                                                className={styles.editInput}
                                                value={editForm.firstName}
                                                onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                                            />
                                        ) : user?.firstName}
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}><FiUser /> Прізвище</div>
                                    <div className={styles.infoValue}>
                                        {isEditing ? (
                                            <input 
                                                className={styles.editInput}
                                                value={editForm.lastName}
                                                onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                                            />
                                        ) : user?.lastName}
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}><FiPhone /> Телефон</div>
                                    <div className={styles.infoValue}>
                                        {isEditing ? (
                                            <input 
                                                className={styles.editInput}
                                                value={editForm.phoneNumber}
                                                onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                                            />
                                        ) : (user?.phoneNumber || "Не вказано")}
                                    </div>
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

                            <div className={styles.adminActions}>
                                {isEditing ? (
                                    <>
                                        <button className={styles.saveBtn} onClick={handleSave}>
                                            <FiCheck size={16} /> <span>Зберегти</span>
                                        </button>
                                        <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>
                                            <FiX size={16} /> <span>Скасувати</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className={styles.editBtn} onClick={startEditing}>
                                            <FiEdit2 size={16} /> <span>Редагувати</span>
                                        </button>
                                        <button className={styles.passwordBtn}>
                                            <FiShield size={16} /> <span>Пароль</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </Card>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;