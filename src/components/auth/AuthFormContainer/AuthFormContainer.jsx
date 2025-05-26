import React from 'react';
import { Link } from 'react-router-dom'; // Для навігації
import styles from './AuthFormContainer.module.css'; // Будемо створювати цей файл
import { FiUser } from 'react-icons/fi'; // Іконка для аватара

const AuthFormContainer = ({ title, children, isSignUp, onGoogleAuth, onFacebookAuth }) => {
  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.avatarPlaceholder}>
          <FiUser className={styles.avatarIcon} />
        </div>
        <h2 className={styles.title}>{title}</h2>

        {children} {/* Тут будуть поля форми входу або реєстрації */}

        <div className={styles.divider}>Або</div>

        <div className={styles.socialAuthButtons}>
          <button className={styles.socialButton} onClick={onGoogleAuth}>
            <img src="/icons/google.svg" alt="Google" className={styles.socialIcon} /> {/* Шлях до вашої іконки Google */}
          </button>
          <button className={styles.socialButton} onClick={onFacebookAuth}>
            <img src="/icons/facebook.svg" alt="Facebook" className={styles.socialIcon} /> {/* Шлях до вашої іконки Facebook */}
          </button>
        </div>

        <div className={styles.switchAuth}>
          {isSignUp ? (
            <>
              Вже зареєстровані?{' '}
              <Link to="/signin" className={styles.switchLink}>
                Увійти
              </Link>
            </>
          ) : (
            <>
              Ще не зареєстровані?{' '}
              <Link to="/signup" className={styles.switchLink}>
                Зареєструватися
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthFormContainer;