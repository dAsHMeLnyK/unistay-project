import React from 'react';
import styles from './FilterBar.module.css';

const FilterBar = ({ filters, onFilterChange, onResetFilters, showFilters, onToggleFilters }) => {
    return (
        <div className={styles.filterBarContainer}>
            <div className={styles.headerControls}>
                <button className={styles.filterToggleButton} onClick={onToggleFilters}>
                    Фільтри {showFilters ? '▲' : '▼'}
                </button>
            </div>

            {showFilters && (
                <div className={styles.filtersSection}>
                    <div className={styles.filterRow}>
                        {/* Тип житла: House=0, Apartment=1, Room=2 */}
                        <div className={styles.formGroup}>
                            <label htmlFor="type">Тип житла</label>
                            <select id="type" name="type" value={filters.type} onChange={onFilterChange}>
                                <option value="">Усі</option>
                                <option value="1">Квартира</option>
                                <option value="2">Кімната</option>
                                <option value="0">Будинок</option>
                            </select>
                        </div>

                        {/* Комунальні: Included=0, Separate=1 */}
                        <div className={styles.formGroup}>
                            <label htmlFor="utilityPaymentType">Комунальні послуги</label>
                            <select id="utilityPaymentType" name="utilityPaymentType" value={filters.utilityPaymentType} onChange={onFilterChange}>
                                <option value="">Усі</option>
                                <option value="1">Окремо</option>
                                <option value="0">Включено</option>
                            </select>
                        </div>

                        {/* Власники: With=0, Without=1 */}
                        <div className={styles.formGroup}>
                            <label htmlFor="ownerOccupancy">Власники</label>
                            <select id="ownerOccupancy" name="ownerOccupancy" value={filters.ownerOccupancy} onChange={onFilterChange}>
                                <option value="">Усі</option>
                                <option value="0">З господарями</option>
                                <option value="1">Без господарів</option>
                            </select>
                        </div>

                        {/* Сусіди: With=0, Without=1 */}
                        <div className={styles.formGroup}>
                            <label htmlFor="neighborInfo">Сусіди</label>
                            <select id="neighborInfo" name="neighborInfo" value={filters.neighborInfo} onChange={onFilterChange}>
                                <option value="">Усі</option>
                                <option value="0">З сусідами</option>
                                <option value="1">Без сусідів</option>
                            </select>
                        </div>

                        <div className={`${styles.formGroup} ${styles.priceRangeGroup}`}>
                            <label>Ціна</label>
                            <div className={styles.priceInputs}>
                                <input type="number" name="minPrice" value={filters.minPrice} onChange={onFilterChange} placeholder="Від" />
                                <input type="number" name="maxPrice" value={filters.maxPrice} onChange={onFilterChange} placeholder="До" />
                            </div>
                        </div>
                    </div>
                    <div className={styles.filterButtons}>
                        <button className={styles.resetButton} onClick={onResetFilters}>Скинути фільтри</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterBar;