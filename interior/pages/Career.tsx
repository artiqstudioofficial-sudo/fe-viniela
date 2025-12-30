import React, { useState } from 'react';
import { JobOpening, JobApplication } from '../types';
import { ChevronDown } from 'lucide-react';
import JobApplicationModal from '../components/JobApplicationModal';
import { useTranslation } from '../hooks/useTranslation';
import TranslatedJobOpening from '../components/TranslatedJobOpening';
import { Shimmer } from '../components/TranslatedContent';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface CareerProps {
  onJobApply: (applicationData: Omit<JobApplication, 'id' | 'timestamp'>) => void;
  jobOpenings: JobOpening[];
  setJobOpenings: React.Dispatch<React.SetStateAction<JobOpening[]>>;
}

const Career: React.FC<CareerProps> = ({ onJobApply, jobOpenings, setJobOpenings }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
    const { t } = useTranslation();
    useDocumentTitle(t('nav.karir'));

    const handleApplyClick = (job: JobOpening) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-viniela-brown dark:text-viniela-cream bg-viniela-dark-cream dark:bg-gray-800">
        <div className="absolute inset-0 z-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop" alt="Collaborative team working" className="w-full h-full object-cover"/>
        </div>
        <div className="relative z-10 p-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-4">{t('career.hero.title')}</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">{t('career.hero.subtitle')}</p>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-12 text-center">{t('career.positions.title')}</h2>
            <div className="max-w-4xl mx-auto space-y-4">
                {jobOpenings.map((job, index) => (
                  <TranslatedJobOpening key={job.id} job={job} setJobOpenings={setJobOpenings}>
                    {(translatedJob, isLoading) => (
                      <details className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-lg shadow-sm group" open={index === 0}>
                          <summary className="font-serif font-semibold text-xl cursor-pointer list-none flex justify-between items-center">
                              {isLoading ? <Shimmer className="h-7 w-3/4" /> : translatedJob.title}
                              <ChevronDown className="text-viniela-gold transform transition-transform duration-300 group-open:rotate-180" />
                          </summary>
                          <div className="pt-4 mt-4 border-t border-viniela-brown/10 dark:border-viniela-cream/10">
                              {isLoading ? (
                                  <div className="space-y-2">
                                      <Shimmer className="h-4 w-full" />
                                      <Shimmer className="h-4 w-5/6" />
                                  </div>
                              ) : (
                                  <p className="text-viniela-brown/80 dark:text-viniela-cream/80">{translatedJob.description}</p>
                              )}
                              <div className="mt-6 text-right">
                                  <button 
                                      onClick={() => handleApplyClick(translatedJob)}
                                      className="bg-viniela-gold text-white font-bold py-2 px-6 rounded-md hover:bg-viniela-gold/90 transition-colors"
                                      disabled={isLoading}
                                  >
                                      {t('btn.apply_position')}
                                  </button>
                              </div>
                          </div>
                      </details>
                    )}
                  </TranslatedJobOpening>
                ))}
            </div>
        </div>
      </section>

      {/* Culture & Benefits */}
      <section className="py-16 md:py-24 bg-viniela-dark-cream dark:bg-gray-800">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-12">{t('career.culture.title')}</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="p-6">
                    <h3 className="text-2xl font-serif font-semibold mb-2">{t('career.culture.item1.title')}</h3>
                    <p>{t('career.culture.item1.desc')}</p>
                </div>
                <div className="p-6">
                    <h3 className="text-2xl font-serif font-semibold mb-2">{t('career.culture.item2.title')}</h3>
                    <p>{t('career.culture.item2.desc')}</p>
                </div>
                <div className="p-6">
                    <h3 className="text-2xl font-serif font-semibold mb-2">{t('career.culture.item3.title')}</h3>
                    <p>{t('career.culture.item3.desc')}</p>
                </div>
            </div>
        </div>
      </section>

      <JobApplicationModal 
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={onJobApply}
      />
    </div>
  );
};

export default Career;