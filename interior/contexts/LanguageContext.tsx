import React, { createContext, useState, ReactNode } from 'react';

export type Language = 'id' | 'en' | 'zh';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
    language: 'id',
    setLanguage: () => {},
});

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('id');

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};