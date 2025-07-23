import React, { useState } from 'react';
import { Handshake, Users, Star, TrendingUp, Award, Mail, Phone, MapPin, ExternalLink, Check, ArrowRight, Target, Zap, Globe } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: string;
  website: string;
  featured: boolean;
}

interface CollaborationType {
  id: string;
  title: string;
  description: string;
  icon: any;
  benefits: string[];
  requirements: string[];
  examples: string[];
}

const partners: Partner[] = [
  {
    id: '1',
    name: 'TechStart Accelerator',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop',
    description: 'Accélérateur de startups technologiques leader en Europe',
    category: 'Accélérateur',
    website: 'https://techstart.com',
    featured: true
  },
  {
    id: '2',
    name: 'Business Angels Network',
    logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&h=150&fit=crop',
    description: 'Réseau de business angels et investisseurs privés',
    category: 'Investissement',
    website: 'https://bannetwork.com',
    featured: true
  },
  {
    id: '3',
    name: 'Digital Marketing Pro',
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=150&fit=crop',
    description: 'Agence de marketing digital spécialisée B2B',
    category: 'Marketing',
    website: 'https://digitalmarketingpro.com',
    featured: false
  },
  {
    id: '4',
    name: 'Legal Business Solutions',
    logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=150&h=150&fit=crop',
    description: 'Cabinet juridique spécialisé droit des affaires',
    category: 'Juridique',
    website: 'https://legalbusiness.com',
    featured: false
  },
  {
    id: '5',
    name: 'Cloud Solutions Enterprise',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&h=150&fit=crop',
    description: 'Solutions cloud et infrastructure pour entreprises',
    category: 'Technologie',
    website: 'https://cloudsolutions.com',
    featured: true
  },
  {
    id: '6',
    name: 'Finance & Growth',
    logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=150&h=150&fit=crop',
    description: 'Conseil en financement et stratégie de croissance',
    category: 'Finance',
    website: 'https://financegrowth.com',
    featured: false
  }
];

const collaborationTypes: CollaborationType[] = [
  {
    id: 'content',
    title: 'Partenariat Contenu',
    description: 'Création de contenu collaboratif et articles invités',
    icon: Users,
    benefits: [
      'Visibilité auprès de notre audience de 50K+ entrepreneurs',
      'Backlinks de qualité pour votre SEO',
      'Positionnement en tant qu\'expert',
      'Partage sur nos réseaux sociaux'
    ],
    requirements: [
      'Expertise reconnue dans votre domaine',
      'Contenu original et de haute qualité',
      'Respect de notre ligne éditoriale',
      'Engagement sur la promotion croisée'
    ],
    examples: [
      'Articles invités sur des sujets d\'expertise',
      'Interviews d\'experts',
      'Études de cas collaboratives',
      'Webinaires conjoints'
    ]
  },
  {
    id: 'sponsoring',
    title: 'Sponsoring & Publicité',
    description: 'Opportunités de sponsoring et placements publicitaires',
    icon: Target,
    benefits: [
      'Audience qualifiée de décideurs',
      'Formats publicitaires variés',
      'Reporting détaillé des performances',
      'Accompagnement dans la création'
    ],
    requirements: [
      'Produit/service aligné avec notre audience',
      'Budget minimum de 2000€/mois',
      'Respect des guidelines publicitaires',
      'Transparence sur les objectifs'
    ],
    examples: [
      'Bannières display dans les articles',
      'Newsletter sponsorisée',
      'Articles sponsorisés',
      'Placement de produit dans le contenu'
    ]
  },
  {
    id: 'events',
    title: 'Événements & Webinaires',
    description: 'Organisation d\'événements et webinaires conjoints',
    icon: Globe,
    benefits: [
      'Co-organisation d\'événements',
      'Partage des coûts et des risques',
      'Audience combinée des partenaires',
      'Contenu réutilisable'
    ],
    requirements: [
      'Capacité d\'organisation événementielle',
      'Budget dédié aux événements',
      'Expertise complémentaire',
      'Engagement sur la promotion'
    ],
    examples: [
      'Webinaires thématiques mensuels',
      'Conférences entrepreneuriales',
      'Ateliers pratiques',
      'Tables rondes d\'experts'
    ]
  },
  {
    id: 'affiliate',
    title: 'Programme d\'Affiliation',
    description: 'Promotion de produits et services en affiliation',
    icon: TrendingUp,
    benefits: [
      'Commissions attractives (5-30%)',
      'Outils de promotion fournis',
      'Suivi en temps réel des performances',
      'Support dédié aux affiliés'
    ],
    requirements: [
      'Produit de qualité et pertinent',
      'Programme d\'affiliation structuré',
      'Matériel promotionnel disponible',
      'Suivi et reporting transparent'
    ],
    examples: [
      'Outils de productivité',
      'Formations en ligne',
      'Services de conseil',
      'Logiciels SaaS'
    ]
  }
];

export function CollaborationsPage() {
  const [selectedCollaboration, setSelectedCollaboration] = useState<string>('content');
  const [showPartnershipForm, setShowPartnershipForm] = useState(false);

  const featuredPartners = partners.filter(p => p.featured);
  const selectedCollab = collaborationTypes.find(c => c.id === selectedCollaboration);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Handshake className="h-16 w-16 mx-auto mb-6 text-white/90" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Collaborons Ensemble
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Développons des partenariats stratégiques pour créer de la valeur mutuelle et impacter l'écosystème entrepreneurial
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-sm">Lecteurs Mensuels</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">25+</div>
              <div className="text-sm">Partenaires Actifs</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">85%</div>
              <div className="text-sm">Dirigeants & Décideurs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Types de Collaborations */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Types de Collaborations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Découvrez les différentes façons de collaborer avec nous et de bénéficier de notre audience qualifiée
            </p>
          </div>

          {/* Collaboration Types Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {collaborationTypes.map((collab) => {
              const Icon = collab.icon;
              return (
                <button
                  key={collab.id}
                  onClick={() => setSelectedCollaboration(collab.id)}
                  className={`flex items-center px-6 py-3 rounded-full transition-colors ${
                    selectedCollaboration === collab.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {collab.title}
                </button>
              );
            })}
          </div>

          {/* Selected Collaboration Details */}
          {selectedCollab && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center mb-6">
                    <selectedCollab.icon className="h-8 w-8 text-purple-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedCollab.title}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    {selectedCollab.description}
                  </p>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Avantages pour vous
                    </h4>
                    <ul className="space-y-3">
                      {selectedCollab.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Prérequis
                    </h4>
                    <ul className="space-y-3">
                      {selectedCollab.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <ArrowRight className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Exemples de collaborations
                    </h4>
                    <div className="space-y-2">
                      {selectedCollab.examples.map((example, index) => (
                        <div key={index} className="bg-white dark:bg-gray-600 rounded-lg p-3">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPartnershipForm(true)}
                    className="w-full bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
                  >
                    Proposer une Collaboration
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Nos Partenaires */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Nos Partenaires de Confiance
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Ils nous font confiance et collaborent avec nous pour créer de la valeur
            </p>
          </div>

          {/* Featured Partners */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredPartners.map((partner) => (
              <div
                key={partner.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-12 h-12 rounded-lg object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {partner.name}
                    </h3>
                    <span className="text-sm text-purple-600 dark:text-purple-400">
                      {partner.category}
                    </span>
                  </div>
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {partner.description}
                </p>
                
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium group-hover:underline"
                >
                  Visiter le site
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            ))}
          </div>

          {/* All Partners Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
              Tous nos partenaires
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-16 h-16 rounded-lg object-cover mb-3"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                    {partner.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {partner.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Découvrez comment nos collaborations ont généré des résultats concrets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  +300% de trafic
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                TechStart Accelerator a vu son trafic multiplié par 3 grâce à notre série d'articles collaboratifs sur l'innovation.
              </p>
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                Partenariat Contenu • 6 mois
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  ROI de 450%
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Digital Marketing Pro a généré un ROI de 450% sur sa campagne sponsorisée grâce à notre audience qualifiée.
              </p>
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Sponsoring • 3 mois
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  2000 participants
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Notre webinaire conjoint avec Legal Business Solutions a attiré plus de 2000 entrepreneurs.
              </p>
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Événement • Webinaire
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à Collaborer ?
          </h2>
          <p className="text-xl mb-8">
            Discutons de votre projet et créons ensemble une collaboration qui génère de la valeur
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <Mail className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Email</div>
              <div className="text-sm opacity-90">partnerships@blogentrepreneur.fr</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <Phone className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Téléphone</div>
              <div className="text-sm opacity-90">+33 1 23 45 67 89</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <MapPin className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Adresse</div>
              <div className="text-sm opacity-90">Paris, France</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowPartnershipForm(true)}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Proposer un Partenariat
            </button>
            <a
              href="mailto:partnerships@blogentrepreneur.fr"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Nous Contacter
            </a>
          </div>
        </div>
      </section>

      {/* Partnership Form Modal */}
      {showPartnershipForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Proposer un Partenariat
                </h3>
                <button
                  onClick={() => setShowPartnershipForm(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Entreprise *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type de collaboration *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                    <option value="">Sélectionnez un type</option>
                    <option value="content">Partenariat Contenu</option>
                    <option value="sponsoring">Sponsoring & Publicité</option>
                    <option value="events">Événements & Webinaires</option>
                    <option value="affiliate">Programme d'Affiliation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description du projet *
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Décrivez votre projet de collaboration, vos objectifs et ce que vous proposez..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget approximatif
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                    <option value="">Sélectionnez une fourchette</option>
                    <option value="0-1000">0 - 1 000€</option>
                    <option value="1000-5000">1 000 - 5 000€</option>
                    <option value="5000-10000">5 000 - 10 000€</option>
                    <option value="10000+">10 000€+</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowPartnershipForm(false)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Envoyer la Proposition
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}