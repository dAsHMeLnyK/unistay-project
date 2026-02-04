import { jwtDecode } from "jwt-decode";
import api from "../HttpClient";
import { LoginUserDtos } from "../dto/UserDto";

interface AuthResultDto {
  token: string;
  expires: string;
  refreshToken?: string;
}

class AuthService {
  private static tokenKey = "token";

  async login(email: string, password: string): Promise<boolean> {
    try {
      const loginData: LoginUserDtos = {
        Email: email,    // Поля з великої літери згідно з LoginUserDtos на бекенді
        Password: password,
      };
      
      // Змінюємо шлях на той, що в AuthController
      const result = await api.post<AuthResultDto>("/auth/login", loginData);
      localStorage.setItem(AuthService.tokenKey, result.token);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(AuthService.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.tokenKey);
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.userid || decodedToken.id || null; 
    } catch {
      return null;
    }
  }
}

export default new AuthService();