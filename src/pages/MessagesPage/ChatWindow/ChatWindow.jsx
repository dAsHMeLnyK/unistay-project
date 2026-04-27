import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../../context/ChatContext";
import { useAuth } from "../../../context/AuthContext";
import { ChatService } from "../../../api/services/ChatService";
import Button from "../../../components/common/Button/Button";
import Input from "../../../components/common/Input/Input";
import ChatMessage from "../ChatMessage/ChatMessage";
import ChatDetails from "../ChatDetails/ChatDetails";
import { FiSend, FiX, FiCheck, FiInfo } from "react-icons/fi";
import styles from "./ChatWindow.module.css";

const ChatWindow = ({ selectedChat, onChatLeave }) => {
  const { activeChatMessages, setActiveChatMessages, connection, typingUsers } =
    useChat();
  const { userId } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatMessages]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (connection && selectedChat) {
      connection.invoke("NotifyTyping", selectedChat.id).catch(console.error);
    }
  };

  const handleSendOrUpdate = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      if (editingMessage) {
        // 1. Оновлюємо на бекенді
        await ChatService.updateMessage(
          selectedChat.id,
          editingMessage.id,
          newMessage,
        );

        // 2. МИТТЄВО оновлюємо локальний стейт (щоб не чекати оновлення сторінки)
        setActiveChatMessages((prev) =>
          prev.map((m) =>
            m.id === editingMessage.id
              ? {
                  ...m,
                  content: newMessage,
                  editedAt: new Date().toISOString(),
                } // Використовуємо editedAt
              : m,
          ),
        );
        setEditingMessage(null);
      } else {
        await ChatService.sendMessage(selectedChat.id, newMessage);
      }
      setNewMessage("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Видалити повідомлення?")) return;
    try {
      await ChatService.deleteMessage(selectedChat.id, id);
      // МИТТЄВО видаляємо зі списку
      setActiveChatMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!selectedChat) {
    return (
      <div className={styles.emptyContainer}>
        <p>Оберіть діалог для спілкування</p>
      </div>
    );
  }

  return (
    <div className={styles.outerContainer}>
      <div className={styles.window}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h3 className={styles.title}>
              {selectedChat.displayName || selectedChat.name}
            </h3>
            {typingUsers[selectedChat.id]?.length > 0 && (
              <span className={styles.typingIndicator}>друкує...</span>
            )}
          </div>
          <button
            className={styles.infoBtn}
            onClick={() => setShowDetails(!showDetails)}
          >
            <FiInfo size={20} />
          </button>
        </header>

        <div className={styles.messagesArea}>
          {activeChatMessages.map((msg) => (
            <ChatMessage
              key={msg.id}
              msg={msg}
              isMine={msg.senderId?.toLowerCase() === userId?.toLowerCase()}
              onEdit={(m) => {
                setEditingMessage(m);
                setNewMessage(m.content);
              }}
              onDelete={handleDeleteMessage}
            />
          ))}
          <div ref={scrollRef} />
        </div>

        <div className={styles.inputSection}>
          {editingMessage && (
            <div className={styles.editPreview}>
              <div className={styles.editPreviewContent}>
                <span className={styles.editPreviewTitle}>Редагування</span>
                <p className={styles.editPreviewText}>
                  {editingMessage.content}
                </p>
              </div>
              <button
                type="button"
                className={styles.cancelEditBtn}
                onClick={() => {
                  setEditingMessage(null);
                  setNewMessage("");
                }}
              >
                <FiX size={16} />
              </button>
            </div>
          )}

          <form className={styles.inputForm} onSubmit={handleSendOrUpdate}>
            <div className={styles.chatInputWrapper}>
              <Input
                value={newMessage}
                onChange={handleInputChange}
                placeholder="Повідомлення..."
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              className={styles.sendButton}
            >
              {editingMessage ? <FiCheck /> : <FiSend />}
            </Button>
          </form>
        </div>
      </div>

      {showDetails && (
        <ChatDetails
          chat={selectedChat}
          onClose={() => setShowDetails(false)}
          onChatLeave={onChatLeave}
        />
      )}
    </div>
  );
};

export default ChatWindow;
