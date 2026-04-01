import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ListingService } from '../api/services/ListingService';
import { FavoriteService } from '../api/services/FavoriteService';
import { useAuth } from './AuthContext';

const ListingContext = createContext();

export const ListingProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [listings, setListings] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [compareIds, setCompareIds] = useState([]); // Стейт для порівняння
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchListings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await ListingService.getAll();
            setListings(data);
        } catch (err) {
            setError("Не вдалося завантажити оголошення");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFavoriteIds = useCallback(async () => {
        if (!isAuthenticated) {
            setFavoriteIds([]);
            return;
        }
        try {
            const data = await FavoriteService.getMyFavorites();
            setFavoriteIds(data.map(fav => fav.id));
        } catch (err) {
            console.error("Помилка завантаження обраних:", err);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchListings();
        fetchFavoriteIds();
    }, [fetchListings, fetchFavoriteIds]);

    const toggleFavorite = async (listingId) => {
        if (!isAuthenticated) {
            alert("Будь ласка, увійдіть в акаунт.");
            return;
        }

        const isFavorited = favoriteIds.includes(listingId);
        
        try {
            if (isFavorited) {
                try {
                    await FavoriteService.removeFromFavorites(listingId);
                } catch (err) {
                    if (err.response && err.response.status === 404) {
                        console.warn("Запис не знайдено на сервері, видаляємо локально.");
                    } else {
                        throw err;
                    }
                }
                setFavoriteIds(prev => prev.filter(id => id !== listingId));
            } else {
                await FavoriteService.addToFavorites(listingId);
                setFavoriteIds(prev => [...prev, listingId]);
            }
        } catch (err) {
            console.error("Помилка toggle favorite:", err);
        }
    };

    // ЛОГІКА ПОРІВНЯННЯ
    const toggleCompare = (listingId) => {
        setCompareIds(prev => {
            if (prev.includes(listingId)) {
                return prev.filter(id => id !== listingId);
            }
            if (prev.length >= 2) {
                alert("Ви можете порівняти лише 2 оголошення одночасно.");
                return prev;
            }
            return [...prev, listingId];
        });
    };

    const clearCompare = () => setCompareIds([]);

    const clearFavorites = async () => {
        const idsToDelete = [...new Set(favoriteIds)];
        try {
            await Promise.allSettled(
                idsToDelete.map(id => FavoriteService.removeFromFavorites(id))
            );
            setFavoriteIds([]);
        } catch (err) {
            console.error("Помилка при очищенні:", err);
        }
    };

    const favoriteListings = listings.filter(l => favoriteIds.includes(l.id));
    const compareListings = listings.filter(l => compareIds.includes(l.id));

    return (
        <ListingContext.Provider value={{
            listings,
            favoriteListings,
            favoriteIds,
            compareIds,      // Додано
            compareListings, // Додано
            loading,
            error,
            fetchListings,
            fetchFavoriteIds,
            toggleFavorite,
            toggleCompare,
            clearCompare,
            clearFavorites,
            addListing: async (dto) => {
                const createdListing = await ListingService.create(dto);
                setListings(prev => [createdListing, ...prev]);
                return createdListing;
            },
            deleteListing: async (id) => {
                await ListingService.delete(id);
                setListings(prev => prev.filter(l => l.id !== id));
            }
        }}>
            {children}
        </ListingContext.Provider>
    );
};

export const useListings = () => useContext(ListingContext);