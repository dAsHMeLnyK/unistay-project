// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Шлях до AuthContext.tsx

const ProtectedRoute = ({ children /*, roles */ }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Можна відобразити спіннер або індикатор завантаження
    return <div>Завантаження авторизації...</div>;
  }

  if (!isAuthenticated) {
    // Якщо користувач не авторизований, перенаправляємо на сторінку входу
    return <Navigate to="/signin" replace />;
  }

  // Логіка ролей (якщо вона вам знадобиться)
  // Наприклад:
  // const { userRole } = useAuth();
  // if (roles && userRole && !roles.includes(userRole)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return children;
};

export default ProtectedRoute;