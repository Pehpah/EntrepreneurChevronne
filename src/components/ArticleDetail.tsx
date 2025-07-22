import React, { useState } from 'react';
import { Calendar, Clock, Tag, ArrowLeft, Share2, Linkedin, MessageCircle, Twitter } from 'lucide-react';
import { Article, Comment } from '../types';
import { categories } from '../data/categories';
import { formatDate } from '../utils/dateUtils';
import { SocialShare } from './SocialShare';
import { Breadcrumb } from './Breadcrumb';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

export function ArticleDetail({ article, onBack }: ArticleDetailProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: '', email: '', content: '' });

  const category = categories.find(cat => cat.slug === article.category);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.author && newComment.email && newComment.content) {
      const comment: Comment = {
        id: Date.now().toString(),
        articleId: article.id,
        author: newComment.author,
        email: newComment.email,
        content: newComment.content,
        publishedAt: new Date().toISOString()
      };
      setComments([...comments, comment]);
      setNewComment({ author: '', email: '', content: '' });
    }
  };

  const shareUrl = `https://entrepreneur-chevronne.com/article/${article.id}`;
  
  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(article.title + ' - ' + shareUrl)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Accueil', onClick: onBack },
          { label: category?.name || 'Article', onClick: onBack },
          { label: article.title }
        ]}
        className="mb-6"
      />

      <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Hero Image */}
        <div className="relative h-64 lg:h-80">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {category && (
            <div className="absolute top-6 left-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-500 text-white">
                <Tag className="w-4 h-4 mr-2" />
                {category.name}
              </span>
            </div>
          )}
        </div>

        {/* Article Header */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} min de lecture</span>
              </div>
              <span>Par {article.author}</span>
            </div>

            {/* Share Buttons */}
            <SocialShare
              url={shareUrl}
              title={article.title}
              description={article.excerpt}
            />
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {article.title}
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            {article.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Article Content */}
        <div className="px-8 pb-8">
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-orange-600 dark:prose-a:text-orange-400">
            <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }} />
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2 text-orange-600" />
          Commentaires ({comments.length})
        </h3>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-8 p-6 bg-slate-50 dark:bg-slate-700 rounded-xl">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Ajouter un commentaire
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Votre nom"
              value={newComment.author}
              onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
              required
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Votre email"
              value={newComment.email}
              onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
              required
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <textarea
            placeholder="Votre commentaire..."
            rows={4}
            value={newComment.content}
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
            required
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300"
          >
            Publier le commentaire
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-orange-500 pl-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-slate-900 dark:text-white">
                  {comment.author}
                </h5>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {new Date(comment.publishedAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                {comment.content}
              </p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">
              Aucun commentaire pour le moment. Soyez le premier à réagir !
            </p>
          )}
        </div>
      </div>
    </div>
  );
}