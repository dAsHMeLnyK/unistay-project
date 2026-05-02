import React, { useState, useEffect } from "react";
import styles from "./EditChatModal.module.css";
import Button from "../../../../components/common/Button/Button";
import Input from "../../../../components/common/Input/Input";
import { FiEdit2, FiX } from "react-icons/fi";

const EditChatModal = ({ isOpen, onClose, onConfirm, chat, isLoading }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen && chat) {
      setName(chat.name || "");
      setDescription(chat.description || "");
    }
  }, [isOpen, chat]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm({ 
          name: name.trim(), 
          description: description.trim() 
      });
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} disabled={isLoading}>
          <FiX />
        </button>

        <div className={styles.contentBody}>
          <div className={styles.iconWrapper}>
            <FiEdit2 className={styles.editIcon} />
          </div>

          <h2
            className="section-title"
            style={{ justifyContent: "center", marginBottom: "8px" }}
          >
            Редагувати чат
          </h2>

          <p
            className="page-subtitle"
            style={{ textAlign: "center", marginBottom: "24px" }}
          >
            Змініть назву або опис цього групового обговорення.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Поле назви */}
            <div className={styles.inputWrapper}>
              <Input
                type="text"
                placeholder="Назва чату / об'єкта *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                disabled={isLoading}
              />
            </div>

            {/* ОНОВЛЕНЕ Поле опису з лічильником */}
            <div className={styles.inputWrapper}>
              <div className={styles.labelWithCounter}>
                <label className={styles.fieldLabel}>Опис об'єкту</label>
                <span className={styles.charCounter}>
                  {(description || "").length}/1000
                </span>
              </div>
              <div className={styles.textareaWrapper}>
                <textarea
                  className={styles.textareaField}
                  placeholder="Опис об'єкта (необов'язково)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  rows="4"
                  maxLength={1000}
                />
              </div>
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
                disabled={isLoading || !name.trim()}
              >
                {isLoading ? "Збереження..." : "Зберегти"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditChatModal;