
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { InteriorDesign, DecorationProduct } from '../types';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { MessageCircle, CheckCircle2, Ruler, Box, ArrowLeft, ChevronLeft, ChevronRight, FileText, ShoppingCart, Sparkles } from 'lucide-react';

interface ProductDetailProps {
  designs: InteriorDesign[];
  decorations: DecorationProduct[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ designs, decorations }) => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = type === 'design' 
    ? designs.find(d => d.id === id) 
    : decorations.find(d => d.id === id);

  useDocumentTitle(product ? product.title : "Produk Detail");

  // Scroll to top on ID change
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImageIndex(0);
  }, [id, type]);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    if (type === 'design') {
        const p = product as InteriorDesign;
        return designs
            .filter(d => d.id !== p.id && d.category === p.category && (d.style === p.style || d.area === p.area))
            .slice(0, 3);
    } else {
        const p = product as DecorationProduct;
        return decorations
            .filter(d => d.id !== p.id && d.category === p.category)
            .slice(0, 4);
    }
  }, [product, type, designs, decorations]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20 px-6 text-center">
        <h1 className="text-3xl font-serif font-bold mb-4">Produk tidak ditemukan</h1>
        <Link to="/services" className="bg-viniela-gold text-white px-8 py-3 rounded-full font-bold">Kembali ke Layanan</Link>
      </div>
    );
  }

  const gallery = product.galleryUrls && product.galleryUrls.length > 0 ? product.galleryUrls : [product.imageUrl];
  const formatPrice = (price: string) => new Intl.NumberFormat('id-ID').format(parseInt(price, 10));

  const isDesign = type === 'design';
  const designProduct = product as InteriorDesign;
  const decorProduct = product as DecorationProduct;

  const nextImage = () => setActiveImageIndex((activeImageIndex + 1) % gallery.length);
  const prevImage = () => setActiveImageIndex((activeImageIndex - 1 + gallery.length) % gallery.length);

  return (
    <div className="animate-fade-in bg-white dark:bg-gray-950 min-h-screen pb-20 pt-20 md:pt-24">
      <div className="container mx-auto px-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-viniela-gray hover:text-viniela-gold transition-colors font-bold text-xs uppercase tracking-widest mb-10"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Gallery Section */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-900 group">
              <img 
                src={gallery[activeImageIndex]} 
                alt={product.title} 
                className="w-full h-full object-cover transition-all duration-700"
              />
              
              {gallery.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"><ChevronLeft size={24} /></button>
                  <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"><ChevronRight size={24} /></button>
                </>
              )}
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {gallery.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImageIndex(idx)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-viniela-gold shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-viniela-gold/10 text-viniela-gold text-[10px] font-black rounded-full uppercase tracking-widest">
                    {isDesign ? designProduct.style : decorProduct.category}
                  </span>
                  {isDesign && (
                      <span className="px-4 py-1.5 bg-viniela-brown/10 text-viniela-brown dark:text-white/60 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-2">
                        <Ruler size={12}/> Luas: {designProduct.area} m²
                      </span>
                  )}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-viniela-brown dark:text-white mb-4 leading-tight">{product.title}</h1>
              <p className="text-3xl font-black text-viniela-gold mb-6">Rp {formatPrice(product.price)}</p>
              <div className="h-px bg-gray-100 dark:bg-gray-800 w-full mb-8"></div>
            </div>

            <div className="space-y-8 mb-12">
              <div>
                <h3 className="text-xs font-black text-viniela-gray uppercase tracking-[0.2em] mb-4">Tentang Produk</h3>
                <p className="text-viniela-brown/80 dark:text-viniela-cream/80 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {isDesign && designProduct.includes && (
                <div className="bg-viniela-cream/50 dark:bg-gray-900 p-8 rounded-[2rem] border border-viniela-gold/10">
                  <h3 className="text-xs font-black text-viniela-gold uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    <FileText size={18}/> Yang Anda Dapatkan (Full Package)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    {designProduct.includes.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span className="text-sm font-bold text-viniela-brown dark:text-viniela-cream">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isDesign && designProduct.specs && (
                <div>
                  <h3 className="text-xs font-black text-viniela-gray uppercase tracking-[0.2em] mb-4">Spesifikasi Material</h3>
                  <div className="flex flex-wrap gap-2">
                    {designProduct.specs.split('|').map((item, idx) => (
                      <div key={idx} className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-xs font-bold shadow-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isDesign && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-[1.5rem] flex flex-col gap-2">
                      <Box className="text-viniela-gold mb-2" size={24} />
                      <span className="text-[10px] font-black text-viniela-gray uppercase tracking-widest">Material</span>
                      <span className="font-bold text-viniela-brown dark:text-viniela-cream">{decorProduct.material}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-[1.5rem] flex flex-col gap-2">
                      <Ruler className="text-viniela-gold mb-2" size={24} />
                      <span className="text-[10px] font-black text-viniela-gray uppercase tracking-widest">Dimensi</span>
                      <span className="font-bold text-viniela-brown dark:text-viniela-cream">{decorProduct.dimensions}</span>
                    </div>
                  </div>
              )}
            </div>

            <div className="mt-auto space-y-4">
              <a 
                href={`https://wa.me/6287789227225?text=${encodeURIComponent(`Halo Viniela, saya ingin beli ${isDesign ? 'Desain' : 'Produk Dekorasi'} "${product.title}" seharga Rp ${formatPrice(product.price)}. Bagaimana langkah selanjutnya?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 bg-viniela-brown dark:bg-viniela-gold text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] flex items-center justify-center gap-3 hover:shadow-2xl hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-viniela-brown/10"
              >
                <ShoppingCart size={22} fill="currentColor" />
                Beli {isDesign ? 'Paket Desain' : 'Produk'} Sekarang
              </a>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
            <section className="border-t border-gray-100 dark:border-gray-800 pt-16">
                <div className="flex items-center gap-3 mb-10">
                    <Sparkles className="text-viniela-gold" size={24} />
                    <h2 className="text-3xl font-serif font-bold text-viniela-brown dark:text-white">Produk Serupa</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {similarProducts.map(item => (
                        <Link 
                            key={item.id} 
                            to={`/product/${isDesign ? 'design' : 'decoration'}/${item.id}`}
                            className="group flex flex-col bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-50 dark:border-gray-800"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-viniela-gold text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md">
                                        {isDesign ? (item as InteriorDesign).style : (item as DecorationProduct).category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-sm font-serif font-bold text-viniela-brown dark:text-white mb-2 leading-tight group-hover:text-viniela-gold transition-colors">{item.title}</h3>
                                <p className="text-viniela-gold font-black text-sm">Rp {formatPrice(item.price)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
