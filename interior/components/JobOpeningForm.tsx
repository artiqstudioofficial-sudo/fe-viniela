
import React, { useState, useEffect } from 'react';
import { JobOpening } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { CheckCircle2 } from 'lucide-react';

interface JobOpeningFormProps {
    openingToEdit: JobOpening | null;
    onSave: (job: JobOpening) => void;
    onCancel: () => void;
}

const initialFormData: Omit<JobOpening, 'id'> = {
    title: '',
    description: '',
    location: '',
    type: ''
};

const JobOpeningForm: React.FC<JobOpeningFormProps> = ({ openingToEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [isSuccess, setIsSuccess] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (openingToEdit) {
            setFormData(openingToEdit);
        } else {
            setFormData(initialFormData);
        }
    }, [openingToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsSuccess(true);
        // FIX: Explicitly typed jobData as JobOpening to avoid assignment errors
        const jobData: JobOpening = {
            ...formData,
            id: openingToEdit?.id || `job-${Date.now()}`
        } as JobOpening;

        setTimeout(() => {
            onSave(jobData);
            setIsSuccess(false);
        }, 1500);
    };

    const formFieldClass = "w-full p-3 rounded-md border border-viniela-dark-cream dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400";
    const labelClass = "block text-sm font-medium text-viniela-brown/80 dark:text-viniela-cream/80 mb-1";

    return (
        <div className="relative">
            {isSuccess && (
                <div className="absolute inset-0 z-50 bg-white/90 dark:bg-gray-800/90 flex flex-col items-center justify-center rounded-lg animate-fade-in">
                    <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
                    <h3 className="text-2xl font-serif font-bold text-viniela-brown dark:text-viniela-cream">{t('admin.notification.save_success')}</h3>
                </div>
            )}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-serif font-bold">{openingToEdit ? t('form.job.title.edit') : t('form.job.title.add')}</h2>
                
                <div>
                    <label htmlFor="title" className={labelClass}>{t('form.job.label.title')}</label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={formFieldClass} required />
                </div>

                <div>
                    <label htmlFor="description" className={labelClass}>{t('form.job.label.description')}</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={5} className={formFieldClass} required></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="location" className={labelClass}>{t('form.job.label.location')}</label>
                        <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className={formFieldClass} required />
                    </div>
                    <div>
                        <label htmlFor="type" className={labelClass}>{t('form.job.label.type')}</label>
                        <input type="text" name="type" id="type" value={formData.type} onChange={handleChange} className={formFieldClass} required placeholder="e.g., Penuh Waktu, Kontrak" />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 font-bold py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        {t('btn.cancel')}
                    </button>
                    <button type="submit" className="bg-viniela-gold text-white font-bold py-2 px-6 rounded-md hover:bg-viniela-gold/90 transition-colors">
                        {t('btn.save')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobOpeningForm;
