import React from 'react';

interface TagCloudProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
  className?: string;
}

export function TagCloud({ tags, onTagClick, className = "" }: TagCloudProps) {
  const getTagSize = (index: number) => {
    const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg'];
    return sizes[index % sizes.length];
  };

  const getTagColor = (index: number) => {
    const colors = [
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <button
          key={tag}
          onClick={() => onTagClick?.(tag)}
          className={`px-3 py-1 rounded-full font-medium transition-all duration-300 hover:scale-105 ${getTagSize(index)} ${getTagColor(index)}`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}