import React, { ReactNode } from 'react';
import { JobOpening } from '../types';
import { useTranslatedJobOpening } from '../hooks/useTranslatedJobOpening';

interface TranslatedJobOpeningProps {
    job: JobOpening;
    setJobOpenings?: React.Dispatch<React.SetStateAction<JobOpening[]>>;
    children: (translatedJob: JobOpening, isLoading: boolean) => ReactNode;
}

const TranslatedJobOpening: React.FC<TranslatedJobOpeningProps> = ({ job, setJobOpenings, children }) => {
    const { translatedJob, isLoading } = useTranslatedJobOpening(job, setJobOpenings);
    return <>{children(translatedJob, isLoading)}</>;
};

export default TranslatedJobOpening;
