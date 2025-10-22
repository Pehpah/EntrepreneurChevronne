#!/bin/bash

# Script de sauvegarde avant merge
TIMESTAMP=$(date "+%Y%m%d_%H%M%S")
BACKUP_DIR="backup_avant_merge_$TIMESTAMP"

echo "💾 Création de la sauvegarde locale avant merge..."
echo "📁 Dossier de sauvegarde: $BACKUP_DIR"

# Créer le dossier de sauvegarde
mkdir -p "$BACKUP_DIR"

# Copier tous les fichiers du projet (sauf node_modules et .git)
echo "📋 Copie des fichiers du projet..."
rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='*.log' . "$BACKUP_DIR/"

# Sauvegarder l'état git actuel
echo "🔧 Sauvegarde de l'état git..."
git status > "$BACKUP_DIR/git_status_avant_merge.txt"
git log --oneline -10 > "$BACKUP_DIR/git_log_avant_merge.txt"
git branch -a > "$BACKUP_DIR/git_branches_avant_merge.txt"
git diff > "$BACKUP_DIR/git_diff_avant_merge.txt"

# Créer un fichier de résumé
cat > "$BACKUP_DIR/RESUME_SAUVEGARDE.md" << EOF
# 💾 Sauvegarde Avant Merge - $TIMESTAMP

## 📋 Contenu de cette sauvegarde

Cette sauvegarde contient l'état complet du projet avant le merge, incluant :

### ✅ Fonctionnalités implémentées :
- Migration complète vers IndexedDB
- Résolution des problèmes de quota localStorage
- Navigation améliorée avec menu déroulant catégories
- Recherche et détails d'articles fonctionnels
- Système de stockage robuste avec fallback automatique
- Scripts de déploiement automatique

### 📁 Fichiers sauvegardés :
- Tous les fichiers source (src/)
- Fichiers de configuration
- Scripts de déploiement
- Documentation

### 🔧 État git sauvegardé :
- git_status_avant_merge.txt
- git_log_avant_merge.txt  
- git_branches_avant_merge.txt
- git_diff_avant_merge.txt

### 🚀 Comment restaurer :
Si vous devez restaurer cette sauvegarde :
\`\`\`bash
# Copier les fichiers depuis la sauvegarde
cp -r $BACKUP_DIR/* .

# Ou restaurer des fichiers spécifiques
cp $BACKUP_DIR/src/hooks/useStorage.ts src/hooks/
\`\`\`

### ⚠️ Important :
- Cette sauvegarde ne contient PAS node_modules (à réinstaller avec npm install)
- Cette sauvegarde ne contient PAS .git (l'historique git reste intact)
- Tous les hooks et composants sont dans leur état final fonctionnel

Date de création: $(date)
EOF

# Créer un fichier de restauration rapide
cat > "$BACKUP_DIR/restaurer.sh" << 'EOF'
#!/bin/bash
echo "🔄 Restauration de la sauvegarde..."
echo "⚠️  Attention: Ceci va écraser les fichiers actuels!"
read -p "Êtes-vous sûr ? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cp -r * ../
    echo "✅ Restauration terminée!"
    echo "💡 N'oubliez pas de faire: npm install"
else
    echo "❌ Restauration annulée"
fi
EOF

chmod +x "$BACKUP_DIR/restaurer.sh"

# Afficher le résumé
echo ""
echo "✅ Sauvegarde terminée!"
echo "📁 Dossier: $BACKUP_DIR"
echo "📊 Taille: $(du -sh "$BACKUP_DIR" | cut -f1)"
echo ""
echo "📋 Contenu sauvegardé:"
echo "   - Tous les fichiers source"
echo "   - Migration IndexedDB complète"
echo "   - Navigation et hooks fonctionnels"
echo "   - Scripts de déploiement"
echo "   - État git actuel"
echo ""
echo "🔄 Pour restaurer: cd $BACKUP_DIR && ./restaurer.sh"
echo "💡 Vous pouvez maintenant faire votre merge en sécurité!"