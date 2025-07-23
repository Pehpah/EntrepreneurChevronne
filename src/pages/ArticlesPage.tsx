import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Clock, User, Tag, TrendingUp, BookOpen, ArrowRight, Star, Eye } from 'lucide-react';
import { articles } from '../data/articles';
import { categories } from '../data/categories';
import { Article } from '../types';

type SortOption = 'recent' | 'popular' | 'alphabetical' | 'reading-time';
type ViewMode = 'grid' | 'list';

export function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort articles
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Sort articles
    switch (sortBy) {
      case 'recent':
        return filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      case 'popular':
        return filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'alphabetical':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'reading-time':
        return filtered.sort((a, b) => (a.readingTime || 0) - (b.readingTime || 0));
      default:
        return filtered;
    }
  }, [searchTerm, selectedCategory, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const getCategoryInfo = (categorySlug: string) => {
    return categories.find(cat => cat.slug === categorySlug);
  };

  const ArticleCard = ({ article, isListView = false }: { article: Article; isListView?: boolean }) => {
    const categoryInfo = getCategoryInfo(article.category);
    const readingTime = getReadingTime(article.content);

    if (isListView) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 flex gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              {categoryInfo && (
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${categoryInfo.color}20`,
                    color: categoryInfo.color 
                  }}
                >
                  {categoryInfo.name}
                </span>
              )}
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(article.publishedAt)}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                {readingTime} min
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              {article.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <User className="h-4 w-4 mr-1" />
                {article.author}
              </div>
              
              <button className="flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm">
                Lire l'article
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          
          <div className="w-48 flex-shrink-0">
            <div className="w-full h-32 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
        <div className="h-48 bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center relative overflow-hidden">
          <BookOpen className="h-16 w-16 text-white group-hover:scale-110 transition-transform" />
          <div className="absolute top-4 left-4">
            {categoryInfo && (
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white"
              >
                {categoryInfo.name}
              </span>
            )}
          </div>
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-2 text-white text-xs">
              <Eye className="h-3 w-3" />
              <span>{article.views || Math.floor(Math.random() * 1000) + 100}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(article.publishedAt)}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {readingTime} min
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <User className="h-4 w-4 mr-1" />
              {article.author}
            </div>
            
            <button className="flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm">
              Lire
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-6 text-white/90" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tous nos Articles
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Découvrez notre collection complète d'articles sur l'entrepreneuriat, la stratégie et la croissance
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">{articles.length}</div>
              <div className="text-sm">Articles Publiés</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">{categories.length}</div>
              <div className="text-sm">Catégories</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-sm">Lecteurs</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans les articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="w-full lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="recent">Plus récents</option>
                <option value="popular">Plus populaires</option>
                <option value="alphabetical">Alphabétique</option>
                <option value="reading-time">Temps de lecture</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 flex items-center ${
                  viewMode === 'grid'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <div className="grid grid-cols-2 gap-1 w-4 h-4">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 flex items-center ${
                  viewMode === 'list'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <div className="space-y-1 w-4 h-4">
                  <div className="bg-current h-1 rounded-sm"></div>
                  <div className="bg-current h-1 rounded-sm"></div>
                  <div className="bg-current h-1 rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredAndSortedArticles.length} article{filteredAndSortedArticles.length > 1 ? 's' : ''} trouvé{filteredAndSortedArticles.length > 1 ? 's' : ''}
              {searchTerm && ` pour "${searchTerm}"`}
              {selectedCategory !== 'all' && ` dans "${getCategoryInfo(selectedCategory)?.name}"`}
            </p>
          </div>
        </div>

        {/* Categories Quick Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              Tout ({articles.length})
            </button>
            {categories.map((category) => {
              const count = articles.filter(a => a.category === category.slug).length;
              return (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? 'text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.slug ? category.color : undefined,
                    borderColor: selectedCategory === category.slug ? category.color : undefined
                  }}
                >
                  {category.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles Grid/List */}
        {filteredAndSortedArticles.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
          }>
            {filteredAndSortedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                isListView={viewMode === 'list'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun article trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Essayez de modifier vos critères de recherche ou de filtrage
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-orange-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ne Ratez Aucun Article
          </h2>
          <p className="text-xl mb-8">
            Recevez nos derniers articles directement dans votre boîte mail
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-600"
            />
            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              S'abonner
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}