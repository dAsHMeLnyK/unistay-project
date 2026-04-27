import HttpClient from "../HttpClient";
import { ChatDto, ChatMessageDto, ChatMemberDto } from "../dto/ChatDto";

export const ChatService = {
  getUserChats: async (): Promise<ChatDto[]> => {
    return await HttpClient.get<ChatDto[]>("/chats");
  },

  createChat: async (payload: {
    name: string;
    description?: string;
    type: number;
  }): Promise<ChatDto> => {
    return await HttpClient.post<ChatDto>("/chats", payload);
  },

  // ВИПРАВЛЕНО: додано зворотні лапки `` та правильний шлях
  addMember: async (
    chatId: string,
    targetUserId: string,
    role?: number,
  ): Promise<ChatMemberDto> => {
    return await HttpClient.post<ChatMemberDto>(
      `/chats/${chatId}/members`, // Використовуйте `` (клавіша над Tab)
      { targetUserId, role },
    );
  },

  // Додаємо заглушку для пошуку (якщо з'явиться ендпоінт)
  searchUserByEmail: async (email: string): Promise<any> => {
    // Наразі у вас немає такого методу на бекенді,
    // тому цей функціонал може видавати 404, поки не додасте метод в UsersController
    return await HttpClient.get(`/users/by-email/${email}`);
  },

  leaveChat: async (chatId: string): Promise<void> => {
    await HttpClient.post(`/chats/${chatId}/leave`, {});
  },

  getChatMessages: async (
    chatId: string,
    skip = 0,
    take = 50,
  ): Promise<ChatMessageDto[]> => {
    return await HttpClient.get<ChatMessageDto[]>(
      `/chats/${chatId}/messages`, // ВИПРАВЛЕНО зворотні лапки
      { params: { skip, take } },
    );
  },

  sendMessage: async (
    chatId: string,
    content: string,
  ): Promise<ChatMessageDto> => {
    return await HttpClient.post<ChatMessageDto>(
      `/chats/${chatId}/messages`, // ВИПРАВЛЕНО зворотні лапки
      { content },
    );
  },

  getChatMembers: async (chatId: string): Promise<ChatMemberDto[]> => {
    return await HttpClient.get<ChatMemberDto[]>(
      `/chats/${chatId}/members`, // ВИПРАВЛЕНО зворотні лапки
    );
  },

  updateMessage: async (
    chatId: string,
    messageId: string,
    content: string,
  ): Promise<ChatMessageDto> => {
    return await HttpClient.put<ChatMessageDto>(
      `/chats/${chatId}/messages/${messageId}`,
      {
        content,
      },
    );
  },

  deleteMessage: async (chatId: string, messageId: string): Promise<void> => {
    return await HttpClient.delete<void>(
      `/chats/${chatId}/messages/${messageId}`,
    );
  },
};
