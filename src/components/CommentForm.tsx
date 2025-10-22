import React, { useState } from 'react';
import { Send, X } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (comment: { author: string; email: string; content: string }) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitLabel?: string;
  isReply?: boolean;
}

export function CommentForm({ 
  onSubmit, 
  onCancel, 
  placeholder = "Votre commentaire...",
  submitLabel = "Publier le commentaire",
  isReply = false 
}: CommentFormProps) {
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.author.trim()) {
      newErrors.author = 'Le nom est requis';
    } else if (formData.author.length < 2) {
      newErrors.author = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Le commentaire est requis';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Le commentaire doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setFormData({ author: '', email: '', content: '' });
      setErrors({});
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${isReply ? 'mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="Votre nom *"
            value={formData.author}
            onChange={(e) => handleChange('author', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
              errors.author ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
            }`}
          />
          {errors.author && (
            <p className="text-red-500 text-sm mt-1">{errors.author}</p>
          )}
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Votre email *"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
              errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>
      
      <div>
        <textarea
          placeholder={placeholder}
          rows={isReply ? 3 : 4}
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none ${
            errors.content ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          }`}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content}</p>
        )}
      </div>
      
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          {isSubmitting ? 'Publication...' : submitLabel}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300"
          >
            <X size={16} />
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}