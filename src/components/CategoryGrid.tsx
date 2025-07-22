import React from 'react';
import { Target, Calendar, Megaphone, PiggyBank, Zap, MessageSquare } from 'lucide-react';
import { categories } from '../data/categories';

interface CategoryGridProps {
  onCategorySelect: (categorySlug: string) => void;
}

const iconMap = {
  Calendar,
  Target,
  Megaphone,
  PiggyBank,
  Zap,
  MessageSquare
};

export function CategoryGrid({ onCategorySelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const IconComponent = iconMap[category.icon as keyof typeof iconMap];
        
        return (
          <div
            key={category.id}
            onClick={() => onCategorySelect(category.slug)}
            className="group cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300">
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                {category.name}
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              {category.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}