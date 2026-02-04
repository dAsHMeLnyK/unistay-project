import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AuthService from "../api/services/AuthService";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  userRole: string | null; // Додаємо роль
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const extractDataFromToken = () => {
    const token = AuthService.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // В .NET ролі зазвичай зберігаються в ключі 'role' або 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        const role = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        setUserId(AuthService.getUserIdFromToken());
        setUserRole(role);
      } catch (e) {
        console.error("Помилка декодування токена", e);
      }
    }
  };

  useEffect(() => {
    const initAuth = () => {
      const authStatus = AuthService.isAuthenticated();
      setIsAuthenticated(authStatus);
      if (authStatus) {
        extractDataFromToken();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await AuthService.login(email, password);
      if (success) {
        setIsAuthenticated(true);
        extractDataFromToken();
      }
      return success;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUserId(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, userRole, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};