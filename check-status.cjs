#!/usr/bin/env node

console.log('🔍 VÉRIFICATION RAPIDE DU STATUT\n');

// Vérifier que les fichiers existent
const fs = require('fs');
const path = require('path');

const criticalFiles = [
  'src/App.tsx',
  'src/components/EmergencyCleanup.tsx',
  'src/components/Header.tsx',
  'src/utils/emergencyCleanup.ts',
  'src/hooks/useAnalytics.ts',
  'public/diagnostic.html',
  'RECOVERY.md'
];

console.log('📁 Vérification des fichiers critiques...');
let allFilesExist = true;

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ MANQUANT: ${file}`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n🚨 ERREUR: Des fichiers critiques sont manquants !');
  process.exit(1);
}

console.log('\n🎯 SOLUTIONS DISPONIBLES:');
console.log('┌─────────────────────────────────────────────────────────────┐');
console.log('│  🚨 RESET D\'URGENCE                                        │');
console.log('│  1. http://localhost:5173/diagnostic.html                  │');
console.log('│  2. Console: EMERGENCY_RESET()                             │');
console.log('│  3. Manuel: localStorage.clear()                           │');
console.log('├─────────────────────────────────────────────────────────────┤');
console.log('│  ⚙️  ACCÈS ADMIN                                           │');
console.log('│  1. http://localhost:5173 → Bouton Admin                   │');
console.log('│  2. Authentification temporairement désactivée             │');
console.log('├─────────────────────────────────────────────────────────────┤');
console.log('│  🔧 OUTILS DE DIAGNOSTIC                                   │');
console.log('│  1. Widget en bas à droite de l\'app                       │');
console.log('│  2. Page diagnostic.html                                    │');
console.log('│  3. Console: CHECK_STATUS()                                │');
console.log('└─────────────────────────────────────────────────────────────┘');

console.log('\n⚡ COMMANDES RAPIDES:');
console.log('npm run dev     # Démarrer le serveur');
console.log('npm run build   # Vérifier que ça compile');

console.log('\n📋 WORKFLOW DE RÉCUPÉRATION:');
console.log('1. 🚨 diagnostic.html → Reset d\'urgence');
console.log('2. ✅ Tester l\'accès admin via bouton ⚙️');
console.log('3. 🧹 Configurer le site si nécessaire');
console.log('4. 📊 Surveiller le quota localStorage');

console.log('\n✅ STATUT: Tous les outils de récupération sont prêts !');
console.log('🎊 En cas de problème, suivez le guide RECOVERY.md');

// Vérifier si le serveur de dev tourne
const { execSync } = require('child_process');
try {
  const result = execSync('lsof -i :5173', { encoding: 'utf8', stdio: 'pipe' });
  if (result.includes('5173')) {
    console.log('\n🟢 Serveur de développement détecté sur le port 5173');
    console.log('🔗 Accès direct: http://localhost:5173');
    console.log('🔗 Diagnostic: http://localhost:5173/diagnostic.html');
  }
} catch (e) {
  console.log('\n🟡 Serveur de développement non démarré');
  console.log('💡 Lancez: npm run dev');
}

console.log('\n' + '='.repeat(60));
console.log('🎯 PRÊT POUR LA RÉCUPÉRATION !');
console.log('='.repeat(60));