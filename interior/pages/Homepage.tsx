
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES_PREVIEW, HERO_SLIDER_DATA, PROCESS_STEPS } from '../constants';
import { ProcessStep as ProcessStepType, ContactSubmission, Project } from '../types';
import { QuoteIcon, CheckCircleIcon } from '../components/icons';
import { useTranslation } from '../hooks/useTranslation';
import TranslatedContent, { Shimmer } from '../components/TranslatedContent';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// This sub-component is defined here because it's only used on the Homepage.
interface ProcessStepProps {
  step: ProcessStepType;
  stepNumber: number;
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  description: string;
}
const ProcessStep: React.FC<ProcessStepProps> = ({ step, stepNumber, isOpen, onToggle, title, description }) => {
  const Icon = step.icon;
  return (
    <div
      className="border-b border-viniela-brown/20 dark:border-viniela-gold/10 last:border-b-0 py-6 cursor-pointer"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle()}
      aria-expanded={isOpen}
      aria-controls={`process-panel-${stepNumber}`}
    >
      <div className="flex items-start space-x-6">
        <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center z-10 shadow-md transition-colors duration-300 ${isOpen ? 'bg-viniela-gold text-white' : 'bg-viniela-brown text-viniela-cream dark:bg-viniela-soft-brown dark:text-viniela-cream'}`}>
          <Icon />
        </div>
        <div className="relative flex-1 pt-1">
          <span
            className="absolute -top-4 -left-4 font-serif text-7xl font-bold text-viniela-brown dark:text-viniela-cream opacity-5 select-none z-0"
            aria-hidden="true"
          >
            {String(stepNumber).padStart(2, '0')}
          </span>
          <div className="relative z-10">
            <h3 className="font-sans text-xl font-bold text-viniela-brown dark:text-viniela-cream">{title}</h3>
            <div
              id={`process-panel-${stepNumber}`}
              className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <p className="text-viniela-gray dark:text-viniela-light-gray leading-relaxed pt-2">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HomepageProps {
  onContactSubmit: (submission: Omit<ContactSubmission, 'id' | 'timestamp'>) => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const Homepage: React.FC<HomepageProps> = ({ onContactSubmit, projects, setProjects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t, language } = useTranslation();
  useDocumentTitle(t('page.title.home'));


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_SLIDER_DATA.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, []);
  
  const currentSlide = HERO_SLIDER_DATA[currentIndex];

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactData.name && contactData.email && contactData.phone && contactData.message) {
      onContactSubmit(contactData);
      setIsSubmitted(true);
      setContactData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000); // Reset after 5 seconds
    }
  };
  
  // Prepare projects for infinite scroll (double the array)
  const testimonialProjects = projects.filter(p => p.clientTestimonial);
  const scrollingProjects = [...testimonialProjects, ...testimonialProjects];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-viniela-brown dark:bg-viniela-deep-brown pb-16 lg:pb-24">
        <div className="container mx-auto px-6">
          <h1 className="text-center font-sans text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold text-viniela-cream tracking-wider uppercase pt-12 mb-12">
            Viniela Interior
          </h1>

          {/* Wrapper for responsive positioning */}
          <div className="lg:relative">
            {/* Main Image Slider */}
            <div className="relative w-full aspect-[16/9] lg:aspect-[1.8/1] rounded-3xl overflow-hidden shadow-2xl">
              {HERO_SLIDER_DATA.map((slide, index) => (
                <img
                  key={slide.id}
                  src={slide.image}
                  alt={t(slide.titleKey as any)}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              {/* Slider Dots */}
              <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {HERO_SLIDER_DATA.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Text Content: Below on mobile, overlay on desktop */}
            <div className="py-8 text-center text-white lg:text-left lg:absolute lg:bottom-8 lg:left-8 lg:max-w-lg lg:p-0">
              <div key={currentIndex} className="animate-fade-in">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-4xl mb-3 header-text-shadow drop-shadow-md">{t(currentSlide.titleKey as any)}</h2>
                <p className="text-white/80 text-base mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0 header-text-shadow drop-shadow-md">{t(currentSlide.descriptionKey as any)}</p>
                <Link to="/contact" className="bg-viniela-gold text-white font-bold text-sm py-3 px-8 rounded-full hover:bg-viniela-gold/90 transition-colors duration-300 transform hover:scale-105 active:scale-95 inline-block shadow-lg">
                  {t('btn.contact_us')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Intro */}
      <section className="py-16 md:py-24 bg-viniela-cream dark:bg-viniela-deep-brown">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="relative z-10 rounded-tl-3xl rounded-br-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2940&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Interior ruang tamu modern dan elegan" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-4 left-4 -right-4 -bottom-4 border border-viniela-light-gray/50 dark:border-viniela-gold/10 rounded-tl-3xl rounded-br-3xl z-0"></div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 text-viniela-brown dark:text-viniela-cream">{t('homepage.about.title')}</h2>
              <p className="text-lg text-viniela-gray dark:text-viniela-light-gray leading-relaxed mb-6">
                {t('homepage.about.text')}
              </p>
              <Link to="/about" className="text-viniela-gold font-bold text-lg hover:underline underline-offset-4">
                {t('btn.read_more')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 md:py-24 bg-viniela-dark-cream dark:bg-viniela-soft-brown">
        <div className="container mx-auto px-6">
          <div className="mb-16 max-w-3xl">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-viniela-brown dark:text-viniela-cream">{t('homepage.why_us.title')}</h2>
            <p className="mt-4 text-lg text-viniela-gray dark:text-viniela-light-gray leading-relaxed">{t('homepage.why_us.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              {PROCESS_STEPS.map((step, index) => (
                <ProcessStep
                  key={index}
                  step={step}
                  stepNumber={index + 1}
                  isOpen={openStep === index}
                  onToggle={() => setOpenStep(openStep === index ? null : index)}
                  title={t(step.titleKey as any)}
                  description={t(step.descriptionKey as any)}
                />
              ))}
            </div>
            <div className="relative hidden md:block">
              <div className="relative z-10 rounded-tl-3xl rounded-br-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Modern living room interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 left-4 -right-4 -bottom-4 border border-viniela-light-gray/50 dark:border-viniela-gold/10 rounded-tl-3xl rounded-br-3xl z-0"></div>
            </div>
          </div>
        </div>
      </section>


      {/* Our Services Preview - Added ID for smooth scrolling */}
      <section id="services" className="py-16 md:py-24 bg-viniela-cream dark:bg-viniela-deep-brown">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-16 text-viniela-brown dark:text-viniela-cream">{t('homepage.services.title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES_PREVIEW.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white dark:bg-viniela-soft-brown p-8 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group text-center border border-transparent dark:border-viniela-gold/10">
                  <div className="text-viniela-gold mb-4 w-12 h-12 mx-auto flex items-center justify-center"><Icon /></div>
                  <h3 className="text-xl font-serif font-semibold mb-2 text-viniela-brown dark:text-viniela-cream">{t(service.titleKey as any)}</h3>
                  <p className="text-viniela-gray dark:text-viniela-light-gray mb-6">{t(service.descriptionKey as any)}</p>
                  <Link to={service.link} className="font-bold text-viniela-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t('btn.see_details')}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Marquee */}
      <section className="py-16 md:py-24 bg-viniela-dark-cream dark:bg-viniela-soft-brown overflow-hidden">
        <div className="container mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-viniela-brown dark:text-viniela-cream">{t('homepage.testimonials.title')}</h2>
        </div>
        
        <div className="relative w-full overflow-hidden mask-gradient-horizontal group">
           <div className="flex animate-scroll hover:[animation-play-state:paused] w-max">
              {scrollingProjects.map((project, index) => (
                 <div key={`${project.id}-${index}`} className="w-[350px] md:w-[450px] flex-shrink-0 pr-8">
                    <TranslatedContent project={project} setProjects={setProjects}>
                      {(translatedProject, isLoading) => (
                        <div className="bg-viniela-cream/60 dark:bg-viniela-deep-brown p-8 rounded-lg shadow-lg flex flex-col items-center h-full transform transition-transform duration-300 hover:scale-[1.02] border border-transparent dark:border-viniela-gold/10">
                          <QuoteIcon />
                          <div className="my-6 italic text-lg leading-relaxed text-viniela-gray dark:text-viniela-light-gray min-h-[120px] flex items-center text-center">
                             {isLoading ? <Shimmer className="h-20 w-full" /> : `"${translatedProject.clientTestimonial}"`}
                          </div>
                          <footer className="mt-auto text-center border-t border-viniela-brown/10 dark:border-viniela-gold/10 pt-4 w-full">
                              {isLoading ? (
                                 <div className="flex flex-col items-center gap-2 mt-2">
                                  <Shimmer className="h-6 w-40" />
                                  <Shimmer className="h-4 w-24" />
                                 </div>
                              ) : (
                                <>
                                  <p className="font-serif font-bold text-viniela-brown dark:text-viniela-cream text-xl">{translatedProject.title}</p>
                                  <p className="text-sm text-viniela-gray dark:text-viniela-light-gray">{translatedProject.location}</p>
                                </>
                              )}
                          </footer>
                        </div>
                      )}
                    </TranslatedContent>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* Contact CTA - Added ID for smooth scrolling and DEEP BROWN THEME */}
      <section id="contact" className="py-20 md:py-32 bg-viniela-brown dark:bg-viniela-deep-brown text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-viniela-gold/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-viniela-gold/5 blur-[100px] rounded-full"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-viniela-cream">{t('homepage.contact.title')}</h2>
          <p className="text-lg text-viniela-cream/70 mb-12 max-w-2xl mx-auto">{t('homepage.contact.subtitle')}</p>
          
          {isSubmitted ? (
              <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-8 rounded-2xl max-w-xl mx-auto backdrop-blur-md animate-fade-in" role="alert">
                <CheckCircleIcon />
                <strong className="block font-serif text-2xl mb-2 mt-4">{t('contact.form.success.title')}</strong>
                <span className="opacity-80">{t('contact.form.success.body')}</span>
              </div>
            ) : (
            <form onSubmit={handleContactFormSubmit} className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4 md:col-span-1">
                  <label htmlFor="hp-name" className="sr-only">Nama</label>
                  <input 
                    id="hp-name" name="name" type="text" placeholder="Nama Lengkap" 
                    required value={contactData.name} onChange={handleContactChange} 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-viniela-gold text-white placeholder-white/40 transition-all backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-4 md:col-span-1">
                  <label htmlFor="hp-email" className="sr-only">Email</label>
                  <input 
                    id="hp-email" name="email" type="email" placeholder="Alamat Email" 
                    required value={contactData.email} onChange={handleContactChange} 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-viniela-gold text-white placeholder-white/40 transition-all backdrop-blur-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="hp-phone" className="sr-only">Nomor Telepon</label>
                  <input 
                    id="hp-phone" name="phone" type="tel" placeholder="Nomor WhatsApp" 
                    required value={contactData.phone} onChange={handleContactChange} 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-viniela-gold text-white placeholder-white/40 transition-all backdrop-blur-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="hp-message" className="sr-only">Pesan</label>
                  <textarea
                    id="hp-message" name="message" placeholder="Jelaskan kebutuhan desain Anda..."
                    rows={4} required value={contactData.message} onChange={handleContactChange} 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-viniela-gold text-white placeholder-white/40 transition-all backdrop-blur-sm"
                  ></textarea>
                </div>
                <button type="submit" className="md:col-span-2 bg-viniela-gold text-white font-black text-[11px] uppercase tracking-[0.3em] py-5 px-8 rounded-xl hover:brightness-110 transition-all shadow-2xl shadow-viniela-gold/20 active:scale-95 flex items-center justify-center gap-3">
                  {t('btn.send_message')}
                </button>
              </form>
            )}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
