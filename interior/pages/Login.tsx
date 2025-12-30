
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ArrowLeft } from 'lucide-react';

interface LoginProps {
    onLogin: (user: string, pass: string) => boolean;
    isAuthenticated: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();
    useDocumentTitle(t('login.title'));

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = onLogin(username, password);
        if (success) {
            navigate('/admin');
        } else {
            setError(t('login.error'));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-viniela-dark-cream/50 dark:bg-black/50 p-6">
            <div className="w-full max-w-md mb-8">
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 text-viniela-brown/70 dark:text-viniela-cream/70 hover:text-viniela-gold transition-colors font-bold text-sm uppercase tracking-widest"
                >
                    <ArrowLeft size={18} />
                    {t('btn.back_to_website')}
                </Link>
            </div>
            
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10">
                    <h1 className="text-3xl font-serif font-bold text-center text-viniela-brown dark:text-viniela-cream mb-2">{t('login.title')}</h1>
                    <p className="text-center text-viniela-gray dark:text-viniela-light-gray mb-8">{t('login.subtitle')}</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="sr-only">{t('login.placeholder.username')}</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder={t('login.placeholder.username')}
                                required
                                className="w-full p-4 rounded-lg border border-viniela-dark-cream dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                autoComplete="username"
                            />
                        </div>
                        <div>
                            <label htmlFor="password-input" className="sr-only">{t('login.placeholder.password')}</label>
                             <input
                                id="password-input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('login.placeholder.password')}
                                required
                                className="w-full p-4 rounded-lg border border-viniela-dark-cream dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                autoComplete="current-password"
                            />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-viniela-gold text-white font-bold py-4 px-8 rounded-lg hover:bg-viniela-gold/90 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {t('login.button')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
