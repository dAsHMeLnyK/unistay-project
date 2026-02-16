// src/components/common/Button/Button.jsx
import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  className = '', 
  fullWidth = false, // Новий проп
  ...props 
}) => {
  return (
    <button
      type={type}
      // Додаємо клас fullWidth, якщо проп передано
      className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;