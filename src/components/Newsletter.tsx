import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, X, AlertCircle, Info, Users } from 'lucide-react';
import { useNewsletter } from '../hooks/useNewsletter';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const { subscribe, isSubscribing, message, clearMessage, getSubscriberCount } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const success = await subscribe(email.trim());
    if (success) {
      setEmail('');
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  const getMessageIcon = () => {
    switch (message?.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getMessageColor = () => {
    switch (message?.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return '';
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      <div className="max-w-md mx-auto text-center relative z-10">
        <Mail className="h-12 w-12 mx-auto mb-4 text-orange-100" />
        <h3 className="text-2xl font-bold mb-2">
          Rejoignez notre communauté
        </h3>
        <p className="text-orange-100 mb-2">
          Recevez chaque semaine nos meilleurs conseils, outils et témoignages d'entrepreneurs qui réussissent.
        </p>
        
        {/* Subscriber count */}
        <div className="flex items-center justify-center gap-2 text-orange-200 mb-6">
          <Users className="w-4 h-4" />
          <span className="text-sm">
            {getSubscriberCount()} entrepreneur{getSubscriberCount() > 1 ? 's' : ''} déjà inscrit{getSubscriberCount() > 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg border flex items-center gap-2 ${getMessageColor()}`}>
            {getMessageIcon()}
            <span className="text-sm flex-1">{message.text}</span>
            <button
              onClick={clearMessage}
              className="hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Votre email professionnel"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubscribing}
              className="flex-1 px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isSubscribing || !email.trim()}
              className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubscribing ? 'Inscription...' : "S'inscrire"}
            </button>
          </div>
        </form>
        
        <p className="text-xs text-orange-200 mt-4">
          ✓ Aucun spam • ✓ Désinscription en un clic • ✓ Données protégées
        </p>
      </div>
    </div>
  );
}