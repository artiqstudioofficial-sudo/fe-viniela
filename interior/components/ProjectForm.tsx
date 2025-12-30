
import React, { useState, useEffect } from 'react';
import { Project, ProjectCategory } from '../types';
import { UploadCloud, X, LoaderCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import imageCompression from 'browser-image-compression';

interface ProjectFormProps {
    projectToEdit: Project | null;
    onSave: (project: Project) => void;
    onCancel: () => void;
}

const initialFormData: Omit<Project, 'id'> = {
    title: '',
    location: '',
    tagline: '',
    category: ProjectCategory.Rumah,
    imageUrl: '',
    description: '',
    clientTestimonial: '',
    beforeImageUrl: '',
    afterImageUrl: '',
};

const FileInput: React.FC<{
    label: string;
    name: string;
    value: string | undefined;
    onFileChange: (name: string, value: string) => void;
    onClear: (name: string) => void;
    required?: boolean;
}> = ({ label, name, value, onFileChange, onClear, required }) => {
    const { t } = useTranslation();
    const [isCompressing, setIsCompressing] = useState(false);
    
    const processFile = async (file: File) => {
        setIsCompressing(true);
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: 'image/webp'
        };

        try {
            const compressedFile = await imageCompression(file, options);
            const reader = new FileReader();
            reader.onloadend = () => {
                onFileChange(name, reader.result as string);
                setIsCompressing(false);
            };
            reader.readAsDataURL(compressedFile);
        } catch (error) {
            console.error("Compression failed:", error);
            const reader = new FileReader();
            reader.onloadend = () => {
                onFileChange(name, reader.result as string);
                setIsCompressing(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => e.preventDefault();
    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
             processFile(file);
        }
    }
    
    return (
        <div>
            <label className="block text-sm font-medium text-viniela-brown/80 dark:text-viniela-cream/80 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
            {value ? (
                <div className="relative w-full h-40 group">
                    <img src={value} alt="Preview" className="w-full h-full object-contain rounded-md border border-viniela-dark-cream dark:border-gray-600 bg-viniela-dark-cream/30 dark:bg-gray-700/30" />
                    <button type="button" onClick={() => onClear(name)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75 transition-colors opacity-0 group-hover:opacity-100">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <label onDragOver={handleDragOver} onDrop={handleDrop} className={`relative flex justify-center items-center w-full h-40 px-4 transition-colors duration-300 bg-white dark:bg-gray-700 border-2 border-dashed rounded-md appearance-none ${isCompressing ? 'cursor-wait opacity-70' : 'cursor-pointer hover:border-viniela-gold'} border-viniela-dark-cream dark:border-gray-600`}>
                    {isCompressing ? (
                        <div className="flex flex-col items-center gap-2">
                             <LoaderCircle className="w-8 h-8 animate-spin text-viniela-gold" />
                             <span className="text-sm font-medium text-viniela-brown dark:text-viniela-cream">Mengompresi gambar...</span>
                        </div>
                    ) : (
                        <span className="flex items-center space-x-2 text-center">
                            <UploadCloud className="w-6 h-6 text-viniela-gray dark:text-viniela-light-gray" />
                            <span className="font-medium text-viniela-gray dark:text-viniela-light-gray text-sm">{t('form.project.upload_prompt')} <span className="text-viniela-gold underline">{t('form.project.upload_prompt_link')}</span></span>
                        </span>
                    )}
                    <input type="file" name={name} onChange={handleFileSelect} className="hidden" accept="image/*" required={required} disabled={isCompressing}/>
                </label>
            )}
        </div>
    );
};

const ProjectForm: React.FC<ProjectFormProps> = ({ projectToEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState({ imageUrl: '' });
    const [isSuccess, setIsSuccess] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (projectToEdit) {
            setFormData(projectToEdit);
        } else {
            setFormData(initialFormData);
        }
    }, [projectToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'imageUrl') {
            setFormErrors(prev => ({...prev, imageUrl: ''}));
        }
    };
    
    const handleClearFile = (name: string) => {
        setFormData(prev => ({...prev, [name]: ''}));
    };

    const validateForm = () => {
        let isValid = true;
        if (!formData.imageUrl) {
            setFormErrors(prev => ({...prev, imageUrl: t('form.project.error.main_image')}));
            isValid = false;
        }
        return isValid;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSuccess(true);
        // FIX: Explicitly typed projectData as Project to avoid assignment errors
        const projectData: Project = {
            ...formData,
            id: projectToEdit?.id || `${formData.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
        } as Project;
        
        // Short delay for the success visual before actually calling onSave
        setTimeout(() => {
            onSave(projectData);
            setIsSuccess(false);
        }, 1500);
    };

    const formFieldClass = "w-full p-3 rounded-md border border-viniela-dark-cream dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400";
    const labelClass = "block text-sm font-medium text-viniela-brown/80 dark:text-viniela-cream/80 mb-1";
    
    return (
        <div className="relative">
            {isSuccess && (
                <div className="absolute inset-0 z-50 bg-white/90 dark:bg-gray-800/90 flex flex-col items-center justify-center rounded-lg animate-fade-in">
                    <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
                    <h3 className="text-2xl font-serif font-bold text-viniela-brown dark:text-viniela-cream">{t('admin.notification.save_success')}</h3>
                </div>
            )}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6" noValidate>
                <h2 className="text-2xl font-serif font-bold">{projectToEdit ? t('form.project.title.edit') : t('form.project.title.add')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="title" className={labelClass}>{t('form.project.label.title')}</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className={formFieldClass} required />
                    </div>
                    <div>
                        <label htmlFor="location" className={labelClass}>{t('form.project.label.location')}</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} className={formFieldClass} required />
                    </div>
                     <div>
                        <label htmlFor="tagline" className={labelClass}>{t('form.project.label.tagline')}</label>
                        <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className={formFieldClass} required />
                    </div>
                     <div>
                        <label htmlFor="category" className={labelClass}>{t('form.project.label.category')}</label>
                        <select name="category" value={formData.category} onChange={handleChange} className={formFieldClass} required>
                            {Object.values(ProjectCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
                
                <div>
                    <FileInput 
                        label={t('form.project.label.main_image')}
                        name="imageUrl"
                        value={formData.imageUrl}
                        onFileChange={handleFileChange}
                        onClear={handleClearFile}
                        required={!projectToEdit}
                    />
                    {formErrors.imageUrl && <p className="text-red-600 text-sm mt-1">{formErrors.imageUrl}</p>}
                </div>

                <div>
                    <label htmlFor="description" className={labelClass}>{t('form.project.label.description')}</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={formFieldClass} required></textarea>
                </div>
                <div>
                    <label htmlFor="clientTestimonial" className={labelClass}>{t('form.project.label.testimonial')}</label>
                    <textarea name="clientTestimonial" value={formData.clientTestimonial} onChange={handleChange} rows={3} className={formFieldClass} required></textarea>
                </div>
                
                <fieldset className="border border-viniela-dark-cream dark:border-gray-600 p-4 rounded-md">
                    <legend className="px-2 font-semibold">{t('form.project.fieldset.optional_images')}</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileInput 
                            label={t('form.project.label.before_image')}
                            name="beforeImageUrl"
                            value={formData.beforeImageUrl}
                            onFileChange={handleFileChange}
                            onClear={handleClearFile}
                        />
                         <FileInput 
                            label={t('form.project.label.after_image')}
                            name="afterImageUrl"
                            value={formData.afterImageUrl}
                            onFileChange={handleFileChange}
                            onClear={handleClearFile}
                        />
                    </div>
                </fieldset>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 font-bold py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        {t('btn.cancel')}
                    </button>
                    <button type="submit" className="bg-viniela-gold text-white font-bold py-2 px-6 rounded-md hover:bg-viniela-gold/90 transition-colors">
                        {t('btn.save')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;
