
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SparklesIcon } from '../components/icons';
import ImageComparisonSlider from '../components/ImageComparisonSlider';
import { UploadCloud, X, LoaderCircle, Download, Wand2, Replace, Trash2, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import imageCompression from 'browser-image-compression';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

type EditMode = 'general' | 'replace' | 'remove';

const AIGenerator: React.FC = () => {
    const { t } = useTranslation();
    useDocumentTitle(t('nav.generator_ai'));
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [objectToChange, setObjectToChange] = useState<string>('');
    const [editMode, setEditMode] = useState<EditMode>('general');
    
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [activeGeneratedImage, setActiveGeneratedImage] = useState<string | null>(null);
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCompressing, setIsCompressing] = useState<boolean>(false);
    const [error, setError] = useState<{message: string, type: 'billing' | 'quota' | 'general' | 'auth'} | null>(null);
    
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const loadingIntervalRef = useRef<number | null>(null);

    const loadingMessages = [
        t('ai.loading.message1'),
        t('ai.loading.message2'),
        t('ai.loading.message3'),
        t('ai.loading.message4'),
        t('ai.loading.message5'),
    ];

    useEffect(() => {
        if (isLoading) {
            setLoadingMessage(loadingMessages[0]);
            let messageIndex = 0;
            loadingIntervalRef.current = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[messageIndex]);
            }, 3000);
        } else {
            if (loadingIntervalRef.current) {
                clearInterval(loadingIntervalRef.current);
                loadingIntervalRef.current = null;
            }
        }
        return () => {
            if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
        };
    }, [isLoading, t]);

    const handleImageUpload = async (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            if (!file.type.startsWith('image/')) {
                setError({message: t('ai.error.invalid_file'), type: 'general'});
                return;
            }
            
            setError(null);
            setGeneratedImages([]);
            setActiveGeneratedImage(null);
            setIsCompressing(true);

            const options = {
                maxSizeMB: 0.8, 
                maxWidthOrHeight: 1280, 
                useWebWorker: true,
                fileType: 'image/webp'
            };

            try {
                const compressedFile = await imageCompression(file, options);
                setImageFile(compressedFile);
                
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageBase64(reader.result as string);
                    setIsCompressing(false);
                };
                reader.readAsDataURL(compressedFile);
            } catch (err) {
                console.error("Compression error:", err);
                setImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageBase64(reader.result as string);
                    setIsCompressing(false);
                };
                reader.readAsDataURL(file);
            }
        }
    };
    
    const handleRemoveImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setImageFile(null);
        setImageBase64(null);
        setGeneratedImages([]);
        setActiveGeneratedImage(null);
        setError(null);
    };

    const handleGenerate = async () => {
        if (!imageFile || !imageBase64) {
            setError({message: t('ai.error.no_image'), type: 'general'});
            return;
        }

        let fullPrompt = '';
        switch (editMode) {
            case 'general':
                if (!prompt) { setError({message: t('ai.error.no_prompt.general'), type: 'general'}); return; }
                fullPrompt = `High quality interior design redesign. Instruction: ${prompt}. Cinematic lighting, professional photography, 8k resolution.`;
                break;
            case 'replace':
                if (!objectToChange || !prompt) { setError({message: t('ai.error.no_prompt.replace'), type: 'general'}); return; }
                fullPrompt = `Find "${objectToChange}" in the image and replace it with "${prompt}". Ensure consistent lighting and perspective with the rest of the room.`;
                break;
            case 'remove':
                if (!objectToChange) { setError({message: t('ai.error.no_prompt.remove'), type: 'general'}); return; }
                fullPrompt = `Remove the "${objectToChange}" from this interior image and fill the space realistically matching the surrounding environment.`;
                break;
        }

        setIsLoading(true);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { 
                    parts: [
                        { inlineData: { mimeType: imageFile.type, data: imageBase64.split(',')[1] } },
                        { text: fullPrompt }
                    ]
                }
            });

            const imagePartData = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData;

            if (imagePartData) {
                const imageUrl = `data:image/png;base64,${imagePartData.data}`;
                setGeneratedImages(prev => [imageUrl, ...prev]);
                setActiveGeneratedImage(imageUrl);
            } else {
                setError({message: t('ai.error.blocked'), type: 'general'});
            }

        } catch (err: any) {
            console.error("API Error Detail:", err);
            const msg = err.message || "";
            
            if (msg.includes('429') || msg.includes('QUOTA_EXCEEDED')) {
                setError({message: "Batas pemakaian API tercapai (Limit Quota). Silakan tunggu sebentar.", type: 'quota'});
            } else if (msg.includes('403') || msg.includes('PERMISSION_DENIED')) {
                setError({message: "Akses ditolak. Pastikan API Generative AI sudah diaktifkan di Google Cloud Console kamu.", type: 'auth'});
            } else if (msg.includes('BILLING') || msg.includes('payment')) {
                setError({message: "Masalah pada Billing GCP. Cek apakah kartu di Cloud Console masih aktif.", type: 'billing'});
            } else if (msg.includes('API_KEY_INVALID')) {
                setError({message: "API Key tidak valid atau salah format.", type: 'auth'});
            } else {
                setError({message: "Terjadi kesalahan sistem saat menghubungi Gemini. Coba lagi nanti.", type: 'general'});
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
        if (!activeGeneratedImage) return;
        const link = document.createElement('a');
        link.href = activeGeneratedImage;
        link.download = `viniela-ai-design-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => { setIsDragging(false); };
    const onDrop = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragging(false); handleImageUpload(e.dataTransfer.files); };

    const EditModeButton: React.FC<{ mode: EditMode, label: string, icon: React.ReactNode }> = ({ mode, label, icon }) => (
        <button onClick={() => setEditMode(mode)} disabled={isLoading} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${editMode === mode ? 'bg-viniela-gold text-white shadow' : 'bg-white dark:bg-gray-700 text-viniela-brown dark:text-viniela-cream hover:bg-viniela-cream dark:hover:bg-gray-600'}`}>
            {icon} {label}
        </button>
    );

    const isFormDisabled = isLoading || isCompressing;

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center text-center text-viniela-brown dark:text-viniela-cream bg-viniela-dark-cream dark:bg-gray-800">
                 <div className="absolute inset-0 z-0 opacity-20"><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1920&auto=format&fit=crop" alt="AI Generated Interior" className="w-full h-full object-cover"/></div>
                <div className="relative z-10 p-8">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-4">{t('ai.hero.title')}</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto">{t('ai.hero.subtitle')}</p>
                </div>
            </section>
            
            {/* Generator Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Input Column */}
                        <div className="bg-white/60 dark:bg-gray-800/60 p-8 rounded-lg shadow-md lg:sticky lg:top-28">
                            <div className="space-y-8">
                                <div className={`${isFormDisabled ? 'opacity-50' : ''}`}>
                                    <h3 className="text-2xl font-serif font-bold mb-4 flex items-center"><span className="bg-viniela-gold text-white rounded-full h-8 w-8 flex items-center justify-center mr-3">1</span>{t('ai.step1.title')}</h3>
                                    <label htmlFor="file_upload" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} className={`relative flex justify-center items-center w-full h-64 px-4 transition-colors duration-300 bg-white dark:bg-gray-700 border-2 border-dashed rounded-md appearance-none ${isFormDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${isDragging ? 'border-viniela-gold' : 'border-viniela-dark-cream dark:border-gray-600 hover:border-viniela-gold'}`}>
                                        {isCompressing ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <LoaderCircle className="w-8 h-8 animate-spin text-viniela-gold" />
                                                <span className="text-sm font-medium text-viniela-brown dark:text-viniela-cream">Mengoptimalkan gambar...</span>
                                            </div>
                                        ) : imageBase64 ? (
                                            <>
                                                <img src={imageBase64} alt="Preview" className="h-full w-full object-contain rounded-md" />
                                                <button onClick={handleRemoveImage} disabled={isFormDisabled} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75 transition-colors disabled:cursor-not-allowed" aria-label="Remove image"><X className="h-5 w-5" /></button>
                                            </>
                                        ) : (
                                            <span className="flex items-center space-x-2 text-center"><UploadCloud className="w-6 h-6 text-viniela-gray dark:text-viniela-light-gray" /><span className="font-medium text-viniela-gray dark:text-viniela-light-gray">{t('ai.step1.prompt')} <span className="text-viniela-gold underline">{t('ai.step1.prompt_link')}</span></span></span>
                                        )}
                                        <input id="file_upload" type="file" name="file_upload" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files)} disabled={isFormDisabled}/>
                                    </label>
                                </div>

                                <div className={`${isFormDisabled ? 'opacity-50' : ''}`}>
                                     <h3 className="text-2xl font-serif font-bold mb-4 flex items-center"><span className="bg-viniela-gold text-white rounded-full h-8 w-8 flex items-center justify-center mr-3">2</span>{t('ai.step2.title')}</h3>
                                     <div className="flex gap-2 bg-viniela-dark-cream dark:bg-gray-900/50 p-1 rounded-lg">
                                        <EditModeButton mode="general" label={t('ai.step2.mode.redesign')} icon={<Wand2 size={16}/>} />
                                        <EditModeButton mode="replace" label={t('ai.step2.mode.replace')} icon={<Replace size={16}/>} />
                                        <EditModeButton mode="remove" label={t('ai.step2.mode.remove')} icon={<Trash2 size={16}/>} />
                                     </div>
                                     <div className="mt-4 space-y-4">
                                        {editMode === 'replace' && (
                                            <input value={objectToChange} onChange={e => setObjectToChange(e.target.value)} placeholder={t('ai.step2.placeholder.replace')} className="w-full p-3 rounded-md border border-viniela-dark-cream dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 disabled:bg-gray-100" disabled={isFormDisabled}/>
                                        )}
                                        {editMode === 'remove' && (
                                            <input value={objectToChange} onChange={e => setObjectToChange(e.target.value)} placeholder={t('ai.step2.placeholder.remove')} className="w-full p-3 rounded-md border border-viniela-dark-cream dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 disabled:bg-gray-100" disabled={isFormDisabled}/>
                                        )}
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder={
                                                editMode === 'general' ? t('ai.step2.placeholder.general') :
                                                editMode === 'replace' ? t('ai.step2.placeholder.replace_with') :
                                                t('ai.step2.placeholder.additional')
                                            }
                                            rows={3}
                                            className="w-full p-3 rounded-md border border-viniela-dark-cream dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 disabled:bg-gray-100"
                                            disabled={isFormDisabled}
                                        />
                                     </div>
                                </div>
                                
                                <div>
                                     <h3 className="text-2xl font-serif font-bold mb-4 flex items-center"><span className="bg-viniela-gold text-white rounded-full h-8 w-8 flex items-center justify-center mr-3">3</span>{t('ai.step3.title')}</h3>
                                    <button onClick={handleGenerate} disabled={isFormDisabled} className="w-full bg-viniela-gold text-white font-bold py-4 px-8 rounded-md hover:bg-viniela-gold/90 transition-colors duration-300 flex items-center justify-center disabled:bg-viniela-gray disabled:cursor-not-allowed shadow-xl shadow-viniela-gold/20">
                                        {isLoading ? (<><LoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />{t('ai.button.processing')}</>) : (<><span className="mr-2"><SparklesIcon /></span>{generatedImages.length > 0 ? t('ai.button.generate_another') : t('ai.button.generate')}</>)}
                                    </button>
                                     {error && (
                                        <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 animate-fade-in ${error.type === 'general' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-800 border border-amber-100'}`}>
                                            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                                            <p className="text-sm font-medium">{error.message}</p>
                                        </div>
                                     )}
                                </div>
                            </div>
                        </div>

                        {/* Output Column */}
                         <div className="bg-viniela-dark-cream/50 dark:bg-viniela-brown p-8 rounded-lg shadow-inner flex flex-col justify-center items-center min-h-[500px] space-y-8 border border-gray-100 dark:border-viniela-gold/10">
                            {isLoading && (
                                <div className="text-center animate-fade-in"><div aria-live="polite" aria-atomic="true"><LoaderCircle className="animate-spin mx-auto h-12 w-12 text-viniela-gold" /><p className="mt-4 font-semibold text-viniela-brown dark:text-viniela-cream text-lg">{loadingMessage}</p><p className="text-sm text-viniela-gray dark:text-viniela-light-gray">{t('ai.loading.subtext')}</p></div></div>
                            )}
                            {!isLoading && activeGeneratedImage && imageBase64 && (
                                <div className="w-full animate-fade-in space-y-8">
                                    <div>
                                        <h3 className="text-3xl font-serif font-bold mb-4 text-center">{t('ai.results.before_after')}</h3>
                                        <ImageComparisonSlider before={imageBase64} after={activeGeneratedImage} />
                                    </div>
                                    
                                    {generatedImages.length > 1 && (
                                        <div>
                                            <h4 className="text-lg font-serif font-bold mb-3 text-center">{t('ai.results.variations')}</h4>
                                            <div className="flex justify-center gap-2 flex-wrap">
                                                {generatedImages.map((img, index) => (
                                                    <button 
                                                        key={index} 
                                                        onClick={() => setActiveGeneratedImage(img)} 
                                                        className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${activeGeneratedImage === img ? 'border-viniela-gold' : 'border-transparent hover:border-viniela-gold/50'}`}
                                                    >
                                                        <img src={img} alt={`Variation ${index + 1}`} className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <button onClick={handleDownload} className="bg-white text-viniela-brown dark:bg-gray-700 dark:text-viniela-cream font-bold py-3 px-6 rounded-md hover:bg-viniela-cream dark:hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center mx-auto shadow-sm border border-gray-100 dark:border-gray-600">
                                            <Download className="mr-2 h-5 w-5" /> {t('btn.download')}
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {!isLoading && !activeGeneratedImage && (
                                <div className="text-center text-viniela-brown/80 dark:text-viniela-cream/80 animate-fade-in">
                                    <div className="bg-viniela-gold/10 p-10 rounded-full mb-6 inline-block">
                                        <SparklesIcon />
                                    </div>
                                    <h3 className="text-2xl font-serif mt-4 font-bold">{t('ai.results.title')}</h3>
                                    <p className="max-w-xs mx-auto mt-2">{t('ai.results.subtitle')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AIGenerator;
