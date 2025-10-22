import React from 'react';
import { MessageCircle, Users } from 'lucide-react';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { useComments } from '../hooks/useComments';

interface CommentsSectionProps {
  articleId: string;
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const { comments, addComment, addReply } = useComments(articleId);

  const handleAddComment = (commentData: { author: string; email: string; content: string }) => {
    addComment({
      ...commentData,
      articleId,
    });
  };

  const handleAddReply = (parentCommentId: string, replyData: { author: string; email: string; content: string; articleId: string }) => {
    addReply(parentCommentId, replyData);
  };

  const totalComments = comments.length + comments.reduce((total, comment) => total + (comment.replies?.length || 0), 0);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-8 mt-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
          <MessageCircle size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Commentaires
          </h3>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Users size={16} />
            <span>
              {totalComments === 0 
                ? 'Aucun commentaire' 
                : `${totalComments} commentaire${totalComments > 1 ? 's' : ''}`
              }
            </span>
          </div>
        </div>
      </div>

      {/* Add Comment Form */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Laissez un commentaire
        </h4>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <CommentForm onSubmit={handleAddComment} />
        </div>
      </div>

      {/* Comments List */}
      <div>
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
          Discussion
        </h4>
        
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">
              Aucun commentaire pour le moment
            </p>
            <p className="text-slate-400 dark:text-slate-500">
              Soyez le premier à partager votre avis !
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleAddReply}
                articleId={articleId}
                level={0}
              />
            ))}
          </div>
        )}
      </div>

      {/* Guidelines */}
      <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
        <h5 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
          Règles de la communauté
        </h5>
        <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
          <li>• Restez respectueux et constructif dans vos commentaires</li>
          <li>• Évitez le spam et les commentaires hors-sujet</li>
          <li>• Partagez vos expériences et vos questions pertinentes</li>
        </ul>
      </div>
    </div>
  );
}