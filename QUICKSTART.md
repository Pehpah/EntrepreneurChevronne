# 🚀 Démarrage Rapide - Blog Entreprise

## ⚡ Installation Express (5 minutes)

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancement en mode développement
```bash
npm start
# ou
npm run dev
```

Le blog sera accessible sur `http://localhost:5173`

## 🎯 Fonctionnalités disponibles immédiatement

✅ **Mode Développement** : Le blog fonctionne avec des données statiques  
✅ **Interface d'administration** : Accédez à `/admin` pour gérer les articles  
✅ **Thème sombre/clair** : Persistant localement  
✅ **Recherche d'articles** : Fonctionnelle  
✅ **Design responsive** : Optimisé mobile/desktop  
✅ **SEO optimisé** : Métadonnées dynamiques, Open Graph, JSON-LD  
✅ **Analytics** : Tracking des événements et pages vues  

## 🗄️ Configuration Supabase (Optionnel)

Pour activer la persistance cloud :

### 1. Créer un projet Supabase
- Allez sur [supabase.com](https://supabase.com)
- Créez un nouveau projet
- Notez l'URL et la clé anonyme

### 2. Configurer les variables d'environnement
Modifiez `.env.local` :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme
```

### 3. Initialiser la base de données
Exécutez le script `supabase-init.sql` dans l'éditeur SQL de Supabase.

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests avec interface graphique
npm run test:ui

# Coverage des tests
npm run test:coverage
```

## 📦 Build de production

```bash
npm run build
```

## 🎨 Pages disponibles

- **`/`** : Accueil avec articles featured
- **`/admin`** : Interface d'administration
- **Catégories** : Navigation par catégorie
- **Recherche** : Recherche en temps réel

## 🔧 Structure du projet

```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages principales  
├── hooks/         # Hooks personnalisés Supabase
├── contexts/      # Contextes React
├── lib/          # Configuration Supabase
├── data/         # Données statiques (fallback)
└── types/        # Types TypeScript
```

## 📱 Administration

Accédez à `/admin` pour :
- ✏️ Créer/modifier des articles
- 🗑️ Supprimer des articles  
- 👁️ Prévisualiser avant publication
- ⭐ Marquer comme article featured

## 🎯 Prochaines étapes

1. **Personnalisation** : Modifiez les couleurs dans `tailwind.config.js`
2. **Contenu** : Ajoutez vos articles via l'interface admin
3. **Analytics** : Configurez Google Analytics dans `index.html`
4. **SEO** : Ajoutez votre image Open Graph (`/og-image.jpg`)
5. **Déploiement** : Utilisez Vercel/Netlify (configurations incluses)

---

**🎉 Votre blog est prêt !** Commencez à créer du contenu dès maintenant.