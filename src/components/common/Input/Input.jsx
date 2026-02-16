import React, { useState, useId } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './Input.module.css';

const Input = ({
  label,
  labelRight,
  icon: Icon,
  type = 'text',
  className = '',
  style, // Для точкового скидання margin
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = useId();
  
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`${styles.inputContainer} ${className}`} style={style}>
      {(label || labelRight) && (
        <div className={styles.labelWrapper}>
          {label && (
            <label htmlFor={inputId} className={styles.label}>
              {label}
            </label>
          )}
          {labelRight && <div className={styles.labelRight}>{labelRight}</div>}
        </div>
      )}
      
      <div className={`${styles.inputWrapper} ${error ? styles.inputError : ''}`}>
        {Icon && <Icon className={styles.icon} />}
        
        <input
          {...props}
          id={inputId}
          type={inputType}
          className={styles.inputField}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input;