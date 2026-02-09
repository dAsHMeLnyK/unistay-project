import React from 'react';
import styles from './FilterBar.module.css';
import Button from '../../common/Button/Button';
import Select from '../../common/Select/Select';
import { 
    FiFilter, FiHome, FiZap, FiUsers, 
    FiUserCheck, FiChevronDown, FiChevronUp, FiRefreshCw 
} from 'react-icons/fi';

const FilterBar = ({ filters, onFilterChange, onResetFilters, showFilters, onToggleFilters }) => {
    
    const options = {
        type: [
            { value: "", label: "Усі типи" },
            { value: "1", label: "Квартира" },
            { value: "2", label: "Кімната" },
            { value: "0", label: "Будинок" }
        ],
        utility: [
            { value: "", label: "Усі варіанти" },
            { value: "1", label: "Окремо" },
            { value: "0", label: "Включено" }
        ],
        owners: [
            { value: "", label: "Усі" },
            { value: "0", label: "З господарями" },
            { value: "1", label: "Без господарів" }
        ],
        neighbors: [
            { value: "", label: "Усі" },
            { value: "0", label: "З сусідами" },
            { value: "1", label: "Без сусідів" }
        ]
    };

    return (
        <div className={styles.filterBarContainer}>
            <div className={styles.headerControls}>
                <Button 
                    variant={showFilters ? 'primary' : 'outline'} 
                    onClick={onToggleFilters}
                    className={styles.filterToggleButton}
                >
                    <FiFilter />
                    Фільтри {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                </Button>
            </div>

            {showFilters && (
                <div className={styles.filtersSection}>
                    <div className={styles.filterRow}>
                        <div className={styles.formGroup}>
                            <label><FiHome className={styles.labelIcon} /> Тип житла</label>
                            <Select name="type" value={filters.type} onChange={onFilterChange} options={options.type} />
                        </div>

                        <div className={styles.formGroup}>
                            <label><FiZap className={styles.labelIcon} /> Комунальні</label>
                            <Select name="utilityPaymentType" value={filters.utilityPaymentType} onChange={onFilterChange} options={options.utility} />
                        </div>

                        <div className={styles.formGroup}>
                            <label><FiUserCheck className={styles.labelIcon} /> Власники</label>
                            <Select name="ownerOccupancy" value={filters.ownerOccupancy} onChange={onFilterChange} options={options.owners} />
                        </div>

                        <div className={styles.formGroup}>
                            <label><FiUsers className={styles.labelIcon} /> Сусіди</label>
                            <Select name="neighborInfo" value={filters.neighborInfo} onChange={onFilterChange} options={options.neighbors} />
                        </div>

                        <div className={`${styles.formGroup} ${styles.priceRangeGroup}`}>
                            <label>Ціна (грн)</label>
                            <div className={styles.priceInputs}>
                                <input type="number" name="minPrice" value={filters.minPrice} onChange={onFilterChange} placeholder="Від" className={styles.priceInput} />
                                <input type="number" name="maxPrice" value={filters.maxPrice} onChange={onFilterChange} placeholder="До" className={styles.priceInput} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.filterButtons}>
                        <Button variant="outline" onClick={onResetFilters} className={styles.resetButton}>
                            <FiRefreshCw /> Скинути фільтри
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterBar;