import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'gestion-quotidienne',
    name: 'Gestion quotidienne',
    slug: 'gestion-quotidienne',
    description: 'Organisation, gestion des équipes et des tâches quotidiennes',
    icon: 'Calendar'
  },
  {
    id: 'strategie',
    name: 'Stratégie',
    slug: 'strategie',
    description: 'Vision, choix à long terme et différenciation',
    icon: 'Target'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    slug: 'marketing',
    description: 'Techniques de vente, communication digitale et branding',
    icon: 'Megaphone'
  },
  {
    id: 'finance',
    name: 'Finance',
    slug: 'finance',
    description: 'Budget, financement et gestion de trésorerie',
    icon: 'PiggyBank'
  },
  {
    id: 'productivite',
    name: 'Productivité',
    slug: 'productivite',
    description: 'Outils, routines et automatisation pour gagner du temps',
    icon: 'Zap'
  },
  {
    id: 'témoignages',
    name: 'Témoignages',
    slug: 'temoignages',
    description: 'Interviews et success stories d\'entrepreneurs',
    icon: 'MessageSquare'
  }
];