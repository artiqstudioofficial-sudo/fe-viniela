
import { useState, useEffect } from 'react';
import { Project } from '../types';

export const useTranslatedProject = (originalProject: Project, setProjects?: any) => {
    // Karena sekarang fokus 1 bahasa (Indonesia), langsung kembalikan data asli
    const translatedProject = originalProject;
    const isLoading = false;
    const error = null;

    return { translatedProject, isLoading, error };
};
