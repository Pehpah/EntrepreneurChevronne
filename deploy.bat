@echo off
echo 🚀 Déploiement automatique des modifications...

echo 📋 Vérification du statut git...
git status

echo ➕ Ajout de tous les fichiers...
git add .

echo 💬 Création du commit...
git commit -m "🔄 Migration complète vers IndexedDB - %date% %time%

✅ Fonctionnalités ajoutées:
- Migration automatique localStorage → IndexedDB
- Système de stockage unifié avec fallback
- Résolution des problèmes de quota
- Navigation complète entre toutes les pages
- Menu déroulant pour les catégories
- Recherche et détails d'articles fonctionnels

🎯 Plus de problèmes de localStorage quota!
📦 IndexedDB avec fallback localStorage automatique
🔧 API identique pour les développeurs"

echo 📤 Push vers le repository...
for /f "tokens=*" %%i in ('git branch --show-current') do set BRANCH=%%i
git push origin %BRANCH%

echo ✅ Déploiement terminé!
echo 📍 Branche: %BRANCH%
pause