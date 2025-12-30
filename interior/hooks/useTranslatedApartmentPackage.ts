import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useTranslation } from './useTranslation';
import { ApartmentPackage } from '../types';
import { batchTranslate } from '../utils/translator';
import { Language } from '../contexts/LanguageContext';

export const useTranslatedApartmentPackage = (
    originalPkg: ApartmentPackage, 
    setApartmentPackages?: Dispatch<SetStateAction<ApartmentPackage[]>>
) => {
    const { language } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [translatedPkg, setTranslatedPkg] = useState(originalPkg);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const updatePackage = async () => {
            if (language === 'id' || !originalPkg) {
                setTranslatedPkg(originalPkg);
                setIsLoading(false);
                return;
            }

            const fieldsToTranslate: (keyof ApartmentPackage)[] = ['name', 'includes', 'appliances', 'excludes'];
            
            const mapToTranslatedPackage = (pkg: ApartmentPackage, lang: Language): ApartmentPackage => {
                 const newPkg = { ...pkg };
                for (const field of fieldsToTranslate) {
                    const key = `${field}_${lang}` as keyof ApartmentPackage;
                    if ((newPkg as any)[key]) {
                        (newPkg as any)[field] = (newPkg as any)[key];
                    }
                }
                return newPkg;
            }

            const needsTranslation = fieldsToTranslate.some(field => 
                (originalPkg as any)[field] && !(originalPkg as any)[`${field}_${language}`]
            );

            if (!needsTranslation) {
                // FIX: Cast language to Language as useTranslation returns it as string
                setTranslatedPkg(mapToTranslatedPackage(originalPkg, language as Language));
                setIsLoading(false);
                return;
            }

            if (!setApartmentPackages) {
                 setTranslatedPkg(originalPkg); // Fallback
                 setIsLoading(false);
                 return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const textsToTranslateMap: { field: keyof ApartmentPackage, text: string }[] = [];
                fieldsToTranslate.forEach(field => {
                    const text = originalPkg[field] as string;
                    if (text) {
                        textsToTranslateMap.push({ field, text });
                    }
                });

                const texts = textsToTranslateMap.map(item => item.text);

                if (texts.length > 0) {
                    // FIX: Cast language to Language for compatibility with batchTranslate
                    const translatedTexts = await batchTranslate(texts, language as Language);
                    
                    const newTranslations: Partial<ApartmentPackage> = {};
                    translatedTexts.forEach((translatedText, index) => {
                        const originalField = textsToTranslateMap[index].field;
                        const key = `${originalField}_${language}` as keyof ApartmentPackage;
                        (newTranslations as any)[key] = translatedText;
                    });
                    
                    setApartmentPackages(prevPkgs => prevPkgs.map(p =>
                        p.id === originalPkg.id ? { ...p, ...newTranslations } : p
                    ));
                    
                } else {
                    setIsLoading(false);
                }

            } catch (err) {
                console.error("Failed to translate apartment package:", err);
                setError("Failed to load translation.");
                setTranslatedPkg(originalPkg); // Fallback
                setIsLoading(false);
            }
        };

        updatePackage();

    }, [language, originalPkg, setApartmentPackages]);

    return { translatedPkg, isLoading, error };
};