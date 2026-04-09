// src/components/common/Card/Card.jsx
import React from 'react';
import styles from './Card.module.css';

const Card = ({ children, className = '', padding = '35px' }) => {
  return (
    <div 
      className={`${styles.card} ${className}`} 
      style={{ padding }}
    >
      {children}
    </div>
  );
};

export default Card;