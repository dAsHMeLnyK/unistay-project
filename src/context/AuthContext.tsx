import React, { createContext, useState, useContext, useEffect, ReactNode } from "react"; 
import AuthService from "../api/services/AuthService"; 
import { jwtDecode } from "jwt-decode"; 
 
interface AuthContextType { 
  isAuthenticated: boolean; 
  userId: string | null; 
  userName: string | null; 
  profileImage: string | null; // Додано
  userRole: string | null; 
  login: (email: string, password: string) => Promise<boolean>; 
  logout: () => void; 
  loading: boolean; 
} 
 
const AuthContext = createContext<AuthContextType | undefined>(undefined); 
 
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => { 
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); 
  const [userId, setUserId] = useState<string | null>(null); 
  const [userName, setUserName] = useState<string | null>(null); 
  const [profileImage, setProfileImage] = useState<string | null>(null); // Додано
  const [userRole, setUserRole] = useState<string | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 
 
  const extractDataFromToken = () => { 
    const token = AuthService.getToken(); 
    if (token) { 
        try { 
            const decoded: any = jwtDecode(token); 
             
            const role = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; 
            const id = decoded.nameid || decoded.sub || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]; 
 
            // Шукаємо ім'я в різних клеймах
            const name = decoded.name ||  
                         decoded.given_name ||
                         decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
                         decoded.unique_name;
            
            // Шукаємо фото (якщо бекенд його кладе в токен)
            const photo = decoded.profileImage || decoded.AvatarUrl || null;
 
            setUserId(id ? id.toString().toLowerCase() : null); 
            setUserName(name || decoded.email || null);  
            setProfileImage(photo); // Встановлюємо фото
            setUserRole(role || null); 
        } catch (e) { 
            console.error("Token decoding error:", e); 
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
    setUserName(null); 
    setProfileImage(null); // Очищуємо фото
    setUserRole(null); 
  }; 
 
  return ( 
    <AuthContext.Provider value={{ isAuthenticated, userId, userName, profileImage, userRole, login, logout, loading }}> 
      {children} 
    </AuthContext.Provider> 
  ); 
}; 
 
export const useAuth = () => { 
  const context = useContext(AuthContext); 
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider"); 
  return context; 
};