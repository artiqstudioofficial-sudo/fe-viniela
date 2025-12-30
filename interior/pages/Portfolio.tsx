import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Project, ProjectCategory } from '../types';
import ImageComparisonSlider from '../components/ImageComparisonSlider';
import TranslatedContent, { Shimmer } from '../components/TranslatedContent';
import ShareModal from '../components/ShareModal';
import { Share2, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface PortfolioProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

// Detail View Component
const ProjectDetailView: React.FC<{ projectId: string, projects: Project[], setProjects: React.Dispatch<React.SetStateAction<Project[]>> }> = ({ projectId, projects, setProjects }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const project = projects.find(p => p.id === projectId);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    useDocumentTitle(project ? project.title : t('portfolio.detail.not_found'));

    if (!project) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-serif">{t('portfolio.detail.not_found')}</h2>
                <button onClick={() => navigate('/portfolio')} className="mt-4 bg-viniela-gold text-white font-bold py-2 px-6 rounded-md hover:bg-viniela-gold/90 transition-colors">
                    {t('portfolio.detail.back')}
                </button>
            </div>
        );
    }

    return (
        <>
            <TranslatedContent project={project} setProjects={setProjects}>
            {(translatedProject, isLoading) => (
                <div className="container mx-auto px-6 py-12 md:py-20 animate-fade-in">
                    <button onClick={() => navigate('/portfolio')} className="mb-8 font-bold text-viniela-gold hover:underline">
                        {t('btn.back_to_portfolio')}
                    </button>
                    {isLoading ? <Shimmer className="h-10 w-3/4 mb-2" /> : <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-2">{translatedProject.title}</h1>}
                    {isLoading ? <Shimmer className="h-7 w-1/2 mb-8" /> : <p className="text-xl text-viniela-brown/70 dark:text-viniela-cream/70 mb-8">{translatedProject.location} - {translatedProject.tagline}</p>}

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3">
                            <img src={translatedProject.imageUrl} alt={translatedProject.title} className="w-full h-auto object-cover rounded-lg shadow-lg mb-8" />
                                                
                            {translatedProject.beforeImageUrl && translatedProject.afterImageUrl && (
                                <div className="mb-8">
                                    <h3 className="text-2xl font-serif font-bold mb-4">{t('portfolio.detail.before_after')}</h3>
                                    <ImageComparisonSlider before={translatedProject.beforeImageUrl} after={translatedProject.afterImageUrl} />
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-2">
                            <div className="lg:sticky lg:top-28 bg-viniela-dark-cream/50 dark:bg-gray-800/50 p-8 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-serif font-bold">{t('portfolio.detail.description')}</h3>
                                    <button onClick={() => setIsShareModalOpen(true)} className="flex items-center gap-2 text-sm font-semibold text-viniela-brown/70 hover:text-viniela-brown dark:text-viniela-cream/70 dark:hover:text-viniela-cream transition-colors bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded-lg shadow-sm hover:shadow-md" aria-label="Share this project">
                                        <Share2 size={16} />
                                        {t('btn.share')}
                                    </button>
                                </div>
                                {isLoading ? <div className="space-y-2"><Shimmer className="h-5 w-full" /><Shimmer className="h-5 w-5/6" /></div> : <p className="text-viniela-brown/80 dark:text-viniela-cream/80 mb-8">{translatedProject.description}</p>}
                                <h3 className="text-2xl font-serif font-bold mb-4 mt-8">{t('portfolio.detail.testimonial')}</h3>
                                <blockquote className="italic border-l-4 border-viniela-gold pl-4">
                                {isLoading ? <div className="space-y-2"><Shimmer className="h-5 w-full" /><Shimmer className="h-5 w-3/4" /></div> : <p>"{translatedProject.clientTestimonial}"</p>}
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </TranslatedContent>
            <ShareModal 
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                projectUrl={window.location.href}
                projectTitle={project.title}
            />
        </>
    );
};


// Main Portfolio Component
const Portfolio: React.FC<PortfolioProps> = ({ projects, setProjects }) => {
    const { projectId } = useParams<{ projectId: string }>();
    const [filter, setFilter] = useState<ProjectCategory | 'All'>('All');
    const { t } = useTranslation();
    
    // Only set list view title if not in detail view to avoid flicker or overwrite
    const isListView = !projectId;
    useDocumentTitle(isListView ? t('nav.portofolio') : ''); 

    const filteredProjects = useMemo(() => {
        if (filter === 'All') return projects;
        return projects.filter(p => p.category === filter);
    }, [filter, projects]);

    if (projectId) {
        return <ProjectDetailView projectId={projectId} projects={projects} setProjects={setProjects} />;
    }

    const categories = ['All', ...Object.values(ProjectCategory)];
    const categoryTranslationKeys: Record<string, string> = {
      'All': 'portfolio.filter.all',
      [ProjectCategory.Rumah]: 'portfolio.filter.rumah',
      [ProjectCategory.Apartemen]: 'portfolio.filter.apartemen',
      [ProjectCategory.Kantor]: 'portfolio.filter.kantor',
      [ProjectCategory.Komersial]: 'portfolio.filter.komersial',
      [ProjectCategory.Cafe]: 'portfolio.filter.cafe',
    };

    return (
        <div className="animate-fade-in">
            <section className="relative h-[60vh] flex items-center justify-center text-center text-viniela-brown dark:text-viniela-cream bg-viniela-dark-cream dark:bg-gray-800">
                <div className="absolute inset-0 z-0 opacity-20">
                    <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1920&auto=format&fit=crop" alt="Portfolio showcase" className="w-full h-full object-cover"/>
                </div>
                <div className="relative z-10 p-8">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-4">{t('portfolio.hero.title')}</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto">{t('portfolio.hero.subtitle')}</p>
                </div>
            </section>
            
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="flex justify-center items-center mb-12 flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat as ProjectCategory | 'All')}
                                aria-pressed={filter === cat}
                                className={`px-5 py-2 rounded-full font-semibold transition-colors duration-300 ${filter === cat ? 'bg-viniela-gold text-white' : 'bg-white dark:bg-gray-700 dark:text-viniela-cream text-viniela-brown hover:bg-viniela-dark-cream dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-viniela-gold'}`}
                            >
                                {t(categoryTranslationKeys[cat] as any)}
                            </button>
                        ))}
                        {filter !== 'All' && (
                            <button
                                onClick={() => setFilter('All')}
                                className="flex items-center gap-1 text-sm text-viniela-gray hover:text-viniela-brown dark:text-viniela-light-gray dark:hover:text-viniela-cream transition-colors font-semibold ml-2 px-3 py-2 rounded-full hover:bg-viniela-dark-cream dark:hover:bg-gray-700"
                                aria-label={t('btn.clear_filter_aria' as any)}
                            >
                                <X size={14} />
                                {t('btn.clear_filter' as any)}
                            </button>
                        )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map(project => (
                             <TranslatedContent key={project.id} project={project} setProjects={setProjects}>
                                {(translatedProject, isLoading) => (
                                    <Link to={`/portfolio/${project.id}`} className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                                        <div className="relative h-60">
                                            <img src={translatedProject.imageUrl} alt={translatedProject.title} className="w-full h-full object-cover"/>
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <p className="text-white font-bold text-lg">{t('portfolio.card.view_detail')}</p>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            {isLoading ? <Shimmer className="h-6 w-3/4 mb-2" /> : <h3 className="font-serif text-xl font-bold">{translatedProject.title}</h3>}
                                            {isLoading ? <Shimmer className="h-4 w-1/2" /> : <p className="text-viniela-gray dark:text-viniela-light-gray">{translatedProject.location}</p>}
                                        </div>
                                    </Link>
                                )}
                            </TranslatedContent>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Portfolio;