import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import styles from './Select.module.css';

const Select = ({ options = [], value, onChange, name, placeholder = "Оберіть..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    // Знаходимо поточну обрану опцію
    const selectedOption = options.find(opt => String(opt.value) === String(value));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange({ target: { name, value: val } });
        setIsOpen(false);
    };

    return (
        <div className={styles.customSelectContainer} ref={selectRef}>
            <div 
                className={`${styles.selectHeader} ${isOpen ? styles.open : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={!selectedOption ? styles.placeholder : ''}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <FiChevronDown className={`${styles.arrowIcon} ${isOpen ? styles.rotated : ''}`} />
            </div>

            {isOpen && (
                <ul className={styles.optionsList}>
                    {options.map((opt) => (
                        <li 
                            key={opt.value} 
                            className={`${styles.optionItem} ${String(value) === String(opt.value) ? styles.active : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Select;