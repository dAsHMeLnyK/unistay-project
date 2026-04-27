import React from 'react'; 
import { FiStar } from 'react-icons/fi'; 
import styles from "./ReviewCard.module.css"; 
 
const ReviewCard = ({ review }) => {  
    // Безпечно дістаємо ім'я
    const displayName = review.user?.fullName || "Користувач";  
    const avatar = review.user?.profileImage;  
 
    // Створюємо безпечний ініціал для аватарки
    const getInitial = () => {
        if (typeof displayName === 'string' && displayName.length > 0) {
            return displayName.charAt(0).toUpperCase();
        }
        return "U"; // Дефолтне значення, якщо ім'я пошкоджене
    };

    const date = new Date(review.publicationDate).toLocaleDateString('uk-UA', {   
        month: 'long',   
        year: 'numeric'   
    });  
  
    return (  
        <div className={styles.reviewCard}>  
            <div className={styles.cardHeader}>  
                <div className={styles.authorAvatar}>  
                    {avatar ? ( 
                        <img  
                            src={avatar}  
                            alt={displayName}  
                            className={styles.avatarImg}  
                        /> 
                    ) : ( 
                        getInitial() // Використовуємо безпечну функцію
                    )}  
                </div>  
                <div className={styles.authorMeta}>  
                    <h4 className={styles.authorName}>{displayName}</h4>  
                    <span className={styles.reviewDate}>{date}</span>  
                </div>  
                <div className="inner-badge" style={{ marginLeft: 'auto', gap: '6px', display: 'flex', alignItems: 'center' }}>  
                    <FiStar style={{ color: '#FFB800', fill: '#FFB800' }} />  
                    <span>{review.rating}</span>  
                </div>  
            </div>  
            <p className={styles.commentText}>{review.comment}</p>  
        </div>  
    );  
};
 
export default ReviewCard;