import React from 'react'; 
import { FiEdit2, FiTrash2 } from 'react-icons/fi'; 
import styles from './ChatMessage.module.css'; 
 
const ChatMessage = ({ msg, isMine, onDelete, onEdit }) => { 
    const time = msg.sentAt  
        ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })  
        : ''; 
 
    return ( 
        <div className={`${styles.messageRow} ${isMine ? styles.myRow : styles.theirRow}`}> 
            {!isMine && ( 
                <div className={styles.miniAvatar}> 
                    {/* ОНОВЛЕНО: profileImage замість avatarUrl */}
                    {msg.sender?.profileImage ? ( 
                        <img src={msg.sender.profileImage} alt={msg.sender.fullName} className={styles.avatarImg} /> 
                    ) : ( 
                        msg.sender?.fullName?.charAt(0).toUpperCase() || "U" 
                    )} 
                </div> 
            )} 
             
            <div className={styles.bubble}> 
                {!isMine && <span className={styles.senderName}>{msg.sender?.fullName || 'Користувач'}</span>} 
                 
                <p className={styles.text}>{msg.content}</p> 
                 
                <div className={styles.msgFooter}> 
                    {(msg.editedAt) && <span className={styles.editedTag}>ред.</span>} 
                    <span className={styles.time}>{time}</span> 
                </div> 
                 
                {isMine && ( 
                    <div className={styles.messageActions}> 
                        <button className={styles.actionBtn} onClick={() => onEdit(msg)} title="Редагувати"> 
                            <FiEdit2 size={13} /> 
                        </button> 
                        <button className={styles.actionBtn} onClick={() => onDelete(msg.id)} title="Видалити"> 
                            <FiTrash2 size={13} /> 
                        </button> 
                    </div> 
                )} 
            </div> 
        </div> 
    ); 
}; 
 
export default ChatMessage;