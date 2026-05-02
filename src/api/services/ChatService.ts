import HttpClient from "../HttpClient"; 
import { ChatDto, ChatMessageDto, ChatMemberDto } from "../dto/ChatDto"; 
 
export const ChatService = { 
  getUserChats: async (): Promise<ChatDto[]> => { 
    return await HttpClient.get<ChatDto[]>("/chats"); 
  }, 
 
  // ОНОВЛЕНО: додано targetUserId
  createChat: async (payload: { 
    name: string; 
    description?: string; 
    type: number;
    targetUserId?: string; 
  }): Promise<ChatDto> => { 
    return await HttpClient.post<ChatDto>("/chats", payload); 
  }, 
 
  addMember: async ( 
    chatId: string, 
    targetUserId: string, 
    role?: number, 
  ): Promise<ChatMemberDto> => { 
    return await HttpClient.post<ChatMemberDto>( 
      `/chats/${chatId}/members`,
      { targetUserId, role }, 
    ); 
  }, 
 
  addMemberByEmail: async ( 
    chatId: string, 
    email: string, 
    role?: number, 
  ): Promise<ChatMemberDto> => { 
    return await HttpClient.post<ChatMemberDto>( 
      `/chats/${chatId}/members/by-email`,
      { email, role }, 
    ); 
  }, 
 
  searchUserByEmail: async (email: string): Promise<any> => { 
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
      `/chats/${chatId}/messages`,
      { params: { skip, take } }, 
    ); 
  }, 
 
  sendMessage: async ( 
    chatId: string, 
    content: string, 
  ): Promise<ChatMessageDto> => { 
    return await HttpClient.post<ChatMessageDto>( 
      `/chats/${chatId}/messages`,
      { content }, 
    ); 
  }, 
 
  getChatMembers: async (chatId: string): Promise<ChatMemberDto[]> => { 
    return await HttpClient.get<ChatMemberDto[]>( 
      `/chats/${chatId}/members`,
    ); 
  }, 
 
  updateMessage: async ( 
    chatId: string, 
    messageId: string, 
    content: string, 
  ): Promise<ChatMessageDto> => { 
    return await HttpClient.put<ChatMessageDto>( 
      `/chats/${chatId}/messages/${messageId}`, 
      { content }, 
    ); 
  }, 
 
  deleteMessage: async (chatId: string, messageId: string): Promise<void> => { 
    return await HttpClient.delete<void>( 
      `/chats/${chatId}/messages/${messageId}`, 
    ); 
  }, 

  // ВИПРАВЛЕНО: Змінено назву з updateChatDetails на updateChat
  updateChat: async (
    chatId: string,
    payload: { name?: string; description?: string }
  ): Promise<ChatDto> => {
    return await HttpClient.put<ChatDto>(`/chats/${chatId}`, payload);
  },

  deleteChat: async (chatId: string): Promise<void> => {
    return await HttpClient.delete<void>(`/chats/${chatId}`);
  },

  // ДОДАНО: Метод для зміни ролі користувача
  changeMemberRole: async (
    chatId: string,
    targetUserId: string,
    role: number
  ): Promise<void> => {
    // Якщо бекенд очікує дані інакше (наприклад, роль передається прямо в URL або іншим об'єктом),
    // вам може знадобитися трохи підправити цей запит під ваш бекенд
    return await HttpClient.put<void>(
      `/chats/${chatId}/members/${targetUserId}/role`,
      { role }
    );
  }
};