import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';

// Context providers
import { ThemeProvider, useTheme } from './ThemeContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorFallback from './components/ErrorFallback';

// Pages - Lazy loading pour optimiser les performances
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ArticlesPage = React.lazy(() => import('./pages/ArticlesPage'));
const ArticleDetailPage = React.lazy(() => import('./pages/ArticleDetailPage'));
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Hooks
import { useAuth } from './hooks/useAuth';
import { useLocalStorage } from './hooks/useLocalStorage';

// Types
interface AppProps {
  className?: string;
}

// Composant de layout principal
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebarOpen', false);

  // Appliquer le thème au document
  useEffect(() => {
    document.documentElement.className = theme;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300`}>
      {/* Header */}
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main 
          className={`
            flex-1 transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'ml-64' : 'ml-0'}
            pt-16 min-h-screen
          `}
        >
          <div className="container mx-auto px-4 py-8">
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900',
        }}
      />
    </div>
  );
};

// Route protégée pour les utilisateurs authentifiés
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Route protégée pour les administrateurs
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Route publique (redirige si connecté)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Composant principal de l'application
const AppContent: React.FC = () => {
  return (
    <Router>
      <AppLayout>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={(error, errorInfo) => {
            console.error('Application Error:', error, errorInfo);
            // Ici vous pouvez ajouter un service de logging comme Sentry
          }}
        >
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<ArticlesPage />} />

            {/* Routes d'authentification */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } 
            />

            {/* Routes protégées */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Routes administrateur */}
            <Route 
              path="/admin/*" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />

            {/* Route 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </AppLayout>
    </Router>
  );
};

// Composant App principal avec tous les providers
const App: React.FC<AppProps> = ({ className }) => {
  return (
    <div className={className}>
      <ThemeProvider defaultTheme="light">
        <AppContent />
      </ThemeProvider>
    </div>
  );
};

// Hook personnalisé pour accéder au contexte de l'app
export const useApp = () => {
  const theme = useTheme();
  const auth = useAuth();

  return {
    ...theme,
    ...auth,
  };
};

// Configuration de l'application
export const appConfig = {
  name: 'Mon Application',
  version: '1.0.0',
  description: 'Application moderne avec React et TypeScript',
  author: 'Votre Nom',
  repository: 'https://github.com/votre-repo',
  homepage: 'https://votre-site.com',
  supportEmail: 'support@votre-site.com',
  features: {
    darkMode: true,
    authentication: true,
    adminPanel: true,
    responsive: true,
    pwa: true,
  },
  routes: {
    home: '/',
    articles: '/articles',
    categories: '/categories',
    profile: '/profile',
    login: '/login',
    register: '/register',
    admin: '/admin',
  },
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    timeout: 10000,
    retries: 3,
  },
  theme: {
    defaultTheme: 'light',
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
} as const;

// Fonction d'initialisation de l'application
export const initializeApp = async () => {
  try {
    // Initialisation des services
    console.log(`🚀 Initialisation de ${appConfig.name} v${appConfig.version}`);
    
    // Vérifier la configuration
    if (!appConfig.api.baseUrl) {
      console.warn('⚠️ URL de l\'API non configurée');
    }

    // Initialiser les services externes si nécessaire
    // await initializeAnalytics();
    // await initializeErrorReporting();
    
    console.log('✅ Application initialisée avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    return false;
  }
};

// Gestionnaire d'erreurs global
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promesse rejetée non gérée:', event.reason);
  // Ici vous pouvez ajouter un service de logging
});

window.addEventListener('error', (event) => {
  console.error('Erreur JavaScript non gérée:', event.error);
  // Ici vous pouvez ajouter un service de logging
});

// Initialiser l'application au chargement
if (typeof window !== 'undefined') {
  initializeApp();
}

export default App;