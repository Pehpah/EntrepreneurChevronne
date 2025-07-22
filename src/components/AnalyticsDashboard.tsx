import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Monitor, 
  Tablet, 
  Smartphone,
  Search,
  MessageCircle,
  FileText,
  Calendar
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';

export function AnalyticsDashboard() {
  const { getMetrics } = useAnalytics();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  const metrics = useMemo(() => getMetrics(), [getMetrics]);

  const formatDuration = (minutes: number) => {
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Analytics Dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Aperçu des performances de votre blog
          </p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="7d">7 derniers jours</option>
          <option value="30d">30 derniers jours</option>
          <option value="90d">90 derniers jours</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pages vues</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatNumber(metrics.totalPageViews)}
              </p>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                <TrendingUp size={14} />
                <span>+12.5%</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Visiteurs uniques</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatNumber(metrics.uniqueVisitors)}
              </p>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                <TrendingUp size={14} />
                <span>+8.2%</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Durée moyenne</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatDuration(metrics.averageSessionDuration)}
              </p>
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                <TrendingDown size={14} />
                <span>-2.1%</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Taux de rebond</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {metrics.bounceRate.toFixed(1)}%
              </p>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                <TrendingDown size={14} />
                <span>-5.3%</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Vues quotidiennes
            </h3>
          </div>
          
          <div className="space-y-2">
            {metrics.dailyViews.slice(-7).map((day, index) => {
              const maxViews = Math.max(...metrics.dailyViews.map(d => d.views));
              const percentage = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
              
              return (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-16">
                    {new Date(day.date).toLocaleDateString('fr-FR', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white w-8 text-right">
                    {day.views}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Répartition par appareil
          </h3>
          
          <div className="space-y-4">
            {Object.entries(metrics.deviceBreakdown).map(([device, count]) => {
              const total = Object.values(metrics.deviceBreakdown).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={device} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(device)}
                    <span className="text-slate-900 dark:text-white capitalize">
                      {device === 'mobile' ? 'Mobile' : device === 'tablet' ? 'Tablette' : 'Desktop'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white w-12 text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Pages populaires
            </h3>
          </div>
          
          <div className="space-y-3">
            {metrics.topPages.slice(0, 5).map((page, index) => (
              <div key={page.path} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {page.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {page.path}
                  </p>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white ml-2">
                  {page.views}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Search Queries */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recherches populaires
            </h3>
          </div>
          
          <div className="space-y-3">
            {metrics.topSearchQueries.slice(0, 5).map((query, index) => (
              <div key={query.query} className="flex items-center justify-between">
                <span className="text-sm text-slate-900 dark:text-white">
                  {query.query}
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {query.count}
                </span>
              </div>
            ))}
            {metrics.topSearchQueries.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                Aucune recherche enregistrée
              </p>
            )}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Sources de trafic
            </h3>
          </div>
          
          <div className="space-y-3">
            {metrics.trafficSources.slice(0, 5).map((source, index) => {
              const total = metrics.trafficSources.reduce((sum, s) => sum + s.count, 0);
              const percentage = total > 0 ? (source.count / total) * 100 : 0;
              
              return (
                <div key={source.source} className="flex items-center justify-between">
                  <span className="text-sm text-slate-900 dark:text-white capitalize">
                    {source.source === 'direct' ? 'Direct' : source.source}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {percentage.toFixed(1)}%
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {source.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}