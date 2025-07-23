import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Search, BookOpen, Star, TrendingUp, Users, Award, Zap, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { SearchBar } from './SearchBar';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onSearch: (query: string) => void;
}

const menuItems = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'articles', label: 'Articles' },
  { id: 'temoignages', label: 'Témoignages' },
  { id: 'ressources', label: 'Ressources' },
  { id: 'collaborations', label: 'Collaborations' },
  { id: 'a-propos', label: 'À propos' }
];

export function Header({ currentPage, onPageChange, onSearch }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { siteConfig } = useSiteConfig();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const iconMap = {
    BookOpen,
    Star,
    TrendingUp,
    Users,
    Award,
    Zap,
  };

  const LogoIcon = iconMap[siteConfig.logo.icon as keyof typeof iconMap] || BookOpen;

  return (
    <header className="bg-white dark:bg-slate-900 shadow-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onPageChange('accueil')}
          >
            {siteConfig.logo.showIcon && (
              <div 
                className="p-2 rounded-lg group-hover:opacity-80 transition-all duration-300"
                style={{
                  background: `linear-gradient(to right, ${siteConfig.theme.primaryColor}, ${siteConfig.theme.secondaryColor})`
                }}
              >
                <LogoIcon className="h-6 w-6 text-white" />
              </div>
            )}
            {siteConfig.logo.showText && (
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {siteConfig.logo.text}
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {siteConfig.logo.subtitle}
                </p>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {menuItems.slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`text-sm font-medium transition-all duration-300 hover:text-orange-600 dark:hover:text-orange-400 ${
                  currentPage === item.id
                    ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400 pb-1'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Admin Button - Toujours visible */}
            <button
              onClick={() => onPageChange('admin')}
              className={`flex items-center space-x-1 text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg ${
                currentPage === 'admin'
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <SearchBar 
              onSearch={onSearch}
              placeholder="Rechercher des articles..."
            />

            {/* User Menu */}
            {isAuthenticated && currentUser && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName)}&background=f97316&color=fff`}
                    alt={currentUser.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {currentUser.displayName}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Admin Button Mobile */}
            <button
              onClick={() => {
                onPageChange('admin');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                currentPage === 'admin'
                  ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}