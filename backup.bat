@echo off
setlocal enabledelayedexpansion

REM Script de sauvegarde Windows avant merge
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set mytime=%mytime: =0%
set TIMESTAMP=%mydate%_%mytime%
set BACKUP_DIR=backup_avant_merge_%TIMESTAMP%

echo 💾 Création de la sauvegarde locale avant merge...
echo 📁 Dossier de sauvegarde: %BACKUP_DIR%

REM Créer le dossier de sauvegarde
mkdir "%BACKUP_DIR%"

echo 📋 Copie des fichiers du projet...
REM Copier tous les fichiers sauf node_modules, .git, dist
xcopy /E /I /H /Y . "%BACKUP_DIR%" /EXCLUDE:backup_exclude.txt 2>nul

REM Créer le fichier d'exclusion temporaire
echo node_modules\ > backup_exclude.txt
echo .git\ >> backup_exclude.txt
echo dist\ >> backup_exclude.txt
echo *.log >> backup_exclude.txt

REM Copier à nouveau avec exclusions
xcopy /E /I /H /Y . "%BACKUP_DIR%" /EXCLUDE:backup_exclude.txt

REM Supprimer le fichier d'exclusion temporaire
del backup_exclude.txt

echo 🔧 Sauvegarde de l'état git...
git status > "%BACKUP_DIR%\git_status_avant_merge.txt"
git log --oneline -10 > "%BACKUP_DIR%\git_log_avant_merge.txt"
git branch -a > "%BACKUP_DIR%\git_branches_avant_merge.txt"
git diff > "%BACKUP_DIR%\git_diff_avant_merge.txt"

REM Créer un fichier de résumé
echo # 💾 Sauvegarde Avant Merge - %TIMESTAMP% > "%BACKUP_DIR%\RESUME_SAUVEGARDE.md"
echo. >> "%BACKUP_DIR%\RESUME_SAUVEGARDE.md"
echo ## 📋 Contenu de cette sauvegarde >> "%BACKUP_DIR%\RESUME_SAUVEGARDE.md"
echo. >> "%BACKUP_DIR%\RESUME_SAUVEGARDE.md"
echo Cette sauvegarde contient l'état complet du projet avant le merge, incluant : >> "%BACKUP_DIR%\RESUME_SAUVEGARDE.md"
echo. >> "%BACKUP_DIR%\RESUME_SAUVEGARDE.md"
echo ### ✅ Fonctionnalités implémentées : >> "%BACKUP_DIR%\RESUME_SAUVEGARDE.md"
echo - Migration complète vers IndexedDB >> "%BACKUP_DIR%\RESUME_SAUVEGARDE.md"
echo - Résolution des problèmes de quota localStorage >> "%BACKUP_DIR%\RESUME_SAUVEGARDE.md"
echo - Navigation améliorée avec menu déroulant catégories >> "%BACKUP_DIR%\RESUME_SAUVEGARDE.md"
echo - Recherche et détails d'articles fonctionnels >> "%BACKUP_DIR%\RESUME_SAUVEGARDE.md"
echo - Système de stockage robuste avec fallback automatique >> "%BACKUP_DIR%\RESUME_SAUVEGARDE.md"
echo - Scripts de déploiement automatique >> "%BACKUP_DIR%\RESUME_SAUVEGARDE.md"

REM Créer un script de restauration
echo @echo off > "%BACKUP_DIR%\restaurer.bat"
echo echo 🔄 Restauration de la sauvegarde... >> "%BACKUP_DIR%\restaurer.bat"
echo echo ⚠️  Attention: Ceci va écraser les fichiers actuels! >> "%BACKUP_DIR%\restaurer.bat"
echo set /p REPLY="Êtes-vous sûr ? (y/N): " >> "%BACKUP_DIR%\restaurer.bat"
echo if /i "%%REPLY%%"=="y" ( >> "%BACKUP_DIR%\restaurer.bat"
echo     xcopy /E /I /H /Y * ..\ >> "%BACKUP_DIR%\restaurer.bat"
echo     echo ✅ Restauration terminée! >> "%BACKUP_DIR%\restaurer.bat"
echo     echo 💡 N'oubliez pas de faire: npm install >> "%BACKUP_DIR%\restaurer.bat"
echo ^) else ( >> "%BACKUP_DIR%\restaurer.bat"
echo     echo ❌ Restauration annulée >> "%BACKUP_DIR%\restaurer.bat"
echo ^) >> "%BACKUP_DIR%\restaurer.bat"
echo pause >> "%BACKUP_DIR%\restaurer.bat"

echo.
echo ✅ Sauvegarde terminée!
echo 📁 Dossier: %BACKUP_DIR%
echo.
echo 📋 Contenu sauvegardé:
echo    - Tous les fichiers source
echo    - Migration IndexedDB complète
echo    - Navigation et hooks fonctionnels
echo    - Scripts de déploiement
echo    - État git actuel
echo.
echo 🔄 Pour restaurer: cd %BACKUP_DIR% ^&^& restaurer.bat
echo 💡 Vous pouvez maintenant faire votre merge en sécurité!
pause