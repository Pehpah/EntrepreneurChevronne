import React, { useState } from 'react';
import { Reply, Clock, User } from 'lucide-react';
import { Comment } from '../types';
import { CommentForm } from './CommentForm';
import { formatDate } from '../utils/dateUtils';

interface CommentItemProps {
  comment: Comment;
  onReply: (parentCommentId: string, reply: { author: string; email: string; content: string; articleId: string }) => void;
  articleId: string;
  level?: number;
}

export function CommentItem({ comment, onReply, articleId, level = 0 }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const handleReply = (replyData: { author: string; email: string; content: string }) => {
    onReply(comment.id, { ...replyData, articleId });
    setShowReplyForm(false);
  };

  const getIndentClass = () => {
    const indentLevels = ['', 'ml-6', 'ml-12', 'ml-18'];
    return indentLevels[Math.min(level, 3)] || 'ml-18';
  };

  const getBorderColor = () => {
    const colors = ['border-orange-500', 'border-blue-500', 'border-green-500', 'border-purple-500'];
    return colors[level % colors.length];
  };

  return (
    <div className={`${getIndentClass()}`}>
      <div className={`border-l-4 ${getBorderColor()} pl-4 py-4 bg-white dark:bg-slate-800 rounded-r-lg mb-4 shadow-sm`}>
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h5 className="font-semibold text-slate-900 dark:text-white">
                {comment.author}
              </h5>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock size={14} />
                <span>{formatDate(comment.publishedAt)}</span>
              </div>
            </div>
          </div>
          
          {level < 3 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
            >
              <Reply size={14} />
              Répondre
            </button>
          )}
        </div>

        {/* Comment Content */}
        <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-300 mb-3">
          <p className="whitespace-pre-wrap">{comment.content}</p>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <CommentForm
            onSubmit={handleReply}
            onCancel={() => setShowReplyForm(false)}
            placeholder="Votre réponse..."
            submitLabel="Répondre"
            isReply={true}
          />
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 mb-3 transition-colors"
            >
              {showReplies ? 'Masquer' : 'Afficher'} {comment.replies.length} réponse{comment.replies.length > 1 ? 's' : ''}
            </button>
            
            {showReplies && (
              <div className="space-y-0">
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    onReply={onReply}
                    articleId={articleId}
                    level={level + 1}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}