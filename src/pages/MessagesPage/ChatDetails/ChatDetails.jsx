import React, { useEffect, useState } from 'react';
import { ChatService } from '../../../api/services/ChatService';
import { useChat } from '../../../context/ChatContext';
import { useAuth } from '../../../context/AuthContext';
import { FiLogOut, FiShield, FiInfo, FiUsers, FiUserPlus, FiUser } from 'react-icons/fi';
import ConfirmModal from '../../../components/common/ConfirmModal/ConfirmModal';
import AddMemberModal from './AddMemberModal/AddMemberModal';
import { ChatType } from '../../../api/dto/ChatDto';
import styles from './ChatDetails.module.css';

const ChatDetails = ({ chat, onClose, onChatLeave }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isLeavingInProgress, setIsLeavingInProgress] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddingInProgress, setIsAddingInProgress] = useState(false);

    const { setChats } = useChat();
    const { userId: currentUserId } = useAuth();

    const fetchMembers = async () => {
        if (!chat?.id) return;
        try {
            setLoading(true);
            const data = await ChatService.getChatMembers(chat.id);
            setMembers(data);
        } catch (err) {
            console.error("Помилка завантаження учасників:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [chat.id]);

    const handleConfirmLeave = async () => {
        try {
            setIsLeavingInProgress(true);
            await ChatService.leaveChat(chat.id);
            setChats(prev => prev.filter(c => c.id !== chat.id));
            setIsLeaveModalOpen(false);
            onClose(); 
            if (onChatLeave) onChatLeave();
        } catch (err) {
            console.error(err);
            alert("Не вдалося залишити чат");
        } finally {
            setIsLeavingInProgress(false);
        }
    };

    const handleAddMember = async (email) => {
        try {
            setIsAddingInProgress(true);
            await ChatService.addMemberByEmail(chat.id, email);
            await fetchMembers();
            setIsAddModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Користувача з таким Email не знайдено або сталася помилка");
        } finally {
            setIsAddingInProgress(false);
        }
    };

    const interlocutor = chat.type === ChatType.Private 
        ? members.find(m => m.userId.toLowerCase() !== currentUserId?.toLowerCase())?.user
        : null;

    const getRoleLabel = (role) => {
        switch (role) {
            case 2: return { text: "Власник", color: "#d4af37" };
            case 1: return { text: "Адмін", color: "#4A5568" };
            default: return { text: "Учасник", color: "#a0aec0" };
        }
    };

    return (
        <>
            <div className={styles.panel}>
                <div className={styles.header}>
                    <h4>Інформація</h4>
                    <button onClick={onClose} className={styles.closeBtn}>&times;</button>
                </div>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <div className={styles.chatProfile}>
                            <div className={styles.largeAvatar}>
                                {/* ОНОВЛЕНО: Відображення фото співрозмовника або назви чату */}
                                {chat.type === ChatType.Private && interlocutor?.profileImage ? (
                                    <img src={interlocutor.profileImage} alt="Avatar" className={styles.avatarImg} />
                                ) : (
                                    chat.type === ChatType.Private && interlocutor 
                                        ? interlocutor.fullName?.charAt(0).toUpperCase() 
                                        : chat.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <h3>{chat.name}</h3>
                            {chat.type === ChatType.Private && interlocutor ? (
                                <p className={styles.typeLabel}>Діалог з <b>{interlocutor.fullName}</b></p>
                            ) : (
                                <p className={styles.typeLabel}>Групове обговорення</p>
                            )}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.sectionTitle}><FiInfo /> <span>Про об'єкт</span></div>
                        <p className={styles.description}>
                            {chat.description || "Опис об'єкта або чату відсутній"}
                        </p>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.sectionHeaderRow}>
                            <div className={styles.sectionTitle}>
                                <FiUsers /> <span>Учасники ({members.length})</span>
                            </div>
                            <button 
                                className={styles.addMemberBtn} 
                                title="Додати до обговорення"
                                onClick={() => setIsAddModalOpen(true)}
                            >
                                <FiUserPlus size={18} />
                            </button>
                        </div>
                        
                        <div className={styles.memberList}>
                            {loading ? (
                                <p className={styles.description}>Завантаження...</p>
                            ) : (
                                members.map(member => (
                                    <div key={member.id} className={styles.memberItem}>
                                        <div className={styles.memberAvatar}>
                                            {/* ОНОВЛЕНО: Фото учасника у списку */}
                                            {member.user?.profileImage ? (
                                                <img src={member.user.profileImage} alt="" className={styles.avatarImg} />
                                            ) : (
                                                member.user?.fullName?.charAt(0).toUpperCase() || <FiUser />
                                            )}
                                        </div>
                                        <div className={styles.memberInfo}>
                                            <span className={styles.memberName}>
                                                {member.userId.toLowerCase() === currentUserId?.toLowerCase() 
                                                    ? "Ви" 
                                                    : member.user?.fullName}
                                            </span>
                                            <span 
                                                className={styles.memberRole} 
                                                style={{ color: getRoleLabel(member.role).color }}
                                            >
                                                {getRoleLabel(member.role).text}
                                            </span>
                                        </div>
                                        {member.role > 0 && (
                                            <FiShield 
                                                className={styles.roleIcon} 
                                                style={{ color: getRoleLabel(member.role).color }} 
                                            />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                <div className={styles.footer}>
                    <button className={styles.leaveBtn} onClick={() => setIsLeaveModalOpen(true)}>
                        <FiLogOut /> Вийти з чату
                    </button>
                </div>
            </div>

            <ConfirmModal 
                isOpen={isLeaveModalOpen}
                title="Вихід з чату"
                message={`Ви впевнені, що хочете залишити "${chat.name}"? Повідомлення залишаться в інших учасників.`}
                onConfirm={handleConfirmLeave}
                onCancel={() => setIsLeaveModalOpen(false)}
                isLoading={isLeavingInProgress}
            />

            <AddMemberModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onConfirm={handleAddMember}
                isLoading={isAddingInProgress}
            />
        </>
    );
};

export default ChatDetails;