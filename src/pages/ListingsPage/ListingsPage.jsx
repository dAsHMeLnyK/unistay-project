// src/pages/ListingsPage/ListingsPage.jsx
import React, { useState, useEffect } from 'react';
import listingsData from '../../data/listings'; // <--- ЗАЛИШАЄМО ЦЕЙ ІМПОРТ
import ListingCard from '../../components/listings/ListingCard/ListingCard';
import FilterBar from '../../components/filters/FilterBar/FilterBar';
import styles from './ListingsPage.module.css';

const ListingsPage = () => {
    const [listings, setListings] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        utilityPaymentType: '',
        ownerOccupancy: '',
        neighborInfo: '',
        minPrice: '',
        maxPrice: '',
    });
    const [showFilters, setShowFilters] = useState(true);

    useEffect(() => {
        // Зчитуємо з localStorage
        const storedListings = JSON.parse(localStorage.getItem('listings'));
        if (storedListings && storedListings.length > 0) {
            setListings(storedListings);
        } else {
            // Якщо в localStorage немає, використовуємо дані з файлу і зберігаємо їх
            localStorage.setItem('listings', JSON.stringify(listingsData));
            setListings(listingsData);
        }
    }, []); // Пустий масив залежностей означає, що ефект запускається один раз після першого рендеру

    // ... (решта вашого коду handleFilterChange, handleResetFilters, handleSearchButtonClick, filteredListings)

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleResetFilters = () => {
        setFilters({
            search: '',
            type: '',
            utilityPaymentType: '',
            ownerOccupancy: '',
            neighborInfo: '',
            minPrice: '',
            maxPrice: '',
        });
        console.log('Фільтри скинуто');
    };

    const handleSearchButtonClick = () => {
        console.log('Кнопка "Шукати" натиснута. Поточні фільтри:', filters);
    };

    const filteredListings = listings.filter((listing) => {
        const listingType = typeof listing.type === 'object' && listing.type !== null ? listing.type.name : listing.type;
        const listingUtilityPaymentType = typeof listing.utilityPaymentType === 'object' && listing.utilityPaymentType !== null ? listing.utilityPaymentType.type : listing.utilityPaymentType;
        const listingOwnerOccupancy = typeof listing.ownerOccupancy === 'object' && listing.ownerOccupancy !== null ? listing.ownerOccupancy.type : listing.ownerOccupancy;
        const listingNeighborInfo = typeof listing.neighborInfo === 'object' && listing.neighborInfo !== null ? listing.neighborInfo.type : listing.neighborInfo;


        const matchesSearch =
            listing.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            listing.address.toLowerCase().includes(filters.search.toLowerCase()) ||
            listing.description.toLowerCase().includes(filters.search.toLowerCase());

        const matchesMinPrice = filters.minPrice ? listing.price >= parseFloat(filters.minPrice) : true;
        const matchesMaxPrice = filters.maxPrice ? listing.price <= parseFloat(filters.maxPrice) : true;
        const matchesType = filters.type ? listingType === filters.type : true;
        const matchesUtilityPaymentType = filters.utilityPaymentType ? listingUtilityPaymentType === filters.utilityPaymentType : true;
        const matchesOwnerOccupancy = filters.ownerOccupancy ? listingOwnerOccupancy === filters.ownerOccupancy : true;
        const matchesNeighborInfo = filters.neighborInfo ? listingNeighborInfo === filters.neighborInfo : true;

        return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesType &&
               matchesUtilityPaymentType && matchesOwnerOccupancy && matchesNeighborInfo;
    });

    return (
        <div className={styles.listingsPage}>
            <div className={styles.pageContentWrapper}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Усі оголошення</h1>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Пошук за ключовими словами..."
                            value={filters.search}
                            name="search"
                            onChange={handleFilterChange}
                            className={styles.searchInput}
                        />
                        <button className={styles.searchButtonHeader} onClick={handleSearchButtonClick}>
                            Шукати
                        </button>
                    </div>
                </div>

                <FilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                />

                <div className={styles.listingsGrid}>
                    {filteredListings.length > 0 ? (
                        filteredListings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))
                    ) : (
                        <p className={styles.noListings}>Оголошень за вашими критеріями не знайдено.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListingsPage;