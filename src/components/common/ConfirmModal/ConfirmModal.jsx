import React from 'react';
import styles from './ConfirmModal.module.css';
import Button from '../Button/Button';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onCancel}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button 
                    className={styles.closeBtn} 
                    onClick={onCancel}
                    aria-label="Закрити"
                >
                    <FiX />
                </button>
                
                <div className={styles.contentBody}>
                    <div className={styles.iconWrapper}>
                        <FiAlertTriangle className={styles.warningIcon} />
                    </div>
                    
                    {/* Використовуємо глобальний клас .section-title з App.css */}
                    <h2 className="section-title" style={{ justifyContent: 'center', marginBottom: '12px' }}>
                        {title}
                    </h2>
                    
                    {/* Використовуємо глобальний клас .page-subtitle з App.css */}
                    <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: '35px' }}>
                        {message}
                    </p>
                </div>
                
                <div className={styles.actions}>
                    <Button 
                        variant="secondary" 
                        onClick={onCancel} 
                        disabled={isLoading}
                    >
                        Скасувати
                    </Button>
                    <Button 
                        variant="primary"
                        onClick={onConfirm} 
                        disabled={isLoading}
                        className={styles.deleteBtnAction}
                    >
                        {isLoading ? "Видалення..." : "Видалити"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;