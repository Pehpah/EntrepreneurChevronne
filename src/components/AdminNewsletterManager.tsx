import React, { useState } from 'react';
import { Users, Mail, Download, Trash2, Search, Calendar, Filter } from 'lucide-react';
import { useNewsletter } from '../hooks/useNewsletter';
import { formatDate } from '../utils/dateUtils';

export function AdminNewsletterManager() {
  const { subscribers, unsubscribe } = useNewsletter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'email' | 'date'>('date');

  const filteredSubscribers = subscribers
    .filter(subscriber => 
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'email') {
        return a.email.localeCompare(b.email);
      }
      return new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime();
    });

  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Date d\'inscription'],
      ...subscribers.map(sub => [sub.email, formatDate(sub.subscribedAt)])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUnsubscribe = (email: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir désinscrire ${email} ?`)) {
      unsubscribe(email);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Gestion Newsletter
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {subscribers.length} abonné{subscribers.length > 1 ? 's' : ''} au total
              </p>
            </div>
          </div>
          
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Download size={16} />
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher par email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'email' | 'date')}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="date">Trier par date</option>
              <option value="email">Trier par email</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="p-6">
        {filteredSubscribers.length === 0 ? (
          <div className="text-center py-8">
            <Mail size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              {searchTerm ? 'Aucun abonné trouvé pour cette recherche' : 'Aucun abonné pour le moment'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSubscribers.map((subscriber, index) => (
              <div
                key={subscriber.email}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {subscriber.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {subscriber.email}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                      <Calendar size={12} />
                      <span>Inscrit le {formatDate(subscriber.subscribedAt)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleUnsubscribe(subscriber.email)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Désinscrire"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      {subscribers.length > 0 && (
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 rounded-b-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{subscribers.length}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total abonnés</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {subscribers.filter(s => new Date(s.subscribedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Cette semaine</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {subscribers.filter(s => new Date(s.subscribedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Ce mois</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}