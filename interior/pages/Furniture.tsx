
import React, { useState, useEffect } from 'react';
import { PackageOpen, MessageCircle, ListFilter, Hammer } from 'lucide-react';
import { ApartmentPackage, PackageCategory } from '../types';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { PackageCard } from './Services';

const Furniture: React.FC<{ apartmentPackages: ApartmentPackage[] }> = ({ apartmentPackages }) => {
  const [expandedPkgId, setExpandedPkgId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useDocumentTitle("Furniture Custom - Viniela");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const furniturePackages = apartmentPackages.filter(p => p.category === PackageCategory.Furniture);

  return (
    <div className="animate-fade-in bg-viniela-cream/50 dark:bg-viniela-deep-brown min-h-screen pb-20">
      <section className="relative h-[55vh] flex items-center justify-center text-center bg-viniela-brown overflow-hidden">
        <img src="https://images.unsplash.com/photo-1556912170-ee5c33ff2989?q=80&w=1920&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105" alt="Furniture Craftsmanship" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-viniela-cream/50 dark:to-viniela-deep-brown"></div>
        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-viniela-gold/20 backdrop-blur-md text-viniela-gold text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 border border-viniela-gold/30">Craftsmanship</span>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-4 tracking-tight">Furniture Custom</h1>
          <p className="text-white/80 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Dibuat secara presisi oleh pengrajin ahli kami. Kitchen set, wardrobe, dan kabinet kustom dengan material pilihan.
          </p>
        </div>
      </section>

      {/* CTA Section for Custom Requests */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6">
           <div className="max-w-6xl mx-auto bg-white dark:bg-viniela-soft-brown p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10 border border-gray-100 dark:border-viniela-gold/10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                 <div className="w-20 h-20 bg-viniela-gold/10 rounded-full flex items-center justify-center text-viniela-gold shrink-0">
                    <Hammer size={36} />
                 </div>
                 <div className="text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-viniela-brown dark:text-white">Punya Desain Sendiri?</h2>
                    <p className="text-viniela-gray dark:text-viniela-light-gray mt-2">Kami mewujudkan furniture kustom berdasarkan ukuran dan budget Anda.</p>
                 </div>
              </div>
              <a 
                href="https://wa.me/6287789227225?text=Halo%20Viniela,%20saya%20ingin%20konsultasi%20furniture%20custom%20sendiri."
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 bg-viniela-gold text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-3"
              >
                <MessageCircle size={20} fill="currentColor" />
                Konsultasi Sekarang
              </a>
           </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-12 max-w-6xl mx-auto border-b border-gray-100 dark:border-viniela-gold/10 pb-6">
             <div className="bg-viniela-gold/10 p-2.5 rounded-xl text-viniela-gold">
                <ListFilter size={18} strokeWidth={2.5} />
             </div>
             <h2 className="text-2xl font-serif font-bold text-viniela-brown dark:text-white">Katalog Model Terpopuler</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
              {furniturePackages.length > 0 ? (
                  furniturePackages.map(pkg => (
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
                    <h3 className="text-2xl font-serif font-bold dark:text-white mb-2">Belum Ada Model Furniture</h3>
                    <p className="text-viniela-gray dark:text-viniela-light-gray mb-8">Hubungi kami untuk katalog lengkap via PDF.</p>
                </div>
              )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Furniture;
