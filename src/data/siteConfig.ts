import { SiteConfiguration } from '../types';

export const defaultSiteConfig: SiteConfiguration = {
  logo: {
    text: 'Entrepreneur Chevronné',
    subtitle: 'Votre guide vers le succès',
    icon: 'BookOpen',
    showIcon: true,
    showText: true,
  },
  hero: {
    title: 'Transformez vos idées en succès',
    subtitle: 'Découvrez les stratégies, outils et témoignages d\'entrepreneurs qui ont transformé leur vision en réalité. Rejoignez une communauté de leaders visionnaires.',
    backgroundImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    ctaButtons: {
      primary: { text: 'Explorer les stratégies', action: 'strategie' },
      secondary: { text: 'Lire les témoignages', action: 'temoignages' },
    },
    stats: {
      articles: { value: '500+', label: 'Articles publiés' },
      users: { value: '50K+', label: 'Entrepreneurs connectés' },
      satisfaction: { value: '95%', label: 'Taux de satisfaction' },
      growth: { value: '200%', label: 'Croissance annuelle' },
    },
  },
  theme: {
    primaryColor: '#f97316', // orange-500
    secondaryColor: '#ea580c', // orange-600
    accentColor: '#fb923c', // orange-400
  },
};