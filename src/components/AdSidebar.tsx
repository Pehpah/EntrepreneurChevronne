import React from 'react';
import { AdBanner } from './AdBanner';
import { useAdvertisements } from '../hooks/useAdvertisements';

export function AdSidebar() {
  const { getAdsByPosition } = useAdvertisements();
  const sidebarAds = getAdsByPosition('sidebar', 3);

  if (sidebarAds.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Nos Partenaires
        </h3>
        <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
      </div>
      
      <div className="space-y-4">
        {sidebarAds.map((ad) => (
          <AdBanner 
            key={ad.id} 
            ad={ad} 
            size="medium"
          />
        ))}
      </div>

      {/* Call to Action for Partners */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center border-2 border-dashed border-slate-300 dark:border-slate-600">
        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
          Devenez Partenaire
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Rejoignez notre réseau de partenaires et touchez notre audience d'entrepreneurs engagés.
        </p>
        <button className="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
          Nous contacter
        </button>
      </div>
    </div>
  );
}