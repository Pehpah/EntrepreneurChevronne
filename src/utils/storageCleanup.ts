// Storage cleanup utilities

export const getStorageInfo = () => {
  let total = 0;
  const items: { key: string; size: number }[] = [];
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const size = localStorage[key].length + key.length;
      total += size;
      items.push({ key, size });
    }
  }
  
  return {
    total,
    totalMB: (total / (1024 * 1024)).toFixed(2),
    items: items.sort((a, b) => b.size - a.size),
    count: items.length
  };
};

export const clearAnalyticsData = () => {
  const keys = Object.keys(localStorage);
  const analyticsKeys = keys.filter(key => 
    key.startsWith('analytics-') || 
    key.startsWith('blog-analytics') ||
    key.includes('pageviews') ||
    key.includes('events') ||
    key.includes('sessions')
  );
  
  analyticsKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log(`🧹 Supprimé ${analyticsKeys.length} clés analytics:`, analyticsKeys);
  return analyticsKeys.length;
};

export const clearAllBlogData = () => {
  const keys = Object.keys(localStorage);
  const blogKeys = keys.filter(key => 
    key.startsWith('blog-') || 
    key.startsWith('analytics-') ||
    key.includes('session') ||
    key.includes('auth')
  );
  
  blogKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log(`🧹 Supprimé ${blogKeys.length} clés blog:`, blogKeys);
  return blogKeys.length;
};

export const optimizeAnalyticsData = () => {
  try {
    // Clean pageviews - keep only last 500
    const pageviews = localStorage.getItem('analytics-pageviews');
    if (pageviews) {
      const data = JSON.parse(pageviews);
      if (Array.isArray(data) && data.length > 500) {
        const optimized = data.slice(-500);
        localStorage.setItem('analytics-pageviews', JSON.stringify(optimized));
        console.log(`📊 Pageviews optimisées: ${data.length} → ${optimized.length}`);
      }
    }
    
    // Clean events - keep only last 1000
    const events = localStorage.getItem('analytics-events');
    if (events) {
      const data = JSON.parse(events);
      if (Array.isArray(data) && data.length > 1000) {
        const optimized = data.slice(-1000);
        localStorage.setItem('analytics-events', JSON.stringify(optimized));
        console.log(`📊 Events optimisés: ${data.length} → ${optimized.length}`);
      }
    }
    
    // Clean sessions - keep only last 50
    const sessions = localStorage.getItem('analytics-sessions');
    if (sessions) {
      const data = JSON.parse(sessions);
      if (Array.isArray(data) && data.length > 50) {
        const optimized = data.slice(-50);
        localStorage.setItem('analytics-sessions', JSON.stringify(optimized));
        console.log(`📊 Sessions optimisées: ${data.length} → ${optimized.length}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'optimisation:', error);
    return false;
  }
};

// Fonction d'urgence pour libérer de l'espace
export const emergencyCleanup = () => {
  console.log('🚨 Nettoyage d\'urgence du localStorage...');
  
  const beforeInfo = getStorageInfo();
  console.log(`📊 Avant nettoyage: ${beforeInfo.totalMB}MB utilisés`);
  
  // 1. Optimiser les analytics
  optimizeAnalyticsData();
  
  // 2. Si toujours trop plein, supprimer complètement les analytics
  const afterOptim = getStorageInfo();
  if (parseFloat(afterOptim.totalMB) > 4) {
    console.log('🧹 Suppression complète des analytics...');
    clearAnalyticsData();
  }
  
  const finalInfo = getStorageInfo();
  console.log(`✅ Après nettoyage: ${finalInfo.totalMB}MB utilisés`);
  
  return {
    before: beforeInfo,
    after: finalInfo,
    saved: (parseFloat(beforeInfo.totalMB) - parseFloat(finalInfo.totalMB)).toFixed(2)
  };
};

// Auto-cleanup au chargement si nécessaire
export const autoCleanupIfNeeded = () => {
  const info = getStorageInfo();
  const sizeMB = parseFloat(info.totalMB);
  
  if (sizeMB > 4) {
    console.log(`⚠️ localStorage trop plein (${sizeMB}MB), nettoyage automatique...`);
    emergencyCleanup();
  }
};