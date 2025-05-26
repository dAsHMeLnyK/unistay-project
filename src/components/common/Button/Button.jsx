import React from 'react';
import styles from './Button.module.css';

// variant: 'primary', 'secondary', etc.
// onClick: function
// type: 'button', 'submit', 'reset'
const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;