# Blog d'Entreprise - Migration Supabase

Un blog moderne pour entrepreneurs utilisant React, TypeScript, Tailwind CSS et Supabase.

## 🚀 Technologies utilisées

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Tailwind Typography
- **Base de données**: Supabase (PostgreSQL)
- **Icônes**: Lucide React
- **Déploiement**: Vercel / Netlify

## 📋 Fonctionnalités

- ✅ Gestion d'articles avec CRUD complet
- ✅ Interface d'administration
- ✅ Système de catégories
- ✅ Recherche d'articles
- ✅ Mode sombre/clair persistant
- ✅ Newsletter
- ✅ Responsive design
- ✅ Stockage Supabase

## 🛠️ Installation et configuration

### 1. Cloner le projet
```bash
git clone <your-repo>
cd blog-entreprise
npm install
```

### 2. Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Copiez l'URL du projet et la clé anonyme
3. Créez un fichier `.env.local` :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Initialiser la base de données

Exécutez le script SQL `supabase-init.sql` dans l'éditeur SQL de Supabase pour créer les tables et données initiales.

### 4. Lancer en développement

```bash
npm run dev
```

## 🗄️ Structure de la base de données

### Tables principales

- **articles**: Stockage des articles avec métadonnées
- **categories**: Catégories d'articles
- **user_preferences**: Préférences utilisateur (thème, etc.)
- **newsletter_subscribers**: Abonnés newsletter

### Schéma articles
```sql
- id: UUID (PK)
- title: VARCHAR(500)
- excerpt: TEXT
- content: TEXT
- category: VARCHAR(255)
- author: VARCHAR(255)
- published_at: DATE
- read_time: INTEGER
- image: VARCHAR(1000)
- tags: TEXT[]
- featured: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connectez votre repository à Vercel
2. Configurez les variables d'environnement :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Déployez automatiquement

### Netlify

1. Connectez votre repository à Netlify
2. Configurez les variables d'environnement
3. Le fichier `netlify.toml` est déjà configuré

### Variables d'environnement de production

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ArticleCard.tsx
│   └── ...
├── pages/              # Pages principales
│   ├── HomePage.tsx
│   ├── AdminPage.tsx
│   ├── CategoryPage.tsx
│   └── ...
├── hooks/              # Hooks personnalisés
│   ├── useSupabase.ts  # Hooks Supabase
│   └── useLocalStorage.ts
├── contexts/           # Contextes React
│   └── ThemeContext.tsx
├── lib/               # Configuration
│   └── supabase.ts
├── types/             # Types TypeScript
│   └── index.ts
├── utils/             # Utilitaires
│   ├── dateUtils.ts
│   └── textUtils.ts
└── data/              # Données statiques (backup)
    ├── articles.ts
    └── categories.ts
```

## 🔧 Scripts disponibles

```bash
npm run dev          # Développement
npm run build        # Build production
npm run preview      # Prévisualiser le build
npm run lint         # Linter ESLint
```

## 🎨 Administration

Accédez à `/admin` pour :
- Créer/modifier/supprimer des articles
- Gérer les catégories
- Prévisualiser les articles
- Gérer la newsletter

## 🔒 Sécurité

- Les données sont stockées sur Supabase avec authentification
- Variables d'environnement pour les clés sensibles
- Validation côté client et serveur
- HTTPS en production

## 📱 Responsive

- Design mobile-first
- Breakpoints Tailwind CSS
- Navigation adaptative
- Images optimisées

## 🎯 Performance

- Bundle splitting automatique avec Vite
- Images lazy loading
- Cache des assets statiques
- Optimisation des requêtes Supabase

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature
3. Commitez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.