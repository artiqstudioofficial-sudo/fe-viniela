import React, { ReactNode } from 'react';
import { ApartmentPackage } from '../types';
import { useTranslatedApartmentPackage } from '../hooks/useTranslatedApartmentPackage';

interface TranslatedApartmentPackageProps {
    pkg: ApartmentPackage;
    setApartmentPackages: React.Dispatch<React.SetStateAction<ApartmentPackage[]>>;
    children: (translatedPkg: ApartmentPackage, isLoading: boolean) => ReactNode;
}

const TranslatedApartmentPackage: React.FC<TranslatedApartmentPackageProps> = ({ pkg, setApartmentPackages, children }) => {
    const { translatedPkg, isLoading } = useTranslatedApartmentPackage(pkg, setApartmentPackages);
    return <>{children(translatedPkg, isLoading)}</>;
};

export default TranslatedApartmentPackage;
