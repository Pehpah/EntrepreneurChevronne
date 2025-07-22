import React from 'react';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { Article } from '../types';
import { categories } from '../data/categories';
import { formatRelativeDate } from '../utils/dateUtils';
import { SocialShare } from './SocialShare';

interface ArticleCardProps {
  article: Article;
  onReadMore: (article: Article) => void;
  featured?: boolean;
}

export function ArticleCard({ article, onReadMore, featured = false }: ArticleCardProps) {
  const category = categories.find(cat => cat.slug === article.category);
  
  const cardSize = featured ? 'lg:col-span-2' : '';
  const imageHeight = featured ? 'h-64 lg:h-80' : 'h-48';

  return (
    <article className={`group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 ${cardSize}`}>
      {/* Image */}
      <div className={`relative ${imageHeight} overflow-hidden`}>
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
              <Tag className="w-3 h-3 mr-1" />
              {category.name}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500 text-white">
              À la une
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatRelativeDate(article.publishedAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{article.readTime} min de lecture</span>
          </div>
        </div>

        <h3 className={`font-bold text-slate-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 ${
          featured ? 'text-xl lg:text-2xl' : 'text-lg'
        }`}>
          {article.title}
        </h3>

        <p className={`text-slate-600 dark:text-slate-300 mb-4 ${
          featured ? 'text-base' : 'text-sm'
        }`}>
          {article.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Read More Button */}
        <button
          onClick={() => onReadMore(article)}
          className="inline-flex items-center justify-between w-full text-orange-600 dark:text-orange-400 font-medium hover:text-orange-700 dark:hover:text-orange-300 transition-colors duration-300 group/button"
        >
          <div className="flex items-center space-x-2">
            <span>Lire la suite</span>
            <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
          </div>
          <SocialShare
            url={`https://entrepreneur-chevronne.com/article/${article.id}`}
            title={article.title}
            description={article.excerpt}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </button>
      </div>
    </article>
  );
}