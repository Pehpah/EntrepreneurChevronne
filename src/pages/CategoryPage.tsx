import React from 'react';
import { Article } from '../types';
import { categories } from '../data/categories';
import { ArticleCard } from '../components/ArticleCard';
import { Target, Calendar, Megaphone, PiggyBank, Zap, MessageSquare } from 'lucide-react';

interface CategoryPageProps {
  categorySlug: string;
  articles: Article[];
  onArticleSelect: (article: Article) => void;
}

const iconMap = {
  Calendar,
  Target,
  Megaphone,
  PiggyBank,
  Zap,
  MessageSquare
};

export function CategoryPage({ categorySlug, articles, onArticleSelect }: CategoryPageProps) {
  const category = categories.find(cat => cat.slug === categorySlug);
  const categoryArticles = articles.filter(article => article.category === categorySlug);

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Catégorie introuvable
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            La catégorie demandée n'existe pas.
          </p>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[category.icon as keyof typeof iconMap];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Category Header */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
              <IconComponent className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                {category.name}
              </h1>
              <p className="text-xl text-slate-300">
                {category.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-slate-400">
            <span>{categoryArticles.length} articles disponibles</span>
            <span>•</span>
            <span>Mis à jour régulièrement</span>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categoryArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onReadMore={onArticleSelect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-6">
                <IconComponent className="h-24 w-24 text-slate-400 dark:text-slate-600 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Aucun article pour le moment
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Nous travaillons sur du contenu exceptionnel pour cette catégorie. 
                Revenez bientôt pour découvrir nos derniers articles !
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}