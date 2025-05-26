import React from 'react';
import styles from './Input.module.css'; // Будемо створювати цей файл

const Input = ({
  icon: Icon, // Отримуємо компонент іконки (наприклад, з react-icons)
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  id,
  className = '',
  ...props // Для будь-яких інших властивостей input, наприклад, required
}) => {
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {Icon && <Icon className={styles.icon} />} {/* Відображаємо іконку, якщо вона передана */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        className={styles.inputField}
        {...props}
      />
    </div>
  );
};

export default Input;