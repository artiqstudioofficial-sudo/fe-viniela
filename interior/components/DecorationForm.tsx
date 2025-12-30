
import React, { useState, useEffect } from 'react';
import { DecorationProduct } from '../types';
import { UploadCloud, X, LoaderCircle, CheckCircle2, Palette, Images } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import PriceInput from './PriceInput';

interface DecorationFormProps {
    productToEdit: DecorationProduct | null;
    onSave: (product: DecorationProduct) => void;
    onCancel: () => void;
}

const initialFormData: Omit<DecorationProduct, 'id'> = {
    title: '',
    category: '',
    price: '',
    imageUrl: '',
    galleryUrls: [],
    description: '',
    isCustom: false,
    material: '',
    dimensions: ''
};

const DecorationForm: React.FC<DecorationFormProps> = ({ productToEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [isCompressing, setIsCompressing] = useState(false);
    const [isGalleryCompressing, setIsGalleryCompressing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (productToEdit) setFormData(productToEdit);
        else setFormData(initialFormData);
    }, [productToEdit]);

    const compressImage = async (file: File) => {
        const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1200, useWebWorker: true, fileType: 'image/webp' };
        return await imageCompression(file, options);
    };

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        // FIXED: Added explicit File[] type casting to solve 'unknown' argument error on line 65
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSuccess(true);
        setTimeout(() => {
            onSave({ ...formData, id: productToEdit?.id || `dec-${Date.now()}` } as DecorationProduct);
            setIsSuccess(false);
        }, 1000);
    };

    const inputClass = "w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-900 dark:text-white transition-all text-sm font-medium";
    const labelClass = "block text-xs font-black text-viniela-brown/70 dark:text-viniela-cream/70 mb-2 uppercase tracking-widest";

    return (
        <div className="relative animate-fade-in">
            {isSuccess && (
                <div className="absolute inset-0 z-50 bg-white/95 dark:bg-gray-800/95 flex flex-col items-center justify-center rounded-2xl text-center p-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
                    <h3 className="text-2xl font-serif font-bold">Produk Berhasil Disimpan</h3>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl space-y-8 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4 border-b pb-6">
                    <Palette className="text-viniela-gold" size={28} />
                    <h2 className="text-2xl font-serif font-bold">{productToEdit ? 'Edit Produk Dekorasi' : 'Tambah Dekorasi Baru'}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className={labelClass}>Foto Utama Produk</label>
                            {formData.imageUrl ? (
                                <div className="relative aspect-square group max-w-sm mx-auto">
                                    <img src={formData.imageUrl} className="w-full h-full object-cover rounded-xl border" alt="Prod" />
                                    <button type="button" onClick={() => setFormData({...formData, imageUrl: ''})} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"><X size={16}/></button>
                                </div>
                            ) : (
                                <label className={`flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 max-w-sm mx-auto ${isCompressing ? 'opacity-50' : ''}`}>
                                    {isCompressing ? <LoaderCircle className="animate-spin text-viniela-gold" /> : <><UploadCloud size={32} className="text-viniela-gray mb-2"/><span className="text-xs font-bold text-viniela-gray">Unggah Visual Utama</span></>}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
                                </label>
                            )}
                        </div>

                        {/* Gallery Section */}
                        <div>
                            <label className={labelClass}>Galeri Foto Pendukung</label>
                            <div className="grid grid-cols-4 gap-3">
                                {(formData.galleryUrls || []).map((url, idx) => (
                                    <div key={idx} className="relative aspect-square group">
                                        <img src={url} className="w-full h-full object-cover rounded-lg border" alt={`Gallery ${idx}`} />
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveGalleryImage(idx)} 
                                            className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={10}/>
                                        </button>
                                    </div>
                                ))}
                                <label className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-xl cursor-pointer hover:bg-viniela-gold/5 ${isGalleryCompressing ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {isGalleryCompressing ? <LoaderCircle className="animate-spin text-viniela-gold w-5 h-5" /> : <Images size={18} className="text-viniela-gray" />}
                                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className={labelClass}>Nama Produk</label>
                            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="cth: Abstract Canvas Painting" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Kategori</label>
                                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={inputClass} placeholder="cth: Vas / Lukisan" required />
                            </div>
                            <div>
                                <label className={labelClass}>Harga (IDR)</label>
                                <PriceInput value={formData.price} onChange={val => setFormData({...formData, price: val})} placeholder="450.000" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Material Utama</label>
                                <input type="text" value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} className={inputClass} placeholder="cth: Kuningan / Clay" />
                            </div>
                            <div>
                                <label className={labelClass}>Dimensi (L x P x T)</label>
                                <input type="text" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} className={inputClass} placeholder="cth: 20x20x40 cm" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                            <input type="checkbox" id="isCustom" checked={formData.isCustom} onChange={e => setFormData({...formData, isCustom: e.target.checked})} className="w-5 h-5 accent-viniela-gold" />
                            <label htmlFor="isCustom" className="text-xs font-bold cursor-pointer">Produk ini dapat di-custom (Ukuran/Warna)</label>
                        </div>
                        <div>
                            <label className={labelClass}>Deskripsi Produk</label>
                            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputClass} h-24`} placeholder="Detail produk..." />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                    <button type="button" onClick={onCancel} className="px-6 py-3 font-bold text-sm rounded-xl border">Batal</button>
                    <button type="submit" className="px-10 py-3 bg-viniela-gold text-white font-bold text-sm rounded-xl shadow-lg">Simpan Produk</button>
                </div>
            </form>
        </div>
    );
};

export default DecorationForm;
