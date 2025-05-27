import { UserSummaryDto } from "./UserDto";


export interface MessageDto {
  id: string;
  senderId: string;
  sender?: UserSummaryDto | null;
  receiverId: string;
  receiver?: UserSummaryDto | null;
  text: string;
  sendDate: string; // ISO string
}

export interface CreateMessageDto {
  receiverId: string;
  text: string;
}

export interface UpdateMessageDto {
  text: string;
}