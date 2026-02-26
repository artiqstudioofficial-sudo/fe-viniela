import React from 'react';
import { Division } from '../types';

const DesignIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-palette ${className}`} aria-hidden="true" />
);
const InteriorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-couch ${className}`} aria-hidden="true" />
);
const ContractorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-helmet-safety ${className}`} aria-hidden="true" />
);
const HomeServiceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-wrench ${className}`} aria-hidden="true" />
);
const HomeDecorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-chair ${className}`} aria-hidden="true" />
);
const PropertyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-building-user ${className}`} aria-hidden="true" />
);
const PropertyManagementIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-tasks ${className}`} aria-hidden="true" />
);
const RealEstateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-house-chimney-window ${className}`} aria-hidden="true" />
);
const LegalityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-file-signature ${className}`} aria-hidden="true" />
);
const LawyerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-scale-balanced ${className}`} aria-hidden="true" />
);
const DigitalAgencyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-bullhorn ${className}`} aria-hidden="true" />
);
const MedicalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-heart-pulse ${className}`} aria-hidden="true" />
);
const AutomotiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-car-side ${className}`} aria-hidden="true" />
);
const CommoditiesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-leaf ${className}`} aria-hidden="true" />
);
const ConsultantIcon: React.FC<{ className?: string }> = ({ className }) => (
  <i className={`fa-solid fa-users-gear ${className}`} aria-hidden="true" />
);

export const divisions: Division[] = [
  {
    name: 'divisionNames.design',
    slug: 'viniela-design',
    Icon: DesignIcon,
    description: 'divisionDescriptions.design',
    url: 'https://vinieladesign.id',
  },
  {
    name: 'divisionNames.interior',
    slug: 'viniela-interior',
    Icon: InteriorIcon,
    description: 'divisionDescriptions.interior',
    url: 'https://vinieladesign.id',
  },
  {
    name: 'divisionNames.contractor',
    slug: 'viniela-kontraktor',
    Icon: ContractorIcon,
    description: 'divisionDescriptions.contractor',
    url: 'https://vinieladesign.id',
  },
  {
    name: 'divisionNames.homeService',
    slug: 'viniela-home-service',
    Icon: HomeServiceIcon,
    description: 'divisionDescriptions.homeService',
    url: 'https://vinielahomeservice.id',
  },
  {
    name: 'divisionNames.homeDecor',
    slug: 'viniela-home-decor',
    Icon: HomeDecorIcon,
    description: 'divisionDescriptions.homeDecor',
    url: 'https://vinieladesign.id',
  },
  {
    name: 'divisionNames.property',
    slug: 'viniela-property',
    Icon: PropertyIcon,
    description: 'divisionDescriptions.property',
    url: 'https://vinielaproperty.id',
  },
  {
    name: 'divisionNames.managementProperty',
    slug: 'viniela-management-property',
    Icon: PropertyManagementIcon,
    description: 'divisionDescriptions.managementProperty',
    url: 'https://vinielaproperty.id/en/list-your-property',
  },
  {
    name: 'divisionNames.realEstate',
    slug: 'viniela-real-estate',
    Icon: RealEstateIcon,
    description: 'divisionDescriptions.realEstate',
    url: '/divisions/viniela-real-estate',
  },
  {
    name: 'divisionNames.legal',
    slug: 'viniela-legalitas',
    Icon: LegalityIcon,
    description: 'divisionDescriptions.legal',
    url: 'https://trustlegal.id',
  },
  {
    name: 'divisionNames.lawyer',
    slug: 'viniela-pengacara',
    Icon: LawyerIcon,
    description: 'divisionDescriptions.lawyer',
    url: 'https://caklawfirm.id',
  },
  {
    name: 'divisionNames.digital',
    slug: 'viniela-digital-agency',
    Icon: DigitalAgencyIcon,
    description: 'divisionDescriptions.digital',
    url: '/divisions/viniela-digital-agency',
  },
  {
    name: 'divisionNames.consultant',
    slug: 'viniela-konsultan-bisnis',
    Icon: ConsultantIcon,
    description: 'divisionDescriptions.consultant',
    url: '/divisions/viniela-konsultan-bisnis',
  },
  {
    name: 'divisionNames.medical',
    slug: 'viniela-medis',
    Icon: MedicalIcon,
    description: 'divisionDescriptions.medical',
    url: 'https://christimedical.id',
  },
  {
    name: 'divisionNames.automotive',
    slug: 'viniela-otomotif',
    Icon: AutomotiveIcon,
    description: 'divisionDescriptions.automotive',
    url: 'https://vinielaotomotif.id',
  },
  {
    name: 'divisionNames.commodities',
    slug: 'viniela-komoditas',
    Icon: CommoditiesIcon,
    description: 'divisionDescriptions.commodities',
    url: '/divisions/viniela-komoditas',
  },
];
