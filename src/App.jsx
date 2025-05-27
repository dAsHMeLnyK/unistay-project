// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout/AuthLayout';

// Імпорти сторінок
import HomePage from './pages/HomePage/HomePage';
import ListingsPage from './pages/ListingsPage/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage/ListingDetailsPage';
import AddListingPage from './pages/AddListingPage/AddListingPage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import SignInPage from './pages/SignInPage/SignInPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

// Імпортуємо AuthProvider з AuthContext.tsx
import { AuthProvider } from './context/AuthContext';
// Імпортуємо ProtectedRoute з нової локації
import ProtectedRoute from './components/common/ProtectedRoute'; // Ось оновлений шлях!

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="listings" element={<ListingsPage />} />
          <Route path="listings/:listingId" element={<ListingDetailPage />} />

          {/* Захищені маршрути всередині MainLayout */}
          <Route
            path="/add-listing"
            element={
              <ProtectedRoute>
                <AddListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-listing/:listingId"
            element={
              <ProtectedRoute>
                <AddListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/signin" element={<AuthLayout><SignInPage /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><SignUpPage /></AuthLayout>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;