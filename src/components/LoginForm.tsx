import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials } from '../types';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isAccountLocked } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(credentials);
      
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email: string) => {
    setCredentials({ email, password: '' });
    setError('');
    setIsLoading(true);

    // Demo passwords
    const demoPasswords: Record<string, string> = {
      'admin@entrepreneur-chevronne.com': 'Admin123!',
      'marie.dupont@example.com': 'Marie123!',
      'jean.martin@example.com': 'Jean123!',
    };

    try {
      const result = await login({
        email,
        password: demoPasswords[email],
      });
      
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = credentials.email && credentials.password;
  const accountLocked = isAccountLocked(credentials.email);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
            <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
            Connexion sécurisée
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Accédez à votre espace d'administration
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Comptes de démonstration
            </span>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleDemoLogin('admin@entrepreneur-chevronne.com')}
              disabled={isLoading}
              className="w-full text-left text-xs text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 disabled:opacity-50"
            >
              👑 Admin: admin@entrepreneur-chevronne.com
            </button>
            <button
              onClick={() => handleDemoLogin('marie.dupont@example.com')}
              disabled={isLoading}
              className="w-full text-left text-xs text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 disabled:opacity-50"
            >
              ✏️ Éditeur: marie.dupont@example.com
            </button>
            <button
              onClick={() => handleDemoLogin('jean.martin@example.com')}
              disabled={isLoading}
              className="w-full text-left text-xs text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 disabled:opacity-50"
            >
              📝 Auteur: jean.martin@example.com
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Adresse email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-700 dark:text-white"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-700 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
                <span className="text-sm text-red-800 dark:text-red-300">{error}</span>
              </div>
            </div>
          )}

          {accountLocked && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                <span className="text-sm text-yellow-800 dark:text-yellow-300">
                  Compte temporairement verrouillé pour des raisons de sécurité
                </span>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={!isFormValid || isLoading || accountLocked}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>

          <div className="text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p>🔒 Connexion sécurisée avec chiffrement</p>
              <p>⏰ Session automatique (60 min)</p>
              <p>🛡️ Protection contre les attaques par force brute</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}