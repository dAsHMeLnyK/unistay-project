// src/components/listings/ContactOwner.jsx
import React from 'react';
import styles from './ContactOwner.module.css';

const ContactOwner = ({ owner }) => {
  return (
    <div className={styles.contactOwner}>
      <h2 className={styles.sectionTitle}>Зв'язатися з власником</h2>
      <div className={styles.ownerInfo}>
        <img src={owner.avatarUrl} alt={owner.name} className={styles.ownerAvatar} />
        <div className={styles.ownerDetails}>
          <p className={styles.ownerName}>{owner.name}</p>
          <p className={styles.registrationDate}>На сайті з {owner.registrationDate}</p>
        </div>
        <button className={styles.messageButton}>Повідомлення</button>
      </div>
      <div className={styles.ownerContact}>
        <p className={styles.ownerPhone}>
          <span className={styles.phoneIcon}>&#9742;</span> {/* Телефонна іконка */}
          {owner.phone}
        </p>
      </div>
    </div>
  );
};

export default ContactOwner;