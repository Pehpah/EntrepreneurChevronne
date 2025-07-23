import React, { useState, useEffect } from 'react';
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
import { articles } from './data/articles';
import { Article } from './types';
import { BackToTop } from './components/BackToTop';
import { useAnalytics } from './hooks/useAnalytics';
import { useSEO } from './hooks/useSEO';
import { defaultSEO, generateArticleSEO, generateCategorySEO } from './utils/seo';
import { categories } from './data/categories';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { EmergencyCleanup } from './components/EmergencyCleanup';
import { autoCleanupIfNeeded } from './utils/storageCleanup';
import { EMERGENCY_RESET, checkStorageStatus, testLocalStorageWrite } from './utils/emergencyCleanup';

type Page = 'accueil' | 'annonceur' | 'gestion-quotidienne' | 'strategie' | 'marketing' | 'finance' | 'productivite' | 'temoignages' | 'ressources' | 'a-propos' | 'admin' | 'search' | 'article-detail';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('accueil');
  const [categorySlug, setCategorySlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  
  const { trackPageView, trackEvent, trackSearch } = useAnalytics();
  const { isAuthenticated, isLoading, hasPermission } = useAuth();

  // Auto-cleanup localStorage au démarrage
  useEffect(() => {
    console.log('🔍 Vérification du localStorage au démarrage...');
    
    // Test d'écriture
    if (!testLocalStorageWrite()) {
      console.log('🚨 localStorage défaillant, reset complet nécessaire');
      EMERGENCY_RESET();
      return;
    }
    
    // Vérification de l'état
    const status = checkStorageStatus();
    if (parseFloat(status.totalMB) > 4) {
      console.log('🚨 localStorage trop plein, reset complet...');
      EMERGENCY_RESET();
      return;
    }
    
    // Nettoyage normal
    autoCleanupIfNeeded();
  }, []);

  // SEO Management
  const getSEOData = () => {
    if (selectedArticle) {
      const category = categories.find(cat => cat.slug === selectedArticle.category);
      return generateArticleSEO(selectedArticle, category);
    }
    
    if (categorySlug && categories.find(cat => cat.slug === categorySlug)) {
      const category = categories.find(cat => cat.slug === categorySlug)!;
      const categoryArticles = articles.filter(a => a.category === categorySlug);
      return generateCategorySEO(category, categoryArticles.length);
    }
    
    return defaultSEO;
  };

  useSEO(getSEOData(), selectedArticle ? 'article' : 'website', selectedArticle);

  // Track page views
  useEffect(() => {
    const getPageTitle = () => {
      if (selectedArticle) return selectedArticle.title;
      if (categorySlug) {
        const category = categories.find(cat => cat.slug === categorySlug);
        return category?.name || categorySlug;
      }
      
      switch (currentPage) {
        case 'accueil': return 'Accueil';
        case 'a-propos': return 'À propos';
        case 'annonceur': return 'Annonceur';
        case 'ressources': return 'Ressources';
        case 'admin': return 'Administration';
        case 'search': return `Recherche: ${searchQuery}`;
        default: return currentPage;
      }
    };

    const path = selectedArticle 
      ? `/article/${selectedArticle.id}`
      : categorySlug 
        ? `/category/${categorySlug}`
        : `/${currentPage}`;

    trackPageView(path, getPageTitle());

    // Track specific events
    if (selectedArticle) {
      trackEvent('article_view', { articleId: selectedArticle.id });
    } else if (categorySlug) {
      trackEvent('category_view', { category: categorySlug });
    }
  }, [currentPage, categorySlug, selectedArticle, searchQuery, trackPageView, trackEvent]);

  const handlePageChange = (page: string) => {
    console.log(`📍 Navigation vers: ${page}`);
    
    if (page === 'admin') {
      console.log('🔓 ACCÈS ADMIN - BYPASS TEMPORAIRE POUR DEBUG');
      // Bypass temporaire de l'authentification pour debug
      setCurrentPage(page as Page);
      setCategorySlug('');
      setSearchQuery('');
      setSelectedArticle(null);
      setShowLogin(false);
      trackPageView(`/${page}`, 'Administration');
      return;
    }
    
    setCurrentPage(page as Page);
    setCategorySlug('');
    setSearchQuery('');
    setSelectedArticle(null);
    setShowLogin(false);
    
    trackPageView(`/${page}`, page);
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
    trackSearch(query);
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
    // Show login form if needed
    if (showLogin) {
      return <LoginForm onSuccess={() => {
        setShowLogin(false);
        setCurrentPage('admin');
      }} />;
    }

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
          {renderPage()}
        </main>

        <Footer />
        <BackToTop />
        <EmergencyCleanup />
      </div>
    </ThemeProvider>
  );
}

export default App;