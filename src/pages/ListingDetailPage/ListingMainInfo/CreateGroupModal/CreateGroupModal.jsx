import React, { useState, useEffect } from "react";  
import styles from "./CreateGroupModal.module.css";  
import Button from "../../../../components/common/Button/Button"; 
import Input from "../../../../components/common/Input/Input";     
import { FiUsers, FiX } from "react-icons/fi";  
  
const CreateGroupModal = ({ isOpen, onClose, onConfirm, isLoading, defaultName, ownerName }) => {  
  const [groupName, setGroupName] = useState(""); 
  const [error, setError] = useState(""); // Стан для збереження помилки
 
  // Коли модалка відкривається, підставляємо дефолтну назву
  useEffect(() => { 
    if (isOpen) { 
      setGroupName(defaultName || ""); 
      setError(""); // Очищаємо помилку при відкритті
    } 
  }, [isOpen, defaultName]); 
  
  if (!isOpen) return null;  
  
  const handleSubmit = (e) => {  
    e.preventDefault();  
    setError(""); // Очищаємо попередню помилку
    
    const trimmedName = groupName.trim();

    // Перевірка бекенду: максимум 100 символів
    if (trimmedName.length > 100) {
      setError("Назва чату не може перевищувати 100 символів");
      return;
    }

    if (trimmedName) {  
      onConfirm(trimmedName);  
    }  
  }; 
  
  return (  
    <div className={styles.modalOverlay} onClick={onClose}>  
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>  
        <button className={styles.closeBtn} onClick={onClose}>  
          <FiX />  
        </button>  
  
        <div className={styles.contentBody}>  
          <div className={styles.iconWrapper}>  
            <FiUsers className={styles.icon} />  
          </div>  
  
          <h2 className="section-title" style={{ justifyContent: "center", marginBottom: "8px" }}>  
            Спільна оренда 
          </h2>  
  
          <p className="page-subtitle" style={{ textAlign: "center", marginBottom: "24px" }}>  
            Ми створимо груповий чат із <strong>{ownerName || "власником"}</strong>.  
            Ви зможете додати друзів пізніше, щоб обговорити оренду разом. 
          </p>  
  
          <form onSubmit={handleSubmit}>  
            <div className={styles.inputWrapper}>  
              <label className={styles.inputLabel}>Назва чату</label> 
              <Input  
                type="text"  
                placeholder="Наприклад: Оренда на літо"  
                value={groupName}  
                onChange={(e) => setGroupName(e.target.value)}  
                required  
                autoFocus  
              />  
              {/* Відображення помилки під інпутом */}
              {error && <div className={styles.errorMessage}>{error}</div>}
            </div>  
  
            <div className={styles.actions}>  
              <Button variant="secondary" type="button" onClick={onClose} disabled={isLoading}>  
                Скасувати  
              </Button>  
              <Button variant="primary" type="submit" disabled={isLoading || !groupName.trim() || groupName.trim().length > 100}>  
                {isLoading ? "Створення..." : "Створити чат"}  
              </Button>  
            </div>  
          </form>  
        </div>  
      </div>  
    </div>  
  );  
}; 
  
export default CreateGroupModal;