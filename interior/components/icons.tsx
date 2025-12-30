import React from 'react';
import { 
    Home, 
    Building, 
    Building2, 
    Coffee, 
    Rocket, 
    Lightbulb, 
    CheckCircle, 
    Quote, 
    Sparkles,
    Pencil,
    PlusCircle
} from 'lucide-react';

// Default size (24x24) icons, more elegant stroke
export const HomeIcon = () => <Home strokeWidth={1.5} />;
export const BuildingIcon = () => <Building strokeWidth={1.5} />;
export const OfficeIcon = () => <Building2 strokeWidth={1.5} />;
export const CafeIcon = () => <Coffee strokeWidth={1.5} />;
export const SparklesIcon = () => <Sparkles strokeWidth={1.5} />;

// Custom size icons, matching original intent
export const RocketIcon = () => <Rocket className="w-8 h-8" strokeWidth={1.5} />;
export const LightbulbIcon = () => <Lightbulb className="w-8 h-8" strokeWidth={1.5} />;

// Custom size and stroke for smaller, bolder look
export const CheckCircleIcon = () => <CheckCircle className="w-4 h-4" strokeWidth={2.5} />;

// Special filled icon
export const QuoteIcon = () => <Quote className="w-12 h-12 text-viniela-gold/20" fill="currentColor" strokeWidth={0} />;

// Custom social icon
export const TiktokIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        className="w-5 h-5"
    >
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.98-1.59-2.01-2.18-4.7-1.8-7.18.38-2.44 1.99-4.63 4.12-5.74 2.03-1.06 4.38-1.05 6.38-.01.53.27 1.04.58 1.52.92.01-2.19-.01-4.38-.01-6.57 0-.2-.01-.39-.01-.58v.01Z"/>
    </svg>
);


// Re-export for flexible use in admin panel
export { Pencil, PlusCircle };