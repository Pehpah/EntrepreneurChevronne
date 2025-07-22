import React, { useState } from 'react';
import { Download, ExternalLink, Search, Filter, BookOpen, Calculator, FileText, Presentation, Smartphone, Globe, Zap, Target } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'template' | 'tool' | 'guide' | 'software';
  type: 'download' | 'external';
  url: string;
  icon: string;
  tags: string[];
  featured?: boolean;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Business Plan Template Complet',
    description: 'Modèle professionnel de business plan avec toutes les sections essentielles et exemples concrets.',
    category: 'template',
    type: 'download',
    url: '#',
    icon: 'FileText',
    tags: ['business plan', 'template', 'stratégie'],
    featured: true
  },
  {
    id: '2',
    title: 'Calculateur de Rentabilité',
    description: 'Outil Excel pour calculer la rentabilité de vos projets et analyser vos investissements.',
    category: 'tool',
    type: 'download',
    url: '#',
    icon: 'Calculator',
    tags: ['finance', 'excel', 'rentabilité'],
    featured: true
  },
  {
    id: '3',
    title: 'Guide Marketing Digital 2024',
    description: 'Guide complet de 50 pages sur les stratégies marketing digital qui fonctionnent.',
    category: 'guide',
    type: 'download',
    url: '#',
    icon: 'BookOpen',
    tags: ['marketing', 'digital', 'guide'],
    featured: true
  },
  {
    id: '4',
    title: 'Canva Pro',
    description: 'Plateforme de design graphique pour créer vos visuels marketing professionnels.',
    category: 'software',
    type: 'external',
    url: 'https://canva.com',
    icon: 'Presentation',
    tags: ['design', 'marketing', 'visuels']
  },
  {
    id: '5',
    title: 'Notion',
    description: 'Outil tout-en-un pour organiser vos projets, notes et bases de données.',
    category: 'software',
    type: 'external',
    url: 'https://notion.so',
    icon: 'Globe',
    tags: ['productivité', 'organisation', 'gestion']
  },
  {
    id: '6',
    title: 'Template Pitch Deck',
    description: 'Présentation PowerPoint professionnelle pour convaincre vos investisseurs.',
    category: 'template',
    type: 'download',
    url: '#',
    icon: 'Presentation',
    tags: ['pitch', 'investissement', 'présentation']
  },
  {
    id: '7',
    title: 'Zapier',
    description: 'Automatisez vos tâches répétitives en connectant vos applications favorites.',
    category: 'software',
    type: 'external',
    url: 'https://zapier.com',
    icon: 'Zap',
    tags: ['automatisation', 'productivité', 'workflow']
  },
  {
    id: '8',
    title: 'Checklist Lancement Produit',
    description: 'Liste complète des étapes pour réussir le lancement de votre produit ou service.',
    category: 'template',
    type: 'download',
    url: '#',
    icon: 'Target',
    tags: ['lancement', 'produit', 'checklist']
  }
];

const iconMap = {
  FileText,
  Calculator,
  BookOpen,
  Presentation,
  Globe,
  Zap,
  Target,
  Smartphone
};

export function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const featuredResources = resources.filter(resource => resource.featured);

  const handleDownload = (resource: Resource) => {
    if (resource.type === 'download') {
      // Simulation de téléchargement
      console.log('Téléchargement:', resource.title);
      alert(`Téléchargement de "${resource.title}" commencé !`);
    } else {
      window.open(resource.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Ressources & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Outils</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Découvrez notre collection d'outils, templates et guides pour accélérer 
              votre croissance entrepreneuriale. Tout ce dont vous avez besoin pour réussir.
            </p>
            <div className="flex items-center space-x-4 text-slate-400">
              <span>{resources.length} ressources disponibles</span>
              <span>•</span>
              <span>Mises à jour régulières</span>
              <span>•</span>
              <span>Téléchargement gratuit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Ressources Populaires
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Nos outils les plus téléchargés par la communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredResources.map((resource) => {
              const IconComponent = iconMap[resource.icon as keyof typeof iconMap];
              
              return (
                <div
                  key={resource.id}
                  className="group bg-slate-50 dark:bg-slate-700 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-600"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                        {resource.title}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                        Populaire
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {resource.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDownload(resource)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                  >
                    {resource.type === 'download' ? (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Télécharger</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        <span>Accéder</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une ressource..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filtres:</span>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Toutes catégories</option>
                <option value="template">Templates</option>
                <option value="tool">Outils</option>
                <option value="guide">Guides</option>
                <option value="software">Logiciels</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Tous types</option>
                <option value="download">Téléchargement</option>
                <option value="external">Lien externe</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Toutes les ressources
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {filteredResources.length} ressource{filteredResources.length !== 1 ? 's' : ''} trouvée{filteredResources.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredResources.map((resource) => {
                const IconComponent = iconMap[resource.icon as keyof typeof iconMap];
                
                return (
                  <div
                    key={resource.id}
                    className="group bg-slate-50 dark:bg-slate-700 p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-600"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 text-sm">
                          {resource.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                      {resource.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => handleDownload(resource)}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-sm"
                    >
                      {resource.type === 'download' ? (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Télécharger</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          <span>Accéder</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="h-24 w-24 text-slate-400 dark:text-slate-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Aucune ressource trouvée
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Essayez de modifier vos critères de recherche ou explorez nos catégories.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Besoin d'une ressource spécifique ?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Nous créons régulièrement de nouveaux outils et guides. 
            Dites-nous ce dont vous avez besoin !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@entrepreneur-chevronne.com?subject=Demande de ressource"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
            >
              Faire une demande
            </a>
            <a
              href="#"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
            >
              Voir la roadmap
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}