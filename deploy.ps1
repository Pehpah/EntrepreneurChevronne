# Script de déploiement PowerShell pour Windows
Write-Host "🚀 Déploiement automatique des modifications..." -ForegroundColor Green

# Vérifier le statut git
Write-Host "📋 Vérification du statut git..." -ForegroundColor Yellow
git status

# Ajouter tous les fichiers modifiés
Write-Host "➕ Ajout de tous les fichiers..." -ForegroundColor Yellow
git add .

# Créer un commit avec un message automatique
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = @"
🔄 Migration complète vers IndexedDB - $timestamp

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
"@

Write-Host "💬 Création du commit..." -ForegroundColor Yellow
git commit -m $commitMessage

# Pousser vers la branche actuelle
Write-Host "📤 Push vers le repository..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
git push origin $currentBranch

Write-Host "✅ Déploiement terminé!" -ForegroundColor Green
Write-Host "📍 Branche: $currentBranch" -ForegroundColor Cyan
Write-Host "⏰ Timestamp: $timestamp" -ForegroundColor Cyan