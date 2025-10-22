import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Play, ExternalLink, Award, TrendingUp, Users } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  quote: string;
  fullStory: string;
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  industry: string;
  featured: boolean;
  videoUrl?: string;
  caseStudyUrl?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    role: 'CEO & Fondatrice',
    company: 'TechStart Solutions',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    quote: "Grâce aux stratégies partagées sur ce blog, j'ai pu faire passer mon chiffre d'affaires de 50K€ à 500K€ en 18 mois.",
    fullStory: "Quand j'ai lancé TechStart Solutions, j'étais complètement perdue dans la jungle entrepreneuriale. Les articles sur la stratégie et le marketing digital m'ont littéralement sauvé la mise. En appliquant les conseils sur l'optimisation des processus et la gestion d'équipe, j'ai réussi à structurer mon entreprise et à attirer les bons talents. Aujourd'hui, nous sommes une équipe de 12 personnes et nos revenus ont été multipliés par 10.",
    results: [
      { metric: 'CA', value: '+900%', description: 'Croissance du chiffre d\'affaires' },
      { metric: 'Équipe', value: '12', description: 'Collaborateurs recrutés' },
      { metric: 'Clients', value: '150+', description: 'Clients satisfaits' }
    ],
    industry: 'Tech',
    featured: true,
    videoUrl: 'https://example.com/video1'
  },
  {
    id: '2',
    name: 'Pierre Martin',
    role: 'Directeur Commercial',
    company: 'InnovateCorp',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    quote: "Les techniques de productivité ont révolutionné ma façon de travailler. Je gagne 3h par jour !",
    fullStory: "En tant que directeur commercial, je croulais sous les tâches administratives. Les articles sur la productivité et l'automatisation m'ont ouvert les yeux. J'ai mis en place un système de CRM automatisé et optimisé mes processus de prospection. Résultat : je passe maintenant 80% de mon temps avec les clients au lieu de 30%.",
    results: [
      { metric: 'Temps client', value: '+150%', description: 'Temps passé avec les prospects' },
      { metric: 'Conversion', value: '+45%', description: 'Taux de conversion des leads' },
      { metric: 'Revenus', value: '+200%', description: 'Augmentation des ventes' }
    ],
    industry: 'Services',
    featured: true
  },
  {
    id: '3',
    name: 'Sophie Chen',
    role: 'Entrepreneure',
    company: 'EcoDesign Studio',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    quote: "Le guide sur le marketing digital m'a permis de tripler mon audience en 6 mois.",
    fullStory: "Mon studio de design éco-responsable peinait à se faire connaître. En suivant les conseils sur le content marketing et les réseaux sociaux, j'ai développé une stratégie de contenu qui résonne avec ma cible. Mes posts LinkedIn génèrent maintenant des milliers de vues et je reçois 5 à 10 demandes qualifiées par semaine.",
    results: [
      { metric: 'Audience', value: '+300%', description: 'Croissance sur LinkedIn' },
      { metric: 'Leads', value: '40/mois', description: 'Demandes qualifiées' },
      { metric: 'Projets', value: '+250%', description: 'Nouveaux contrats' }
    ],
    industry: 'Design',
    featured: false
  },
  {
    id: '4',
    name: 'Thomas Leclerc',
    role: 'Consultant Indépendant',
    company: 'Strategy Plus',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    quote: "Les outils de gestion financière recommandés ont transformé ma rentabilité.",
    fullStory: "Comme beaucoup de consultants, je négligeais la partie financière de mon activité. Les articles sur la gestion financière pour entrepreneurs m'ont fait prendre conscience de l'importance du pilotage par les chiffres. J'ai mis en place un tableau de bord et optimisé ma tarification. Ma marge nette a doublé en un an.",
    results: [
      { metric: 'Marge', value: '+100%', description: 'Amélioration de la rentabilité' },
      { metric: 'Tarifs', value: '+60%', description: 'Augmentation des prix' },
      { metric: 'Clients', value: '25', description: 'Clients réguliers' }
    ],
    industry: 'Conseil',
    featured: false
  },
  {
    id: '5',
    name: 'Camille Rousseau',
    role: 'Co-fondatrice',
    company: 'HealthTech Innovations',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    quote: "La série sur le leadership m'a aidée à devenir une meilleure dirigeante.",
    fullStory: "Passer de développeuse à dirigeante n'était pas évident. Les articles sur le leadership et la gestion d'équipe m'ont donné les clés pour motiver mes collaborateurs et créer une culture d'entreprise forte. Notre équipe est maintenant plus soudée et plus performante que jamais.",
    results: [
      { metric: 'Rétention', value: '95%', description: 'Taux de rétention des talents' },
      { metric: 'Satisfaction', value: '4.8/5', description: 'Score de satisfaction équipe' },
      { metric: 'Croissance', value: '+180%', description: 'Croissance de l\'équipe' }
    ],
    industry: 'HealthTech',
    featured: true,
    caseStudyUrl: 'https://example.com/case-study-healthtech'
  },
  {
    id: '6',
    name: 'Alexandre Moreau',
    role: 'Fondateur',
    company: 'Local Business Hub',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    quote: "Les stratégies de networking ont multiplié mes opportunités business par 5.",
    fullStory: "J'étais très introverti et le networking me terrifiait. Les conseils pratiques sur comment créer des relations professionnelles durables ont changé ma vision. J'ai maintenant un réseau de plus de 200 contacts qualifiés qui me génèrent régulièrement des opportunités.",
    results: [
      { metric: 'Réseau', value: '200+', description: 'Contacts professionnels actifs' },
      { metric: 'Opportunités', value: '15/mois', description: 'Nouvelles opportunités' },
      { metric: 'Partenariats', value: '8', description: 'Partenariats stratégiques' }
    ],
    industry: 'Services',
    featured: false
  }
];

const industries = ['Tous', 'Tech', 'Services', 'Design', 'Conseil', 'HealthTech'];

export function TestimonialsPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('Tous');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showFullStory, setShowFullStory] = useState<string | null>(null);

  const filteredTestimonials = selectedIndustry === 'Tous' 
    ? testimonials 
    : testimonials.filter(t => t.industry === selectedIndustry);

  const featuredTestimonials = testimonials.filter(t => t.featured);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % featuredTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + featuredTestimonials.length) % featuredTestimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Ils Ont Transformé Leur Business
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Découvrez comment nos lecteurs ont appliqué nos conseils pour obtenir des résultats extraordinaires
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm">Success Stories</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">€50M+</div>
              <div className="text-sm">CA Généré</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm">Taux de Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Testimonials Carousel */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Témoignages Vedettes
          </h2>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-white dark:bg-gray-600 shadow-md hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
                
                <div className="flex space-x-2">
                  {featuredTestimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial
                          ? 'bg-orange-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-white dark:bg-gray-600 shadow-md hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                >
                  <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {featuredTestimonials[currentTestimonial] && (
                <div className="text-center">
                  <Quote className="h-12 w-12 text-orange-500 mx-auto mb-6" />
                  
                  <blockquote className="text-2xl font-medium text-gray-900 dark:text-white mb-8">
                    "{featuredTestimonials[currentTestimonial].quote}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center mb-6">
                    <img
                      src={featuredTestimonials[currentTestimonial].avatar}
                      alt={featuredTestimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {featuredTestimonials[currentTestimonial].name}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {featuredTestimonials[currentTestimonial].role}
                      </div>
                      <div className="text-sm text-orange-600 dark:text-orange-400">
                        {featuredTestimonials[currentTestimonial].company}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mb-6">
                    {renderStars(featuredTestimonials[currentTestimonial].rating)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {featuredTestimonials[currentTestimonial].results.map((result, index) => (
                      <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {result.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {result.description}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center space-x-4">
                    {featuredTestimonials[currentTestimonial].videoUrl && (
                      <button className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                        <Play className="h-4 w-4 mr-2" />
                        Voir la vidéo
                      </button>
                    )}
                    {featuredTestimonials[currentTestimonial].caseStudyUrl && (
                      <button className="flex items-center px-6 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Étude de cas
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* All Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Tous les Témoignages
          </h2>

          {/* Industry Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className={`px-6 py-3 rounded-full transition-colors ${
                  selectedIndustry === industry
                    ? 'bg-orange-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      {testimonial.company}
                    </p>
                  </div>
                  {testimonial.featured && (
                    <Award className="h-5 w-5 text-yellow-500" />
                  )}
                </div>

                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                <blockquote className="text-gray-700 dark:text-gray-300 mb-4">
                  "{testimonial.quote}"
                </blockquote>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {testimonial.results.slice(0, 3).map((result, index) => (
                    <div key={index} className="text-center">
                      <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {result.value}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.metric}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowFullStory(testimonial.id)}
                  className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:underline"
                >
                  Lire l'histoire complète →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à Écrire Votre Success Story ?
          </h2>
          <p className="text-xl mb-8">
            Rejoignez des milliers d'entrepreneurs qui ont transformé leur business grâce à nos conseils
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Commencer Maintenant
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
              Partager Mon Témoignage
            </button>
          </div>
        </div>
      </section>

      {/* Full Story Modal */}
      {showFullStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              {(() => {
                const testimonial = testimonials.find(t => t.id === showFullStory);
                if (!testimonial) return null;
                
                return (
                  <>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full mr-4"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {testimonial.role} chez {testimonial.company}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowFullStory(null)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {testimonial.fullStory}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-8">
                      {testimonial.results.map((result, index) => (
                        <div key={index} className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {result.value}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {result.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}