
import React from 'react';
import { TEAM_MEMBERS } from '../constants';
import { useTranslation } from '../hooks/useTranslation';
import { Shield, Search, PenTool, Leaf } from 'lucide-react';
import { QuoteIcon } from '../components/icons';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const About: React.FC = () => {
    const { t } = useTranslation();
    useDocumentTitle(t('nav.tentang_kami'));
    
    const values = [
        { key: 'about.values.v1', icon: <Shield className="w-10 h-10 text-viniela-gold" /> },
        { key: 'about.values.v2', icon: <Search className="w-10 h-10 text-viniela-gold" /> },
        { key: 'about.values.v3', icon: <PenTool className="w-10 h-10 text-viniela-gold" /> },
        { key: 'about.values.v4', icon: <Leaf className="w-10 h-10 text-viniela-gold" /> }
    ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center text-center text-white bg-viniela-brown dark:bg-viniela-deep-brown overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1920&auto=format&fit=crop" alt="About Viniela" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent"></div>
        </div>
        <div className="relative z-10 p-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-4 header-text-shadow">{t('about.hero.title')}</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto header-text-shadow">{t('about.hero.subtitle')}</p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 md:py-24 bg-viniela-cream dark:bg-viniela-deep-brown">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="order-2 md:order-1">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 text-viniela-brown dark:text-viniela-cream">{t('about.story.title')}</h2>
                    <p className="text-lg text-viniela-gray dark:text-viniela-light-gray leading-relaxed mb-4">{t('about.story.p1')}</p>
                    <p className="text-lg text-viniela-gray dark:text-viniela-light-gray leading-relaxed">{t('about.story.p2')}</p>
                </div>
                <div className="relative h-96 md:h-[500px] order-1 md:order-2">
                    <div className="absolute top-0 left-0 w-[70%] h-[80%] rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 z-10">
                         <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop" alt="Founder sketching ideas" className="w-full h-full object-cover"/>
                    </div>
                    <div className="absolute bottom-0 right-0 w-[70%] h-[80%] rounded-lg overflow-hidden shadow-xl border-8 border-viniela-cream dark:border-viniela-deep-brown transform hover:scale-105 transition-transform duration-500">
                        <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop" alt="Finished interior project" className="w-full h-full object-cover"/>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Philosophy & Values */}
      <section className="py-16 md:py-24 bg-viniela-dark-cream dark:bg-viniela-soft-brown">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 dark:text-viniela-cream">{t('about.philosophy.title')}</h2>
            <div className="relative max-w-4xl mx-auto mb-16">
                 <div className="absolute -top-4 -left-4">
                    <QuoteIcon />
                </div>
                <blockquote className="text-2xl md:text-3xl font-serif italic text-viniela-brown/90 dark:text-viniela-cream/90 relative z-10 p-4">
                    {t('about.philosophy.quote')}
                </blockquote>
            </div>
            
            <h3 className="text-3xl font-serif font-bold mb-12 dark:text-viniela-cream">{t('about.values.title')}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map(value => (
                    <div key={value.key} className="bg-viniela-cream dark:bg-viniela-deep-brown p-6 md:p-8 rounded-lg shadow-md text-center transform hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center justify-center border border-transparent dark:border-viniela-gold/10">
                        <div className="mb-4 inline-block">{value.icon}</div>
                        <h4 className="text-lg md:text-xl font-semibold font-serif text-viniela-brown dark:text-viniela-cream min-h-[3.5rem] flex items-center justify-center">{t(value.key as any)}</h4>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16 md:py-24 bg-viniela-cream dark:bg-viniela-deep-brown">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-16 dark:text-viniela-cream">{t('about.team.title')}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {TEAM_MEMBERS.map(member => (
                    <div key={member.name} className="group text-center">
                        <div className="relative overflow-hidden rounded-lg shadow-lg mb-4 aspect-square">
                            <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <h4 className="text-xl font-semibold font-serif text-viniela-brown dark:text-viniela-cream">{member.name}</h4>
                        <p className="text-viniela-gold font-medium">{member.role}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default About;
