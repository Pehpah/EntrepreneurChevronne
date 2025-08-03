#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Vérification du Blog Entreprise...\n');

// Vérifications de base
const checks = [
  {
    name: 'Configuration Supabase',
    check: () => {
      return fs.existsSync('.env.local') && fs.existsSync('src/lib/supabase.ts');
    }
  },
  {
    name: 'Fichiers de configuration',
    check: () => {
      return fs.existsSync('vercel.json') && fs.existsSync('netlify.toml');
    }
  },
  {
    name: 'Script SQL d\'initialisation',
    check: () => {
      return fs.existsSync('supabase-init.sql');
    }
  },
  {
    name: 'Tests configurés',
    check: () => {
      return fs.existsSync('vitest.config.ts') && fs.existsSync('src/test/setup.ts');
    }
  },
  {
    name: 'Documentation',
    check: () => {
      return fs.existsSync('README.md') && fs.existsSync('QUICKSTART.md');
    }
  }
];

let allPassed = true;

checks.forEach(({ name, check }) => {
  const passed = check();
  console.log(`${passed ? '✅' : '❌'} ${name}`);
  if (!passed) allPassed = false;
});

console.log('\n📋 Résumé:');
console.log(`Status: ${allPassed ? '🎉 Tout est prêt !' : '⚠️  Quelques éléments manquent'}`);

if (allPassed) {
  console.log('\n🚀 Pour démarrer:');
  console.log('1. npm install');
  console.log('2. npm start');
  console.log('3. Ouvrez http://localhost:5173');
  console.log('\n📖 Consultez QUICKSTART.md pour plus de détails');
}

console.log('\n🎯 Fonctionnalités disponibles:');
console.log('• Blog avec articles et catégories');
console.log('• Interface d\'administration (/admin)');
console.log('• Thème sombre/clair');
console.log('• Recherche d\'articles');
console.log('• Design responsive');
console.log('• Tests unitaires');
console.log('• Déploiement Vercel/Netlify');

process.exit(allPassed ? 0 : 1);