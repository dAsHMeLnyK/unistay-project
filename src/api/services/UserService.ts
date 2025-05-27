import { HttpClient } from "../HttpClient";
import AuthService from "./AuthService";
import {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
} from "../dto/UserDto";

class UserService {
  private httpClient = new HttpClient({
    baseURL: "http://localhost:5113/api/users",
  });

  async getAll(): Promise<UserDto[]> {
    return await this.httpClient.get<UserDto[]>("/");
  }

  async getById(userId: string): Promise<UserDto> {
    return await this.httpClient.get<UserDto>(`/${userId}`);
  }

  async create(data: CreateUserDto): Promise<UserDto> {
    return await this.httpClient.post<UserDto, CreateUserDto>("/", data);
  }

  async update(userId: string, data: UpdateUserDto): Promise<UserDto> {
    return await this.httpClient.put<UserDto, UpdateUserDto>(`/${userId}`, data);
  }

  async delete(userId: string): Promise<void> {
    await this.httpClient.delete<void>(`/${userId}`);
  }
}

export default new UserService();
