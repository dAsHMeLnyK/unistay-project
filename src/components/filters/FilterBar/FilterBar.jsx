// src/components/filters/FilterBar/FilterBar.jsx
import React from 'react';
import styles from './FilterBar.module.css';

const FilterBar = ({ filters, onFilterChange, onResetFilters, showFilters, onToggleFilters }) => {
    return (
        <div className={styles.filterBarContainer}>
            <div className={styles.headerControls}>
                <button
                    className={styles.filterToggleButton}
                    onClick={onToggleFilters} // Використовуємо onToggleFilters з пропсів
                >
                    Фільтри {showFilters ? '▲' : '▼'}
                </button>
                {/* Заголовок "Усі оголошення" буде в ListingsPage */}
            </div>

            {showFilters && (
                <div className={styles.filtersSection}>
                    <div className={styles.filterRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="type">Тип житла</label>
                            <select
                                id="type"
                                name="type"
                                value={filters.type}
                                onChange={onFilterChange}
                            >
                                <option value="">Усі</option>
                                <option value="Квартира">Квартира</option>
                                <option value="Кімната">Кімната</option>
                                <option value="Будинок">Будинок</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="utilityPaymentType">Комунальні послуги</label>
                            <select
                                id="utilityPaymentType"
                                name="utilityPaymentType"
                                value={filters.utilityPaymentType}
                                onChange={onFilterChange}
                            >
                                <option value="">Усі</option>
                                <option value="separate">Окремо</option>
                                <option value="included">Включено в ціну</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="ownerOccupancy">Власники</label>
                            <select
                                id="ownerOccupancy"
                                name="ownerOccupancy"
                                value={filters.ownerOccupancy}
                                onChange={onFilterChange}
                            >
                                <option value="">Усі</option>
                                <option value="with-owner">З господарями</option>
                                <option value="without-owner">Без господарів</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="neighborInfo">Сусіди</label>
                            <select
                                id="neighborInfo"
                                name="neighborInfo"
                                value={filters.neighborInfo}
                                onChange={onFilterChange}
                            >
                                <option value="">Усі</option>
                                <option value="with-roommates">З сусідами</option>
                                <option value="no-roommates">Без сусідів</option>
                            </select>
                        </div>

                        <div className={`${styles.formGroup} ${styles.priceRangeGroup}`}>
                            <label>Ціна</label>
                            <div className={styles.priceInputs}>
                                <input
                                    type="number"
                                    id="minPrice"
                                    name="minPrice"
                                    value={filters.minPrice}
                                    onChange={onFilterChange}
                                    placeholder="Від"
                                    min="0"
                                />
                                <input
                                    type="number"
                                    id="maxPrice"
                                    name="maxPrice"
                                    value={filters.maxPrice}
                                    onChange={onFilterChange}
                                    placeholder="До"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.filterButtons}>
                        {/* Кнопка "Шукати" тут не потрібна, оскільки фільтрація відбувається одразу при зміні */}
                        <button className={styles.resetButton} onClick={onResetFilters}>
                            Скинути фільтри
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterBar;