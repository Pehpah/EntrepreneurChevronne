import React from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Article } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { articles } from '../data/articles';

interface SearchResultsPageProps {
  query: string;
  onArticleSelect: (article: Article) => void;
}

export function SearchResultsPage({ query, onArticleSelect }: SearchResultsPageProps) {
  const searchResults = articles.filter(article => 
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
    article.content.toLowerCase().includes(query.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <section className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>

          <div className="flex items-center space-x-4">
            <Search className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Résultats de recherche
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {searchResults.length} résultat{searchResults.length !== 1 ? 's' : ''} pour "{query}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onReadMore={onArticleSelect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="h-24 w-24 text-slate-400 dark:text-slate-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Aucun résultat trouvé
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
                Nous n'avons trouvé aucun article correspondant à votre recherche "{searchQuery}".
                Essayez avec d'autres mots-clés ou explorez nos catégories.
              </p>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              >
                Retour à l'accueil
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}