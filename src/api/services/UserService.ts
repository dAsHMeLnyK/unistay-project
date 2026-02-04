import api from "../HttpClient";
import {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
} from "../dto/UserDto";

class UserService {
  // Для отримання всіх користувачів (потрібні права адміна)
  async getAll(): Promise<UserDto[]> {
    return await api.get<UserDto[]>("/users");
  }

  async getById(userId: string): Promise<UserDto> {
    return await api.get<UserDto>(`/users/${userId}`);
  }

  // РЕЄСТРАЦІЯ: тепер йде через /auth/register
  async create(data: CreateUserDto): Promise<UserDto> {
    return await api.post<UserDto, CreateUserDto>("/auth/register", data);
  }

  async update(userId: string, data: UpdateUserDto): Promise<UserDto> {
    return await api.put<UserDto, UpdateUserDto>(`/users/${userId}`, data);
  }

  async delete(userId: string): Promise<void> {
    await api.delete<void>(`/users/${userId}`);
  }
}

export default new UserService();