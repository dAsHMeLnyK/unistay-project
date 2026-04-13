import React, { useState } from 'react';
import { FiMapPin, FiCalendar, FiUser, FiPhone, FiCheckCircle, FiNavigation, FiMessageSquare } from 'react-icons/fi';
import { SiTelegram, SiViber } from 'react-icons/si'; // Якщо є react-icons/si, або замініть на звичайні іконки
import Button from "../../../components/common/Button/Button";
import Card from "../../../components/common/Card/Card";
import styles from './ListingMainInfo.module.css';

const ListingMainInfo = ({ listing }) => {
    const [showPhone, setShowPhone] = useState(false);

    // Отримуємо номер та чистимо його від зайвих символів для посилань
    const rawPhone = listing.user?.phoneNumber || "";
    const cleanPhone = rawPhone.replace(/\D/g, ''); 

    const scrollToMap = () => {
        const mapSection = document.getElementById('location-map');
        if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const formattedDate = new Date(listing.publicationDate).toLocaleDateString('uk-UA', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <Card className={styles.infoCard} padding="30px">
            <div className={styles.headerSection}>
                <h1 className={styles.title}>{listing.title}</h1>
                <div className={styles.locationRow}>
                    <div className={styles.addressWrapper}>
                        <FiMapPin className={styles.icon} />
                        <span>{listing.address}</span>
                    </div>
                    <button onClick={scrollToMap} className={styles.mapLink} title="Показати на карті">
                        <FiNavigation /> <span>На карті</span>
                    </button>
                </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.priceBlock}>
                <span className={styles.priceLabel}>Вартість оренди</span>
                <div className={styles.priceValue}>
                    {listing.price.toLocaleString()} ₴ <span className={styles.period}>/ міс.</span>
                </div>
            </div>

            <div className={styles.ownerCard}>
                <div className={styles.ownerAvatar}>
                    {listing.user?.fullName?.charAt(0) || <FiUser />}
                </div>
                <div className={styles.ownerInfo}>
                    <div className={styles.ownerName}>
                        {listing.user?.fullName || "Власник"}
                    </div>
                    <div className={styles.ownerStatus}>На зв'язку в Unistay</div>
                </div>
            </div>

            <div className={styles.actions}>
                {!showPhone ? (
                    <Button 
                        fullWidth
                        variant="primary"
                        onClick={() => setShowPhone(true)}
                        className={styles.mainPhoneBtn}
                    >
                        <FiPhone /> Показати контакти
                    </Button>
                ) : (
                    <div className={styles.contactExpanded}>
                        {/* Номер-посилання для прямого дзвінка */}
                        <a href={`tel:+${cleanPhone}`} className={styles.phoneCallLink}>
                            <FiPhone /> {rawPhone || "Номер відсутній"}
                        </a>
                        
                        {/* Кнопки месенджерів */}
                        <div className={styles.messengerGrid}>
                            <a 
                                href={`https://t.me/+${cleanPhone}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className={`${styles.messengerBtn} ${styles.tg}`}
                            >
                                Telegram
                            </a>
                            <a 
                                href={`viber://chat?number=%2B${cleanPhone}`} 
                                className={`${styles.messengerBtn} ${styles.viber}`}
                            >
                                Viber
                            </a>
                        </div>
                    </div>
                )}
                
                <Button fullWidth variant="secondary">
                    <FiMessageSquare /> Написати повідомлення
                </Button>
            </div>

            <div className={styles.footerMeta}>
                <FiCalendar /> <span>Опубліковано {formattedDate}</span>
            </div>
        </Card>
    );
};

export default ListingMainInfo;