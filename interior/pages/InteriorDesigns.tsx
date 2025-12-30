
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { InteriorDesign, DesignStyle } from '../types';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ShoppingBag, ArrowRight, Ruler, LayoutGrid, ListFilter } from 'lucide-react';

interface InteriorDesignsProps {
  designs: InteriorDesign[];
}

const STYLES: (DesignStyle | 'Semua Gaya')[] = ['Semua Gaya', 'Japandi', 'Scandinavian', 'Modern', 'Industrial', 'Minimalis', 'Classic'];

const InteriorDesigns: React.FC<InteriorDesignsProps> = ({ designs }) => {
  const [searchParams] = useSearchParams();
  const catFilter = searchParams.get('cat'); // 'Rumah' or 'Interior'
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | 'Semua Gaya'>('Semua Gaya');
  const [isScrolled, setIsScrolled] = useState(false);
  
  useDocumentTitle(catFilter === 'Rumah' ? "Desain Arsitektur Rumah" : "Katalog Desain Interior");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('id-ID').format(parseInt(price, 10));
  };

  const filteredDesigns = useMemo(() => {
    let result = designs;
    if (catFilter) {
      result = result.filter(d => d.category === catFilter);
    }
    if (selectedStyle !== 'Semua Gaya') {
      result = result.filter(d => d.style === selectedStyle);
    }
    return result;
  }, [designs, catFilter, selectedStyle]);

  return (
    <div className="animate-fade-in bg-viniela-cream/50 dark:bg-gray-950 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[55vh] flex items-center justify-center text-center bg-viniela-brown overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1920&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105" 
          alt="Interior Hero" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-viniela-cream/50 dark:to-gray-950"></div>
        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1 bg-viniela-gold/20 backdrop-blur-md text-viniela-gold text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 border border-viniela-gold/30">
            {catFilter === 'Rumah' ? 'Architecture' : 'Interior Catalog'}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
            {catFilter === 'Rumah' ? 'Desain Rumah' : 'Interior Eksklusif'}
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Inspirasi ruang tanpa batas. Pilih gaya yang paling mewakili kepribadian dan kenyamanan Anda.
          </p>
        </div>
      </section>

      {/* FIXED: Removed gap with 1px offset adjustment */}
      <section className={`py-4 sticky top-[63px] md:top-[71px] z-40 transition-all duration-300 border-b ${
        isScrolled 
        ? 'bg-white/95 backdrop-blur-md dark:bg-gray-950/95 shadow-xl border-gray-100 dark:border-gray-800' 
        : 'bg-viniela-cream/50 dark:bg-gray-950/50 border-transparent'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar py-2">
            <div className="flex-shrink-0 bg-viniela-gold/10 p-2.5 rounded-xl text-viniela-gold hidden sm:block">
              <ListFilter size={18} strokeWidth={2.5} />
            </div>
            <div className="flex gap-2.5">
              {STYLES.map(style => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 transform active:scale-95 ${
                    selectedStyle === style 
                    ? 'bg-viniela-brown dark:bg-viniela-gold text-white shadow-lg' 
                    : 'bg-white dark:bg-gray-800 text-viniela-gray hover:text-viniela-gold border border-gray-100 dark:border-gray-700'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <div className="container mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 max-w-7xl mx-auto">
          {filteredDesigns.length > 0 ? (
            filteredDesigns.map(design => (
              <Link 
                key={design.id} 
                to={`/product/design/${design.id}`}
                className="group bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_rgba(184,149,90,0.12)] transition-all duration-700 flex flex-col border border-gray-50/50 dark:border-gray-800/50 transform hover:-translate-y-3"
              >
                <div className="relative h-80 overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                  <img 
                    src={design.imageUrl} 
                    alt={design.title} 
                    loading="lazy"
                    onLoad={(e) => (e.currentTarget.previousElementSibling as HTMLElement).style.display = 'none'}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 relative z-10" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-20"></div>
                  
                  <div className="absolute top-6 left-6 flex flex-col gap-2 z-30">
                    <span className="bg-viniela-gold/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl border border-white/20">
                      {design.style}
                    </span>
                    <span className="bg-white/90 backdrop-blur-md text-viniela-brown px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 border border-gray-100">
                      <Ruler size={11} strokeWidth={3}/> {design.area} m²
                    </span>
                  </div>
                </div>

                <div className="p-10 flex flex-col flex-1 relative bg-white dark:bg-gray-900">
                  <h3 className="text-2xl font-serif font-bold text-viniela-brown dark:text-white mb-3 leading-tight group-hover:text-viniela-gold transition-colors duration-300">
                    {design.title}
                  </h3>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-[2px] w-8 bg-viniela-gold/40 group-hover:w-full transition-all duration-700"></div>
                    <p className="text-viniela-gold text-2xl font-black whitespace-nowrap">
                      Rp {formatPrice(design.price)}
                    </p>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-8 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-[10px] font-black text-viniela-gray uppercase tracking-widest group-hover:text-viniela-brown dark:group-hover:text-viniela-cream transition-colors duration-300">
                      Selengkapnya <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                    <div className="p-3.5 bg-viniela-cream dark:bg-gray-800 text-viniela-gold rounded-2xl group-hover:bg-viniela-gold group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:rotate-[15deg]">
                      <ShoppingBag size={20} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-32 text-center animate-fade-in flex flex-col items-center">
               <div className="bg-viniela-gold/5 p-12 rounded-full mb-8 relative">
                  <div className="absolute inset-0 bg-viniela-gold/10 blur-2xl rounded-full"></div>
                  <LayoutGrid size={64} className="text-viniela-gold opacity-40 relative z-10" />
               </div>
               <p className="text-viniela-gray font-serif italic text-2xl mb-6">Maaf, koleksi untuk gaya "{selectedStyle}" belum tersedia.</p>
               <button 
                  onClick={() => setSelectedStyle('Semua Gaya')} 
                  className="bg-viniela-gold text-white px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest shadow-xl shadow-viniela-gold/20 active:scale-95 transition-all"
               >
                  Tampilkan Semua Koleksi
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteriorDesigns;
