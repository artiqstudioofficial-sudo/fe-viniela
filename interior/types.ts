
import React from 'react';

export interface Service {
  icon: React.FC;
  title: string;
  description: string;
  link: string;
  portfolioLink?: string;
  titleKey?: string;
  descriptionKey?: string;
}

export enum ProjectCategory {
  Rumah = "Rumah",
  Apartemen = "Apartemen",
  Kantor = "Kantor",
  Komersial = "Komersial",
  Cafe = "Café"
}

// Added missing Project interface to resolve export errors
export interface Project {
  id: string;
  title: string;
  location: string;
  tagline: string;
  category: ProjectCategory;
  imageUrl: string;
  description: string;
  clientTestimonial: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  [key: string]: any;
}

export type DesignStyle = 'Japandi' | 'Scandinavian' | 'Modern' | 'Industrial' | 'Minimalis' | 'Classic' | 'Vintage';

export interface InteriorDesign {
  id: string;
  category: 'Rumah' | 'Interior';
  title: string;
  style: DesignStyle;
  price: string;
  area: string; // numeric string
  imageUrl: string;
  galleryUrls: string[];
  description: string;
  includes: string[];
  specs: string; // Pipe separated
}

export interface DecorationProduct {
  id: string;
  title: string;
  category: string;
  price: string;
  imageUrl: string;
  galleryUrls: string[];
  description: string;
  isCustom: boolean;
  material: string;
  dimensions: string;
}

export interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

export interface JobOpening {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  [key: string]: any;
}

export enum PackageCategory {
  Apartemen = "Apartemen",
  Rumah = "Rumah",
  Kantor = "Kantor",
  Cafe = "Cafe",
  Klinik = "Klinik",
  Furniture = "Furniture",
  Lainnya = "Lainnya"
}

export interface ApartmentPackage {
  id: string;
  category: PackageCategory;
  name: string;
  imageUrl?: string;
  subCategory?: string;
  scope?: string;
  area?: string;
  originalPrice: string;
  price: string;
  kamarUtama?: string;
  kamarAnak?: string;
  ruangTamu?: string;
  dapur?: string;
  elektronik?: string;
  spesifikasi?: string;
  bonus?: string;
  [key: string]: any;
}

export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  description: string;
  titleKey?: string;
  descriptionKey?: string;
}

export interface ProcessStep {
  icon: React.FC;
  title: string;
  description: string;
  titleKey?: string;
  descriptionKey?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  timestamp: Date;
}

export interface JobApplication {
  id: string;
  jobTitle: string;
  name: string;
  email: string;
  message: string;
  cvFileName: string;
  timestamp: Date;
}

export interface PackageConsultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  packageId: string;
  packageName: string;
  packagePrice: string;
  timestamp: Date;
}
