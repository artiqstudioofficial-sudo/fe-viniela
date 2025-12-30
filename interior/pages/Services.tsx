
import React, { useState, useMemo, useEffect } from 'react';
import { Ruler, Box, Layout, Utensils, Zap, Gift, ChevronDown, ChevronUp, MessageCircle, Info, Briefcase, Store, Stethoscope, Coffee, PackageOpen, ArrowRight, ListFilter, Hammer, Ruler as RulerIcon, Settings } from 'lucide-react';
import { ApartmentPackage, PackageCategory } from '../types';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSearchParams } from 'react-router-dom';

const formatPrice = (price: string) => {
    const number = parseInt(price, 10);
    if (isNaN(number)) return price;
    return new Intl.NumberFormat('id-ID').format(number);
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

export const getCategoryLabels = (cat: PackageCategory) => {
    switch (cat) {
        case PackageCategory.Kantor:
            return {
                field1: { label: 'Ruang Pimpinan', icon: <Briefcase size={14}/> },
                field2: { label: 'Area Staff', icon: <Layout size={14}/> },
                field3: { label: 'Lobby/Tunggu', icon: <Layout size={14}/> },
                field4: { label: 'Meeting/Pantry', icon: <Utensils size={14}/> }
            };
        case PackageCategory.Cafe:
            return {
                field1: { label: 'Area Pengunjung', icon: <Coffee size={14}/> },
                field2: { label: 'Bar / Kasir', icon: <Store size={14}/> },
                field3: { label: 'Ruang VIP/Outdoor', icon: <Layout size={14}/> },
                field4: { label: 'Kitchen/Gudang', icon: <Utensils size={14}/> }
            };
        case PackageCategory.Klinik:
            return {
                field1: { label: 'Ruang Tunggu', icon: <Layout size={14}/> },
                field2: { label: 'Ruang Konsultasi', icon: <Stethoscope size={14}/> },
                field3: { label: 'Ruang Tindakan', icon: <Layout size={14}/> },
                field4: { label: 'Apotek/Gudang', icon: <PackageOpen size={14}/> }
            };
        case PackageCategory.Furniture:
            return {
                field1: { label: 'Kitchen Set', icon: <Utensils size={14}/> },
                field2: { label: 'Wardrobe', icon: <Layout size={14}/> },
                field3: { label: 'Cabinet / Credenza', icon: <Layout size={14}/> },
                field4: { label: 'Aksesoris / Lainnya', icon: <PackageOpen size={14}/> }
            };
        default:
            return {
                field1: { label: 'Kamar Utama', icon: <Layout size={14}/> },
                field2: { label: 'Kamar Anak', icon: <Layout size={14}/> },
                field3: { label: 'Ruang Tamu', icon: <Layout size={14}/> },
                field4: { label: 'Dapur', icon: <Utensils size={14}/> }
            };
    }
};

interface PackageCardProps {
    pkg: ApartmentPackage;
    isExpanded: boolean;
    onToggle: () => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, isExpanded, onToggle }) => {
    const hasDetails = !!(pkg.kamarUtama || pkg.kamarAnak || pkg.ruangTamu || pkg.dapur || pkg.elektronik || pkg.bonus || pkg.spesifikasi);
    const labels = getCategoryLabels(pkg.category);

    return (
        <div className="bg-white dark:bg-viniela-soft-brown rounded-[2rem] md:rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col border border-gray-100 dark:border-viniela-gold/10 hover:shadow-2xl transition-all duration-500 h-fit self-start group/card">
            <div className="relative h-56 md:h-64 overflow-hidden">
                <img 
                    src={pkg.imageUrl || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop'} 
                    alt={pkg.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                    <span className="px-3 py-1 bg-viniela-gold text-white text-[9px] md:text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg">
                        {pkg.subCategory || 'Custom Project'}
                    </span>
                </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div className="max-w-[65%]">
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-viniela-brown dark:text-white leading-tight mb-2">{pkg.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] md:text-xs font-bold text-viniela-gray uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><Ruler size={14}/> {pkg.area} m²</span>
                            <span className="flex items-center gap-1.5"><Box size={14}/> {pkg.scope}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-viniela-gold text-xl md:text-2xl font-black leading-none">Rp {formatPrice(pkg.price)}</p>
                        {pkg.originalPrice && <p className="text-[10px] md:text-xs text-viniela-gray line-through mt-1 opacity-70 font-bold">Rp {formatPrice(pkg.originalPrice)}</p>}
                    </div>
                </div>

                {hasDetails && (
                    <button 
                        onClick={onToggle}
                        className={`w-full mb-4 py-3 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 ${
                            isExpanded 
                            ? 'bg-viniela-gold border-viniela-gold text-white shadow-inner' 
                            : 'bg-transparent border-viniela-gold/20 text-viniela-gold hover:border-viniela-gold/50'
                        }`}
                    >
                        {isExpanded ? <><ChevronUp size={14}/> Tutup Item</> : <><ChevronDown size={14}/> Lihat Item Pekerjaan</>}
                    </button>
                )}

                <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mb-6' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4 border-t border-gray-100 dark:border-viniela-gold/10">
                            {pkg.kamarUtama && (
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black text-viniela-gold uppercase tracking-widest">{labels.field1.icon} {labels.field1.label}</h4>
                                    <ul className="text-[11px] space-y-1 text-viniela-gray/90 dark:text-viniela-light-gray/80 leading-relaxed font-bold">
                                        {pkg.kamarUtama.split('|').map((t, i) => <li key={i} className="flex gap-2"><span>•</span> {t}</li>)}
                                    </ul>
                                </div>
                            )}
                            {pkg.kamarAnak && (
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black text-viniela-gold uppercase tracking-widest">{labels.field2.icon} {labels.field2.label}</h4>
                                    <ul className="text-[11px] space-y-1 text-viniela-gray/90 dark:text-viniela-light-gray/80 leading-relaxed font-bold">
                                        {pkg.kamarAnak.split('|').map((t, i) => <li key={i} className="flex gap-2"><span>•</span> {t}</li>)}
                                    </ul>
                                </div>
                            )}
                            {pkg.ruangTamu && (
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black text-viniela-gold uppercase tracking-widest">{labels.field3.icon} {labels.field3.label}</h4>
                                    <ul className="text-[11px] space-y-1 text-viniela-gray/90 dark:text-viniela-light-gray/80 leading-relaxed font-bold">
                                        {pkg.ruangTamu.split('|').map((t, i) => <li key={i} className="flex gap-2"><span>•</span> {t}</li>)}
                                    </ul>
                                </div>
                            )}
                            {pkg.dapur && (
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black text-viniela-gold uppercase tracking-widest">{labels.field4.icon} {labels.field4.label}</h4>
                                    <ul className="text-[11px] space-y-1 text-viniela-gray/90 dark:text-viniela-light-gray/80 leading-relaxed font-bold">
                                        {pkg.dapur.split('|').map((t, i) => <li key={i} className="flex gap-2"><span>•</span> {t}</li>)}
                                    </ul>
                                </div>
                            )}
                            {pkg.elektronik && (
                                <div className="sm:col-span-2 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2"><Zap size={14}/> Fasilitas Elektronik</h4>
                                    <ul className="text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-viniela-gray/90 font-bold">
                                        {pkg.elektronik.split('|').map((t, i) => <li key={i} className="flex gap-2 text-blue-900/70 dark:text-blue-300/70"><span>✓</span> {t}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <a 
                    href={`https://wa.me/6287789227225?text=${encodeURIComponent(`Halo Viniela, saya tertarik dengan paket ${pkg.name}. Bisa info lebih lanjut?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-viniela-brown dark:bg-viniela-gold text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 hover:shadow-2xl hover:brightness-110 transition-all active:scale-95 shadow-lg"
                >
                    <MessageCircle size={18} fill="currentColor" />
                    Hubungi WhatsApp
                </a>
            </div>
        </div>
    );
};

const Services: React.FC<{ apartmentPackages: ApartmentPackage[] }> = ({ apartmentPackages }) => {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('cat');
  
  const [activeTab, setActiveTab] = useState<PackageCategory>(() => {
    if (catParam && Object.values(PackageCategory).includes(catParam as PackageCategory)) {
        return catParam as PackageCategory;
    }
    return PackageCategory.Apartemen;
  });
  
  const [expandedPkgId, setExpandedPkgId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useDocumentTitle("Paket Interior - Viniela");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (catParam && Object.values(PackageCategory).includes(catParam as PackageCategory)) {
        setActiveTab(catParam as PackageCategory);
    }
  }, [catParam]);

  const packagesToDisplay = apartmentPackages.filter(p => p.category === activeTab);

  return (
    <div className="animate-fade-in bg-viniela-cream/50 dark:bg-viniela-deep-brown min-h-screen pb-20">
      <section className="relative h-[45vh] flex items-center justify-center text-center bg-viniela-brown overflow-hidden">
        <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1920&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-25" alt="Hero" />
        <div className="relative z-10 px-6">
            <span className="inline-block px-4 py-1.5 bg-viniela-gold/20 backdrop-blur-md text-viniela-gold text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 border border-viniela-gold/30">Interior Solution</span>
            <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-4 tracking-tight">Katalog Layanan</h1>
            <p className="text-white/80 max-w-2xl mx-auto font-medium text-lg">Transparansi harga dan kualitas material terbaik dari Viniela.</p>
        </div>
      </section>

      <section className={`py-4 sticky top-[63px] md:top-[71px] z-40 transition-all duration-300 border-b ${
        isScrolled 
        ? 'bg-white/95 backdrop-blur-md dark:bg-viniela-deep-brown/95 shadow-xl border-gray-100 dark:border-viniela-gold/20' 
        : 'bg-viniela-cream/50 dark:bg-viniela-deep-brown/50 border-transparent'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar py-2">
            <div className="flex-shrink-0 bg-viniela-gold/10 p-2.5 rounded-xl text-viniela-gold hidden sm:block">
              <ListFilter size={18} strokeWidth={2.5} />
            </div>
            <div className="flex gap-2.5">
              {CATEGORY_ORDER.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 transform active:scale-95 ${
                    activeTab === category 
                    ? 'bg-viniela-brown dark:bg-viniela-gold text-white shadow-lg' 
                    : 'bg-white dark:bg-viniela-soft-brown text-viniela-gray dark:text-viniela-cream hover:text-viniela-gold border border-gray-100 dark:border-viniela-gold/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pt-12 md:pt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
              {packagesToDisplay.length > 0 ? (
                  packagesToDisplay.map(pkg => (
                    <PackageCard 
                        key={pkg.id} 
                        pkg={pkg} 
                        isExpanded={expandedPkgId === pkg.id}
                        onToggle={() => setExpandedPkgId(expandedPkgId === pkg.id ? null : pkg.id)}
                    />
                  ))
              ) : (
                <div className="col-span-full py-20 text-center animate-fade-in flex flex-col items-center">
                    <PackageOpen size={64} className="text-viniela-gold opacity-40 mb-6" />
                    <h3 className="text-2xl font-serif font-bold dark:text-white mb-2">Paket {activeTab} Belum Tersedia</h3>
                    <p className="text-viniela-gray dark:text-viniela-light-gray mb-8">Hubungi kami untuk penawaran kustom.</p>
                    <a href="https://wa.me/6287789227225" className="bg-viniela-gold text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">Konsultasi Custom</a>
                </div>
              )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
