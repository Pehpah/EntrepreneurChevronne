import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X, Upload, Calendar, Tag, User, Clock } from 'lucide-react';
import { Article } from '../types';
import { articles as initialArticles } from '../data/articles';
import { categories } from '../data/categories';

export function AdminPage() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [newArticle, setNewArticle] = useState<Omit<Article, 'id'>>({
    title: '',
    excerpt: '',
    content: '',
    author: 'Admin',
    publishedAt: new Date().toISOString(),
    readTime: 5,
    category: categories[0].id,
    tags: [],
    imageUrl: '',
    featured: false
  });

  const handleSave = () => {
    if (editingArticle) {
      // Mise à jour d'un article existant
      setArticles(articles.map(article => 
        article.id === editingArticle.id ? editingArticle : article
      ));
    } else {
      // Création d'un nouvel article
      const article: Article = {
        ...newArticle,
        id: Date.now().toString(),
        publishedAt: new Date().toISOString()
      };
      setArticles([article, ...articles]);
    }
    
    setIsEditing(false);
    setEditingArticle(null);
    setNewArticle({
      title: '',
      excerpt: '',
      content: '',
      author: 'Admin',
      publishedAt: new Date().toISOString(),
      readTime: 5,
      category: categories[0].id,
      tags: [],
      imageUrl: '',
      featured: false
    });
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setArticles(articles.filter(article => article.id !== id));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingArticle(null);
    setShowPreview(false);
  };

  const currentArticle = editingArticle || newArticle;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Administration des Articles
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gérez vos articles de blog, créez du nouveau contenu et modifiez les publications existantes.
          </p>
        </div>

        {!isEditing ? (
          <div>
            {/* Bouton Nouveau Article */}
            <div className="mb-6">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouvel Article
              </button>
            </div>

            {/* Liste des Articles */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Articles ({articles.length})
                </h2>
              </div>
              
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {articles.map((article) => (
                  <div key={article.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-slate-900 dark:text-white truncate">
                            {article.title}
                          </h3>
                          {article.featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                              À la Une
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {article.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {article.readTime} min
                          </div>
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            {categories.find(cat => cat.id === article.category)?.name}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(article)}
                          className="p-2 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowPreview(true)}
                          className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          title="Aperçu"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {editingArticle ? 'Modifier l\'Article' : 'Nouvel Article'}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showPreview ? 'Édition' : 'Aperçu'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors duration-200"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors duration-200"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {!showPreview ? (
                <div className="space-y-6">
                  {/* Titre */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Titre de l'article
                    </label>
                    <input
                      type="text"
                      value={currentArticle.title}
                      onChange={(e) => {
                        if (editingArticle) {
                          setEditingArticle({ ...editingArticle, title: e.target.value });
                        } else {
                          setNewArticle({ ...newArticle, title: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-700 dark:text-white"
                      placeholder="Entrez le titre de votre article..."
                    />
                  </div>

                  {/* Extrait */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Extrait
                    </label>
                    <textarea
                      value={currentArticle.excerpt}
                      onChange={(e) => {
                        if (editingArticle) {
                          setEditingArticle({ ...editingArticle, excerpt: e.target.value });
                        } else {
                          setNewArticle({ ...newArticle, excerpt: e.target.value });
                        }
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-700 dark:text-white"
                      placeholder="Résumé de votre article..."
                    />
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      URL de l'image
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={currentArticle.imageUrl}
                        onChange={(e) => {
                          if (editingArticle) {
                            setEditingArticle({ ...editingArticle, imageUrl: e.target.value });
                          } else {
                            setNewArticle({ ...newArticle, imageUrl: e.target.value });
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-700 dark:text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <Upload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Métadonnées */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Catégorie
                      </label>
                      <select
                        value={currentArticle.category}
                        onChange={(e) => {
                          if (editingArticle) {
                            setEditingArticle({ ...editingArticle, category: e.target.value });
                          } else {
                            setNewArticle({ ...newArticle, category: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-700 dark:text-white"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Temps de lecture (min)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={currentArticle.readTime}
                        onChange={(e) => {
                          if (editingArticle) {
                            setEditingArticle({ ...editingArticle, readTime: parseInt(e.target.value) });
                          } else {
                            setNewArticle({ ...newArticle, readTime: parseInt(e.target.value) });
                          }
                        }}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Auteur
                      </label>
                      <input
                        type="text"
                        value={currentArticle.author}
                        onChange={(e) => {
                          if (editingArticle) {
                            setEditingArticle({ ...editingArticle, author: e.target.value });
                          } else {
                            setNewArticle({ ...newArticle, author: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Tags (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={currentArticle.tags.join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                        if (editingArticle) {
                          setEditingArticle({ ...editingArticle, tags });
                        } else {
                          setNewArticle({ ...newArticle, tags });
                        }
                      }}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-700 dark:text-white"
                      placeholder="entrepreneuriat, startup, business..."
                    />
                  </div>

                  {/* À la Une */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={currentArticle.featured}
                      onChange={(e) => {
                        if (editingArticle) {
                          setEditingArticle({ ...editingArticle, featured: e.target.checked });
                        } else {
                          setNewArticle({ ...newArticle, featured: e.target.checked });
                        }
                      }}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300 dark:border-slate-600 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                      Mettre en avant cet article
                    </label>
                  </div>

                  {/* Contenu */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Contenu de l'article
                    </label>
                    <textarea
                      value={currentArticle.content}
                      onChange={(e) => {
                        if (editingArticle) {
                          setEditingArticle({ ...editingArticle, content: e.target.value });
                        } else {
                          setNewArticle({ ...newArticle, content: e.target.value });
                        }
                      }}
                      rows={20}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-700 dark:text-white font-mono text-sm"
                      placeholder="Rédigez votre article en Markdown..."
                    />
                  </div>
                </div>
              ) : (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h1>{currentArticle.title}</h1>
                  <p className="lead">{currentArticle.excerpt}</p>
                  {currentArticle.imageUrl && (
                    <img 
                      src={currentArticle.imageUrl} 
                      alt={currentArticle.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                  <div className="whitespace-pre-wrap">{currentArticle.content}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}