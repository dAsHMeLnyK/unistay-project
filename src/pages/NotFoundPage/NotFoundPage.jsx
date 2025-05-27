// src/pages/NotFoundPage/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css'; // Створіть цей файл для стилів

const NotFoundPage = () => {
  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Упс! Сторінку не знайдено.</p>
      <p className={styles.description}>
        Ми не можемо знайти сторінку, яку ви шукаєте. Можливо, вона була переміщена або видалена.
      </p>
      <Link to="/" className={styles.homeButton}>
        Повернутися на головну
      </Link>
    </div>
  );
};

export default NotFoundPage;