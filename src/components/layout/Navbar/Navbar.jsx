import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css'; // Створимо цей файл для стилів
// import HeartIcon from '../../../assets/icons/heart.svg'; // Приклад іконки
// import ChatIcon from '../../../assets/icons/chat.svg'; // Приклад іконки

const Navbar = () => {
  // У майбутньому тут буде логіка для визначення, чи користувач увійшов
  const isLoggedIn = false; // Заглушка

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
          {isLoggedIn ? (
            <>
              <Link to="/favorites" className={styles.iconLink}>
                {/* <img src={HeartIcon} alt="Обране" /> */}
                <span>&#x2764;</span> {/* Проста іконка серця */}
              </Link>
              <Link to="/chat" className={styles.iconLink}>
                {/* <img src={ChatIcon} alt="Чат" /> */}
                <span>&#128172;</span> {/* Проста іконка чату */}
              </Link>
              <Link to="/profile" className={styles.userName}>
                Ім'я П.
              </Link>
            </>
          ) : (
            <>
              <Link to="/favorites" className={styles.iconLink} aria-label="Обране">
                <span>&#x2764;</span>
              </Link>
              {/* Іконка чату може бути доступна тільки для авторизованих */}
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