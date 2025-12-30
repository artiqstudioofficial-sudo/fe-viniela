
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { Menu, X, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdminPath = pathname.startsWith('/admin') || pathname === '/login';
  if (isAdminPath) return null;

  const isHome = pathname === '/';
  const isHeroPage = isHome || pathname === '/services' || pathname === '/interior-designs' || pathname === '/decorations' || pathname === '/about' || pathname === '/portfolio';
  
  const shouldShowWhiteText = isHeroPage && !isScrolled && !isOpen;
  
  const headerBgClass = isScrolled || isOpen 
    ? 'bg-white/95 backdrop-blur-md shadow-lg dark:bg-viniela-deep-brown/95 border-b dark:border-viniela-gold/10' 
    : 'bg-transparent';
    
  const textColorClass = shouldShowWhiteText 
    ? 'text-white header-text-shadow drop-shadow-md' 
    : 'text-viniela-brown dark:text-viniela-cream';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${headerBgClass}`}>
      <div className="container mx-auto px-6 py-4 md:py-5 flex justify-between items-center">
        <NavLink to="/" className={`text-2xl md:text-3xl font-serif font-black transition-all duration-300 ${textColorClass} hover:scale-105 transform`}>
          Viniela
        </NavLink>
        
        <nav className="hidden lg:flex items-center space-x-10">
          {NAV_LINKS.map((link) => (
            <div key={link.name} className="relative" ref={link.children ? dropdownRef : null}>
              {link.children ? (
                <div 
                    className="relative group h-full flex items-center"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    <button
                        className={`flex items-center gap-1.5 font-sans font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 hover:text-viniela-gold py-2 ${dropdownOpen ? 'text-viniela-gold' : textColorClass}`}
                    >
                        {link.name}
                        <ChevronDown size={12} strokeWidth={3} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* DROPDOWN CONTAINER: No gap between trigger and menu */}
                    <div 
                        className={`absolute top-full left-1/2 -translate-x-1/2 w-64 pt-4 transition-all duration-300 origin-top ${
                          dropdownOpen 
                          ? 'opacity-100 visible translate-y-0 scale-100' 
                          : 'opacity-0 invisible -translate-y-2 scale-95 pointer-events-none'
                        }`}
                    >
                        <div className="bg-white dark:bg-viniela-soft-brown shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden border border-gray-100 dark:border-viniela-gold/20">
                          {link.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.path}
                                onClick={() => setDropdownOpen(false)}
                                className="block px-8 py-4 text-[11px] font-black uppercase tracking-widest text-viniela-brown dark:text-viniela-cream hover:bg-viniela-gold hover:text-white transition-all"
                              >
                                {child.name}
                              </Link>
                          ))}
                        </div>
                    </div>
                </div>
              ) : (
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `font-sans font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 hover:text-viniela-gold ${
                      isActive ? 'text-viniela-gold' : textColorClass
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              )}
            </div>
          ))}
          <div className="w-px h-5 bg-viniela-gray/30"></div>
          <ThemeToggle isHeaderSolid={!shouldShowWhiteText} />
        </nav>

        <div className="lg:hidden flex items-center gap-5">
          <ThemeToggle isHeaderSolid={!shouldShowWhiteText} />
          <button onClick={() => setIsOpen(!isOpen)} className={textColorClass}>
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen border-t dark:border-viniela-gold/20' : 'max-h-0'}`}>
        <div className="bg-white dark:bg-viniela-deep-brown px-8 py-10 flex flex-col space-y-8">
          {NAV_LINKS.map((link) => (
            <div key={link.name}>
              {link.children ? (
                <div className="space-y-6">
                  <span className="text-[10px] font-black text-viniela-gold uppercase tracking-[0.3em] opacity-60">{link.name}</span>
                  <div className="flex flex-col space-y-6 pl-4 border-l-2 border-viniela-gold/20">
                    {link.children.map((child) => (
                      <Link 
                        key={child.name} 
                        to={child.path} 
                        onClick={() => setIsOpen(false)}
                        className="text-2xl font-serif font-bold text-viniela-brown dark:text-viniela-cream"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsOpen(false)} 
                    className={({ isActive }) => `text-3xl font-serif font-bold ${isActive ? 'text-viniela-gold' : 'text-viniela-brown dark:text-viniela-cream'}`}
                >
                  {link.name}
                </NavLink>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
