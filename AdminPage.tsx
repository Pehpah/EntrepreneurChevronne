import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Download,
  Upload,
  Save,
  X,
  Check,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Globe,
  Shield
} from 'lucide-react';

// =============================================================================
// TYPES ET INTERFACES
// =============================================================================

interface AdminStats {
  totalArticles: number;
  totalUsers: number;
  totalViews: number;
  totalComments: number;
  monthlyGrowth: number;
  activeUsers: number;
}

interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  publishedAt: string;
  lastModified: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  status: 'active' | 'inactive' | 'banned';
  lastLogin: string;
  articlesCount: number;
}

type AdminTab = 'dashboard' | 'articles' | 'users' | 'analytics' | 'settings';

// =============================================================================
// DONNÉES MOCKÉES (à remplacer par des appels API)
// =============================================================================

const mockStats: AdminStats = {
  totalArticles: 156,
  totalUsers: 1247,
  totalViews: 45623,
  totalComments: 892,
  monthlyGrowth: 12.5,
  activeUsers: 89,
};

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Guide complet de la gestion quotidienne',
    author: 'Marie Dubois',
    category: 'Gestion Quotidienne',
    status: 'published',
    views: 1250,
    publishedAt: '2024-01-15',
    lastModified: '2024-01-16',
  },
  {
    id: '2',
    title: 'Stratégies marketing pour PME',
    author: 'Pierre Martin',
    category: 'Marketing',
    status: 'draft',
    views: 0,
    publishedAt: '',
    lastModified: '2024-01-14',
  },
  {
    id: '3',
    title: 'Optimiser sa productivité au travail',
    author: 'Sophie Laurent',
    category: 'Productivité',
    status: 'published',
    views: 890,
    publishedAt: '2024-01-10',
    lastModified: '2024-01-12',
  },
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    role: 'editor',
    status: 'active',
    lastLogin: '2024-01-16',
    articlesCount: 12,
  },
  {
    id: '2',
    name: 'Pierre Martin',
    email: 'pierre.martin@email.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-16',
    articlesCount: 8,
  },
  {
    id: '3',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    role: 'user',
    status: 'inactive',
    lastLogin: '2024-01-10',
    articlesCount: 3,
  },
];

// =============================================================================
// COMPOSANTS UTILITAIRES
// =============================================================================

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}> = ({ title, value, icon, trend, color = 'blue' }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {trend !== undefined && (
          <p className={`text-sm flex items-center mt-1 ${
            trend >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend >= 0 ? '+' : ''}{trend}%
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/20`}>
        {icon}
      </div>
    </div>
  </div>
);

const Badge: React.FC<{
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'danger' | 'info';
}> = ({ children, variant }) => {
  const variants = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${variants[variant]}`}>
      {children}
    </span>
  );
};

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simuler le chargement des données
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // =============================================================================
  // ONGLET DASHBOARD
  // =============================================================================

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Articles"
          value={mockStats.totalArticles}
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          trend={8.2}
          color="blue"
        />
        <StatCard
          title="Total Utilisateurs"
          value={mockStats.totalUsers.toLocaleString()}
          icon={<Users className="w-6 h-6 text-green-600" />}
          trend={12.5}
          color="green"
        />
        <StatCard
          title="Vues Totales"
          value={mockStats.totalViews.toLocaleString()}
          icon={<Eye className="w-6 h-6 text-purple-600" />}
          trend={-2.1}
          color="purple"
        />
        <StatCard
          title="Utilisateurs Actifs"
          value={mockStats.activeUsers}
          icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
          trend={5.7}
          color="orange"
        />
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Articles Récents
          </h3>
          <div className="space-y-3">
            {mockArticles.slice(0, 3).map((article) => (
              <div key={article.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {article.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {article.author} • {article.views} vues
                  </p>
                </div>
                <Badge
                  variant={
                    article.status === 'published' ? 'success' :
                    article.status === 'draft' ? 'warning' : 'info'
                  }
                >
                  {article.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Actions Rapides
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Article
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Users className="w-4 h-4 mr-2" />
              Inviter Utilisateur
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Exporter Données
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // =============================================================================
  // ONGLET ARTICLES
  // =============================================================================

  const renderArticles = () => (
    <div className="space-y-6">
      {/* Barre d'actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher des articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </button>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Article
        </button>
      </div>

      {/* Table des articles */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Auteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Vues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {mockArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {article.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {article.category}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {article.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={
                        article.status === 'published' ? 'success' :
                        article.status === 'draft' ? 'warning' : 'info'
                      }
                    >
                      {article.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {article.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {article.publishedAt || 'Non publié'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // =============================================================================
  // ONGLET UTILISATEURS
  // =============================================================================

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Barre d'actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher des utilisateurs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </button>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Inviter Utilisateur
        </button>
      </div>

      {/* Table des utilisateurs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Articles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Dernière Connexion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={
                        user.role === 'admin' ? 'danger' :
                        user.role === 'editor' ? 'warning' : 'info'
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={
                        user.status === 'active' ? 'success' :
                        user.status === 'inactive' ? 'warning' : 'danger'
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.articlesCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400">
                        <Shield className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // =============================================================================
  // NAVIGATION PRINCIPALE
  // =============================================================================

  const tabs = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ] as const;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'articles':
        return renderArticles();
      case 'users':
        return renderUsers();
      case 'analytics':
        return (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Analytics à venir
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Les statistiques détaillées seront bientôt disponibles.
            </p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Paramètres à venir
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Les paramètres de configuration seront bientôt disponibles.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Administration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gérez votre contenu, vos utilisateurs et vos paramètres
          </p>
        </div>

        {/* Navigation par onglets */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu principal */}
        <div className="mb-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;