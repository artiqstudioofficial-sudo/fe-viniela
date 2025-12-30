
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DecorationProduct } from '../types';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ShoppingCart, Palette, MessageCircle, ListFilter, LayoutGrid } from 'lucide-react';

interface DecorationsProps {
  decorations: DecorationProduct[];
}

const Decorations: React.FC<DecorationsProps> = ({ decorations }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [isScrolled, setIsScrolled] = useState(false);
  useDocumentTitle("Dekorasi & Aksesori - Viniela");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(decorations.map(d => d.category));
    return ['Semua', ...Array.from(cats)];
  }, [decorations]);

  const filteredDecor = useMemo(() => {
    if (selectedCategory === 'Semua') return decorations;
    return decorations.filter(d => d.category === selectedCategory);
  }, [decorations, selectedCategory]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('id-ID').format(parseInt(price, 10));
  };

  return (
    <div className="animate-fade-in bg-viniela-cream/50 dark:bg-viniela-deep-brown min-h-screen pb-20">
      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center text-center bg-viniela-gold overflow-hidden">
        <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1920&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Hero" />
        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 tracking-tight header-text-shadow">Dekorasi & Aksesori</h1>
          <p className="text-white/80 max-w-2xl mx-auto font-medium text-lg header-text-shadow">Sentuhan akhir yang sempurna untuk karakter ruang Anda.</p>
        </div>
      </section>

      {/* SYNCED CATEGORY BAR - NO GAP */}
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
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 transform active:scale-95 ${
                    selectedCategory === cat 
                    ? 'bg-viniela-brown dark:bg-viniela-gold text-white shadow-lg' 
                    : 'bg-white dark:bg-viniela-soft-brown text-viniela-gray dark:text-viniela-cream hover:text-viniela-gold border border-gray-100 dark:border-viniela-gold/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 pt-12">
        {/* Custom Order CTA */}
        <div className="max-w-6xl mx-auto mb-16 bg-viniela-brown dark:bg-viniela-soft-brown text-white p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border border-transparent dark:border-viniela-gold/10">
          <div className="relative z-10 text-center lg:text-left">
            <h2 className="text-2xl md:text-4xl font-serif font-bold mb-4">Ingin Dekorasi Custom?</h2>
            <p className="text-white/70 max-w-md">Kami melayani pembuatan furnitur dan aksesoris custom sesuai selera.</p>
          </div>
          <a 
            href="https://wa.me/6287789227225?text=Halo%20Viniela,%20saya%20ingin%20tanya%20tentang%20layanan%20Dekorasi%20Custom."
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 flex items-center gap-3 bg-viniela-gold px-8 py-4 md:px-10 md:py-5 rounded-full font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-xl"
          >
            <MessageCircle size={18} />
            Hubungi WhatsApp
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {filteredDecor.length > 0 ? (
            filteredDecor.map(product => (
              <Link 
                key={product.id} 
                to={`/product/decoration/${product.id}`}
                className="group flex flex-col bg-white dark:bg-viniela-soft-brown rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-transparent dark:border-viniela-gold/10"
              >
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  {product.isCustom && (
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                      Custom
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-base md:text-lg font-serif font-bold text-viniela-brown dark:text-white mb-2 leading-tight group-hover:text-viniela-gold transition-colors">{product.title}</h3>
                  <p className="text-viniela-gold font-black mb-4">Rp {formatPrice(product.price)}</p>
                  <div className="mt-auto pt-4 border-t border-gray-50 dark:border-viniela-gold/10 flex justify-between items-center">
                    <span className="text-[10px] font-black text-viniela-gray dark:text-viniela-cream/60 uppercase tracking-widest group-hover:text-viniela-gold transition-colors">Detail</span>
                    <ShoppingCart size={18} className="text-viniela-gray dark:text-viniela-cream/60 group-hover:text-viniela-gold transition-colors" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center animate-fade-in flex flex-col items-center">
                <LayoutGrid size={64} className="text-viniela-gold opacity-30 mb-6" />
                <p className="text-viniela-gray dark:text-viniela-light-gray font-serif italic text-xl">Koleksi untuk kategori "{selectedCategory}" sedang kami siapkan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Decorations;
