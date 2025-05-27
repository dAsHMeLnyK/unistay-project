export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  role: string; // або enum, якщо є UserRole enum на фронті
  phoneNumber?: string | null;
  profileImage?: string | null;
  registrationDate: string; // ISO string
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string | null;
  profileImage?: string | null;
}

export interface UpdateUserDto {
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  profileImage?: string | null;
}

export interface UserSummaryDto {
  id: string;
  fullName: string;
}

export interface LoginUserDtos {
  Email: string;
  Password: string;
}
