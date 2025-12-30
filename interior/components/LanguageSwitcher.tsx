import React, { useContext, useState, useEffect, useRef } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Globe, Check } from 'lucide-react';

const languages = [
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
];

interface LanguageSwitcherProps {
  isHeaderSolid: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isHeaderSolid }) => {
    const { language, setLanguage } = useContext(LanguageContext);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const selectLanguage = (langCode: 'id' | 'en' | 'zh') => {
        setLanguage(langCode);
        setIsOpen(false);
    };
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);


    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={toggleDropdown}
                className={`flex items-center gap-1.5 font-sans font-medium transition-colors duration-300 ${isHeaderSolid ? 'text-viniela-brown/80 hover:text-viniela-brown' : 'text-white [text-shadow:0_1px_3px_rgb(0_0_0_/_0.4)] hover:text-white'}`}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label="Select language"
            >
                <Globe size={18} />
                <span>{language.toUpperCase()}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white rounded-md shadow-lg z-50 py-1" role="menu">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => selectLanguage(lang.code as any)}
                            className="w-full text-left px-4 py-2 text-sm text-viniela-brown hover:bg-viniela-dark-cream flex items-center justify-between"
                            role="menuitem"
                        >
                            {lang.name}
                            {language === lang.code && <Check size={16} className="text-viniela-gold" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;