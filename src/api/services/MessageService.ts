import { HttpClient } from "../HttpClient";
import {
  MessageDto,
  CreateMessageDto,
  UpdateMessageDto,
} from "../dto/MessageDto";

class MessageService {
  private httpClient = new HttpClient({
    baseURL: "http://localhost:5131/api/messages",
  });

  async send(data: CreateMessageDto): Promise<MessageDto> {
    return await this.httpClient.post<MessageDto, CreateMessageDto>("/", data);
  }

  async getMyMessages(): Promise<MessageDto[]> {
    return await this.httpClient.get<MessageDto[]>("/");
  }

  async getConversationWithUser(otherUserId: string): Promise<MessageDto[]> {
    return await this.httpClient.get<MessageDto[]>(`/conversation/${otherUserId}`);
  }

  async getById(messageId: string): Promise<MessageDto> {
    return await this.httpClient.get<MessageDto>(`/${messageId}`);
  }

  async update(messageId: string, data: UpdateMessageDto): Promise<MessageDto> {
    return await this.httpClient.put<MessageDto, UpdateMessageDto>(`/${messageId}`, data);
  }

  async delete(messageId: string): Promise<void> {
    await this.httpClient.delete<void>(`/${messageId}`);
  }
}

export default new MessageService();