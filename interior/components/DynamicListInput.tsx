
import React, { useState, useEffect } from 'react';
import { X, Plus, ListPlus } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface DynamicListInputProps {
    label: string;
    value: string; // Pipe-separated string
    onChange: (value: string) => void;
    placeholder?: string;
}

const DynamicListInput: React.FC<DynamicListInputProps> = ({ label, value, onChange, placeholder }) => {
    const [items, setItems] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        const propItems = value ? value.split('|').filter(item => item.trim() !== '') : [];
        if (JSON.stringify(propItems) !== JSON.stringify(items)) {
            setItems(propItems);
        }
    }, [value]);

    const handleAddItem = () => {
        if (inputValue.trim() !== '' && !items.includes(inputValue.trim())) {
            const newItems = [...items, inputValue.trim()];
            setItems(newItems);
            onChange(newItems.join('|'));
            setInputValue('');
        }
    };

    const handleRemoveItem = (itemToRemove: string) => {
        const newItems = items.filter(item => item !== itemToRemove);
        setItems(newItems);
        onChange(newItems.join('|'));
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddItem();
        }
    };

    const labelClass = "block text-xs font-black text-viniela-brown/60 dark:text-viniela-cream/60 mb-3 uppercase tracking-widest flex items-center gap-2";
    const inputClass = "flex-grow p-3.5 rounded-l-xl border border-r-0 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-900 dark:text-white transition-all text-sm";
    const buttonClass = "bg-viniela-gold text-white font-bold px-5 rounded-r-xl hover:bg-viniela-gold/90 transition-all flex items-center gap-2 active:scale-95 shadow-sm";


    return (
        <div className="group animate-fade-in">
            <label className={labelClass}>
                <ListPlus size={14} className="text-viniela-gold" />
                {label}
            </label>
            <div className="flex">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || "Ketik item dan klik tambah..."}
                    className={inputClass}
                />
                <button type="button" onClick={handleAddItem} className={buttonClass}>
                    <Plus size={18} />
                    <span className="hidden sm:inline">Tambah</span>
                </button>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
                {items.length === 0 ? (
                    <div className="w-full py-4 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                        <span className="text-[11px] font-bold text-viniela-gray uppercase tracking-widest italic opacity-60">Kosong</span>
                    </div>
                ) : (
                    items.map((item, index) => (
                        <div key={index} className="flex items-center bg-white dark:bg-gray-800 text-viniela-brown dark:text-viniela-cream text-[11px] font-bold px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm animate-fade-in hover:border-viniela-gold/30 transition-colors group/item">
                            <span>{item}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveItem(item)}
                                className="ml-2.5 text-gray-400 hover:text-red-500 transition-colors"
                                aria-label={`Hapus ${item}`}
                            >
                                <X size={14} strokeWidth={3} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DynamicListInput;
