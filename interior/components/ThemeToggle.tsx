import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
    isHeaderSolid: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isHeaderSolid }) => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const iconColorClass = isHeaderSolid
        ? 'text-viniela-brown dark:text-viniela-cream'
        : 'text-white [text-shadow:0_1px_3px_rgb(0_0_0_/_0.4)]';

    return (
        <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-viniela-gold transition-colors duration-300 ${isHeaderSolid ? 'hover:bg-viniela-dark-cream/60 dark:hover:bg-gray-700/60' : 'hover:bg-white/20'} ${isHeaderSolid ? 'focus:ring-offset-viniela-cream dark:focus:ring-offset-viniela-brown' : 'focus:ring-offset-transparent'}`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? (
                <Moon className={`w-5 h-5 ${iconColorClass}`} />
            ) : (
                <Sun className={`w-5 h-5 ${iconColorClass}`} />
            )}
        </button>
    );
};

export default ThemeToggle;
