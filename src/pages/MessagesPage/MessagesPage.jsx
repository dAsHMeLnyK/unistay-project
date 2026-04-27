import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import { ChatService } from "../../api/services/ChatService";
import ChatSidebar from "./ChatSidebar/ChatSidebar";
import ChatWindow from "./ChatWindow/ChatWindow";
import styles from "./MessagesPage.module.css";

const MessagesPage = () => {
  const { chats, setChats, setActiveChatMessages, joinChat } = useChat();
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const data = await ChatService.getUserChats();
        setChats(data);

        // Шукаємо ID чату в стейті переходу
        const targetChatId = location.state?.selectedChatId;
        if (targetChatId) {
          const target = data.find((c) => c.id === targetChatId);
          if (target) {
            handleSelectChat(target);
          }
        }
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [location.state?.selectedChatId]);

  const handleSelectChat = async (chat) => {
    if (selectedChat?.id === chat.id) return;
    setSelectedChat(chat);

    joinChat(chat.id);

    try {
      const history = await ChatService.getChatMessages(chat.id);
      setActiveChatMessages([...history].reverse());
    } catch (error) {
      console.error("Не вдалося завантажити повідомлення:", error);
    }
  };

  const sortedChats = [...chats].sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt).getTime() -
      new Date(a.updatedAt || a.createdAt).getTime(),
  );

  return (
    <div className="page-content-container">
      <header className="page-header">
        <h1 className="page-title">Повідомлення</h1>
        <p className="page-subtitle">
          Спілкуйтеся з власниками нерухомості та керуйте записами
        </p>
      </header>

      <div className={styles.messagingLayout}>
        <ChatSidebar
          chats={sortedChats}
          selectedId={selectedChat?.id}
          onSelect={handleSelectChat}
          loading={loading}
        />
        <ChatWindow
          selectedChat={selectedChat}
          onChatLeave={() => setSelectedChat(null)}
        />
      </div>
    </div>
  );
};

export default MessagesPage;
