import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../common/Button/Button'; // Імпортуємо нашу нову кнопку

const Navbar = () => {
    const { isAuthenticated, currentUser, logout } = useAuth();
    const [favCount, setFavCount] = useState(0);

    useEffect(() => {
        const updateCount = () => {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            setFavCount(favorites.length);
        };
        updateCount();
        window.addEventListener('storage', updateCount);
        window.addEventListener('favoritesUpdated', updateCount);
        return () => {
            window.removeEventListener('storage', updateCount);
            window.removeEventListener('favoritesUpdated', updateCount);
        };
    }, []);

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <Link to="/" className={styles.logo}> UniStay </Link>
                
                <div className={styles.navLinks}>
                    <NavLink 
                        to="/listings" 
                        className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
                    >
                        Переглянути оголошення
                    </NavLink>
                    <NavLink 
                        to="/add-listing" 
                        className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
                    >
                        Додати оголошення
                    </NavLink>
                </div>

                <div className={styles.userActions}>
                    <Link to="/favorites" className={styles.iconLink} aria-label="Обране">
                        <div className={styles.heartContainer}>
                            <svg viewBox="0 0 24 24" fill="var(--accent-color)" stroke="var(--accent-color)" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            {favCount > 0 && <span className={styles.badge}>{favCount}</span>}
                        </div>
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <NavLink 
                                to="/my-listings" 
                                className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
                            >
                                Мої оголошення
                            </NavLink>
                            
                            {/* Використовуємо Button для Профілю */}
                            <Link to="/profile">
                                <Button className={styles.navButton}>
                                    {currentUser?.name || 'Мій профіль'}
                                </Button>
                            </Link>

                            {/* Використовуємо Button з варіантом outline для виходу */}
                            <Button 
                                variant="outline" 
                                onClick={logout} 
                                className={styles.navButton}
                            >
                                Вийти
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/signin" className={styles.authLink}>Вхід</Link>
                            
                            <Link to="/signup">
                                <Button className={styles.navButton}>Реєстрація</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;