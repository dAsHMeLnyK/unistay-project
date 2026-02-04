import React, { useState, useEffect, useMemo } from 'react';
import ListingCard from '../../components/listings/ListingCard/ListingCard';
import FilterBar from '../../components/filters/FilterBar/FilterBar';
import LoadingPage from '../LoadingPage/LoadingPage';
import { useListings } from '../../context/ListingContext';
import { ListingService } from '../../api/services/ListingService';
import styles from './ListingsPage.module.css';

const ListingsPage = () => {
    const { listings, fetchListings, loading, error } = useListings();
    const [displayListings, setDisplayListings] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    
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

    // Первинне завантаження
    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    // Синхронізація локального списку з глобальним
    useEffect(() => {
        setDisplayListings(listings);
    }, [listings]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleResetFilters = () => {
        setFilters({
            search: '', type: '', utilityPaymentType: '',
            ownerOccupancy: '', neighborInfo: '',
            minPrice: '', maxPrice: '',
        });
        setDisplayListings(listings);
    };

    // ФУНКЦІЯ ПОШУКУ
    const handleSearchButtonClick = async () => {
        if (!filters.search.trim()) {
            setDisplayListings(listings); // Якщо порожньо — показуємо все
            return;
        }

        setIsSearching(true);
        try {
            const searchResults = await ListingService.search(filters.search);
            setDisplayListings(searchResults);
        } catch (err) {
            console.error("Помилка пошуку:", err);
        } finally {
            setIsSearching(false);
        }
    };

    const filteredListings = useMemo(() => {
        return displayListings.filter((listing) => {
            const price = parseFloat(listing.price);
            const min = filters.minPrice ? parseFloat(filters.minPrice) : -Infinity;
            const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;

            const matchesPrice = price >= min && price <= max;
            const matchesType = filters.type !== '' ? String(listing.type) === filters.type : true;
            
            const matchesUtility = filters.utilityPaymentType !== '' 
                ? listing.communalServices?.some(s => String(s) === filters.utilityPaymentType)
                : true;

            const matchesOwners = filters.ownerOccupancy !== '' 
                ? String(listing.owners) === filters.ownerOccupancy 
                : true;

            const matchesNeighbors = filters.neighborInfo !== '' 
                ? String(listing.neighbours) === filters.neighborInfo 
                : true;

            return matchesPrice && matchesType && matchesUtility && matchesOwners && matchesNeighbors;
        });
    }, [displayListings, filters]);

    if (loading) return <LoadingPage />;

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
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchButtonClick()}
                            className={styles.searchInput}
                        />
                        <button 
                            className={styles.searchButtonHeader} 
                            onClick={handleSearchButtonClick}
                            disabled={isSearching}
                        >
                            {isSearching ? '...' : 'Шукати'}
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

                {error ? (
                    <div className={styles.errorContainer}>
                        <p className={styles.error}>Помилка завантаження: {error}</p>
                        <button onClick={() => fetchListings()} className={styles.retryButton}>
                            Спробувати ще раз
                        </button>
                    </div>
                ) : (
                    <div className={styles.listingsGrid}>
                        {filteredListings.length > 0 ? (
                            filteredListings.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                <p className={styles.noListings}>
                                    {isSearching ? 'Шукаємо...' : 'Оголошень не знайдено.'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingsPage;