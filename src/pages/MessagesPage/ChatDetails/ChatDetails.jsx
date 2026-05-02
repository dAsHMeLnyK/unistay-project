import React, { useEffect, useState } from "react";
import { ChatService } from "../../../api/services/ChatService";
import { useChat } from "../../../context/ChatContext";
import { useAuth } from "../../../context/AuthContext";
import {
  FiUsers,
  FiUserPlus,
  FiLogOut,
  FiInfo,
  FiUser,
  FiShield,
  FiTrash2,
  FiEdit2,
  FiTrendingUp // Додано нову іконку
} from "react-icons/fi";
import ConfirmModal from "../../../components/common/ConfirmModal/ConfirmModal";
import AddMemberModal from "./AddMemberModal/AddMemberModal";
import EditChatModal from "./EditChatModal/EditChatModal";
import { ChatType } from "../../../api/dto/ChatDto";
import styles from "./ChatDetails.module.css";

const ChatDetails = ({ chat, onClose, onChatLeave }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLeavingInProgress, setIsLeavingInProgress] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddingInProgress, setIsAddingInProgress] = useState(false);
  const [isEditingInProgress, setIsEditingInProgress] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingInProgress, setIsDeletingInProgress] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Отримуємо список чатів для відстеження актуального стану
  const { chats, setChats } = useChat();
  const { userId: currentUserId } = useAuth();

  // ДОДАНО: Динамічне отримання актуальних даних чату (вирішує проблему з оновленням)
  const activeChat = chats.find((c) => c.id === chat.id) || chat;

  const fetchMembers = async () => {
    if (!activeChat?.id) return;
    try {
      setLoading(true);
      const data = await ChatService.getChatMembers(activeChat.id);
      setMembers(data);
    } catch (err) {
      console.error("Помилка завантаження учасників:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [activeChat.id]);

  const currentUserMember = members?.find(
    (m) => m.userId?.toLowerCase() === currentUserId?.toLowerCase(),
  );
  
  const isOwner = currentUserMember?.role === 2;
  const isAdminOrOwner = currentUserMember?.role >= 1;

  const handleConfirmLeave = async () => {
    try {
      setIsLeavingInProgress(true);
      await ChatService.leaveChat(activeChat.id);
      setChats((prev) => prev.filter((c) => c.id !== activeChat.id));
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
      await ChatService.addMemberByEmail(activeChat.id, email);
      await fetchMembers();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Деталі помилки:", err.response?.data || err);
      alert("Користувача з таким Email не знайдено або сталася помилка");
    } finally {
      setIsAddingInProgress(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeletingInProgress(true);
    try {
      await ChatService.deleteChat(activeChat.id);
      setChats((prev) => prev.filter((c) => c.id !== activeChat.id));
      setIsDeleteModalOpen(false);
      onClose();
      if (onChatLeave) onChatLeave();
    } catch (error) {
      console.error("Помилка при видаленні чату:", error);
      alert("Помилка при видаленні чату.");
    } finally {
      setIsDeletingInProgress(false);
    }
  };

  const handleEditChat = async (updatedData) => {
    setIsEditingInProgress(true);
    try {
      const updatedChat = await ChatService.updateChat(activeChat.id, updatedData);
      setChats((prev) =>
        prev.map((c) => (c.id === activeChat.id ? { ...c, ...updatedChat } : c)),
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Помилка при оновленні чату:", error);
      alert("Не вдалося оновити дані чату.");
    } finally {
      setIsEditingInProgress(false);
    }
  };

  const handleMakeAdmin = async (targetUserId) => {
    if (!window.confirm("Призначити цього користувача адміністратором?")) return;
    
    try {
      await ChatService.changeMemberRole(activeChat.id, targetUserId, 1); 
      await fetchMembers(); 
    } catch (error) {
      console.error("Помилка при зміні ролі:", error);
      alert("Не вдалося призначити адміністратора. Перевірте, чи додано ендпоінт на бекенді.");
    }
  };

  const interlocutor =
    activeChat.type === ChatType.Private
      ? members.find(
          (m) => m.userId.toLowerCase() !== currentUserId?.toLowerCase(),
        )?.user
      : null;

  const getRoleLabel = (role) => {
    switch (role) {
      case 2:
        return { text: "Власник", color: "#d4af37" };
      case 1:
        return { text: "Адмін", color: "var(--analysis-line-1)" };
      default:
        return { text: "Учасник", color: "var(--analysis-line-2)" };
    }
  };

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h4>Інформація</h4>
          <button onClick={onClose} className={styles.closeBtn}>
            &times;
          </button>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <div className={styles.chatProfile}>
              <div className={styles.largeAvatar}>
                {activeChat.type === ChatType.Private &&
                interlocutor?.profileImage ? (
                  <img
                    src={interlocutor.profileImage}
                    alt="Avatar"
                    className={styles.avatarImg}
                  />
                ) : activeChat.type === ChatType.Private && interlocutor ? (
                  interlocutor.fullName?.charAt(0).toUpperCase()
                ) : (
                  activeChat.name?.charAt(0).toUpperCase()
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>{activeChat.name}</h3>
                {isAdminOrOwner && activeChat.type !== ChatType.Private && (
                  <button
                    className={styles.addMemberBtn}
                    title="Редагувати чат"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <FiEdit2 size={16} />
                  </button>
                )}
              </div>

              {activeChat.type === ChatType.Private && interlocutor ? (
                <p className={styles.typeLabel}>
                  Діалог з <b>{interlocutor.fullName}</b>
                </p>
              ) : (
                <p className={styles.typeLabel}>Групове обговорення</p>
              )}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <FiInfo /> <span>Про об'єкт</span>
            </div>
            <p className={styles.description}>
              {activeChat.description || "Опис об'єкта або чату відсутній"}
            </p>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeaderRow}>
              <div className={styles.sectionTitle}>
                <FiUsers /> <span>Учасники ({members?.length || 0})</span>
              </div>
              {activeChat.type !== ChatType.Private && isAdminOrOwner && (
                <button
                  className={styles.addMemberBtn}
                  title="Додати до обговорення"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <FiUserPlus size={18} />
                </button>
              )}
            </div>

            <div className={styles.memberList}>
              {loading ? (
                <p className={styles.description}>Завантаження...</p>
              ) : (
                members?.map((member) => (
                  <div key={member.id} className={styles.memberItem}>
                    <div className={styles.memberAvatar}>
                      {member.user?.profileImage ? (
                        <img
                          src={member.user.profileImage}
                          alt=""
                          className={styles.avatarImg}
                        />
                      ) : (
                        member.user?.fullName?.charAt(0).toUpperCase() || (
                          <FiUser />
                        )
                      )}
                    </div>
                    <div className={styles.memberInfo}>
                      <span className={styles.memberName}>
                        {member.userId.toLowerCase() ===
                        currentUserId?.toLowerCase()
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

                    {/* Кнопка зі стандартною підказкою */}
                    {isOwner && member.role === 0 && (
                      <button 
                        className={styles.makeAdminBtn} 
                        title="Призначити адміністратором"
                        onClick={() => handleMakeAdmin(member.userId)}
                      >
                        <FiTrendingUp size={16} />
                      </button>
                    )}

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
          <button
            className={styles.leaveBtn}
            onClick={() => setIsLeaveModalOpen(true)}
          >
            <FiLogOut /> Вийти з чату
          </button>

          {isOwner && (
            <button
              className={styles.deleteBtn}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <FiTrash2 /> Видалити чат
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isLeaveModalOpen}
        title="Вихід з чату"
        message={`Ви впевнені, що хочете залишити "${activeChat.name}"? Повідомлення залишаться в інших учасників.`}
        onConfirm={handleConfirmLeave}
        onCancel={() => setIsLeaveModalOpen(false)}
        isLoading={isLeavingInProgress}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Видалення чату"
        message={`Ви впевнені, що хочете назавжди видалити "${activeChat.name}"? Усі повідомлення будуть втрачені для всіх учасників. Цю дію неможливо скасувати.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeletingInProgress}
      />

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddMember}
        isLoading={isAddingInProgress}
      />

      <EditChatModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditChat}
        chat={activeChat}
        isLoading={isEditingInProgress}
      />
    </>
  );
};

export default ChatDetails;