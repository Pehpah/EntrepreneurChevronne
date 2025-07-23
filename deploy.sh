#!/bin/bash

echo "🚀 Déploiement automatique des modifications..."

# Vérifier le statut git
echo "📋 Vérification du statut git..."
git status

# Ajouter tous les fichiers modifiés
echo "➕ Ajout de tous les fichiers..."
git add .

# Créer un commit avec un message automatique
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
COMMIT_MESSAGE="🔄 Migration complète vers IndexedDB - $TIMESTAMP

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

echo "💬 Création du commit..."
git commit -m "$COMMIT_MESSAGE"

# Pousser vers la branche actuelle
echo "📤 Push vers le repository..."
CURRENT_BRANCH=$(git branch --show-current)
git push origin "$CURRENT_BRANCH"

echo "✅ Déploiement terminé!"
echo "📍 Branche: $CURRENT_BRANCH"
echo "⏰ Timestamp: $TIMESTAMP"