import React, { useState } from 'react';
import styles from './AddMemberModal.module.css';
import Button from '../../../../components/common/Button/Button';
import Input from '../../../../components/common/Input/Input'; // Використовуємо ваш готовий Input
import { FiUserPlus, FiX, FiMail } from 'react-icons/fi';

const AddMemberModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            onConfirm(email);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <FiX />
                </button>
                
                <div className={styles.contentBody}>
                    <div className={styles.iconWrapper}>
                        <FiUserPlus className={styles.addIcon} />
                    </div>
                    
                    <h2 className="section-title" style={{ justifyContent: 'center', marginBottom: '8px' }}>
                        Додати учасника
                    </h2>
                    
                    <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: '24px' }}>
                        Введіть Email користувача, щоб запросити його до обговорення цієї нерухомості.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputWrapper}>
                            <Input
                                type="email"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div className={styles.actions}>
                            <Button 
                                variant="secondary" 
                                type="button"
                                onClick={onClose} 
                                disabled={isLoading}
                            >
                                Скасувати
                            </Button>
                            <Button 
                                variant="primary"
                                type="submit"
                                disabled={isLoading || !email.trim()}
                            >
                                {isLoading ? "Додавання..." : "Додати"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;