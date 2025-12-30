
import React, { useState, useEffect } from 'react';
import { ApartmentPackage, PackageCategory } from '../types';
import { CheckCircle2, UploadCloud, X, LoaderCircle, LayoutTemplate, Brush, Ruler, ClipboardCheck } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import DynamicListInput from './DynamicListInput';
import PriceInput from './PriceInput';
import { useTranslation } from '../hooks/useTranslation';

interface ApartmentPackageFormProps {
    packageToEdit: ApartmentPackage | null;
    onSave: (pkg: ApartmentPackage) => void;
    onCancel: () => void;
}

const initialFormData: Omit<ApartmentPackage, 'id'> = {
    name: '',
    category: PackageCategory.Apartemen,
    imageUrl: '',
    subCategory: '',
    scope: '',
    area: '',
    originalPrice: '',
    price: '',
    kamarUtama: '',
    kamarAnak: '',
    ruangTamu: '',
    dapur: '',
    elektronik: '',
    spesifikasi: '',
    bonus: '',
};

const CATEGORY_ORDER = [
    PackageCategory.Apartemen,
    PackageCategory.Rumah,
    PackageCategory.Kantor,
    PackageCategory.Cafe,
    PackageCategory.Klinik,
    PackageCategory.Furniture,
    PackageCategory.Lainnya
];

const CATEGORY_CONFIG: Record<PackageCategory, {
    field1: { label: string; placeholder: string };
    field2: { label: string; placeholder: string };
    field3: { label: string; placeholder: string };
    field4: { label: string; placeholder: string };
    unitTypes: string[];
}> = {
    [PackageCategory.Apartemen]: {
        field1: { label: 'Kamar Utama', placeholder: 'cth: Lemari 2 Pintu Full HPL' },
        field2: { label: 'Kamar Anak', placeholder: 'cth: Meja Belajar & Ranjang' },
        field3: { label: 'Ruang Tamu', placeholder: 'cth: Backdrop TV + LED Strip' },
        field4: { label: 'Dapur / Pantry', placeholder: 'cth: Kitchen Set Top & Bottom' },
        unitTypes: ['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom', 'Penthouse', 'Custom']
    },
    [PackageCategory.Rumah]: {
        field1: { label: 'Kamar Utama', placeholder: 'cth: Walk-in Closet & Bedframe' },
        field2: { label: 'Kamar Anak / Tamu', placeholder: 'cth: Meja Belajar Minimalis' },
        field3: { label: 'Ruang Keluarga', placeholder: 'cth: Sofa Set & Wall Panel' },
        field4: { label: 'Dapur Bersih / Kotor', placeholder: 'cth: Island Table & Cabinetry' },
        unitTypes: ['Tipe 36', 'Tipe 45', 'Tipe 60', 'Tipe 100+', '2 Lantai', 'Tipe Custom']
    },
    [PackageCategory.Kantor]: {
        field1: { label: 'Ruang Pimpinan', placeholder: 'cth: Meja Kerja Direktur & Credenza' },
        field2: { label: 'Area Staff', placeholder: 'cth: Cubicle Workstation Set' },
        field3: { label: 'Lobby & Resepsionis', placeholder: 'cth: Meja Resepsionis & Sofa' },
        field4: { label: 'Meeting / Pantry', placeholder: 'cth: Meja Rapat & Kursi' },
        unitTypes: ['Small Office', 'Medium Office', 'HQ / Corporate', 'Co-working', 'Ruko']
    },
    [PackageCategory.Cafe]: {
        field1: { label: 'Area Pengunjung', placeholder: 'cth: Booth / Meja & Kursi' },
        field2: { label: 'Bar / Kasir', placeholder: 'cth: Meja Counter & Rak Display' },
        field3: { label: 'Ruang VIP / Outdoor', placeholder: 'cth: Wall Decor & Lighting' },
        field4: { label: 'Kitchen / Gudang', placeholder: 'cth: Rak Gudang / Kitchen Komersial' },
        unitTypes: ['Kiosk', 'Stand-alone Cafe', 'Restoran', 'Coffee Shop']
    },
    [PackageCategory.Klinik]: {
        field1: { label: 'Ruang Tunggu', placeholder: 'cth: Sofa Pasien & Backdrop Resepsionis' },
        field2: { label: 'Ruang Konsultasi', placeholder: 'cth: Meja Dokter & Lemari File' },
        field3: { label: 'Ruang Tindakan', placeholder: 'cth: Kabinet Alkes & Lampu' },
        field4: { label: 'Apotek / Gudang', placeholder: 'cth: Rak Obat Khusus' },
        unitTypes: ['Klinik Kecil', 'Praktek Dokter', 'Apotek', 'Lab Medik']
    },
    [PackageCategory.Furniture]: {
        field1: { label: 'Kitchen Set', placeholder: 'cth: Kitchen Set Minimalis' },
        field2: { label: 'Wardrobe / Lemari', placeholder: 'cth: Wardrobe Full Plafon' },
        field3: { label: 'Cabinet / Backdrop', placeholder: 'cth: Backdrop TV HPL' },
        field4: { label: 'Aksesori Furniture', placeholder: 'cth: Rak Sepatu / Meja Rias' },
        unitTypes: ['Dapur', 'Kamar Tidur', 'Ruang Tamu', 'Custom Furniture']
    },
    [PackageCategory.Lainnya]: {
        field1: { label: 'Area Utama', placeholder: 'cth: Item Utama Ruangan' },
        field2: { label: 'Area Penunjang 1', placeholder: 'cth: Item Pendukung' },
        field3: { label: 'Area Penunjang 2', placeholder: 'cth: Item Pendukung' },
        field4: { label: 'Lain-lain', placeholder: 'cth: Item Tambahan' },
        unitTypes: ['Project Custom', 'Renovasi Sebagian', 'Lainnya']
    }
};

const FURNISHING_OPTIONS = [
    'Full Furnished',
    'Semi Furnished',
    'Basic Interior',
    'Custom Renovation',
    'Fit Out Only'
];

const FileInput: React.FC<{
    label: string;
    value: string | undefined;
    onChange: (value: string) => void;
    onClear: () => void;
}> = ({ label, value, onChange, onClear }) => {
    const [isCompressing, setIsCompressing] = useState(false);
    
    const processFile = async (file: File) => {
        setIsCompressing(true);
        try {
            const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1200, useWebWorker: true, fileType: 'image/webp' };
            const compressedFile = await imageCompression(file, options);
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
                setIsCompressing(false);
            };
            reader.readAsDataURL(compressedFile);
        } catch (error) {
            console.error("Gagal kompres:", error);
            setIsCompressing(false);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-xs font-black text-viniela-brown/60 dark:text-viniela-cream/60 mb-2 uppercase tracking-widest">{label}</label>
            {value ? (
                <div className="relative w-full h-64 group">
                    <img src={value} alt="Preview" className="w-full h-full object-cover rounded-2xl border-2 border-viniela-gold/20 shadow-inner" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                        <button type="button" onClick={onClear} className="bg-red-500 text-white rounded-full p-3 hover:bg-red-600 transition-all shadow-xl transform hover:scale-110">
                            <X size={20} />
                        </button>
                    </div>
                </div>
            ) : (
                <label className={`flex flex-col justify-center items-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer hover:border-viniela-gold hover:bg-viniela-gold/5 transition-all ${isCompressing ? 'opacity-50 pointer-events-none' : 'border-gray-200 dark:border-gray-700'}`}>
                    {isCompressing ? <LoaderCircle className="animate-spin text-viniela-gold" /> : (
                        <>
                            <div className="bg-viniela-gold/10 p-5 rounded-full mb-4">
                                <UploadCloud className="text-viniela-gold w-10 h-10" />
                            </div>
                            <span className="text-sm font-bold text-viniela-brown dark:text-viniela-cream">Unggah Foto Utama Paket</span>
                            <span className="text-xs text-viniela-gray mt-2">JPG, PNG, atau WEBP • Maks. 1MB</span>
                        </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && processFile(e.target.files[0])} />
                </label>
            )}
        </div>
    );
};

const ApartmentPackageForm: React.FC<ApartmentPackageFormProps> = ({ packageToEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<ApartmentPackage, 'id'>>(initialFormData);
    const [isSuccess, setIsSuccess] = useState(false);
    const { t } = useTranslation();

    const currentConfig = CATEGORY_CONFIG[formData.category];

    useEffect(() => {
        if (packageToEdit) {
            setFormData({ ...initialFormData, ...packageToEdit });
        } else {
            setFormData(initialFormData);
        }
    }, [packageToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSuccess(true);
        setTimeout(() => {
            onSave({ ...formData, id: packageToEdit?.id || `pkg-${Date.now()}` } as ApartmentPackage);
            setIsSuccess(false);
        }, 1200);
    };

    const inputClass = "w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-viniela-gold bg-white dark:bg-gray-900 dark:text-white transition-all shadow-sm focus:shadow-md text-sm font-medium";
    const labelClass = "block text-xs font-black text-viniela-brown/70 dark:text-viniela-cream/70 mb-2 uppercase tracking-widest";

    return (
        <div className="relative animate-fade-in">
            {isSuccess && (
                <div className="absolute inset-0 z-50 bg-white/95 dark:bg-gray-800/95 flex flex-col items-center justify-center rounded-2xl animate-fade-in text-center p-8">
                    <div className="bg-green-100 p-6 rounded-full mb-6">
                        <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-viniela-brown dark:text-viniela-cream">Data Berhasil Disimpan</h3>
                    <p className="text-viniela-gray mt-2">Paket interior "{formData.name}" telah masuk ke database.</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-2xl shadow-xl space-y-10 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 dark:border-gray-700 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-viniela-gold/10 p-3 rounded-xl">
                            <LayoutTemplate className="text-viniela-gold" size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-viniela-brown dark:text-viniela-cream">
                                {packageToEdit ? 'Ubah Data Paket' : 'Tambah Paket Baru'}
                            </h2>
                            <p className="text-sm text-viniela-gray font-medium">Pengaturan khusus untuk kategori <span className="text-viniela-gold font-bold">{formData.category}</span></p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>Pilih Kategori Utama</label>
                        <div className="flex flex-wrap gap-2 p-1 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-800">
                            {CATEGORY_ORDER.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setFormData({...formData, category: cat, subCategory: ''})}
                                    className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                        formData.category === cat 
                                        ? 'bg-viniela-gold text-white shadow-md' 
                                        : 'text-viniela-gray hover:bg-white dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-1">
                        <FileInput 
                            label="Foto Paket (Thumbnail)" 
                            value={formData.imageUrl} 
                            onChange={val => setFormData({...formData, imageUrl: val})} 
                            onClear={() => setFormData({...formData, imageUrl: ''})} 
                        />
                    </div>
                    
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Nama Paket Layanan</label>
                            <input 
                                type="text" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                className={inputClass} 
                                required 
                                placeholder={`cth: Paket ${formData.category} Premium`} 
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Tipe / Sub-Kategori</label>
                            <select 
                                value={formData.subCategory} 
                                onChange={e => setFormData({...formData, subCategory: e.target.value})} 
                                className={inputClass}
                                required
                            >
                                <option value="" disabled>Pilih Tipe Unit</option>
                                {currentConfig.unitTypes.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Skala Pekerjaan</label>
                            <select 
                                value={formData.scope} 
                                onChange={e => setFormData({...formData, scope: e.target.value})} 
                                className={inputClass}
                                required
                            >
                                <option value="" disabled>Pilih Cakupan</option>
                                {FURNISHING_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Estimasi Luas Area</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    placeholder="21" 
                                    value={formData.area} 
                                    onChange={e => setFormData({...formData, area: e.target.value})} 
                                    className={`${inputClass} pr-12`} 
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-viniela-gray">m²</span>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-viniela-dark-cream/30 dark:bg-gray-950/50 p-6 rounded-2xl border border-viniela-gold/10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-viniela-gray uppercase mb-2 tracking-widest">Harga Asli (Tampilan Coret)</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-viniela-gray border-r pr-3 border-gray-300 dark:border-gray-700">Rp</div>
                                        <PriceInput 
                                            value={formData.originalPrice} 
                                            onChange={val => setFormData({...formData, originalPrice: val})} 
                                            className={`${inputClass} pl-16 opacity-70`} 
                                            placeholder="cth: 100.000.000"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-viniela-gold uppercase mb-2 tracking-widest">Harga Paket (Wajib)</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-viniela-gold border-r pr-3 border-viniela-gold/30">Rp</div>
                                        <PriceInput 
                                            value={formData.price} 
                                            onChange={val => setFormData({...formData, price: val})} 
                                            required 
                                            className={`${inputClass} pl-16 border-viniela-gold/50 font-black text-viniela-gold text-lg`} 
                                            placeholder="cth: 80.000.000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-700"></div>
                
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-viniela-brown text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                            <ClipboardCheck size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-bold text-viniela-brown dark:text-viniela-cream">Spesifikasi Area & Item</h3>
                            <p className="text-xs text-viniela-gray font-medium">Input item yang didapat klien sesuai kategori <span className="font-bold underline">{formData.category}</span></p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="space-y-8">
                            <div className="bg-gray-50/50 dark:bg-gray-950/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <DynamicListInput label={currentConfig.field1.label} value={formData.kamarUtama || ''} onChange={val => setFormData({...formData, kamarUtama: val})} placeholder={currentConfig.field1.placeholder} />
                            </div>
                            <div className="bg-gray-50/50 dark:bg-gray-950/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <DynamicListInput label={currentConfig.field2.label} value={formData.kamarAnak || ''} onChange={val => setFormData({...formData, kamarAnak: val})} placeholder={currentConfig.field2.placeholder} />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-gray-50/50 dark:bg-gray-950/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <DynamicListInput label={currentConfig.field3.label} value={formData.ruangTamu || ''} onChange={val => setFormData({...formData, ruangTamu: val})} placeholder={currentConfig.field3.placeholder} />
                            </div>
                            <div className="bg-gray-50/50 dark:bg-gray-950/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <DynamicListInput label={currentConfig.field4.label} value={formData.dapur || ''} onChange={val => setFormData({...formData, dapur: val})} placeholder={currentConfig.field4.placeholder} />
                            </div>
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-50/30 dark:bg-blue-950/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                <DynamicListInput label="Unit Elektronik / Smart Home" value={formData.elektronik || ''} onChange={val => setFormData({...formData, elektronik: val})} placeholder="cth: Smart TV / AC / CCTV" />
                            </div>
                            <div className="bg-gray-50/50 dark:bg-gray-950/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <DynamicListInput label="Spesifikasi Teknik & Material" value={formData.spesifikasi || ''} onChange={val => setFormData({...formData, spesifikasi: val})} placeholder="cth: HPL Taco / Engsel Huben" />
                            </div>
                            <div className="bg-viniela-gold/5 p-6 rounded-2xl border border-viniela-gold/20">
                                <DynamicListInput label="Bonus Promo Spesial" value={formData.bonus || ''} onChange={val => setFormData({...formData, bonus: val})} placeholder="cth: Free Voucher / Garansi 2 Thn" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-10 border-t border-gray-100 dark:border-gray-700">
                    <button type="button" onClick={onCancel} className="px-8 py-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-viniela-brown dark:text-viniela-cream font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all active:scale-95 shadow-sm">{t('btn.cancel')}</button>
                    <button type="submit" className="px-14 py-4 bg-viniela-gold text-white font-bold rounded-xl hover:bg-viniela-gold/90 transition-all shadow-xl shadow-viniela-gold/25 active:scale-95 flex items-center justify-center gap-3"><Brush size={20} />{t('btn.save')}</button>
                </div>
            </form>
        </div>
    );
};

export default ApartmentPackageForm;
