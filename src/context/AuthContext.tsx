import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AuthService from "../api/services/AuthService"; // Переконайтеся, що шлях правильний

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null; // Додаємо userId
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean; // Додаємо стан завантаження
}

// Забезпечуємо, що значення за замовчуванням відповідає інтерфейсу
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Початковий стан: завантаження

  useEffect(() => {
    // При завантаженні компонента перевіряємо стан авторизації
    const checkAuthStatus = () => {
      const authenticated = AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setUserId(AuthService.getUserIdFromToken());
      } else {
        setUserId(null); // Важливо скинути userId, якщо не авторизований
      }
      setLoading(false); // Завантаження завершено
    };

    checkAuthStatus();
    // Можна також додати слухача для змін localStorage, якщо потрібно реагувати на зміни з інших вкладок/вікон
    // window.addEventListener('storage', checkAuthStatus);
    // return () => window.removeEventListener('storage', checkAuthStatus);
  }, []); // Пустий масив залежностей означає, що ефект запускається лише один раз при монтуванні

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true); // Починаємо завантаження
    try {
      const success = await AuthService.login(email, password);
      setIsAuthenticated(success);
      if (success) {
        setUserId(AuthService.getUserIdFromToken());
      } else {
        setUserId(null);
      }
      return success;
    } finally {
      setLoading(false); // Завжди завершуємо завантаження
    }
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUserId(null);
    // Після виходу, можливо, потрібно перенаправити користувача на сторінку входу
    // window.location.href = "/login"; // Можна зробити це в компоненті, який викликає logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) { // Змінено на undefined, оскільки createContext тепер ініціалізується undefined
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};