
import React, { useState, useEffect } from 'react';

interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: string;
    onChange: (value: string) => void;
}

const formatNumber = (value: string): string => {
    if (!value) return '';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const unformatNumber = (value: string): string => {
    return value.replace(/[^0-9]/g, '');
};

const PriceInput: React.FC<PriceInputProps> = ({ value, onChange, className, ...props }) => {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
        setDisplayValue(formatNumber(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = unformatNumber(e.target.value);
        onChange(rawValue);
    };

    const defaultClass = "w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-900 dark:text-white transition-all shadow-sm text-sm font-medium";

    return (
        <input
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            className={className || defaultClass}
            {...props}
        />
    );
};

export default PriceInput;
