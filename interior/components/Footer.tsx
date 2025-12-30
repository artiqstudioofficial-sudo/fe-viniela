
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';
import { TiktokIcon } from './icons';

const SocialIcon: React.FC<{ children: React.ReactNode; href: string }> = ({ children, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-viniela-cream/70 hover:text-viniela-gold transition-colors duration-300">
    {children}
  </a>
);

const Footer: React.FC = () => {
  const { pathname } = useLocation();
  
  if (pathname.startsWith('/admin') || pathname === '/login') return null;

  return (
    <footer className="bg-viniela-brown dark:bg-viniela-deep-brown text-viniela-cream border-t dark:border-viniela-gold/10">
      <div className="container mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-5">
            <h3 className="text-4xl font-serif font-bold text-viniela-gold mb-4">Viniela</h3>
            <p className="max-w-md text-viniela-cream/80 leading-relaxed">
              Perusahaan jasa desain dan bangun interior yang berkomitmen menciptakan ruang berkarakter, fungsional, dan hangat.
            </p>
          </div>

          <div className="hidden lg:block lg:col-span-1"></div>

          <div className="lg:col-span-2">
            <h4 className="font-serif font-semibold text-lg mb-4 text-white">Perusahaan</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-viniela-gold transition-colors">Tentang Kami</Link></li>
              <li><Link to="/career" className="hover:text-viniela-gold transition-colors">Karir</Link></li>
              <li><Link to="/admin" className="hover:text-viniela-gold transition-colors">Panel Admin</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-serif font-semibold text-lg mb-4 text-white">Layanan</h4>
            <ul className="space-y-3">
              <li><Link to="/services" className="hover:text-viniela-gold transition-colors">Semua Layanan</Link></li>
              <li><Link to="/portfolio" className="hover:text-viniela-gold transition-colors">Portofolio</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-serif font-semibold text-lg mb-4 text-white">Kontak</h4>
            <ul className="space-y-3 text-sm text-viniela-cream/70">
              <li>Jl. Lingkar Luar Barat No. Kav. 8, Cengkareng, Jakarta Barat 11740</li>
              <li><a href="mailto:Vinieladesign@gmail.com" className="hover:text-white">Vinieladesign@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-between border-t border-viniela-cream/10 pt-8">
          <p className="text-sm text-viniela-cream/60 mt-4 sm:mt-0">&copy; {new Date().getFullYear()} Viniela Interior. Hak Cipta Dilindungi.</p>
          <div className="flex space-x-6">
             <SocialIcon href="https://www.instagram.com/vinieladesign/"><Instagram size={20} /></SocialIcon>
             <SocialIcon href="https://www.tiktok.com/@vinieladesign"><TiktokIcon /></SocialIcon>
             <SocialIcon href="https://www.facebook.com/Vinieladesigninterior"><Facebook size={20} /></SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
