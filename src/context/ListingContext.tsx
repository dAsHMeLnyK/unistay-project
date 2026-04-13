import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ListingService } from '../api/services/ListingService';
import { FavoriteService } from '../api/services/FavoriteService';
import { useAuth } from './AuthContext';
import { ListingDto, CreateListingDto } from '../api/dto/ListingDto';

interface ListingContextType {
    listings: ListingDto[];
    favoriteListings: ListingDto[];
    favoriteIds: string[];
    compareIds: string[];
    compareListings: ListingDto[];
    loading: boolean;
    error: string | null;
    fetchListings: () => Promise<void>;
    fetchFavoriteIds: () => Promise<void>;
    toggleFavorite: (listingId: string) => Promise<void>;
    toggleCompare: (listingId: string) => void;
    clearCompare: () => void;
    clearFavorites: () => Promise<void>;
    addListing: (dto: CreateListingDto) => Promise<ListingDto>;
    deleteListing: (id: string) => Promise<void>;
}

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export const ListingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [listings, setListings] = useState<ListingDto[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [compareIds, setCompareIds] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchListings = useCallback(async () => {
        setLoading(true);
        setError(null);
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
            // ВИПРАВЛЕНО: Мапимо саме listingId (або id оголошення), приводимо до рядка
            setFavoriteIds(data.map((fav: any) => (fav.listingId || fav.id).toString()));
        } catch (err) {
            console.error("Помилка завантаження обраних:", err);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    useEffect(() => {
        fetchFavoriteIds();
    }, [fetchFavoriteIds, isAuthenticated]);

    const toggleFavorite = async (listingId: string) => {
        if (!isAuthenticated) {
            alert("Будь ласка, увійдіть в акаунт.");
            return;
        }

        const idStr = listingId.toString();
        const isFavorited = favoriteIds.includes(idStr);
        
        try {
            if (isFavorited) {
                try {
                    await FavoriteService.removeFromFavorites(idStr);
                } catch (err: any) {
                    if (err.response?.status !== 404) throw err;
                }
                setFavoriteIds(prev => prev.filter(id => id !== idStr));
            } else {
                await FavoriteService.addToFavorites(idStr);
                setFavoriteIds(prev => [...prev, idStr]);
            }
        } catch (err) {
            console.error("Помилка toggle favorite:", err);
        }
    };

    const toggleCompare = (listingId: string) => {
        const idStr = listingId.toString();
        setCompareIds(prev => {
            if (prev.includes(idStr)) {
                return prev.filter(id => id !== idStr);
            }
            if (prev.length >= 2) {
                alert("Ви можете порівняти лише 2 оголошення одночасно.");
                return prev;
            }
            return [...prev, idStr];
        });
    };

    const clearCompare = () => setCompareIds([]);

    const clearFavorites = async () => {
        try {
            await Promise.allSettled(
                favoriteIds.map(id => FavoriteService.removeFromFavorites(id))
            );
            setFavoriteIds([]);
        } catch (err) {
            console.error("Помилка при очищенні обраного:", err);
        }
    };

    const value = {
        listings,
        favoriteListings: listings.filter(l => favoriteIds.includes(l.id.toString())),
        favoriteIds,
        compareIds,
        compareListings: listings.filter(l => compareIds.includes(l.id.toString())),
        loading,
        error,
        fetchListings,
        fetchFavoriteIds,
        toggleFavorite,
        toggleCompare,
        clearCompare,
        clearFavorites,
        addListing: async (dto: CreateListingDto) => {
            const created = await ListingService.create(dto);
            setListings(prev => [created, ...prev]);
            return created;
        },
        deleteListing: async (id: string) => {
            await ListingService.delete(id);
            setListings(prev => prev.filter(l => l.id.toString() !== id.toString()));
        }
    };

    return (
        <ListingContext.Provider value={value}>
            {children}
        </ListingContext.Provider>
    );
};

export const useListings = () => {
    const context = useContext(ListingContext);
    if (context === undefined) {
        throw new Error("useListings must be used within a ListingProvider");
    }
    return context;
};