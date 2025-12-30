
import React, { useState, useEffect, useCallback } from 'react';
import { X, Facebook, Linkedin, Mail, Link as LinkIcon, Check } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectUrl: string;
    projectTitle: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, projectUrl, projectTitle }) => {
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();

    const handleCopyLink = useCallback(() => {
        navigator.clipboard.writeText(projectUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        });
    }, [projectUrl]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const encodedUrl = encodeURIComponent(projectUrl);
    const encodedTitle = encodeURIComponent(`Lihat proyek luar biasa dari Viniela: ${projectTitle}`);

    const shareOptions = [
        { name: 'Copy Link', icon: copied ? <Check className="text-green-500" /> : <LinkIcon />, action: handleCopyLink, isAction: true, label: copied ? t('share.copied') : t('share.copy') },
        { name: 'Facebook', icon: <Facebook />, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, label: t('share.facebook') },
        { name: 'LinkedIn', icon: <Linkedin />, href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`, label: t('share.linkedin') },
        { name: 'Email', icon: <Mail />, href: `mailto:?subject=${encodedTitle}&body=Saya rasa Anda akan menyukai proyek ini: ${projectUrl}`, label: t('share.email') },
    ];
    
    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
        >
            <div 
                className="bg-viniela-cream dark:bg-gray-800 w-full max-w-md rounded-xl shadow-2xl p-6 relative"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 id="share-modal-title" className="text-2xl font-serif font-bold text-viniela-brown dark:text-viniela-cream">{t('share.title')}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-viniela-dark-cream dark:hover:bg-gray-700" aria-label={t('share.close')}>
                        <X size={24} className="text-viniela-brown/70 dark:text-viniela-cream/70"/>
                    </button>
                </div>
                
                <div className="space-y-3">
                    {shareOptions.map(option => {
                        const commonClasses = "w-full flex items-center gap-4 p-3 rounded-lg text-left font-semibold transition-colors duration-200";
                        if ('isAction' in option) {
                            return (
                                <button key={option.name} onClick={option.action} className={`${commonClasses} ${copied ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-viniela-dark-cream/60 hover:bg-viniela-dark-cream dark:bg-gray-700/60 dark:hover:bg-gray-700 text-viniela-brown dark:text-viniela-cream'}`}>
                                    {option.icon}
                                    <span>{option.label}</span>
                                </button>
                            );
                        }
                        return (
                            <a 
                                key={option.name}
                                href={option.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${commonClasses} bg-viniela-dark-cream/60 hover:bg-viniela-dark-cream dark:bg-gray-700/60 dark:hover:bg-gray-700 text-viniela-brown dark:text-viniela-cream`}
                                aria-label={option.label}
                            >
                                {option.icon}
                                <span>{option.name}</span>
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
