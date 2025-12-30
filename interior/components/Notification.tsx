import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 transition-all duration-300 animate-fade-in ${
            type === 'success' 
                ? 'bg-white dark:bg-gray-800 border-green-500' 
                : 'bg-white dark:bg-gray-800 border-red-500'
        }`}>
            <div className="flex-shrink-0">
                {type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                )}
            </div>
            <p className="font-medium text-sm text-viniela-brown dark:text-viniela-cream">
                {message}
            </p>
            <button 
                onClick={onClose} 
                className="ml-2 text-viniela-gray hover:text-viniela-brown dark:text-viniela-light-gray dark:hover:text-viniela-cream transition-colors"
                aria-label="Close notification"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Notification;