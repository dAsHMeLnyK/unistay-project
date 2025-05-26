import React from 'react';
import { Link } from 'react-router-dom'; // Якщо використовуєте react-router-dom
import styles from './AuthLayout.module.css';

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.authLayout}>
      <div className={styles.backgroundBlur}></div>
      <header className={styles.header}>
        {/* Логотип як посилання на головну сторінку */}
        <Link to="/" className={styles.logo}>
          UniStay
        </Link>
      </header>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;