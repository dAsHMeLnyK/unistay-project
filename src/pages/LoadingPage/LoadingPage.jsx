import React from 'react';
import styles from './LoadingPage.module.css';

const LoadingPage = () => {
    return (
        <div className={styles.loaderWrapper}>
            <div className={styles.content}>
                <div className={styles.houseAnimation}>
                    <div className={styles.roof}></div>
                    <div className={styles.walls}>
                        <div className={styles.window}></div>
                    </div>
                </div>
                <h2 className={styles.loadingText}>Шукаємо найкращі варіанти...</h2>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill}></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingPage;