
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { PORTFOLIO_PROJECTS, JOB_OPENINGS, APARTMENT_PACKAGES, INTERIOR_DESIGNS, DECORATION_PRODUCTS } from './constants';
import { Project, ContactSubmission, JobApplication, JobOpening, ApartmentPackage, InteriorDesign, DecorationProduct } from './types';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoaderCircle } from 'lucide-react';

const Homepage = lazy(() => import('./pages/Homepage'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const InteriorDesigns = lazy(() => import('./pages/InteriorDesigns'));
const Decorations = lazy(() => import('./pages/Decorations'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Contact = lazy(() => import('./pages/Contact'));
const Career = lazy(() => import('./pages/Career'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const AIGenerator = lazy(() => import('./pages/AIGenerator'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
    <div className="flex flex-col items-center gap-4 text-viniela-brown dark:text-viniela-cream">
      <LoaderCircle className="w-12 h-12 animate-spin text-viniela-gold" />
      <p className="font-serif text-lg">Memuat Halaman...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('viniela_projects');
    return saved ? JSON.parse(saved) : PORTFOLIO_PROJECTS;
  });

  const [interiorDesigns, setInteriorDesigns] = useState<InteriorDesign[]>(() => {
    const saved = localStorage.getItem('viniela_designs');
    return saved ? JSON.parse(saved) : INTERIOR_DESIGNS;
  });

  const [decorations, setDecorations] = useState<DecorationProduct[]>(() => {
    const saved = localStorage.getItem('viniela_decorations');
    return saved ? JSON.parse(saved) : DECORATION_PRODUCTS;
  });

  useEffect(() => { localStorage.setItem('viniela_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('viniela_designs', JSON.stringify(interiorDesigns)); }, [interiorDesigns]);
  useEffect(() => { localStorage.setItem('viniela_decorations', JSON.stringify(decorations)); }, [decorations]);

  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>(() => {
    const saved = localStorage.getItem('viniela_contact_submissions');
    return saved ? JSON.parse(saved).map((i:any)=>({...i, timestamp: new Date(i.timestamp)})) : [];
  });

  const [jobApplications, setJobApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('viniela_job_applications');
    return saved ? JSON.parse(saved).map((i:any)=>({...i, timestamp: new Date(i.timestamp)})) : [];
  });

  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(() => {
    const saved = localStorage.getItem('viniela_job_openings');
    return saved ? JSON.parse(saved) : JOB_OPENINGS;
  });

  const [apartmentPackages, setApartmentPackages] = useState<ApartmentPackage[]>(() => {
    const saved = localStorage.getItem('viniela_apartment_packages');
    return saved ? JSON.parse(saved) : APARTMENT_PACKAGES;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('viniela-auth'));

  const handleLogin = (user: string, pass: string): boolean => {
    if (user === 'admin' && pass === 'password123') {
      localStorage.setItem('viniela-auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('viniela-auth');
    setIsAuthenticated(false);
  };

  const handleContactSubmit = (d: any) => {
    const newSubmission = {...d, id: `c-${Date.now()}`, timestamp: new Date()};
    setContactSubmissions([newSubmission, ...contactSubmissions]);
    localStorage.setItem('viniela_contact_submissions', JSON.stringify([newSubmission, ...contactSubmissions]));
  };

  const handleJobApply = (d: any) => {
    const newApp = {...d, id: `app-${Date.now()}`, timestamp: new Date()};
    setJobApplications([newApp, ...jobApplications]);
    localStorage.setItem('viniela_job_applications', JSON.stringify([newApp, ...jobApplications]));
  };

  return (
    <ThemeProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="bg-viniela-cream text-viniela-brown font-sans dark:bg-viniela-brown dark:text-viniela-cream">
          <Header />
          <main className="min-h-screen">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Homepage onContactSubmit={handleContactSubmit} projects={projects} setProjects={setProjects} />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services apartmentPackages={apartmentPackages} />} />
                <Route path="/interior-designs" element={<InteriorDesigns designs={interiorDesigns} />} />
                <Route path="/decorations" element={<Decorations decorations={decorations} />} />
                <Route path="/product/:type/:id" element={<ProductDetail designs={interiorDesigns} decorations={decorations} />} />
                <Route path="/portfolio" element={<Portfolio projects={projects} setProjects={setProjects} />} />
                <Route path="/portfolio/:projectId" element={<Portfolio projects={projects} setProjects={setProjects} />} />
                <Route path="/ai-generator" element={<AIGenerator />} />
                <Route path="/contact" element={<Contact onContactSubmit={handleContactSubmit} />} />
                <Route path="/career" element={<Career onJobApply={handleJobApply} jobOpenings={jobOpenings} setJobOpenings={setJobOpenings} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Admin 
                        projects={projects} setProjects={setProjects}
                        interiorDesigns={interiorDesigns} setInteriorDesigns={setInteriorDesigns}
                        decorations={decorations} setDecorations={setDecorations}
                        contactSubmissions={contactSubmissions}
                        jobApplications={jobApplications}
                        jobOpenings={jobOpenings}
                        apartmentPackages={apartmentPackages}
                        onDeleteContact={id => setContactSubmissions(prev => prev.filter(s=>s.id!==id))}
                        onDeleteApplication={id => setJobApplications(prev => prev.filter(s=>s.id!==id))}
                        onSaveJobOpening={j => setJobOpenings(prev => prev.find(x=>x.id===j.id) ? prev.map(x=>x.id===j.id?j:x) : [j, ...prev])}
                        onDeleteJobOpening={id => setJobOpenings(prev => prev.filter(x=>x.id!==id))}
                        onSaveApartmentPackage={p => setApartmentPackages(prev => prev.find(x=>x.id===p.id) ? prev.map(x=>x.id===p.id?p:x) : [p, ...prev])}
                        onDeleteApartmentPackage={id => setApartmentPackages(prev => prev.filter(x=>x.id!==id))}
                        onLogout={handleLogout}
                      />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
