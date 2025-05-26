import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage/HomePage';
import ListingsPage from './pages/ListingsPage/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage/ListingDetailsPage';
import AddListingPage from './pages/AddListingPage/AddListingPage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import SignInPage from './pages/SignInPage/SignInPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
// Додайте інші сторінки за потреби
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="listings" element={<ListingsPage />} />
        <Route path="listings/:listingId" element={<ListingDetailPage />} />
        <Route path="add-listing" element={<AddListingPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        {/* Додайте інші маршрути всередині MainLayout якщо потрібно */}
      </Route>
      <Route path="/signin" element={<SignInPage />} /> {/* Можливо, тут буде інший Layout */}
      <Route path="/signup" element={<SignUpPage />} /> {/* Можливо, тут буде інший Layout */}
      {/* Маршрути для скидання паролю і т.д. */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;