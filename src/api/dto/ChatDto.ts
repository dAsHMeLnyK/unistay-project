export enum ChatMemberRole {
    Member = 0,
    Admin = 1,
    Owner = 2
}

export enum ChatType {
    Group = 0,
    Private = 1
}

export interface UserSummaryDto {
    id: string;
    fullName: string;
    avatarUrl?: string;
}

export interface ChatMemberDto {
    id: string;
    chatId: string;
    userId: string;
    user?: UserSummaryDto;
    role: ChatMemberRole;
    joinedAt: string;
    isActive: boolean;
}

export interface ChatDto {
    id: string;
    name: string;
    description?: string;
    type: ChatType;
    createdById: string;
    createdBy?: UserSummaryDto;
    createdAt: string;
    updatedAt?: string;
    isActive: boolean;
    memberCount: number;
    members: ChatMemberDto[];
    admins: ChatMemberDto[]; // Додано з бекенду
    owners: ChatMemberDto[]; // Додано з бекенду
}

export interface ChatMessageDto {
    id: string;
    chatId: string;
    senderId: string;
    sender?: UserSummaryDto;
    content: string;
    sentAt: string;
    editedAt?: string;
    isDeleted: boolean;
}