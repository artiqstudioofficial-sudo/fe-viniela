
import { translations } from '../i18n/translations';

export const useTranslation = () => {
    const language = 'id'; // Konsisten menggunakan Indonesia
    
    const t = (key: string): string => {
        // Ambil dictionary bahasa yang dipilih
        const dictionary = (translations as any)[language];
        
        // Cek apakah key ada di dictionary
        if (dictionary && dictionary[key]) {
            return dictionary[key];
        }
        
        // Log untuk membantu debugging jika ada kunci yang hilang
        console.warn(`Translation key missing: ${key}`);
        
        // Kembalikan key asli jika tidak ditemukan
        return key;
    };

    return { t, language };
};
