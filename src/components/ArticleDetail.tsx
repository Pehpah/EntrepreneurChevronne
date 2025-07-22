import React from 'react';
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { Article } from '../types';
import { categories } from '../data/categories';
import { formatDate } from '../utils/dateUtils';
import { SocialShare } from './SocialShare';
import { Breadcrumb } from './Breadcrumb';
import { CommentsSection } from './CommentsSection';
import { AdBanner } from './AdBanner';
import { useAdvertisements } from '../hooks/useAdvertisements';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

export function ArticleDetail({ article, onBack }: ArticleDetailProps) {
  const category = categories.find(cat => cat.slug === article.category);
  const { getAdsByPosition } = useAdvertisements();
  
  const topAds = getAdsByPosition('article-top', 1);
  const bottomAds = getAdsByPosition('article-bottom', 1);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Accueil', onClick: onBack },
          { label: category?.name || 'Article', onClick: onBack },
          { label: article.title }
        ]}
        className="mb-6"
      />

      <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Hero Image */}
        <div className="relative h-64 lg:h-80">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {category && (
            <div className="absolute top-6 left-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-500 text-white">
                <Tag className="w-4 h-4 mr-2" />
                {category.name}
              </span>
            </div>
          )}
        </div>

        {/* Article Header */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} min de lecture</span>
              </div>
              <span>Par {article.author}</span>
            </div>

            {/* Share Buttons */}
            <SocialShare
              url={shareUrl}
              title={article.title}
              description={article.excerpt}
            />
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {article.title}
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            {article.excerpt}
          </p>

          {/* Top Advertisement */}
          {topAds.length > 0 && (
            <div className="mb-8">
              <AdBanner ad={topAds[0]} size="large" />
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Article Content */}
        <div className="px-8 pb-8">
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-orange-600 dark:prose-a:text-orange-400">
            <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }} />
          </div>

          {/* Bottom Advertisement */}
          {bottomAds.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              <AdBanner ad={bottomAds[0]} size="large" />
            </div>
          )}
        </div>
      </article>

      {/* Comments Section */}
      <CommentsSection articleId={article.id} />
    </div>
  );
}