import React, { ReactNode } from 'react';
import { Project } from '../types';
import { useTranslatedProject } from '../hooks/useTranslatedProject';

interface TranslatedContentProps {
    project: Project;
    setProjects?: React.Dispatch<React.SetStateAction<Project[]>>;
    children: (translatedProject: Project, isLoading: boolean) => ReactNode;
}

const TranslatedContent: React.FC<TranslatedContentProps> = ({ project, setProjects, children }) => {
    const { translatedProject, isLoading } = useTranslatedProject(project, setProjects);
    return <>{children(translatedProject, isLoading)}</>;
};

export const Shimmer: React.FC<{ className?: string }> = ({ className = 'h-6 w-3/4' }) => (
  <div className={`bg-gray-300 dark:bg-gray-700 rounded animate-pulse ${className}`}></div>
);

export default TranslatedContent;