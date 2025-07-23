import { useState, useEffect } from 'react';
import { Comment } from '../types';
import { useSimpleStorage } from './useSimpleStorage';

export function useComments(articleId: string) {
  const [allComments, setAllComments] = useSimpleStorage<Comment[]>('blog-comments', []);
  const [comments, setComments] = useState<Comment[]>([]);

  // Filter comments for this article
  useEffect(() => {
    const articleComments = allComments.filter(comment => comment.articleId === articleId);
    setComments(articleComments);
  }, [allComments, articleId]);

  const addComment = (newComment: Omit<Comment, 'id' | 'publishedAt'>) => {
    const comment: Comment = {
      ...newComment,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString(),
    };

    const updatedComments = [...allComments, comment];
    setAllComments(updatedComments);
  };

  const addReply = (parentCommentId: string, reply: Omit<Comment, 'id' | 'publishedAt'>) => {
    const replyComment: Comment = {
      ...reply,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString(),
    };

    const updatedComments = allComments.map(comment => {
      if (comment.id === parentCommentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), replyComment]
        };
      }
      return comment;
    });

    setAllComments(updatedComments);
  };

  const deleteComment = (commentId: string) => {
    const updatedComments = allComments.filter(comment => comment.id !== commentId);
    setAllComments(updatedComments);
  };

  return {
    comments,
    addComment,
    addReply,
    deleteComment,
  };
}