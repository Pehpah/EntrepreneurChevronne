// 🚨 SOLUTION D'URGENCE - COPIEZ ET COLLEZ DANS LA CONSOLE DU NAVIGATEUR (F12)

console.log('🚨 NETTOYAGE D\'URGENCE DU LOCALSTORAGE...');

// 1. Vérifier la taille actuelle
let total = 0;
const items = [];
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    const size = localStorage[key].length + key.length;
    total += size;
    items.push({ key, size });
  }
}
console.log(`📊 Taille actuelle: ${(total / (1024 * 1024)).toFixed(2)}MB`);

// 2. Supprimer toutes les données analytics
const keys = Object.keys(localStorage);
const analyticsKeys = keys.filter(key => 
  key.startsWith('analytics-') || 
  key.startsWith('blog-analytics') ||
  key.includes('pageviews') ||
  key.includes('events') ||
  key.includes('sessions')
);

console.log(`🧹 Suppression de ${analyticsKeys.length} clés analytics...`);
analyticsKeys.forEach(key => {
  console.log(`   - ${key} (${(localStorage[key].length / 1024).toFixed(1)}KB)`);
  localStorage.removeItem(key);
});

// 3. Vérifier la taille après nettoyage
let totalAfter = 0;
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    totalAfter += localStorage[key].length + key.length;
  }
}
console.log(`✅ Taille après nettoyage: ${(totalAfter / (1024 * 1024)).toFixed(2)}MB`);
console.log(`💾 Espace libéré: ${((total - totalAfter) / (1024 * 1024)).toFixed(2)}MB`);

console.log('🎉 NETTOYAGE TERMINÉ ! Rechargez la page (F5)');

// 4. Recharger automatiquement la page
setTimeout(() => {
  window.location.reload();
}, 2000);