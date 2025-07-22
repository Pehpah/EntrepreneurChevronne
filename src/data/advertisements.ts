import { Advertisement } from '../types';

export const advertisements: Advertisement[] = [
  {
    id: '1',
    title: 'Formation Entrepreneur Pro',
    description: 'Devenez entrepreneur en 90 jours avec notre formation certifiante. Plus de 5000 entrepreneurs formés !',
    imageUrl: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=400',
    targetUrl: 'https://formation-entrepreneur-pro.com',
    sponsor: 'Entrepreneur Academy',
    position: 'sidebar',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    clickCount: 234,
    impressions: 5678,
    priority: 8
  },
  {
    id: '2',
    title: 'Outils de Gestion Business',
    description: 'Suite complète d\'outils pour gérer votre entreprise. CRM, facturation, comptabilité en un seul endroit.',
    imageUrl: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400',
    targetUrl: 'https://business-tools-suite.com',
    sponsor: 'BusinessTools Pro',
    position: 'article-top',
    isActive: true,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    clickCount: 156,
    impressions: 3421,
    priority: 7
  },
  {
    id: '3',
    title: 'Financement Startup',
    description: 'Obtenez le financement dont votre startup a besoin. Jusqu\'à 500K€ en 48h.',
    imageUrl: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
    targetUrl: 'https://startup-funding.com',
    sponsor: 'StartupCapital',
    position: 'article-bottom',
    isActive: true,
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    clickCount: 89,
    impressions: 2156,
    priority: 9
  },
  {
    id: '4',
    title: 'Comptabilité Simplifiée',
    description: 'Logiciel de comptabilité spécialement conçu pour les entrepreneurs. Essai gratuit 30 jours.',
    imageUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
    targetUrl: 'https://compta-simple.com',
    sponsor: 'ComptaFacile',
    position: 'between-articles',
    isActive: true,
    startDate: '2024-02-01',
    endDate: '2024-08-01',
    clickCount: 67,
    impressions: 1834,
    priority: 6
  },
  {
    id: '5',
    title: 'Marketing Digital Masterclass',
    description: 'Masterclass exclusive : Comment générer 10K€/mois avec le marketing digital. Accès limité.',
    imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    targetUrl: 'https://marketing-masterclass.com',
    sponsor: 'Digital Marketing Pro',
    position: 'header',
    isActive: true,
    startDate: '2024-01-10',
    endDate: '2024-05-10',
    clickCount: 312,
    impressions: 8965,
    priority: 10
  }
];

export const adPlacements = {
  sidebar: { maxAds: 3, enabled: true },
  'article-top': { maxAds: 1, enabled: true },
  'article-middle': { maxAds: 1, enabled: true },
  'article-bottom': { maxAds: 1, enabled: true },
  header: { maxAds: 1, enabled: true },
  footer: { maxAds: 2, enabled: true },
  'between-articles': { maxAds: 1, enabled: true }
};