// src/context/ListingContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'; // <--- ДОДАНО useState, useEffect
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

const ListingContext = createContext();

export const ListingProvider = ({ children }) => {
    const { userId } = useAuth();

    // Додаємо стан для оголошень, щоб він був доступний для всіх, хто використовує контекст
    const [listings, setListings] = useState(() => {
        // Ініціалізуємо стан з localStorage при першому рендері
        try {
            const storedListings = localStorage.getItem('listings');
            return storedListings ? JSON.parse(storedListings) : [];
        } catch (error) {
            console.error("Помилка при читанні оголошень з localStorage:", error);
            return [];
        }
    });

    // Використовуємо useEffect для синхронізації localStorage при зміні listings
    useEffect(() => {
        try {
            localStorage.setItem('listings', JSON.stringify(listings));
        } catch (error) {
            console.error("Помилка при записі оголошень в localStorage:", error);
        }
    }, [listings]);


    const addListing = (newListingData) => {
        const newListing = {
            ...newListingData,
            id: uuidv4(),
            photos: newListingData.photos && newListingData.photos.length > 0
                ? newListingData.photos
                : ['/src/assets/images/завантаження (4).jpg'],
            currency: newListingData.currency || 'грн',
            status: 'available',
            ownerId: userId || 'anonymous_user',
            owner: {
                name: userId ? `Користувач ID: ${userId.substring(0, 8)}...` : 'Невідомий користувач',
                phone: '+38 0XX XXX XX XX',
                avatarUrl: userId ? `https://via.placeholder.com/60x60/B17457/FFFFFF?text=${userId.substring(0, 1).toUpperCase()}` : 'https://via.placeholder.com/60x60/B17457/FFFFFF?text=Anon',
                registrationDate: new Date().toISOString().split('T')[0],
            },
            reviews: [],
            publishedDate: new Date().toLocaleDateString('uk-UA'),
            rating: 0,
            type: newListingData.type || 'Квартира',
            bedrooms: newListingData.bedrooms || 0,
            bathrooms: newListingData.bathrooms || 0,
            guests: newListingData.guests || 0,
            amenities: newListingData.amenities || [],
            fullDescription: newListingData.fullDescription || newListingData.description || 'Детальний опис відсутній.',
            imageUrl: newListingData.imageUrl || (newListingData.photos && newListingData.photos[0]) || '/src/assets/images/завантаження (4).jpg',
            allImages: newListingData.allImages || (newListingData.photos && newListingData.photos.length > 0 ? newListingData.photos : ['/src/assets/images/завантаження (4).jpg']),
            utilityPaymentType: newListingData.utilityPaymentType || 'separate',
            ownerOccupancy: newListingData.ownerOccupancy || 'without-owner',
            neighborInfo: newListingData.neighborInfo || 'no-roommates',
            buildYear: newListingData.buildYear || null,
            floor: newListingData.floor || null,
            totalFloors: newListingData.totalFloors || null,
            heating: newListingData.heating || null,
            parking: newListingData.parking || false,
            balcony: newListingData.balcony || false,
            animals: newListingData.animals || false,
            children: newListingData.children || false,
            wifi: newListingData.wifi || false,
            condition: newListingData.condition || 'new',
        };

        // Замість безпосереднього звернення до localStorage, оновлюємо стан listings
        setListings((prevListings) => [...prevListings, newListing]);

        return newListing.id;
    };

    const updateListing = (id, updatedListingData) => {
        setListings((prevListings) => {
            const updated = prevListings.map((listing) =>
                String(listing.id) === String(id)
                    ? { ...listing, ...updatedListingData }
                    : listing
            );
            return updated;
        });
    };

    // <--- НОВА ФУНКЦІЯ: ВИДАЛЕННЯ ОГОЛОШЕННЯ
    const deleteListing = (id) => {
        setListings((prevListings) => {
            const filteredListings = prevListings.filter((listing) => String(listing.id) !== String(id));
            return filteredListings;
        });
        console.log(`Оголошення з ID ${id} видалено.`);
    };

    // <--- НОВА ФУНКЦІЯ: ОТРИМАННЯ ОГОЛОШЕНЬ ВЛАСНИКА
    const getListingsByOwnerId = (ownerId) => {
        return listings.filter(listing => String(listing.ownerId) === String(ownerId));
    };


    return (
        <ListingContext.Provider value={{
            listings, // <--- ДОДАНО: експортуємо список оголошень
            addListing,
            updateListing, // Переконайтеся, що ви її також використовуєте
            deleteListing, // <--- ЕКСПОРТУЄМО deleteListing
            getListingsByOwnerId, // <--- ЕКСПОРТУЄМО getListingsByOwnerId
        }}>
            {children}
        </ListingContext.Provider>
    );
};

export const useListings = () => {
    const context = useContext(ListingContext);
    if (!context) {
        throw new Error('useListings must be used within a ListingProvider');
    }
    return context;
};