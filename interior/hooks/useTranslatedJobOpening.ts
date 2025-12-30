import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useTranslation } from './useTranslation';
import { JobOpening } from '../types';
import { batchTranslate } from '../utils/translator';
import { Language } from '../contexts/LanguageContext';

export const useTranslatedJobOpening = (
    originalJob: JobOpening, 
    setJobOpenings?: Dispatch<SetStateAction<JobOpening[]>>
) => {
    const { language } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [translatedJob, setTranslatedJob] = useState(originalJob);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const updateJob = async () => {
            if (language === 'id' || !originalJob) {
                setTranslatedJob(originalJob);
                setIsLoading(false);
                return;
            }

            const fieldsToTranslate: (keyof JobOpening)[] = ['title', 'description', 'location', 'type'];
            
            const mapToTranslatedJob = (job: JobOpening, lang: Language): JobOpening => {
                 const newJob = { ...job };
                for (const field of fieldsToTranslate) {
                    const key = `${field}_${lang}` as keyof JobOpening;
                    if ((newJob as any)[key]) {
                        (newJob as any)[field] = (newJob as any)[key];
                    }
                }
                return newJob;
            }

            const needsTranslation = fieldsToTranslate.some(field => 
                (originalJob as any)[field] && !(originalJob as any)[`${field}_${language}`]
            );

            if (!needsTranslation) {
                // FIX: Cast language to Language as useTranslation returns it as string
                setTranslatedJob(mapToTranslatedJob(originalJob, language as Language));
                setIsLoading(false);
                return;
            }

            if (!setJobOpenings) {
                 setTranslatedJob(originalJob); // Fallback
                 setIsLoading(false);
                 return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const textsToTranslateMap: { field: keyof JobOpening, text: string }[] = [];
                fieldsToTranslate.forEach(field => {
                    const text = originalJob[field] as string;
                    if (text) {
                        textsToTranslateMap.push({ field, text });
                    }
                });

                const texts = textsToTranslateMap.map(item => item.text);

                if (texts.length > 0) {
                    // FIX: Cast language to Language for compatibility with batchTranslate
                    const translatedTexts = await batchTranslate(texts, language as Language);
                    
                    const newTranslations: Partial<JobOpening> = {};
                    translatedTexts.forEach((translatedText, index) => {
                        const originalField = textsToTranslateMap[index].field;
                        const key = `${originalField}_${language}` as keyof JobOpening;
                        (newTranslations as any)[key] = translatedText;
                    });
                    
                    setJobOpenings(prevJobs => prevJobs.map(j =>
                        j.id === originalJob.id ? { ...j, ...newTranslations } : j
                    ));
                    
                } else {
                    setIsLoading(false);
                }

            } catch (err) {
                console.error("Failed to translate job opening:", err);
                setError("Failed to load translation.");
                setTranslatedJob(originalJob); // Fallback
                setIsLoading(false);
            }
        };

        updateJob();

    }, [language, originalJob, setJobOpenings]);

    return { translatedJob, isLoading, error };
};