import React, { useState } from 'react';
import { ContactSubmission } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface ContactProps {
    onContactSubmit: (submission: Omit<ContactSubmission, 'id' | 'timestamp'>) => void;
}

const Contact: React.FC<ContactProps> = ({ onContactSubmit }) => {
    const { t } = useTranslation();
    useDocumentTitle(t('nav.kontak'));
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validate = () => {
        const newErrors = { name: '', email: '', phone: '', message: '' };
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = t('contact.form.error.name');
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = t('contact.form.error.email');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('contact.form.error.email_format');
            isValid = false;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = t('contact.form.error.phone');
            isValid = false;
        }

        if (!formData.message.trim()) {
            newErrors.message = t('contact.form.error.message');
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onContactSubmit(formData);
            setIsSubmitted(true);
        }
    };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-viniela-brown dark:text-viniela-cream bg-viniela-dark-cream dark:bg-gray-800">
        <div className="absolute inset-0 z-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop" alt="Elegant desk with contact tools" className="w-full h-full object-cover"/>
        </div>
        <div className="relative z-10 p-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-4">{t('contact.hero.title')}</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">{t('contact.hero.subtitle')}</p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-3xl font-serif font-bold mb-6">{t('contact.form.title')}</h2>
                     {isSubmitted ? (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300 p-6 rounded-md" role="alert" aria-live="assertive">
                            <h3 className="font-bold text-lg">{t('contact.form.success.title')}</h3>
                            <p>{t('contact.form.success.body')}</p>
                            <button 
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setFormData({ name: '', email: '', phone: '', message: '' });
                                }}
                                className="mt-4 bg-viniela-gold text-white font-bold py-2 px-4 rounded-md hover:bg-viniela-gold/90 transition-colors"
                            >
                                {t('contact.form.success.button')}
                            </button>
                        </div>
                    ) : (
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div>
                            <label htmlFor="name" className="sr-only">{t('contact.form.placeholder.name')}</label>
                            <input 
                                type="text" 
                                name="name"
                                id="name"
                                placeholder={t('contact.form.placeholder.name')} 
                                value={formData.name}
                                onChange={handleChange}
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? "name-error" : undefined}
                                className={`w-full p-3 rounded-md border ${errors.name ? 'border-red-500' : 'border-viniela-dark-cream dark:border-gray-600'} focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                            />
                            {errors.name && <p id="name-error" className="text-red-600 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                             <label htmlFor="email" className="sr-only">{t('contact.form.placeholder.email')}</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                placeholder={t('contact.form.placeholder.email')}
                                value={formData.email}
                                onChange={handleChange}
                                 aria-invalid={!!errors.email}
                                 aria-describedby={errors.email ? "email-error" : undefined}
                                className={`w-full p-3 rounded-md border ${errors.email ? 'border-red-500' : 'border-viniela-dark-cream dark:border-gray-600'} focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                            />
                            {errors.email && <p id="email-error" className="text-red-600 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                             <label htmlFor="phone" className="sr-only">{t('contact.form.placeholder.phone')}</label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                placeholder={t('contact.form.placeholder.phone')}
                                value={formData.phone}
                                onChange={handleChange}
                                 aria-invalid={!!errors.phone}
                                 aria-describedby={errors.phone ? "phone-error" : undefined}
                                className={`w-full p-3 rounded-md border ${errors.phone ? 'border-red-500' : 'border-viniela-dark-cream dark:border-gray-600'} focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                            />
                            {errors.phone && <p id="phone-error" className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                            <label htmlFor="message" className="sr-only">{t('contact.form.placeholder.message')}</label>
                            <textarea
                                name="message"
                                id="message"
                                placeholder={t('contact.form.placeholder.message')}
                                rows={6}
                                value={formData.message}
                                onChange={handleChange}
                                 aria-invalid={!!errors.message}
                                 aria-describedby={errors.message ? "message-error" : undefined}
                                className={`w-full p-3 rounded-md border ${errors.message ? 'border-red-500' : 'border-viniela-dark-cream dark:border-gray-600'} focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                            ></textarea>
                            {errors.message && <p id="message-error" className="text-red-600 text-sm mt-1">{errors.message}</p>}
                        </div>
                        <button type="submit" className="w-full bg-viniela-gold text-white font-bold py-3 px-8 rounded-md hover:bg-viniela-gold/90 transition-colors duration-300">
                            {t('btn.submit_now')}
                        </button>
                    </form>
                    )}
                </div>
                <div>
                    <h2 className="text-3xl font-serif font-bold mb-6">{t('contact.info.title')}</h2>
                    <div className="space-y-4 text-lg text-viniela-brown/80 dark:text-viniela-cream/80">
                        <p><strong>{t('contact.info.address')}:</strong><br/>{t('footer.address')}</p>
                        <p><strong>{t('contact.info.email')}:</strong><br/><a href="mailto:Vinieladesign@gmail.com" className="text-viniela-gold hover:underline">Vinieladesign@gmail.com</a></p>
                        <p><strong>{t('contact.info.phone')}:</strong><br/>
                            <a href="tel:087789227225" className="text-viniela-gold hover:underline block">0877 – 8922 – 7225</a>
                            <a href="tel:087789228500" className="text-viniela-gold hover:underline block">0877 – 8922 – 8500</a>
                        </p>
                    </div>
                    <div className="mt-8 h-80 rounded-lg overflow-hidden shadow-md">
                         <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.741750731694!2d106.72895489999999!3d-6.1653288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f79197e2c4fb%3A0xd797787cc64542d8!2sViniela%20Design%20Interior!5e0!3m2!1sid!2sid!4v1763441687216!5m2!1sid!2sid" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen={false} 
                            loading="lazy" 
                            title="Location of Viniela Interior on Google Maps"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="dark:grayscale dark:invert">
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;