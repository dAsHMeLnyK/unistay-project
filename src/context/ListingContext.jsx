import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ListingService } from '../api/services/ListingService';

const ListingContext = createContext();

export const ListingProvider = ({ children }) => {
    const [listings, setListings] = useState([]);
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

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    const addListing = async (dto) => {
        try {
            const createdListing = await ListingService.create(dto);
            setListings(prev => [createdListing, ...prev]);
            return createdListing; // ПОВЕРТАЄМО ОБ'ЄКТ (важливо для ID)
        } catch (err) {
            console.error("Помилка при створенні:", err);
            throw err;
        }
    };

    return (
        <ListingContext.Provider value={{
            listings,
            loading,
            error,
            fetchListings,
            addListing,
            getComparison: ListingService.compare,
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