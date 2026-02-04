import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.notFoundWrapper}>
            <div className={styles.content}>
                <h1 className={styles.errorCode}>404</h1>
                <div className={styles.houseIllustration}>
                    {/* Маленька візуальна деталь: будиночок, якого "немає" */}
                    <div className={styles.roof}></div>
                    <div className={styles.base}>
                        <div className={styles.door}></div>
                    </div>
                </div>
                <h2 className={styles.title}>Ой! Ця оселя не знайдена</h2>
                <p className={styles.description}>
                    Схоже, за цією адресою ніхто не живе. Можливо, ви помилилися посиланням або оголошення було видалено.
                </p>
                <button 
                    className={styles.homeButton} 
                    onClick={() => navigate('/')}
                >
                    Повернутися на головну
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;