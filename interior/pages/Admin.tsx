
import React, { useState } from 'react';
import { Project, ContactSubmission, JobApplication, JobOpening, ApartmentPackage, InteriorDesign, DecorationProduct } from '../types';
import ProjectForm from '../components/ProjectForm';
import JobOpeningForm from '../components/JobOpeningForm';
import ApartmentPackageForm from '../components/ApartmentPackageForm';
import InteriorDesignForm from '../components/InteriorDesignForm';
import DecorationForm from '../components/DecorationForm';
import Notification from '../components/Notification';
import { Trash2, Mail, FolderKanban, LogOut, ClipboardList, Package, Pencil, PlusCircle, Search, ChevronLeft, ChevronRight, Layout, Palette } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useDataManagement } from '../hooks/useDataManagement';

interface AdminProps {
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    interiorDesigns: InteriorDesign[];
    setInteriorDesigns: React.Dispatch<React.SetStateAction<InteriorDesign[]>>;
    decorations: DecorationProduct[];
    setDecorations: React.Dispatch<React.SetStateAction<DecorationProduct[]>>;
    contactSubmissions: ContactSubmission[];
    jobApplications: JobApplication[];
    jobOpenings: JobOpening[];
    apartmentPackages: ApartmentPackage[];
    onDeleteContact: (id: string) => void;
    onDeleteApplication: (id: string) => void;
    onSaveJobOpening: (job: JobOpening) => void;
    onDeleteJobOpening: (id: string) => void;
    onSaveApartmentPackage: (pkg: ApartmentPackage) => void;
    onDeleteApartmentPackage: (id: string) => void;
    onLogout: () => void;
}

const AdminTableControls: React.FC<{
    query: string;
    setQuery: (q: string) => void;
    page: number;
    setPage: (p: number) => void;
    totalPages: number;
    filteredCount: number;
    placeholder: string;
}> = ({ query, setQuery, page, setPage, totalPages, filteredCount, placeholder }) => {
    const { t } = useTranslation();
    
    return (
        <div className="space-y-4 mb-6 bg-viniela-dark-cream/20 p-4 rounded-xl border border-gray-100">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-viniela-gray" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-viniela-gold dark:text-white"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {filteredCount > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-700 dark:text-gray-300 gap-4">
                    <span className="font-medium text-viniela-gray">
                        {t('admin.search.results_found').replace('{count}', filteredCount.toString())}
                    </span>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30"><ChevronLeft size={16} /></button>
                        <span className="font-bold px-3">{page} / {totalPages}</span>
                        <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30"><ChevronRight size={16} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};


const Admin: React.FC<AdminProps> = ({ 
    projects, setProjects, interiorDesigns, setInteriorDesigns, decorations, setDecorations,
    contactSubmissions, jobApplications, jobOpenings, apartmentPackages,
    onDeleteContact, onDeleteApplication, onSaveJobOpening, onDeleteJobOpening, onSaveApartmentPackage, onDeleteApartmentPackage, onLogout 
}) => {
    const [activeTab, setActiveTab] = useState('portfolio');
    const [isProjectFormVisible, setIsProjectFormVisible] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isJobFormVisible, setIsJobFormVisible] = useState(false);
    const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
    const [isPackageFormVisible, setIsPackageFormVisible] = useState(false);
    const [editingPackage, setEditingPackage] = useState<ApartmentPackage | null>(null);
    const [isDesignFormVisible, setIsDesignFormVisible] = useState(false);
    const [editingDesign, setEditingDesign] = useState<InteriorDesign | null>(null);
    const [isDecorFormVisible, setIsDecorFormVisible] = useState(false);
    const [editingDecor, setEditingDecor] = useState<DecorationProduct | null>(null);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    
    const { t } = useTranslation();
    useDocumentTitle(t('admin.title'));

    const projectData = useDataManagement(projects, ['title', 'location', 'category'], 10);
    const packageData = useDataManagement(apartmentPackages, ['name', 'category', 'subCategory', 'price'], 10);
    const designData = useDataManagement(interiorDesigns, ['title', 'style', 'price'], 10);
    const decorData = useDataManagement(decorations, ['title', 'category', 'price'], 10);
    const jobData = useDataManagement(jobOpenings, ['title', 'location', 'type'], 10);
    const messageData = useDataManagement(contactSubmissions, ['name', 'email', 'message'], 10);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => { setNotification({ message, type }); };

    const navItems = [
        { name: 'portfolio', label: t('admin.tab.portfolio'), count: projects.length, icon: <FolderKanban size={20} /> },
        { name: 'packages', label: t('admin.tab.packages'), count: apartmentPackages.length, icon: <Package size={20} /> },
        { name: 'designs', label: 'Katalog Desain', count: interiorDesigns.length, icon: <Layout size={20} /> },
        { name: 'decorations', label: 'Produk Dekorasi', count: decorations.length, icon: <Palette size={20} /> },
        { name: 'jobs', label: t('admin.tab.jobs'), count: jobOpenings.length, icon: <ClipboardList size={20} /> },
        { name: 'messages', label: t('admin.tab.messages'), count: contactSubmissions.length, icon: <Mail size={20} /> },
    ];
    
    const SidebarLink = ({ name, label, count, icon, isActive, onClick }: any) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                isActive ? 'bg-viniela-gold text-white shadow-lg' : 'text-viniela-gray hover:bg-gray-100 dark:text-viniela-light-gray dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            <span className="flex-1 text-left">{label}</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-viniela-gold' : 'bg-gray-200 dark:bg-gray-600'}`}>{count}</span>
        </button>
    );

    const renderContent = () => {
        if (activeTab === 'portfolio') {
            return (
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-serif font-bold">{t('admin.portfolio.title')}</h2>
                        {!isProjectFormVisible && <button onClick={() => { setIsProjectFormVisible(true); setEditingProject(null); }} className="flex items-center gap-2 bg-viniela-gold text-white font-bold py-3 px-6 rounded-lg shadow-lg active:scale-95"><PlusCircle size={20} /> {t('admin.portfolio.add_button')}</button>}
                    </div>
                    {isProjectFormVisible ? <ProjectForm projectToEdit={editingProject} onSave={(data) => { if (editingProject) setProjects(prev => prev.map(p => p.id === data.id ? data : p)); else setProjects(prev => [data, ...prev]); setIsProjectFormVisible(false); showNotification(t('admin.notification.save_success')); }} onCancel={() => setIsProjectFormVisible(false)} /> : (
                        <>
                             {projectData.totalItems > 0 && <AdminTableControls query={projectData.query} setQuery={projectData.setQuery} page={projectData.page} setPage={projectData.setPage} totalPages={projectData.totalPages} filteredCount={projectData.filteredCount} placeholder={t('admin.search.placeholder')} />}
                             {projectData.filteredCount > 0 ? (
                                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50">
                                            <tr className="border-b">
                                                <th className="p-4 font-bold text-xs uppercase text-viniela-gray">{t('admin.table.header.image')}</th>
                                                <th className="p-4 font-bold text-xs uppercase text-viniela-gray">{t('admin.table.header.title')}</th>
                                                <th className="p-4 font-bold text-xs uppercase text-viniela-gray text-right">{t('admin.table.header.actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {projectData.paginatedData.map(p => (
                                                <tr key={p.id} className="hover:bg-gray-50/50">
                                                    <td className="p-4"><img src={p.imageUrl} className="w-16 h-12 rounded-lg object-cover" alt="" /></td>
                                                    <td className="p-4 font-bold">{p.title}</td>
                                                    <td className="p-4 flex justify-end gap-2">
                                                        {/* FIX: Replaced logical || with proper function block to avoid void truthiness issues */}
                                                        <button onClick={() => { setEditingProject(p); setIsProjectFormVisible(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                                                        {/* FIX: Replaced logical && chain with proper if block for void functions */}
                                                        <button onClick={() => { if (window.confirm(t('admin.confirm_delete_project'))) { setProjects(prev => prev.filter(x => x.id !== p.id)); showNotification(t('admin.notification.delete_success')); } }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                             ) : <div className="text-center py-20 italic">{t('admin.search.no_results')}</div>}
                        </>
                    )}
                </div>
            );
        }
        if (activeTab === 'packages') {
            return (
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-serif font-bold">{t('admin.packages.title')}</h2>
                        {!isPackageFormVisible && <button onClick={() => { setIsPackageFormVisible(true); setEditingPackage(null); }} className="flex items-center gap-2 bg-viniela-gold text-white font-bold py-3 px-6 rounded-lg shadow-lg active:scale-95"><PlusCircle size={20} /> {t('admin.packages.add_button')}</button>}
                    </div>
                    {isPackageFormVisible ? <ApartmentPackageForm packageToEdit={editingPackage} onSave={(data) => { onSaveApartmentPackage(data); setIsPackageFormVisible(false); showNotification(t('admin.notification.save_success')); }} onCancel={() => setIsPackageFormVisible(false)} /> : (
                        <>
                             {packageData.totalItems > 0 && <AdminTableControls query={packageData.query} setQuery={packageData.setQuery} page={packageData.page} setPage={packageData.setPage} totalPages={packageData.totalPages} filteredCount={packageData.filteredCount} placeholder={t('admin.search.placeholder')} />}
                             {packageData.filteredCount > 0 ? (
                                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50">
                                            <tr className="border-b">
                                                <th className="p-4 font-bold text-xs uppercase text-viniela-gray">{t('admin.table.header.package_name')}</th>
                                                <th className="p-4 font-bold text-xs uppercase text-viniela-gray">{t('admin.table.header.price')}</th>
                                                <th className="p-4 font-bold text-xs uppercase text-viniela-gray text-right">{t('admin.table.header.actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {packageData.paginatedData.map(pkg => (
                                                <tr key={pkg.id} className="hover:bg-gray-50/50">
                                                    <td className="p-4 font-bold">{pkg.name}</td>
                                                    <td className="p-4 font-mono text-viniela-gold">Rp {parseInt(pkg.price, 10).toLocaleString('id-ID')}</td>
                                                    <td className="p-4 flex justify-end gap-2">
                                                        {/* FIX: Replaced logical || with proper function block and corrected set form visibility function */}
                                                        <button onClick={() => { setEditingPackage(pkg); setIsPackageFormVisible(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                                                        {/* FIX: Replaced logical && chain with proper if block for void functions */}
                                                        <button onClick={() => { if (window.confirm(t('admin.confirm_delete_package'))) { onDeleteApartmentPackage(pkg.id); showNotification(t('admin.notification.delete_success')); } }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                             ) : <div className="text-center py-20 italic">{t('admin.search.no_results')}</div>}
                        </>
                    )}
                </div>
            );
        }
        if (activeTab === 'designs') {
            return (
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-serif font-bold">Kelola Katalog Desain Interior</h2>
                        {!isDesignFormVisible && <button onClick={() => { setIsDesignFormVisible(true); setEditingDesign(null); }} className="flex items-center gap-2 bg-viniela-gold text-white font-bold py-3 px-6 rounded-lg shadow-lg active:scale-95"><PlusCircle size={20} /> Tambah Desain</button>}
                    </div>
                    {isDesignFormVisible ? <InteriorDesignForm designToEdit={editingDesign} onSave={(data) => { if (editingDesign) setInteriorDesigns(prev => prev.map(p => p.id === data.id ? data : p)); else setInteriorDesigns(prev => [data, ...prev]); setIsDesignFormVisible(false); showNotification("Desain disimpan."); }} onCancel={() => setIsDesignFormVisible(false)} /> : (
                        <>
                             <AdminTableControls query={designData.query} setQuery={designData.setQuery} page={designData.page} setPage={designData.setPage} totalPages={designData.totalPages} filteredCount={designData.filteredCount} placeholder="Cari desain..." />
                             <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50">
                                        <tr className="border-b">
                                            <th className="p-4 font-bold text-xs uppercase">Visual</th>
                                            <th className="p-4 font-bold text-xs uppercase">Nama Desain</th>
                                            <th className="p-4 font-bold text-xs uppercase">Luas</th>
                                            <th className="p-4 font-bold text-xs uppercase">Harga</th>
                                            <th className="p-4 font-bold text-xs uppercase text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {designData.paginatedData.map(d => (
                                            <tr key={d.id} className="hover:bg-gray-50/50">
                                                <td className="p-4"><img src={d.imageUrl} className="w-16 h-12 rounded-lg object-cover" alt="" /></td>
                                                <td className="p-4 font-bold">{d.title} <span className="block text-[10px] uppercase text-viniela-gold">{d.style}</span></td>
                                                <td className="p-4 text-xs font-bold">{d.area} m²</td>
                                                <td className="p-4 font-mono text-viniela-gold">Rp {parseInt(d.price, 10).toLocaleString('id-ID')}</td>
                                                <td className="p-4 flex justify-end gap-2">
                                                    <button onClick={() => {setEditingDesign(d); setIsDesignFormVisible(true);}} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => window.confirm("Hapus desain ini?") && setInteriorDesigns(prev => prev.filter(x => x.id !== d.id))}><Trash2 size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            );
        }
        if (activeTab === 'decorations') {
            return (
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-serif font-bold">Kelola Katalog Dekorasi</h2>
                        {!isDecorFormVisible && <button onClick={() => { setIsDecorFormVisible(true); setEditingDecor(null); }} className="flex items-center gap-2 bg-viniela-gold text-white font-bold py-3 px-6 rounded-lg shadow-lg active:scale-95"><PlusCircle size={20} /> Tambah Dekorasi</button>}
                    </div>
                    {isDecorFormVisible ? <DecorationForm productToEdit={editingDecor} onSave={(data) => { if (editingDecor) setDecorations(prev => prev.map(p => p.id === data.id ? data : p)); else setDecorations(prev => [data, ...prev]); setIsDecorFormVisible(false); showNotification("Produk dekorasi disimpan."); }} onCancel={() => setIsDecorFormVisible(false)} /> : (
                        <>
                             <AdminTableControls query={decorData.query} setQuery={decorData.setQuery} page={decorData.page} setPage={decorData.setPage} totalPages={decorData.totalPages} filteredCount={decorData.filteredCount} placeholder="Cari dekorasi..." />
                             <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50">
                                        <tr className="border-b">
                                            <th className="p-4 font-bold text-xs uppercase">Visual</th>
                                            <th className="p-4 font-bold text-xs uppercase">Nama Produk</th>
                                            <th className="p-4 font-bold text-xs uppercase">Kategori</th>
                                            <th className="p-4 font-bold text-xs uppercase">Harga</th>
                                            <th className="p-4 font-bold text-xs uppercase text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {decorData.paginatedData.map(d => (
                                            <tr key={d.id} className="hover:bg-gray-50/50">
                                                <td className="p-4"><img src={d.imageUrl} className="w-16 h-16 rounded-lg object-cover" alt="" /></td>
                                                <td className="p-4 font-bold">{d.title}</td>
                                                <td className="p-4 text-xs font-bold text-viniela-gray uppercase tracking-widest">{d.category}</td>
                                                <td className="p-4 font-mono text-viniela-gold">Rp {parseInt(d.price, 10).toLocaleString('id-ID')}</td>
                                                <td className="p-4 flex justify-end gap-2">
                                                    <button onClick={() => {setEditingDecor(d); setIsDecorFormVisible(true);}} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => window.confirm("Hapus produk ini?") && setDecorations(prev => prev.filter(x => x.id !== d.id))}><Trash2 size={18} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            );
        }
        if (activeTab === 'jobs') {
            return (
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-serif font-bold">{t('admin.jobs.title')}</h2>
                        {!isJobFormVisible && <button onClick={() => { setIsJobFormVisible(true); setEditingJob(null); }} className="flex items-center gap-2 bg-viniela-gold text-white font-bold py-3 px-6 rounded-lg shadow-lg active:scale-95"><PlusCircle size={20} /> {t('admin.jobs.add_button')}</button>}
                    </div>
                    {isJobFormVisible ? <JobOpeningForm openingToEdit={editingJob} onSave={(data) => { onSaveJobOpening(data); setIsJobFormVisible(false); showNotification(t('admin.notification.save_success')); }} onCancel={() => setIsJobFormVisible(false)} /> : (
                        <>
                             {jobData.totalItems > 0 && <AdminTableControls query={jobData.query} setQuery={jobData.setQuery} page={jobData.page} setPage={jobData.setPage} totalPages={jobData.totalPages} filteredCount={jobData.filteredCount} placeholder={t('admin.search.placeholder')} />}
                             {jobData.filteredCount > 0 ? (
                                <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50">
                                            <tr className="border-b">
                                                <th className="p-4 font-bold text-xs uppercase text-viniela-gray">{t('admin.table.header.job_title')}</th>
                                                <th className="p-4 font-bold text-xs uppercase text-viniela-gray text-right">{t('admin.table.header.actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {jobData.paginatedData.map(j => (
                                                <tr key={j.id} className="hover:bg-gray-50/50">
                                                    <td className="p-4 font-bold">{j.title}</td>
                                                    <td className="p-4 flex justify-end gap-2">
                                                        {/* FIX: Replaced logical || with proper function block to avoid void truthiness issues */}
                                                        <button onClick={() => { setEditingJob(j); setIsJobFormVisible(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                                                        {/* FIX: Replaced logical && chain with proper if block for void functions */}
                                                        <button onClick={() => { if (window.confirm(t('admin.confirm_delete_job'))) { onDeleteJobOpening(j.id); showNotification(t('admin.notification.delete_success')); } }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                             ) : <div className="text-center py-20 italic">{t('admin.search.no_results')}</div>}
                        </>
                    )}
                </div>
            );
        }
        if (activeTab === 'messages') {
            return (
                <div>
                    <h2 className="text-2xl font-serif font-bold mb-8">{t('admin.messages.title')}</h2>
                    {messageData.totalItems > 0 && <AdminTableControls query={messageData.query} setQuery={messageData.setQuery} page={messageData.page} setPage={messageData.setPage} totalPages={messageData.totalPages} filteredCount={messageData.filteredCount} placeholder={t('admin.search.placeholder')} />}
                    {messageData.filteredCount > 0 ? (
                        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr className="border-b">
                                        <th className="p-4 font-bold text-xs uppercase text-viniela-gray">{t('admin.table.header.date')}</th>
                                        <th className="p-4 font-bold text-xs uppercase text-viniela-gray">{t('admin.table.header.name')}</th>
                                        <th className="p-4 font-bold text-xs uppercase text-viniela-gray text-right">{t('admin.table.header.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {messageData.paginatedData.map(m => (
                                        <tr key={m.id} className="hover:bg-gray-50/50">
                                            <td className="p-4 text-sm">{m.timestamp.toLocaleDateString('id-ID')}</td>
                                            <td className="p-4 font-bold">{m.name} <p className="text-xs font-normal opacity-60">{m.email}</p></td>
                                            <td className="p-4 flex justify-end"><button onClick={() => onDeleteContact(m.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <div className="text-center py-20 italic">{t('admin.search.no_results')}</div>}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-950 text-viniela-brown dark:text-viniela-cream md:flex min-h-screen">
            <aside className="w-full md:w-72 bg-white dark:bg-gray-900 shadow-2xl flex-shrink-0 md:flex md:flex-col border-r border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 text-center">
                    <h1 className="text-3xl font-serif font-black text-viniela-gold">Viniela</h1>
                </div>
                <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
                    {navItems.map(item => <SidebarLink key={item.name} label={item.label} count={item.count} icon={item.icon} isActive={activeTab === item.name} onClick={() => { setActiveTab(item.name); setIsProjectFormVisible(false); setIsJobFormVisible(false); setIsPackageFormVisible(false); setIsDesignFormVisible(false); setIsDecorFormVisible(false); }} />)}
                </nav>
                <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                     <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-red-500 hover:bg-red-50 transition-all"><LogOut size={20} /> <span>{t('btn.logout')}</span></button>
                </div>
            </aside>
            <main className="flex-1 p-8 md:p-12 overflow-y-auto bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto">{renderContent()}</div>
                {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            </main>
        </div>
    );
};

export default Admin;
