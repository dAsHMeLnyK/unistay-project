import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Layouts
import MainLayout from "./layouts/MainLayout/MainLayout";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";
import HomeLayout from "./layouts/HomeLayout/HomeLayout";

// Pages
import HomePage from "./pages/HomePage/HomePage";
import ListingsPage from "./pages/ListingsPage/ListingsPage";
import ListingDetailPage from "./pages/ListingDetailPage/ListingDetailsPage";
import AddListingPage from "./pages/AddListingPage/AddListingPage";
import EditListingPage from "./pages/EditListingPage/EditListingPage";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";
import MyListingsPage from "./pages/MyListingsPage/MyListingsPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ExploreMapPage from './pages/ExploreMapPage/ExploreMapPage';
import ComparePage from "./pages/ComparePage/ComparePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import MessagesPage from "./pages/MessagesPage/MessagesPage"; // ДОДАНО

// Context & Protection
import { AuthProvider } from "./context/AuthContext";
import { ListingProvider } from "./context/ListingContext";
import { ChatProvider } from "./context/ChatContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <ListingProvider>
          <Routes>
            {/* 1. Головна сторінка */}
            <Route element={<HomeLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>

            {/* 2. Всі інші сторінки */}
            <Route element={<MainLayout />}>
              <Route path="listings" element={<ListingsPage />} />
              <Route path="listings/:listingId" element={<ListingDetailPage />} />
              <Route path="explore-map" element={<ExploreMapPage />} />
              <Route path="compare" element={<ComparePage />} />

              {/* Захищені маршрути */}
              <Route path="add-listing" element={
                <ProtectedRoute><AddListingPage /></ProtectedRoute>
              } />
              <Route path="edit-listing/:listingId" element={
                <ProtectedRoute><EditListingPage /></ProtectedRoute>
              } />
              <Route path="favorites" element={
                <ProtectedRoute><FavoritesPage /></ProtectedRoute>
              } />
              <Route path="my-listings" element={
                <ProtectedRoute><MyListingsPage /></ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
              } />

              {/* Сторінка повідомлень */}
              <Route path="messages" element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } />
              
            </Route>

            {/* 3. Авторизація */}
            <Route path="/signin" element={<AuthLayout><SignInPage /></AuthLayout>} />
            <Route path="/signup" element={<AuthLayout><SignUpPage /></AuthLayout>} />
            
            {/* 4. Сторінка 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ListingProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;