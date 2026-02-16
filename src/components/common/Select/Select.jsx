import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import styles from './Select.module.css';

const Select = ({ options = [], value, onChange, name, placeholder = "Оберіть..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

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
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={!selectedOption ? styles.placeholder : ''}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <FiChevronDown className={`${styles.arrowIcon} ${isOpen ? styles.rotated : ''}`} />
            </div>

            {isOpen && (
                <ul className={styles.optionsList} role="listbox">
                    {options.map((opt) => (
                        <li 
                            key={opt.value} 
                            className={`${styles.optionItem} ${String(value) === String(opt.value) ? styles.active : ''}`}
                            onClick={() => handleSelect(opt.value)}
                            role="option"
                            aria-selected={String(value) === String(opt.value)}
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