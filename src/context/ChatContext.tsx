import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "./AuthContext";
import AuthService from "../api/services/AuthService";
import { ChatDto, ChatMessageDto, ChatMemberDto } from "../api/dto/ChatDto";

interface ChatContextType {
  connection: signalR.HubConnection | null;
  chats: ChatDto[];
  setChats: React.Dispatch<React.SetStateAction<ChatDto[]>>;
  activeChatMessages: ChatMessageDto[];
  setActiveChatMessages: React.Dispatch<React.SetStateAction<ChatMessageDto[]>>;
  typingUsers: Record<string, string[]>;
  joinChat: (chatId: string) => Promise<void>;
  leaveChat: (chatId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const [chats, setChats] = useState<ChatDto[]>([]);
  const [activeChatMessages, setActiveChatMessages] = useState<
    ChatMessageDto[]
  >([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const token = AuthService.getToken();

    if (isAuthenticated && token) {
      const rawUrl =
        import.meta.env.VITE_API_URL || "https://localhost:7190/api";
      const hubUrl = rawUrl.replace("/api", "") + "/hubs/chat";

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, { accessTokenFactory: () => token })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      setConnection(newConnection);
    } else {
      if (connection) {
        connection.stop();
        setConnection(null);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("SignalR: Connected to ChatHub");

          // 1. Нове повідомлення
          connection.on("ReceiveMessage", (message: ChatMessageDto) => {
            setActiveChatMessages((prev) =>
              prev.some((m) => m.id === message.id) ? prev : [...prev, message],
            );
          });

          // 2. Редагування повідомлення (Згідно IChatClient)
          connection.on("MessageEdited", (editedMsg: ChatMessageDto) => {
            setActiveChatMessages((prev) =>
              prev.map((m) => (m.id === editedMsg.id ? editedMsg : m)),
            );
          });

          // 3. Видалення повідомлення (Згідно IChatClient)
          connection.on(
            "MessageDeleted",
            (chatId: string, messageId: string) => {
              setActiveChatMessages((prev) =>
                prev.filter((m) => m.id !== messageId),
              );
            },
          );

          // 4. Користувач приєднався
          connection.on(
            "UserJoined",
            (chatId: string, member: ChatMemberDto) => {
              console.log("Member joined:", member);
              // Тут можна оновити список чатів (кількість учасників)
              setChats((prev) =>
                prev.map((c) =>
                  c.id === chatId
                    ? { ...c, memberCount: c.memberCount + 1 }
                    : c,
                ),
              );
            },
          );

          // 5. Друкування
          connection.on(
            "UserTyping",
            (chatId: string, userId: string, userName: string) => {
              setTypingUsers((prev) => ({
                ...prev,
                [chatId]: Array.from(
                  new Set([...(prev[chatId] || []), userName]),
                ),
              }));
            },
          );

          connection.on(
            "UserStoppedTyping",
            (chatId: string, userId: string) => {
              setTypingUsers((prev) => {
                const currentChatTyping = prev[chatId] || [];
                return {
                  ...prev,
                  [chatId]: [],
                };
              });
            },
          );
        })
        .catch((err) => console.error("SignalR Start Error: ", err));

      return () => {
        connection.off("ReceiveMessage");
        connection.off("MessageEdited");
        connection.off("MessageDeleted");
        connection.off("UserJoined");
        connection.off("UserTyping");
        connection.off("UserStoppedTyping");
      };
    }
  }, [connection]);

  const joinChat = useCallback(
    async (chatId: string) => {
      if (connection?.state === signalR.HubConnectionState.Connected) {
        await connection.invoke("JoinChat", chatId).catch(console.error);
      }
    },
    [connection],
  );

  const leaveChat = useCallback(
    async (chatId: string) => {
      if (connection?.state === signalR.HubConnectionState.Connected) {
        await connection.invoke("LeaveChat", chatId).catch(console.error);
      }
    },
    [connection],
  );

  return (
    <ChatContext.Provider
      value={{
        connection,
        chats,
        setChats,
        activeChatMessages,
        setActiveChatMessages,
        typingUsers,
        joinChat,
        leaveChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined)
    throw new Error("useChat must be used within a ChatProvider");
  return context;
};
