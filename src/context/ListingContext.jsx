import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ListingService } from '../api/services/ListingService';
import { FavoriteService } from '../api/services/FavoriteService';
import { useAuth } from './AuthContext';

const ListingContext = createContext();

export const ListingProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [listings, setListings] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState([]); 
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
            // ВАЖЛИВО: Бекенд повертає об'єкти, беремо саме Id
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
                    // ВАЖЛИВО: Якщо сервер повернув 404, це означає, що в базі 
                    // запису вже немає. Ми все одно маємо видалити його зі стейту!
                    if (err.response && err.response.status === 404) {
                        console.warn("Запис не знайдено на сервері, видаляємо локально.");
                    } else {
                        throw err; // Якщо помилка інша (напр. 500), кидаємо далі
                    }
                }
                // Видаляємо зі стейту незалежно від того, чи видалив сервер (204) чи не знайшов (404)
                setFavoriteIds(prev => prev.filter(id => id !== listingId));
            } else {
                await FavoriteService.addToFavorites(listingId);
                setFavoriteIds(prev => [...prev, listingId]);
            }
        } catch (err) {
            console.error("Помилка toggle favorite:", err);
        }
};

    const clearFavorites = async () => {
    // window.confirm більше не потрібен тут!
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

    return (
        <ListingContext.Provider value={{
            listings,
            favoriteListings,
            favoriteIds,
            loading,
            error,
            fetchListings,
            fetchFavoriteIds,
            toggleFavorite,
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