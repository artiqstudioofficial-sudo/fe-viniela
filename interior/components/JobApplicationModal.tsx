import React, { useState, useEffect } from 'react';
import { JobOpening, JobApplication } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface JobApplicationModalProps {
    job: JobOpening | null;
    isOpen: boolean;
    onClose: () => void;
    onApply: (application: Omit<JobApplication, 'id' | 'timestamp'>) => void;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({ job, isOpen, onClose, onApply }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (isOpen) {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', message: '' });
            setCvFile(null);
        }
    }, [isOpen, job]);
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!job || !cvFile) return;

        onApply({
            jobTitle: job.title,
            name: formData.name,
            email: formData.email,
            message: formData.message,
            cvFileName: cvFile.name,
        });
        setIsSubmitted(true);
    };

    if (!isOpen || !job) return null;

    const inputClass = "w-full p-3 rounded-md border border-viniela-dark-cream dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400";

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                className="bg-viniela-cream dark:bg-gray-800 w-full max-w-3xl rounded-xl shadow-2xl p-8 relative"
                onClick={e => e.stopPropagation()}
            >
                {isSubmitted ? (
                     <div className="text-center py-12">
                        <h3 className="text-2xl font-serif font-bold text-viniela-brown dark:text-viniela-cream mb-2">{t('career.modal.success.title')}</h3>
                        <p className="text-viniela-gray dark:text-viniela-light-gray mb-6">{t('career.modal.success.body')}</p>
                        <button onClick={onClose} className="bg-viniela-gold text-white font-bold py-2 px-6 rounded-md hover:bg-viniela-gold/90 transition-colors">
                            {t('btn.close')}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-start pb-4 border-b border-viniela-brown/20 dark:border-viniela-cream/20 mb-6">
                            <div>
                                <h2 id="modal-title" className="text-2xl md:text-3xl font-serif font-bold text-viniela-brown dark:text-viniela-cream">{job.title}</h2>
                                <p className="text-viniela-gray dark:text-viniela-light-gray mt-1">{job.location} &bull; {job.type}</p>
                            </div>
                            <button onClick={onClose} className="bg-viniela-dark-cream dark:bg-gray-700 dark:hover:bg-gray-600 text-viniela-brown dark:text-viniela-cream font-semibold py-2 px-5 rounded-lg hover:bg-opacity-80 transition-colors" aria-label={t('btn.close')}>
                                {t('btn.close')}
                            </button>
                        </div>
                        
                        <p className="text-viniela-gray dark:text-viniela-light-gray mb-6">
                           {job.description}
                        </p>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="modal-name" className="sr-only">{t('contact.form.placeholder.name')}</label>
                                    <input id="modal-name" type="text" placeholder={t('contact.form.placeholder.name')} required className={inputClass} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div>
                                    <label htmlFor="modal-email" className="sr-only">{t('contact.form.placeholder.email')}</label>
                                    <input id="modal-email" type="email" placeholder={t('contact.form.placeholder.email')} required className={inputClass} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="modal-cv" className="block text-sm font-medium text-viniela-brown dark:text-viniela-cream mb-2">{t('career.modal.upload_cv')}</label>
                                <div className="flex items-center gap-4">
                                    <label htmlFor="modal-cv" className="cursor-pointer bg-viniela-dark-cream dark:bg-gray-700 dark:hover:bg-gray-600 text-viniela-brown dark:text-viniela-cream font-semibold py-2 px-5 rounded-lg hover:bg-opacity-80 transition-colors">
                                        {t('career.modal.choose_file')}
                                    </label>
                                    <span className="text-sm text-viniela-gray dark:text-viniela-light-gray">{cvFile ? cvFile.name : t('career.modal.no_file')}</span>
                                    <input 
                                        type="file" 
                                        id="modal-cv" 
                                        className="hidden"
                                        accept=".pdf,.doc,.docx" 
                                        required
                                        onChange={e => setCvFile(e.target.files ? e.target.files[0] : null)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="modal-message" className="sr-only">{t('career.modal.placeholder.message')}</label>
                                <textarea id="modal-message" placeholder={t('career.modal.placeholder.message')} rows={4} className={inputClass} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-viniela-brown dark:bg-viniela-gold text-white font-bold py-3 px-8 rounded-md hover:bg-viniela-brown/90 dark:hover:bg-viniela-gold/90 transition-colors duration-300 shadow-lg">
                                    {t('btn.submit')}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default JobApplicationModal;