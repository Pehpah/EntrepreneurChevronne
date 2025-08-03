import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { AboutPage } from './pages/AboutPage';
import { AdvertiserPage } from './pages/AdvertiserPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AdminPage } from './pages/AdminPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ArticleDetail } from './components/ArticleDetail';
import { ThemeProvider } from './contexts/ThemeContext';
import { useArticles } from './hooks/useSupabase';
import { Article } from './types';
import { BackToTop } from './components/BackToTop';

type Page = 'accueil' | 'annonceur' | 'gestion-quotidienne' | 'strategie' | 'marketing' | 'finance' | 'productivite' | 'temoignages' | 'ressources' | 'a-propos' | 'admin' | 'search' | 'article-detail';

function App() {
  const { articles, loading: articlesLoading } = useArticles();
  const [currentPage, setCurrentPage] = useState<Page>('accueil');
  const [, setCategorySlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handlePageChange = (page: string) => {
    setCurrentPage(page as Page);
    setCategorySlug('');
    setSearchQuery('');
    setSelectedArticle(null);
  };

  const handleCategorySelect = (slug: string) => {
    setCategorySlug(slug);
    setCurrentPage(slug as Page);
    setSelectedArticle(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('search');
    setSelectedArticle(null);
  };

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article);
    setCurrentPage('article-detail');
  };

  const handleBackToHome = () => {
    setCurrentPage('accueil');
    setSelectedArticle(null);
    setSearchQuery('');
    setCategorySlug('');
  };

  const renderPage = () => {
    if (currentPage === 'article-detail' && selectedArticle) {
      return (
        <ArticleDetail
          article={selectedArticle}
          onBack={handleBackToHome}
        />
      );
    }

    if (currentPage === 'search') {
      return (
        <SearchResultsPage
          searchQuery={searchQuery}
          articles={articles}
          onArticleSelect={handleArticleSelect}
          onBack={handleBackToHome}
        />
      );
    }

    switch (currentPage) {
      case 'accueil':
        return (
          <HomePage
            articles={articles}
            onArticleSelect={handleArticleSelect}
            onCategorySelect={handleCategorySelect}
          />
        );
      case 'a-propos':
        return <AboutPage />;
      case 'annonceur':
        return <AdvertiserPage />;
      case 'ressources':
        return <ResourcesPage />;
      case 'admin':
        return <AdminPage />;
      case 'gestion-quotidienne':
      case 'strategie':
      case 'marketing':
      case 'finance':
      case 'productivite':
      case 'temoignages':
        return (
          <CategoryPage
            categorySlug={currentPage}
            articles={articles}
            onArticleSelect={handleArticleSelect}
          />
        );
      default:
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Page en construction
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Cette section sera bientôt disponible !
              </p>
              <button
                onClick={handleBackToHome}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
        />
        
        <main className="flex-1">
          {articlesLoading && currentPage !== 'admin' ? (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Chargement...</p>
              </div>
            </div>
          ) : (
            renderPage()
          )}
        </main>

        <Footer />
        <BackToTop />
      </div>
    </ThemeProvider>
  );
}

export default App;