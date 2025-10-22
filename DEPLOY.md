# 🚀 Guide de Déploiement Automatique

Ce guide vous explique comment envoyer automatiquement toutes vos modifications vers Git.

## 📁 Scripts Disponibles

J'ai créé **3 scripts de déploiement** pour différents environnements :

### 1. **Linux/Mac** - `deploy.sh`
```bash
chmod +x deploy.sh
./deploy.sh
```

### 2. **Windows PowerShell** - `deploy.ps1`
```powershell
PowerShell -ExecutionPolicy Bypass -File deploy.ps1
```

### 3. **Windows Batch** - `deploy.bat`
```cmd
deploy.bat
```

## 🔧 Ce que font les scripts

1. **Vérification du statut** - `git status`
2. **Ajout de tous les fichiers** - `git add .`
3. **Commit automatique** avec message détaillé
4. **Push vers la branche actuelle** - `git push origin <branche>`

## 📝 Message de Commit Automatique

Les scripts créent automatiquement un commit avec :

```
🔄 Migration complète vers IndexedDB - [TIMESTAMP]

✅ Fonctionnalités ajoutées:
- Migration automatique localStorage → IndexedDB
- Système de stockage unifié avec fallback
- Résolution des problèmes de quota
- Navigation complète entre toutes les pages
- Menu déroulant pour les catégories
- Recherche et détails d'articles fonctionnels

🎯 Plus de problèmes de localStorage quota!
📦 IndexedDB avec fallback localStorage automatique
🔧 API identique pour les développeurs
```

## 🚨 Commandes Manuelles (si les scripts ne marchent pas)

Si vous préférez faire manuellement :

```bash
# 1. Vérifier les modifications
git status

# 2. Ajouter tous les fichiers
git add .

# 3. Créer un commit
git commit -m "Migration IndexedDB - $(date)"

# 4. Pousser vers votre branche
git push origin main
# ou
git push origin <nom-de-votre-branche>
```

## 📋 Vérification

Après le déploiement, vérifiez sur GitHub que :
- ✅ Tous les nouveaux fichiers sont présents
- ✅ Les modifications sont visibles
- ✅ Le commit apparaît dans l'historique

## 🆘 En cas de problème

Si vous avez des erreurs :

1. **Conflit de merge** :
   ```bash
   git pull origin main
   # Résoudre les conflits manuellement
   git add .
   git commit -m "Résolution conflits"
   git push origin main
   ```

2. **Problème d'authentification** :
   - Vérifiez vos credentials Git
   - Utilisez un token GitHub si nécessaire

3. **Branche protégée** :
   - Créez une Pull Request depuis votre branche
   - Ou changez de branche : `git checkout -b feature/indexeddb-migration`

## 🎯 Résumé des Modifications

Toutes ces modifications sont maintenant prêtes à être déployées :

- **Migration complète vers IndexedDB**
- **Résolution des problèmes de quota localStorage**
- **Navigation améliorée avec menu déroulant catégories**
- **Recherche et détails d'articles fonctionnels**
- **Système de stockage robuste avec fallback**

**Lancez simplement le script correspondant à votre OS !** 🚀