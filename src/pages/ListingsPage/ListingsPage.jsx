import React, { useState, useEffect, useMemo } from 'react';
import ListingCard from '../../components/listings/ListingCard/ListingCard';
import FilterBar from '../../components/filters/FilterBar/FilterBar';
import LoadingPage from '../LoadingPage/LoadingPage';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import { useListings } from '../../context/ListingContext';
import { ListingService } from '../../api/services/ListingService';
import { FiSearch } from 'react-icons/fi';
import styles from './ListingsPage.module.css';

const ListingsPage = () => {
    const { listings, fetchListings, loading, error } = useListings();
    const [displayListings, setDisplayListings] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    
    const [filters, setFilters] = useState({
        search: '', type: '', utilityPaymentType: '', 
        ownerOccupancy: '', neighborInfo: '',       
        minPrice: '', maxPrice: '',
    });
    const [showFilters, setShowFilters] = useState(true);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

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

    const handleSearchButtonClick = async () => {
        if (!filters.search.trim()) {
            setDisplayListings(listings);
            return;
        }
        setIsSearching(true);
        try {
            const searchResults = await ListingService.search(filters.search);
            setDisplayListings(searchResults);
        } catch (err) {
            console.error("Search error:", err);
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
            {/* НОВИЙ УНІФІКОВАНИЙ ЗАГОЛОВОК */}
            <header className="page-header">
                <h1 className="page-title">Усі оголошення</h1>
                <p className="page-subtitle">Знайдіть ідеальне житло в Острозі серед актуальних пропозицій</p>
                
                <div className={styles.searchBar}>
                    <Input
                        icon={FiSearch}
                        type="text"
                        placeholder="Пошук за ключовими словами..."
                        value={filters.search}
                        name="search"
                        onChange={handleFilterChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchButtonClick()}
                        className={styles.customSearchInput}
                    />
                    <Button 
                        variant="primary" // Вказуємо явно варіант
                        className={styles.customSearchButton}
                        onClick={handleSearchButtonClick}
                        disabled={isSearching}
                    >
                        {isSearching ? '...' : 'Шукати'}
                    </Button>
                </div>
            </header>

            <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
            />

            {error ? (
                <div className={styles.errorContainer}>
                    <p className="page-subtitle">Помилка завантаження: {error}</p>
                    <Button variant="outline" onClick={() => fetchListings()}>
                        Спробувати ще раз
                    </Button>
                </div>
            ) : (
                <div className="cards-grid">
                    {filteredListings.length > 0 ? (
                        filteredListings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))
                    ) : (
                        <div className={styles.noResults}>
                            <p className="page-subtitle">
                                {isSearching ? 'Шукаємо...' : 'На жаль, оголошень не знайдено за вашим запитом.'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ListingsPage;