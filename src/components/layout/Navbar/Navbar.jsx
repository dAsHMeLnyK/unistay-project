// src/components/layout/Navbar/Navbar.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../../context/AuthContext'; // <--- ІМПОРТ AuthContext

const Navbar = () => {
    const { isAuthenticated, currentUser, logout } = useAuth(); // <--- ВИКОРИСТОВУЄМО useAuth

    // Функція для обробки виходу
    const handleLogout = () => {
        logout();
        // Можливо, перенаправити на головну сторінку або сторінку входу після виходу
        // navigate('/'); // Якщо у вас є доступ до useNavigate
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <Link to="/" className={styles.logo}>
                    UniStay
                </Link>
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
                    {isAuthenticated ? ( // <--- ВИКОРИСТОВУЄМО isAuthenticated
                        <>
                            <Link to="/favorites" className={styles.iconLink} aria-label="Обране">
                                <span>&#x2764;</span> {/* Проста іконка серця */}
                            </Link>
                            {/* <Link to="/chat" className={styles.iconLink}>
                                <span>&#128172;</span>
                            </Link> */}
                            {/* Додаємо посилання на "Мої оголошення" */}
                            <NavLink
                                to="/my-listings" // Створимо цю сторінку далі
                                className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}
                            >
                                Мої оголошення
                            </NavLink>
                            <Link to="/profile" className={styles.userName}>
                                {currentUser?.name || 'Мій профіль'} {/* Відображаємо ім'я користувача, якщо є */}
                            </Link>
                            {/* Додаємо кнопку "Вийти" */}
                            <button onClick={handleLogout} className={`${styles.authLink} ${styles.signUpButton}`}>
                                Вийти
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Обране може бути доступне і неавторизованим, але тоді потрібно зберігати його локально, або приховувати */}
                            <Link to="/favorites" className={styles.iconLink} aria-label="Обране">
                                <span>&#x2764;</span>
                            </Link>
                            <Link to="/signin" className={styles.authLink}>
                                Вхід
                            </Link>
                            <Link to="/signup" className={`${styles.authLink} ${styles.signUpButton}`}>
                                Реєстрація
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;