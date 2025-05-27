import { jwtDecode } from "jwt-decode";
import { HttpClient } from "../HttpClient";
import { LoginUserDtos } from "../dto/UserDto";

interface AuthResultDto {
  token: string;
  expires: string;
  refreshToken?: string;
}

class AuthService {
  private static tokenKey = "token";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({ baseURL: "http://localhost:5131/api" });
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const loginDto: LoginUserDtos = {
        Email: email,
        Password: password,
      };
      const result = await this.httpClient.post<AuthResultDto>("/users/login", loginDto);
      localStorage.setItem(AuthService.tokenKey, result.token);
      return true;
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(AuthService.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AuthService.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.tokenKey);
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: { userid: string } = jwtDecode(token);
    return decodedToken.userid;
  }
}

export default new AuthService();
