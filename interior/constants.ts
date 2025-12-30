
import { Service, Project, ProjectCategory, TeamMember, JobOpening, HeroSlide, ProcessStep, ApartmentPackage, PackageCategory, InteriorDesign, DecorationProduct } from './types';
import { HomeIcon, BuildingIcon, OfficeIcon, CafeIcon, RocketIcon, LightbulbIcon, CheckCircleIcon } from './components/icons';
import { Sofa } from 'lucide-react';

export const NAV_LINKS = [
  { name: 'Beranda', path: '/' },
  { name: 'Tentang Kami', path: '/about' },
  { 
    name: 'Layanan', 
    path: '#',
    children: [
      { name: 'Paket Interior', path: '/services' },
      { name: 'Desain Rumah', path: '/interior-designs?cat=Rumah' },
      { name: 'Desain Interior', path: '/interior-designs?cat=Interior' },
      { name: 'Dekorasi', path: '/decorations' },
    ]
  },
  { name: 'Portofolio', path: '/portfolio' },
  { name: 'Generator AI', path: '/ai-generator' },
  { name: 'Kontak', path: '/contact' },
  { name: 'Karir', path: '/career' },
];

export const HERO_SLIDER_DATA: HeroSlide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1920&auto=format&fit=crop',
    title: 'Hunian Pribadi Anda, Tercipta.',
    description: 'Setiap ruang memiliki potensi menjadi mahakarya. Kami memadukan elegansi, kenyamanan, dan kepribadian untuk menciptakan rumah Anda.',
    titleKey: 'hero.slide1.title',
    descriptionKey: 'hero.slide1.desc',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1920&auto=format&fit=crop',
    title: 'Kemewahan dalam Setiap Detail.',
    description: 'Dari konsep hingga sentuhan akhir, kami memastikan setiap elemen mencerminkan standar kualitas dan estetika tertinggi untuk gaya hidup Anda.',
    titleKey: 'hero.slide2.title',
    descriptionKey: 'hero.slide2.desc',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1920&auto=format&fit=crop',
    title: 'Desain yang Menceritakan Kisah Anda.',
    description: 'Kami percaya interior adalah cerminan jiwa. Biarkan kami membantu Anda mengekspresikan identitas unik melalui ruang yang dirancang khusus.',
    titleKey: 'hero.slide3.title',
    descriptionKey: 'hero.slide3.desc',
  },
];

export const INTERIOR_DESIGNS: InteriorDesign[] = [
  {
    id: 'id-1',
    category: 'Interior',
    title: 'Japandi Harmony Living Room',
    style: 'Japandi',
    price: '2500000',
    area: '24',
    imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Desain ruang tamu dengan perpaduan gaya Jepang dan Skandinavia yang mengutamakan ketenangan dan efisiensi.',
    includes: ['Gambar 3D Render', 'Rencana Anggaran Biaya (RAB)', 'Gambar Kerja Teknis', 'Link Pembelian Produk'],
    specs: 'Lantai Parquet|Wall Panel Kayu|Pencahayaan Hangat|Furniture Minimalis'
  },
  {
    id: 'id-2',
    category: 'Rumah',
    title: 'Modern Tropical House Design',
    style: 'Modern',
    price: '15000000',
    area: '120',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Desain arsitektur rumah tinggal dengan konsep tropis modern yang memaksimalkan sirkulasi udara alami.',
    includes: ['Gambar Arsitektur Lengkap', 'Gambar Struktur', 'RAB Konstruksi', 'Visualisasi Eksterior 3D'],
    specs: 'Beton Ekspos|Kayu Ulin|Kaca Low-E|Atap Bitumen'
  }
];

export const DECORATION_PRODUCTS: DecorationProduct[] = [
  {
    id: 'dec-1',
    title: 'Luxury Ceramic Vase Set',
    category: 'Vas & Wadah',
    price: '450000',
    imageUrl: 'https://images.unsplash.com/photo-1578500484721-f39c764e9c64?q=80&w=800&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1578500484721-f39c764e9c64?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Satu set vas keramik handmade dengan tekstur elegan untuk mempercantik sudut ruangan.',
    isCustom: false,
    material: 'Premium Clay Ceramic',
    dimensions: 'T: 30cm, D: 15cm'
  },
  {
    id: 'dec-2',
    title: 'Golden Hour Wall Mirror',
    category: 'Cermin',
    price: '1250000',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Cermin dinding dengan bingkai kuningan yang memberikan kesan luas dan mewah.',
    isCustom: true,
    material: 'Antique Brass & Premium Glass',
    dimensions: 'D: 80cm'
  }
];

export const APARTMENT_PACKAGES: ApartmentPackage[] = [
    { 
        id: 'elegant-studio', category: PackageCategory.Apartemen, name: 'Elegant Studio Package', 
        imageUrl: 'https://images.unsplash.com/photo-1536376074432-cd209f984364?q=80&w=800&auto=format&fit=crop',
        subCategory: 'Studio', scope: 'Full Furnished', area: '21', originalPrice: '80000000', price: '50000000', 
        kamarUtama: 'Kasur 160x200|Headboard multipleks 160|Lemari pakaian 80x200|Gordyn & vitrase',
        dapur: 'Kitchen atas|Kitchen bawah|Rak piring & rak sendok',
        elektronik: '1 AC 1/2 PK|1 Android TV 32inch|1 Kulkas 2 Pintu',
        spesifikasi: 'Engsel soft close|Rel double track|Luar HPL',
        bonus: '1 Kompor portable',
    },
    { 
        id: 'exclusive-studio', category: PackageCategory.Apartemen, name: 'Exclusive Studio Package', 
        imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800&auto=format&fit=crop',
        subCategory: 'Studio', scope: 'Full Furnished', area: '21', originalPrice: '110000000', price: '75000000', 
        kamarUtama: 'Kasur Comforta 160x200|Headboard puff premium|Lemari pakaian cermin|Meja rias built-in',
        dapur: 'Kitchen atas kaca|Kitchen bawah|Kabinet microwave|Modena Slim Hood',
        elektronik: '1 AC 1/2 PK Sharp|1 Android TV 43inch|1 Kulkas Samsung',
        spesifikasi: 'Rel soft close|Luar HPL motif kayu premium|Inner melaminto',
        bonus: 'Lampu spotlight LED',
    },
    { 
        id: 'elegant-2br', category: PackageCategory.Apartemen, name: 'Elegant 2 Bedroom', 
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
        subCategory: '2 Kamar Tidur', scope: 'Full Furnished', area: '42', originalPrice: '140000000', price: '95000000', 
        kamarUtama: 'Ranjang 160x200|Lemari 120x200|Headboard custom',
        kamarAnak: 'Ranjang 90x200|Lemari 80x200|Meja Belajar',
        ruangTamu: 'Kabinet TV|Sofa 2 seater|Meja makan + 4 kursi',
        dapur: 'Kitchen Set L-Shape|Granit top table',
        elektronik: '3 AC 1/2 PK|1 TV 40inch|1 Kulkas',
    },
    { 
        id: 'exclusive-2br', category: PackageCategory.Apartemen, name: 'Exclusive 2 Bedroom', 
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
        subCategory: '2 Kamar Tidur', scope: 'Full Furnished', area: '42', originalPrice: '180000000', price: '125000000', 
        kamarUtama: 'Springbed Serta|Lemari sliding 150cm|Meja rias mewah',
        kamarAnak: 'Springbed 100x200|Lemari & Meja Belajar solid',
        ruangTamu: 'Backdrop TV full wall|Sofa L-Shape|Dining set luxury',
        dapur: 'Kitchen set high-gloss|Modena Stove & Hood',
        elektronik: '3 AC 1/2 PK Inverter|1 TV 50inch 4K|1 Kulkas Side-by-side',
        bonus: 'Free Smart Door Lock',
    },
    { 
        id: 'elegant-3br', category: PackageCategory.Apartemen, name: 'Elegant 3 Bedroom', 
        imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop',
        subCategory: '3 Kamar Tidur', scope: 'Full Furnished', area: '60', originalPrice: '190000000', price: '145000000', 
        kamarUtama: 'Bed set 180x200|Lemari 160cm|Meja rias',
        kamarAnak: 'Bed set 120x200|Lemari 100cm|Meja belajar',
        ruangTamu: 'Sofa L-Shape|Meja makan 6 kursi|Backdrop TV mewah',
        dapur: 'Kitchen Set Full Ceiling|Mini bar',
    },
    { 
        id: 'exclusive-3br', category: PackageCategory.Apartemen, name: 'Exclusive 3 Bedroom', 
        imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
        subCategory: '3 Kamar Tidur', scope: 'Full Furnished', area: '60', originalPrice: '250000000', price: '185000000', 
        kamarUtama: 'Bed set King Serta|Walk-in closet|Meja rias marble',
        kamarAnak: 'Bed set 120x200 premium|Lemari full wall',
        ruangTamu: 'Backdrop TV Marble|Sofa Premium|Dining Table Solid Wood',
        dapur: 'Kitchen Set Quartz Top|Modena Island Hood',
    },
    { 
        id: 'home-minimalist', category: PackageCategory.Rumah, name: 'Modern Minimalist House', 
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
        subCategory: 'Tipe 36/45', scope: 'Semi Furnished', area: '45', originalPrice: '90000000', price: '65000000', 
        kamarUtama: 'Lemari Built-in|Headboard Minimalis|Meja Rias',
        ruangTamu: 'Backdrop TV|Partisi Ruangan',
        dapur: 'Kitchen Set Minimalis|Top Table Granit',
    },
    { 
        id: 'home-luxury', category: PackageCategory.Rumah, name: 'Luxury Residence Package', 
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
        subCategory: 'Tipe 100+', scope: 'Full Furnished', area: '120', originalPrice: '280000000', price: '215000000', 
        kamarUtama: 'Bed set Luxury|Walk-in Closet|Meja Rias Besar',
        ruangTamu: 'Wall Panel Full|Sofa Import|Kabinet TV Premium',
        dapur: 'Island Kitchen|HPL Premium Finish',
    },
    { 
        id: 'office-pro', category: PackageCategory.Kantor, name: 'Professional Office Suite', 
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
        subCategory: 'Small Office', scope: 'Fit Out Only', area: '50', originalPrice: '150000000', price: '110000000', 
        kamarUtama: 'Meja Direktur Custom|Credenza Belakang',
        kamarAnak: '4 Workstation Staff|Sekat Akrilik',
        ruangTamu: 'Lobby Counter|Sofa Tunggu',
    },
    { 
        id: 'cafe-aesthetic', category: PackageCategory.Cafe, name: 'Aesthetic Coffee Shop', 
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop',
        subCategory: 'Kiosk/Stand-alone', scope: 'Full Interior', area: '30', originalPrice: '120000000', price: '85000000', 
        kamarUtama: 'Sofa Booth Built-in|Meja Kayu Solid',
        kamarAnak: 'Bar Counter Marble|Rak Display Kopi',
        ruangTamu: 'Wall Decor Neon|Pencahayaan Industri',
    }
];

export const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Adelia Putri', role: 'Founder & Principal Designer', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop' },
  { name: 'Baskara Wijaya', role: 'Lead Architect', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop' }
];

export const JOB_OPENINGS: JobOpening[] = [
  { id: 'jo-1', title: 'Senior Interior Designer', description: 'Kami mencari desainer interior berpengalaman minimal 3 tahun dengan portofolio yang kuat.', location: 'Jakarta', type: 'Penuh Waktu' },
  { id: 'jo-2', title: 'Site Supervisor', description: 'Bertanggung jawab mengawasi jalannya proyek konstruksi interior di lapangan.', location: 'Jakarta', type: 'Penuh Waktu' }
];

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'modern-classic-apartment-jakarta',
    title: 'Modern Classic Apartment',
    location: 'Jakarta Barat',
    tagline: 'Elegansi Klasik Bertemu Kenyamanan Modern',
    category: ProjectCategory.Apartemen,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=1200&auto=format&fit=crop',
    description: 'Proyek ini menggabungkan elemen desain klasik seperti profil dinding dengan sentuhan furnitur modern minimalis.',
    clientTestimonial: 'Viniela mengubah apartemen standar kami menjadi sebuah mahakarya yang hangat.',
    beforeImageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop',
    afterImageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'scandinavian-house-bsd',
    title: 'Scandinavian Minimalist House',
    location: 'BSD City',
    tagline: 'Cahaya Alami & Material Kayu yang Hangat',
    category: ProjectCategory.Rumah,
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    description: 'Rumah dengan konsep terbuka yang memaksimalkan masuknya cahaya matahari.',
    clientTestimonial: 'Rumah terasa jauh lebih luas setelah didesain ulang oleh tim Viniela.',
    beforeImageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop',
    afterImageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: LightbulbIcon,
    title: 'Desain Terukur & Personal',
    description: 'Kami mendengarkan gaya hidup dan kebutuhan Anda untuk hasil akhir yang mencerminkan kepribadian Anda.',
    titleKey: 'homepage.process.step1.title',
    descriptionKey: 'homepage.process.step1.desc',
  },
  {
    icon: CheckCircleIcon,
    title: 'Kualitas & Keahlian Terbaik',
    description: 'Kolaborasi dengan pengrajin terbaik memastikan setiap detail dieksekusi dengan standar kualitas tertinggi.',
    titleKey: 'homepage.process.step2.title',
    descriptionKey: 'homepage.process.step2.desc',
  },
  {
    icon: RocketIcon,
    title: 'Manajemen Proyek Transparan',
    description: 'Komunikasi jelas, jadwal terencana, dan anggaran transparan untuk proses konstruksi tanpa stres.',
    titleKey: 'homepage.process.step3.title',
    descriptionKey: 'homepage.process.step3.desc',
  }
];

export const SERVICES_PREVIEW: Service[] = [
  { icon: HomeIcon, title: 'Desain Rumah', description: 'Desain hunian personal dan fungsional.', link: '/services', titleKey: 'services.preview.rumah.title', descriptionKey: 'services.preview.rumah.desc' },
  { icon: BuildingIcon, title: 'Desain Apartemen', description: 'Desain efisien dan bergaya untuk hunian vertikal.', link: '/services', titleKey: 'services.preview.apartemen.title', descriptionKey: 'services.preview.apartemen.desc' },
  { icon: OfficeIcon, title: 'Desain Kantor', description: 'Ruang kerja produktif yang meningkatkan kreativitas.', link: '/services', titleKey: 'services.preview.office.title', descriptionKey: 'services.preview.office.desc' },
  { icon: CafeIcon, title: 'Kafe & Ritel', description: 'Konsep visual unik untuk bisnis Anda.', link: '/services', titleKey: 'services.preview.cafe.title', descriptionKey: 'services.preview.cafe.desc' },
];
