import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi'; // Єдина бібліотека Fi
import styles from './Navbar.module.css';
import { useAuth } from '../../../context/AuthContext';
import { useListings } from '../../../context/ListingContext';
import Button from '../../common/Button/Button';

const Navbar = () => {
    const { isAuthenticated, currentUser, logout } = useAuth();
    const { favoriteIds } = useListings();

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <Link to="/" className={styles.logo}> UniStay </Link>
                
                {/* Контейнер посилань */}
                <div className={styles.navLinks}>
                    <NavLink to="/listings" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}>
                        Переглянути оголошення
                    </NavLink>
                    <NavLink to="/add-listing" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}>
                        Додати оголошення
                    </NavLink>
                </div>

                <div className={styles.userActions}>
                    <Link to="/favorites" className={styles.iconLink}>
                        <div className={styles.heartContainer}>
                            {/* Зафарбовуємо FiHeart через проп fill */}
                            <FiHeart className={styles.heartIcon} fill="var(--accent-color)" />
                            {favoriteIds.length > 0 && <span className={styles.badge}>{favoriteIds.length}</span>}
                        </div>
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <NavLink to="/my-listings" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}>
                                Мої оголошення
                            </NavLink>
                            <Link to="/profile">
                                <Button className={styles.navButton}>{currentUser?.name || 'Мій профіль'}</Button>
                            </Link>
                            <Button variant="outline" onClick={logout} className={styles.navButton}>Вийти</Button>
                        </>
                    ) : (
                        <>
                            <Link to="/signin">
                                <Button variant="outline" className={styles.navButton}>Вхід</Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="primary" className={styles.navButton}>Реєстрація</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;