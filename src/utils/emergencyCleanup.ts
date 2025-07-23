// Solution d'urgence pour nettoyer complètement le localStorage

export const EMERGENCY_RESET = () => {
  console.log('🚨 RESET COMPLET DU LOCALSTORAGE...');
  
  try {
    // 1. Sauvegarder les données importantes (si elles existent)
    const importantData: Record<string, any> = {};
    
    const keysToSave = [
      'blog-site-config',
      'blog-users', 
      'blog-comments',
      'newsletter-subscribers'
    ];
    
    keysToSave.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          importantData[key] = JSON.parse(data);
          console.log(`💾 Sauvegardé: ${key}`);
        } catch (e) {
          console.warn(`⚠️ Impossible de sauvegarder ${key}`);
        }
      }
    });
    
    // 2. VIDER COMPLÈTEMENT le localStorage
    localStorage.clear();
    console.log('🧹 localStorage complètement vidé');
    
    // 3. Restaurer les données importantes
    Object.entries(importantData).forEach(([key, data]) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`✅ Restauré: ${key}`);
      } catch (e) {
        console.warn(`⚠️ Impossible de restaurer ${key}`);
      }
    });
    
    console.log('🎉 RESET TERMINÉ ! Rechargement...');
    
    // 4. Recharger la page
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du reset:', error);
    return false;
  }
};

// Fonction pour vérifier l'état du localStorage
export const checkStorageStatus = () => {
  let total = 0;
  let count = 0;
  const items: { key: string; size: number }[] = [];
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const value = localStorage[key];
      const size = value.length + key.length;
      total += size;
      count++;
      items.push({ key, size: Math.round(size / 1024) }); // en KB
    }
  }
  
  const status = {
    totalMB: (total / (1024 * 1024)).toFixed(2),
    totalKB: Math.round(total / 1024),
    count,
    items: items.sort((a, b) => b.size - a.size)
  };
  
  console.log('📊 État du localStorage:', status);
  return status;
};

// Fonction pour tester si on peut écrire dans localStorage
export const testLocalStorageWrite = () => {
  try {
    const testKey = 'test-write-' + Date.now();
    const testData = 'test-data';
    localStorage.setItem(testKey, testData);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (retrieved === testData) {
      console.log('✅ localStorage fonctionne correctement');
      return true;
    } else {
      console.log('❌ localStorage ne fonctionne pas correctement');
      return false;
    }
  } catch (error) {
    console.log('❌ Impossible d\'écrire dans localStorage:', error);
    return false;
  }
};

// Exposer les fonctions globalement pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).EMERGENCY_RESET = EMERGENCY_RESET;
  (window as any).checkStorageStatus = checkStorageStatus;
  (window as any).testLocalStorageWrite = testLocalStorageWrite;
}