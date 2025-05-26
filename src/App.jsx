import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout/AuthLayout';

import HomePage from './pages/HomePage/HomePage';
import ListingsPage from './pages/ListingsPage/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage/ListingDetailsPage';
import AddListingPage from './pages/AddListingPage/AddListingPage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import SignInPage from './pages/SignInPage/SignInPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Маршрути, що використовують MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="listings" element={<ListingsPage />} />
        <Route path="listings/:listingId" element={<ListingDetailPage />} />
        <Route path="/add-listing" element={<AddListingPage />} />
        <Route path="/edit-listing/:listingId" element={<AddListingPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
      </Route>

      {/* Маршрути автентифікації, кожен з власним AuthLayout */}
      {/* ЦЕЙ КОД ВЖЕ БУВ НАДАНИЙ У "ВАРІАНТІ 1" - ВИКОРИСТОВУЙТЕ ЙОГО! */}
      <Route path="/signin" element={<AuthLayout><SignInPage /></AuthLayout>} />
      <Route path="/signup" element={<AuthLayout><SignUpPage /></AuthLayout>} />
      {/* Можете додати сюди маршрут для скидання паролю */}
      {/* <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} /> */}

      {/* Маршрут для 404 сторінки */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;