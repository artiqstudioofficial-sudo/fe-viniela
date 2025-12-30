
import React, { useState, useEffect } from 'react';
import { InteriorDesign, DesignStyle } from '../types';
import { UploadCloud, X, LoaderCircle, CheckCircle2, Layout, Images } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import DynamicListInput from './DynamicListInput';
import PriceInput from './PriceInput';

interface InteriorDesignFormProps {
    designToEdit: InteriorDesign | null;
    onSave: (design: InteriorDesign) => void;
    onCancel: () => void;
}

const STYLES: DesignStyle[] = ['Japandi', 'Scandinavian', 'Modern', 'Industrial', 'Minimalis', 'Classic', 'Vintage'];
const INCLUDE_OPTIONS = ['Gambar 3D Render', 'Rencana Anggaran Biaya (RAB)', 'Gambar Kerja Teknis', 'Link Pembelian Produk', 'Gambar Arsitektur', 'Laporan Struktur'];

const initialFormData: Omit<InteriorDesign, 'id'> = {
    category: 'Interior',
    title: '',
    style: 'Japandi',
    price: '',
    area: '',
    imageUrl: '',
    galleryUrls: [],
    description: '',
    includes: ['Gambar 3D Render', 'Rencana Anggaran Biaya (RAB)', 'Gambar Kerja Teknis', 'Link Pembelian Produk'],
    specs: '',
};

const InteriorDesignForm: React.FC<InteriorDesignFormProps> = ({ designToEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [isCompressing, setIsCompressing] = useState(false);
    const [isGalleryCompressing, setIsGalleryCompressing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (designToEdit) setFormData(designToEdit);
        else setFormData(initialFormData);
    }, [designToEdit]);

    const compressImage = async (file: File) => {
        const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1600, useWebWorker: true, fileType: 'image/webp' };
        return await imageCompression(file, options);
    };

    const handleMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsCompressing(true);
            const compressed = await compressImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
                setIsCompressing(false);
            };
            reader.readAsDataURL(compressed);
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // FIXED: Added explicit File[] type casting to solve 'unknown' argument error on line 70
        const files = Array.from(e.target.files || []) as File[];
        if (files.length === 0) return;

        setIsGalleryCompressing(true);
        const compressedBase64: string[] = [];

        for (const file of files) {
            try {
                // FIXED: 'file' is now correctly inferred as 'File' due to the cast above
                const compressed = await compressImage(file);
                const reader = new FileReader();
                const b64 = await new Promise<string>((resolve) => {
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(compressed);
                });
                compressedBase64.push(b64);
            } catch (err) {
                console.error("Gallery compress error:", err);
            }
        }

        setFormData(prev => ({
            ...prev,
            galleryUrls: [...(prev.galleryUrls || []), ...compressedBase64]
        }));
        setIsGalleryCompressing(false);
    };

    const handleRemoveGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            galleryUrls: prev.galleryUrls.filter((_, i) => i !== index)
        }));
    };

    const handleToggleInclude = (option: string) => {
        setFormData(prev => ({
            ...prev,
            includes: prev.includes.includes(option) 
                ? prev.includes.filter(i => i !== option)
                : [...prev.includes, option]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSuccess(true);
        setTimeout(() => {
            onSave({ ...formData, id: designToEdit?.id || `design-${Date.now()}` } as InteriorDesign);
            setIsSuccess(false);
        }, 1200);
    };

    const inputClass = "w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-900 dark:text-white transition-all text-sm font-medium";
    const labelClass = "block text-xs font-black text-viniela-brown/70 dark:text-viniela-cream/70 mb-2 uppercase tracking-widest";

    return (
        <div className="relative animate-fade-in">
            {isSuccess && (
                <div className="absolute inset-0 z-50 bg-white/95 dark:bg-gray-800/95 flex flex-col items-center justify-center rounded-2xl text-center p-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
                    <h3 className="text-2xl font-serif font-bold">Desain Berhasil Disimpan</h3>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl space-y-8 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between border-b pb-6">
                    <div className="flex items-center gap-4">
                        <Layout className="text-viniela-gold" size={28} />
                        <h2 className="text-2xl font-serif font-bold">{designToEdit ? 'Edit Desain' : 'Tambah Desain Baru'}</h2>
                    </div>
                    <div className="flex gap-2 p-1 bg-gray-50 dark:bg-gray-950 rounded-xl">
                        {(['Rumah', 'Interior'] as const).map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setFormData({...formData, category: cat})}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.category === cat ? 'bg-viniela-gold text-white shadow-md' : 'text-viniela-gray'}`}
                            >
                                {cat === 'Rumah' ? 'Desain Rumah' : 'Interior'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className={labelClass}>Foto Utama Desain (Cover)</label>
                            {formData.imageUrl ? (
                                <div className="relative aspect-video group">
                                    <img src={formData.imageUrl} className="w-full h-full object-cover rounded-xl border" alt="Main" />
                                    <button type="button" onClick={() => setFormData({...formData, imageUrl: ''})} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={16}/></button>
                                </div>
                            ) : (
                                <label className={`flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 ${isCompressing ? 'opacity-50' : ''}`}>
                                    {isCompressing ? <LoaderCircle className="animate-spin text-viniela-gold" /> : <><UploadCloud size={32} className="text-viniela-gray mb-2"/><span className="text-xs font-bold text-viniela-gray">Unggah Foto Utama</span></>}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleMainImage} />
                                </label>
                            )}
                        </div>

                        {/* Gallery Section */}
                        <div>
                            <label className={labelClass}>Galeri Foto Tambahan</label>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {formData.galleryUrls.map((url, idx) => (
                                    <div key={idx} className="relative aspect-square group">
                                        <img src={url} className="w-full h-full object-cover rounded-lg border" alt={`Gallery ${idx}`} />
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveGalleryImage(idx)} 
                                            className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12}/>
                                        </button>
                                    </div>
                                ))}
                                <label className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-xl cursor-pointer hover:bg-viniela-gold/5 ${isGalleryCompressing ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {isGalleryCompressing ? <LoaderCircle className="animate-spin text-viniela-gold w-6 h-6" /> : <Images size={20} className="text-viniela-gray" />}
                                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Tentang Desain</label>
                            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputClass} h-32`} placeholder="Ceritakan konsep dan keunggulan desain ini..." required />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Nama Desain</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="cth: Modern Japandi Room" required />
                            </div>
                            <div>
                                <label className={labelClass}>Gaya Interior</label>
                                <select value={formData.style} onChange={e => setFormData({...formData, style: e.target.value as DesignStyle})} className={inputClass}>
                                    {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Estimasi Luas Area</label>
                                <div className="relative">
                                    <input type="number" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className={`${inputClass} pr-12`} placeholder="24" required />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-viniela-gray">m²</span>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Harga Desain (IDR)</label>
                                <PriceInput value={formData.price} onChange={val => setFormData({...formData, price: val})} placeholder="2.500.000" required />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Yang Didapat Pembeli</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {INCLUDE_OPTIONS.map(opt => (
                                    <button key={opt} type="button" onClick={() => handleToggleInclude(opt)} className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all ${formData.includes.includes(opt) ? 'bg-viniela-gold/10 border-viniela-gold text-viniela-gold' : 'border-gray-100 dark:border-gray-700 opacity-60'}`}>
                                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${formData.includes.includes(opt) ? 'bg-viniela-gold border-viniela-gold text-white' : 'border-gray-300'}`}>
                                            {formData.includes.includes(opt) && <CheckCircle2 size={12}/>}
                                        </div>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <DynamicListInput label="Spesifikasi / Item Utama" value={formData.specs} onChange={val => setFormData({...formData, specs: val})} placeholder="cth: Parquet Wood Flooring" />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                    <button type="button" onClick={onCancel} className="px-6 py-3 font-bold text-sm rounded-xl border hover:bg-gray-50">Batal</button>
                    <button type="submit" className="px-10 py-3 bg-viniela-gold text-white font-bold text-sm rounded-xl shadow-lg">Simpan Desain</button>
                </div>
            </form>
        </div>
    );
};

export default InteriorDesignForm;
