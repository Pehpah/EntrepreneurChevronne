import React from 'react';
import { BarChart3, Users, MessageCircle, FileText, TrendingUp, Eye } from 'lucide-react';
import { useNewsletter } from '../hooks/useNewsletter';
import { useComments } from '../hooks/useComments';
import { articles } from '../data/articles';

export function AdminStats() {
  const { getSubscriberCount } = useNewsletter();
  const totalSubscribers = getSubscriberCount();

  // Calculate total comments across all articles
  const allComments = articles.reduce((total, article) => {
    const { comments } = useComments(article.id);
    return total + comments.length + comments.reduce((acc, comment) => acc + (comment.replies?.length || 0), 0);
  }, 0);

  const stats = [
    {
      title: 'Articles publiés',
      value: articles.length,
      icon: FileText,
      color: 'bg-blue-500',
      trend: '+2 ce mois'
    },
    {
      title: 'Abonnés newsletter',
      value: totalSubscribers,
      icon: Users,
      color: 'bg-green-500',
      trend: '+12 cette semaine'
    },
    {
      title: 'Commentaires',
      value: allComments,
      icon: MessageCircle,
      color: 'bg-purple-500',
      trend: '+8 aujourd\'hui'
    },
    {
      title: 'Vues estimées',
      value: articles.length * 156,
      icon: Eye,
      color: 'bg-orange-500',
      trend: '+24% ce mois'
    }
  ];

  const topCategories = [
    { name: 'Stratégie', count: articles.filter(a => a.category === 'strategie').length },
    { name: 'Marketing', count: articles.filter(a => a.category === 'marketing').length },
    { name: 'Finance', count: articles.filter(a => a.category === 'finance').length },
    { name: 'Productivité', count: articles.filter(a => a.category === 'productivite').length },
  ].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <TrendingUp size={14} />
                  {stat.trend}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Articles par catégorie</h3>
          </div>
          <div className="space-y-3">
            {topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">{category.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(category.count / articles.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white w-8 text-right">
                    {category.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Activité récente</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-white">Nouvel abonné newsletter</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Il y a 2 minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-white">Nouveau commentaire</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Il y a 15 minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-white">Article consulté</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Il y a 1 heure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}