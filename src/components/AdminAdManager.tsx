import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, TrendingUp, DollarSign, MousePointer } from 'lucide-react';
import { Advertisement } from '../types';
import { useAdvertisements } from '../hooks/useAdvertisements';
import { AdBanner } from './AdBanner';

export function AdminAdManager() {
  const { ads, getAdStats, addAdvertisement, updateAdvertisement, deleteAdvertisement } = useAdvertisements();
  const [isEditing, setIsEditing] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    targetUrl: '',
    sponsor: '',
    position: 'sidebar' as Advertisement['position'],
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAd) {
      updateAdvertisement(editingAd.id, formData);
    } else {
      addAdvertisement(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingAd(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      targetUrl: '',
      sponsor: '',
      position: 'sidebar',
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 5
    });
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description,
      imageUrl: ad.imageUrl,
      targetUrl: ad.targetUrl,
      sponsor: ad.sponsor,
      position: ad.position,
      isActive: ad.isActive,
      startDate: ad.startDate,
      endDate: ad.endDate,
      priority: ad.priority
    });
    setIsEditing(true);
  };

  const handleDelete = (adId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
      deleteAdvertisement(adId);
    }
  };

  const totalRevenue = ads.reduce((total, ad) => total + (ad.clickCount * 2.5), 0); // Exemple: 2.5€ par clic
  const totalClicks = ads.reduce((total, ad) => total + ad.clickCount, 0);
  const totalImpressions = ads.reduce((total, ad) => total + ad.impressions, 0);
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Revenus totaux</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalRevenue.toFixed(2)}€</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total clics</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalClicks}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <MousePointer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Impressions</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalImpressions}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">CTR moyen</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{averageCTR}%</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Ad Form */}
      {isEditing && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {editingAd ? 'Modifier la publicité' : 'Nouvelle publicité'}
            </h3>
            <button
              onClick={resetForm}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Sponsor
                </label>
                <input
                  type="text"
                  value={formData.sponsor}
                  onChange={(e) => setFormData({ ...formData, sponsor: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  URL de l'image
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  URL cible
                </label>
                <input
                  type="url"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Position
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value as Advertisement['position'] })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="sidebar">Sidebar</option>
                  <option value="article-top">Haut d'article</option>
                  <option value="article-bottom">Bas d'article</option>
                  <option value="header">Header</option>
                  <option value="footer">Footer</option>
                  <option value="between-articles">Entre articles</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Priorité (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-orange-600 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Active
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                {editingAd ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Gestion des Publicités
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={16} />
          Nouvelle publicité
        </button>
      </div>

      {/* Ads List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ads.map((ad) => {
          const stats = getAdStats(ad.id);
          return (
            <div key={ad.id} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {ad.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {ad.sponsor} • {ad.position}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(ad)}
                    className="p-2 text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 transition-colors"
                    title="Modifier"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(ad.id)}
                    className="p-2 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="mb-4">
                <AdBanner ad={ad} size="small" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {stats.totalClicks}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Clics</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {stats.totalImpressions}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Vues</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {stats.ctr}%
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">CTR</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}