import React, { useState, useEffect } from 'react';
import { ApartmentPackage, PackageConsultation } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { X } from 'lucide-react';

interface ConsultationModalProps {
    pkg: ApartmentPackage | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<PackageConsultation, 'id' | 'timestamp'>) => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ pkg, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (isOpen) {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', phone: '' });
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pkg) return;

        onSubmit({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            packageId: pkg.id,
            packageName: pkg.name,
            packagePrice: pkg.price,
        });
        setIsSubmitted(true);
    };

    const formatPrice = (price: string) => {
        const number = parseInt(price, 10);
        if (isNaN(number)) return price;
        return new Intl.NumberFormat('id-ID').format(number);
    };

    if (!isOpen || !pkg) return null;

    const inputClass = "w-full p-3 rounded-md border border-viniela-dark-cream dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400";

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-modal-title"
        >
            <div 
                className="bg-viniela-cream dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-2xl p-8 relative"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-viniela-dark-cream dark:hover:bg-gray-700 transition-colors"
                    aria-label={t('btn.close')}
                >
                    <X size={20} className="text-viniela-brown dark:text-viniela-cream" />
                </button>

                {isSubmitted ? (
                     <div className="text-center py-8">
                        <h3 className="text-2xl font-serif font-bold text-viniela-brown dark:text-viniela-cream mb-2">{t('contact.form.success.title')}</h3>
                        <p className="text-viniela-gray dark:text-viniela-light-gray mb-6">{t('contact.form.success.body')}</p>
                        <button onClick={onClose} className="bg-viniela-gold text-white font-bold py-2 px-6 rounded-md hover:bg-viniela-gold/90 transition-colors">
                            {t('btn.close')}
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 id="consultation-modal-title" className="text-2xl font-serif font-bold text-viniela-brown dark:text-viniela-cream mb-1">{t('consultation.title')}</h2>
                        <p className="text-sm text-viniela-gray dark:text-viniela-light-gray mb-6">{t('consultation.subtitle')}</p>
                        
                        <div className="bg-viniela-dark-cream/50 dark:bg-gray-700/50 p-4 rounded-lg mb-6 border border-viniela-dark-cream dark:border-gray-600">
                            <p className="text-xs uppercase font-bold text-viniela-gray dark:text-viniela-light-gray mb-1">{t('consultation.package_selected')}</p>
                            <p className="font-serif font-bold text-lg text-viniela-brown dark:text-viniela-cream">{pkg.name}</p>
                            <p className="text-viniela-gold font-bold">Rp {formatPrice(pkg.price)}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="cons-name" className="block text-sm font-medium text-viniela-brown dark:text-viniela-cream mb-1">{t('contact.form.placeholder.name')}</label>
                                <input 
                                    id="cons-name" 
                                    type="text" 
                                    required 
                                    className={inputClass} 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder={t('contact.form.placeholder.name')}
                                />
                            </div>
                            <div>
                                <label htmlFor="cons-email" className="block text-sm font-medium text-viniela-brown dark:text-viniela-cream mb-1">{t('contact.form.placeholder.email')}</label>
                                <input 
                                    id="cons-email" 
                                    type="email" 
                                    required 
                                    className={inputClass} 
                                    value={formData.email} 
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    placeholder={t('contact.form.placeholder.email')}
                                />
                            </div>
                            <div>
                                <label htmlFor="cons-phone" className="block text-sm font-medium text-viniela-brown dark:text-viniela-cream mb-1">{t('contact.form.placeholder.phone')} (WhatsApp)</label>
                                <input 
                                    id="cons-phone" 
                                    type="tel" 
                                    required 
                                    className={inputClass} 
                                    value={formData.phone} 
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>
                            
                            <div className="pt-2">
                                <button type="submit" className="w-full bg-viniela-gold text-white font-bold py-3 px-8 rounded-md hover:bg-viniela-gold/90 transition-colors duration-300 shadow-lg">
                                    {t('btn.submit_now')}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ConsultationModal;