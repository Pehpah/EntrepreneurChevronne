import React from 'react';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';
import { Article } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { Newsletter } from '../components/Newsletter';
import { CategoryGrid } from '../components/CategoryGrid';
import { TagCloud } from '../components/TagCloud';
import { AdSidebar } from '../components/AdSidebar';
import { useSiteConfig } from '../hooks/useSiteConfig';

interface HomePageProps {
  articles: Article[];
  onArticleSelect: (article: Article) => void;
  onCategorySelect: (categorySlug: string) => void;
}

export function HomePage({ articles, onArticleSelect, onCategorySelect }: HomePageProps) {
  const featuredArticles = articles.filter(article => article.featured);
  const latestArticles = articles.slice(0, 4);
  const { siteConfig } = useSiteConfig();
  
  // Extract all unique tags from articles
  const allTags = Array.from(new Set(articles.flatMap(article => article.tags)));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20 lg:py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('${siteConfig.hero.backgroundImage}')` }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              {siteConfig.hero.title.split(' ').map((word, index) => {
                const isHighlighted = word === 'idées' || word === 'succès';
                return (
                  <span key={index}>
                    {isHighlighted ? (
                      <span 
                        className="text-transparent bg-clip-text"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${siteConfig.theme.accentColor}, ${siteConfig.theme.primaryColor})`
                        }}
                      >
                        {word}
                      </span>
                    ) : (
                      word
                    )}{' '}
                  </span>
                );
              })}
            </h1>
            <p className="text-xl lg:text-2xl text-slate-300 mb-8">
              {siteConfig.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onCategorySelect(siteConfig.hero.ctaButtons.primary.action)}
                className="px-8 py-4 text-white font-semibold rounded-lg transform hover:scale-105 transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, ${siteConfig.theme.primaryColor}, ${siteConfig.theme.secondaryColor})`
                }}
              >
                {siteConfig.hero.ctaButtons.primary.text}
              </button>
              <button
                onClick={() => onCategorySelect(siteConfig.hero.ctaButtons.secondary.action)}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
              >
                {siteConfig.hero.ctaButtons.secondary.text}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{
                  background: `linear-gradient(to right, ${siteConfig.theme.primaryColor}, ${siteConfig.theme.secondaryColor})`
                }}
              >
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{siteConfig.hero.stats.articles.value}</h3>
              <p className="text-slate-600 dark:text-slate-400">{siteConfig.hero.stats.articles.label}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{siteConfig.hero.stats.users.value}</h3>
              <p className="text-slate-600 dark:text-slate-400">{siteConfig.hero.stats.users.label}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{siteConfig.hero.stats.satisfaction.value}</h3>
              <p className="text-slate-600 dark:text-slate-400">{siteConfig.hero.stats.satisfaction.label}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{siteConfig.hero.stats.growth.value}</h3>
              <p className="text-slate-600 dark:text-slate-400">{siteConfig.hero.stats.growth.label}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Articles à la une
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Nos contenus les plus impactants pour accélérer votre croissance entrepreneuriale
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onReadMore={onArticleSelect}
                featured={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Explorez nos catégories
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Des contenus spécialisés pour chaque aspect de votre parcours entrepreneurial
            </p>
          </div>

          <CategoryGrid onCategorySelect={onCategorySelect} />
        </div>
      </section>

      {/* Latest Articles with Sidebar */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Derniers articles
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Restez à jour avec nos dernières réflexions et conseils
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Articles */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {latestArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onReadMore={onArticleSelect}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar with Ads */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <AdSidebar />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>

      {/* Popular Tags */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Sujets Populaires
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Explorez nos contenus par thématiques
            </p>
          </div>
          <TagCloud 
            tags={allTags.slice(0, 20)} 
            onTagClick={(tag) => console.log('Tag clicked:', tag)}
            className="justify-center"
          />
        </div>
      </section>

      {/* Testimonial Quote */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl lg:text-3xl font-light italic mb-8">
            "Le succès en entrepreneuriat ne se mesure pas seulement par les profits, mais par l'impact positif que vous créez dans le monde."
          </blockquote>
          <cite className="text-lg text-orange-400">— Entrepreneur Chevronné</cite>
        </div>
      </section>
    </div>
  );
}