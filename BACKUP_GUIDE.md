# 💾 Guide de Sauvegarde Avant Merge

## 🚨 Pourquoi faire une sauvegarde ?

Avant de faire un `git pull` ou un merge, il est **essentiel** de sauvegarder votre travail actuel pour éviter toute perte de données en cas de conflit ou de problème.

## 📁 Scripts de Sauvegarde Disponibles

### 1. **Linux/Mac** - `backup.sh`
```bash
chmod +x backup.sh
./backup.sh
```

### 2. **Windows** - `backup.bat`
```cmd
backup.bat
```

## 🔧 Ce que font les scripts

1. **Créent un dossier horodaté** : `backup_avant_merge_YYYYMMDD_HHMMSS`
2. **Copient tous les fichiers** (sauf node_modules, .git, dist, logs)
3. **Sauvegardent l'état git** :
   - Status actuel
   - Historique des commits
   - Liste des branches
   - Différences non commitées
4. **Créent un script de restauration** automatique
5. **Génèrent un résumé** de la sauvegarde

## 📋 Contenu Sauvegardé

### ✅ **Fichiers inclus :**
- Tous les fichiers source (`src/`)
- Fichiers de configuration (`package.json`, `tsconfig.json`, etc.)
- Scripts de déploiement (`deploy.*`)
- Documentation (`.md`)
- Fichiers publics (`public/`)

### ❌ **Fichiers exclus :**
- `node_modules/` (à réinstaller avec `npm install`)
- `.git/` (l'historique git reste intact)
- `dist/` (build généré)
- `*.log` (logs temporaires)

## 🎯 État Actuel Sauvegardé

Votre sauvegarde contiendra **TOUTES** ces améliorations :

### 🔄 **Migration IndexedDB Complète**
- Remplacement total de localStorage
- Plus de problèmes de quota (5-10MB → illimité)
- Fallback automatique vers localStorage
- Migration automatique des données existantes

### 🧭 **Navigation Améliorée**
- Menu déroulant pour les catégories
- Navigation fluide entre toutes les pages
- Recherche fonctionnelle avec page de résultats
- Détails d'articles accessibles

### 🛠️ **Hooks et Composants**
- `useStorage` - Hook unifié IndexedDB/localStorage
- `storage.ts` - Utilitaire de stockage robuste
- Tous les hooks migrés (Analytics, Auth, Comments, etc.)
- Navigation corrigée dans App.tsx

### 📦 **Scripts de Déploiement**
- Scripts automatiques pour Linux/Mac/Windows
- Commits avec messages détaillés
- Push automatique vers Git

## 🔄 Comment Restaurer

### **Restauration Automatique :**
```bash
# Aller dans le dossier de sauvegarde
cd backup_avant_merge_YYYYMMDD_HHMMSS

# Linux/Mac
./restaurer.sh

# Windows
restaurer.bat
```

### **Restauration Manuelle :**
```bash
# Copier tous les fichiers
cp -r backup_avant_merge_YYYYMMDD_HHMMSS/* .

# Ou restaurer des fichiers spécifiques
cp backup_avant_merge_YYYYMMDD_HHMMSS/src/hooks/useStorage.ts src/hooks/

# Réinstaller les dépendances
npm install
```

## 📋 Checklist Avant Merge

- [ ] ✅ **Sauvegarde créée** avec `backup.sh` ou `backup.bat`
- [ ] 📁 **Dossier de sauvegarde vérifié** (contient tous les fichiers)
- [ ] 🔧 **État git sauvegardé** (status, log, diff)
- [ ] 💾 **Script de restauration testé** (optionnel)

## 🚀 Procédure Complète

1. **Créer la sauvegarde :**
   ```bash
   ./backup.sh    # ou backup.bat sur Windows
   ```

2. **Vérifier la sauvegarde :**
   ```bash
   ls backup_avant_merge_*/
   cat backup_avant_merge_*/RESUME_SAUVEGARDE.md
   ```

3. **Faire le merge en sécurité :**
   ```bash
   git pull origin main
   ```

4. **En cas de problème, restaurer :**
   ```bash
   cd backup_avant_merge_*/
   ./restaurer.sh
   ```

## 🎉 Avantages

- ✅ **Sécurité totale** - Aucune perte de données possible
- ✅ **Restauration rapide** - Un script automatique
- ✅ **État git préservé** - Toutes les infos sauvegardées
- ✅ **Fonctionnalités complètes** - Migration IndexedDB incluse
- ✅ **Documentation complète** - Résumé de chaque sauvegarde

**Lancez la sauvegarde maintenant, puis faites votre merge en toute sécurité !** 🛡️