import React from 'react';
import styles from './ConfirmModal.module.css';
import Button from '../Button/Button';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onCancel}>
            {/* stopPropagation запобігає закриттю при кліку на саме вікно */}
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onCancel}>
                    <FiX />
                </button>
                
                <div className={styles.contentBody}>
                    <div className={styles.iconWrapper}>
                        <FiAlertTriangle className={styles.warningIcon} />
                    </div>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.message}>{message}</p>
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