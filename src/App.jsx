import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css"; // ПІДКЛЮЧЕНО: тепер всі класи .page-title працюватимуть

// Layouts
import MainLayout from "./layouts/MainLayout/MainLayout";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";

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

// Context & Protection
import { AuthProvider } from "./context/AuthContext";
import { ListingProvider } from "./context/ListingContext";
import ProtectedRoute from "./components/common/ProtectedRoute";


function App() {
  return (
    <AuthProvider>
      <ListingProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="listings" element={<ListingsPage />} />
            <Route path="listings/:listingId" element={<ListingDetailPage />} />
            <Route path="/explore-map" element={<ExploreMapPage />} />
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
              <ProtectedRoute>
                <div style={{ padding: "20px" }}>Profile Page Placeholder</div>
              </ProtectedRoute>
            } />
          </Route>

          {/* Авторизація */}
          <Route path="/signin" element={<AuthLayout><SignInPage /></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout><SignUpPage /></AuthLayout>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ListingProvider>
    </AuthProvider>
  );
}

export default App;