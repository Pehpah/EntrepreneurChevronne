import React, { useEffect } from 'react';
import { ExternalLink, Eye } from 'lucide-react';
import { Advertisement } from '../types';
import { useAdvertisements } from '../hooks/useAdvertisements';

interface AdBannerProps {
  ad: Advertisement;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function AdBanner({ ad, size = 'medium', className = '' }: AdBannerProps) {
  const { trackImpression, trackClick } = useAdvertisements();

  // Track impression when component mounts
  useEffect(() => {
    trackImpression(ad.id);
  }, [ad.id, trackImpression]);

  const handleClick = () => {
    trackClick(ad.id, ad.targetUrl);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'p-3 text-sm';
      case 'large':
        return 'p-6 text-base';
      default:
        return 'p-4 text-sm';
    }
  };

  const getImageClasses = () => {
    switch (size) {
      case 'small':
        return 'h-20';
      case 'large':
        return 'h-40';
      default:
        return 'h-32';
    }
  };

  return (
    <div className={`bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${getSizeClasses()} ${className}`}>
      {/* Sponsored Label */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
          Sponsorisé
        </span>
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <Eye size={12} />
          <span>{ad.impressions}</span>
        </div>
      </div>

      <div onClick={handleClick} className="space-y-3">
        {/* Image */}
        <div className={`w-full ${getImageClasses()} bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden`}>
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {ad.title}
          </h4>
          
          <p className="text-slate-600 dark:text-slate-300 line-clamp-2">
            {ad.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Par {ad.sponsor}
            </span>
            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
              <span className="text-xs font-medium">En savoir plus</span>
              <ExternalLink size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}