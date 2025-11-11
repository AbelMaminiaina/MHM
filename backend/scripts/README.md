# Scripts d'Import, Export et Backup de Données

Ce dossier contient les scripts utilitaires pour gérer les données de la base MongoDB.

## 📋 Scripts Disponibles

### 1. **Seed de Données de Test** (`seedMembersToMongoDB.js`)

Crée 15 membres de test dans la base de données.

**Usage:**
```bash
npm run seed
```

ou

```bash
node scripts/seedMembersToMongoDB.js
```

⚠️ **Note:** Ce script contient des credentials MongoDB en dur. À utiliser uniquement en développement.

---

### 2. **Import depuis Excel** (`importMembersFromExcel.js`)

Importe des membres depuis un fichier Excel (.xlsx) vers MongoDB.

**Usage:**
```bash
npm run import:members <chemin-vers-fichier.xlsx>
```

**Exemple:**
```bash
npm run import:members ./data/membres_2024.xlsx
```

**Format du fichier Excel:**

Le fichier doit contenir les colonnes suivantes :

#### Colonnes Obligatoires (*)
- `firstName*` - Prénom
- `lastName*` - Nom
- `dateOfBirth*` - Date de naissance (format: YYYY-MM-DD, ex: 1990-05-15)
- `email*` - Email (doit être unique)
- `phone*` - Téléphone

#### Colonnes Optionnelles
- `street` - Rue/Numéro
- `city` - Ville
- `postalCode` - Code postal
- `country` - Pays (défaut: France)
- `memberType` - Type d'adhésion: `regular`, `student`, `family`, `honorary` (défaut: regular)
- `status` - Statut: `active`, `inactive`, `pending`, `suspended` (défaut: pending)
- `occupation` - Profession
- `interests` - Centres d'intérêt
- `emergencyContactName` - Nom du contact d'urgence
- `emergencyContactPhone` - Téléphone du contact d'urgence
- `emergencyContactRelationship` - Relation avec le contact d'urgence
- `notes` - Notes

**Fonctionnalités:**
- ✅ Validation des données avant import
- ✅ Vérification des doublons par email
- ✅ Gestion des erreurs avec rapport détaillé
- ✅ Statistiques d'import
- ✅ Support des dates au format Excel ou texte

---

### 3. **Créer un Template Excel** (`createExcelTemplate.js`)

Génère un fichier Excel template avec les colonnes nécessaires et des exemples.

**Usage:**
```bash
npm run create:template
```

**Résultat:**
- Crée le fichier `./data/members_template.xlsx`
- Contient une feuille "Instructions" avec le guide
- Contient une feuille "Membres" avec les colonnes et 2 exemples

---

## 🚀 Workflow Complet d'Import

### Étape 1: Créer le Template
```bash
cd backend
npm run create:template
```

### Étape 2: Remplir le Template
1. Ouvrez `./data/members_template.xlsx` avec Excel/LibreOffice
2. Lisez les instructions dans la première feuille
3. Remplissez vos données dans la feuille "Membres" (à partir de la ligne 4)
4. Sauvegardez le fichier (ou créez une copie)

### Étape 3: Importer les Données
```bash
npm run import:members ./data/members_template.xlsx
```

### Étape 4: Vérifier l'Import
Le script affichera:
- Nombre de lignes importées avec succès ✅
- Nombre d'erreurs ❌
- Liste détaillée des erreurs si présentes
- Statistiques finales de la base de données

---

## 📊 Configuration de la Base de Données

### Variables d'Environnement

Les scripts utilisent la variable `MONGO_URI` du fichier `.env`:

```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/mhm_db
```

### Base de Données de Production

Pour importer vers la base de production:

1. **Assurez-vous que le fichier `.env` contient le bon MONGO_URI**
2. **Testez d'abord avec quelques lignes**
3. **Faites une sauvegarde de la base avant un import massif**

---

## 🔒 Sécurité

⚠️ **Attention:**
- Ne commitez **jamais** les fichiers Excel contenant des données réelles
- Les credentials MongoDB ne doivent **jamais** être en dur dans le code
- Utilisez toujours les variables d'environnement
- Le script `seedMembersToMongoDB.js` contient des credentials en dur - **à utiliser uniquement en développement**

---

## 🐛 Dépannage

### Erreur: "MONGO_URI non défini"
→ Vérifiez que le fichier `.env` existe et contient `MONGO_URI`

### Erreur: "Cannot find module 'xlsx'"
→ Installez les dépendances: `npm install`

### Erreur: "File not found"
→ Vérifiez le chemin du fichier Excel

### Membres déjà existants ignorés
→ Normal, le script vérifie les doublons par email

### Erreurs de validation
→ Vérifiez que les colonnes obligatoires sont remplies
→ Vérifiez le format des dates (YYYY-MM-DD)
→ Vérifiez que memberType et status sont des valeurs valides

---

## 📝 Exemples de Données

### Données Valides
```
firstName: Jean
lastName: Dupont
dateOfBirth: 1990-05-15
email: jean.dupont@example.com
phone: +33 6 12 34 56 78
memberType: regular
status: active
```

### Dates Acceptées
- Format ISO: `1990-05-15`
- Format Excel: nombre de jours depuis 1900
- Format texte: `15/05/1990` (sera parsé automatiquement)

---

## 💾 Backup et Restauration MongoDB

### 4. **Backup de la Base de Données** (`backupMongoDB.js`)

Crée une sauvegarde complète de la base de données MongoDB.

**Prérequis:**
- **MongoDB Database Tools** doit être installé
- Télécharger: https://www.mongodb.com/try/download/database-tools

**Installation MongoDB Database Tools:**
```bash
# Windows (avec chocolatey)
choco install mongodb-database-tools

# macOS (avec brew)
brew install mongodb-database-tools

# Linux (Ubuntu/Debian)
wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2004-x86_64-100.9.4.deb
sudo apt install ./mongodb-database-tools-*.deb
```

#### a) Créer un Backup

```bash
npm run backup
```

**Résultat:**
- Crée un backup dans `backend/backups/backup_mhm_db_YYYY-MM-DDTHH-MM-SS/`
- Affiche la taille du backup
- Liste les 5 derniers backups disponibles

**Exemple de sortie:**
```
======================================================================
💾 BACKUP MONGODB - SAUVEGARDE DE LA BASE DE DONNÉES
======================================================================

📊 Informations de connexion:
   • Base de données: mhm_db
   • Type: MongoDB Atlas
   • Destination: C:\...\backups\backup_mhm_db_2025-01-06T14-30-00

🔄 Début du backup...

======================================================================
✅ BACKUP TERMINÉ AVEC SUCCÈS
======================================================================
📁 Emplacement: C:\...\backups\backup_mhm_db_2025-01-06T14-30-00
📊 Taille: 2.45 MB
🕐 Date: 06/01/2025 14:30:00
======================================================================

📋 Backups disponibles (3):
   1. backup_mhm_db_2025-01-06T14-30-00 (06/01/2025 14:30:00)
   2. backup_mhm_db_2025-01-05T10-15-00 (05/01/2025 10:15:00)
   3. backup_mhm_db_2025-01-04T18-00-00 (04/01/2025 18:00:00)

💡 Pour restaurer ce backup:
   npm run backup:restore backup_mhm_db_2025-01-06T14-30-00
```

---

#### b) Lister les Backups

```bash
npm run backup:list
```

Affiche tous les backups disponibles avec leur date et emplacement.

---

#### c) Restaurer un Backup

**Restaurer le backup le plus récent:**
```bash
npm run backup:restore
```

**Restaurer un backup spécifique:**
```bash
npm run backup:restore backup_mhm_db_2025-01-06T14-30-00
```

⚠️ **ATTENTION:** La restauration **ÉCRASE** toutes les données actuelles de la base !

---

### 📅 Stratégie de Backup Recommandée

**Production:**
1. **Backup automatique quotidien** (via cron/scheduled task)
2. **Backup manuel avant chaque import massif**
3. **Conserver au moins 7 jours de backups**

**Avant modifications importantes:**
```bash
# 1. Faire un backup
npm run backup

# 2. Effectuer l'opération (import, mise à jour, etc.)
npm run import:members ./data/new_members.xlsx

# 3. Si problème, restaurer le backup
npm run backup:restore
```

**Automatiser les backups (Windows):**
```powershell
# Créer une tâche planifiée
$action = New-ScheduledTaskAction -Execute "npm" -Argument "run backup" -WorkingDirectory "C:\path\to\backend"
$trigger = New-ScheduledTaskTrigger -Daily -At 2AM
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "MHM_MongoDB_Backup"
```

**Automatiser les backups (Linux/macOS - Cron):**
```bash
# Éditer crontab
crontab -e

# Ajouter (backup quotidien à 2h du matin)
0 2 * * * cd /path/to/backend && npm run backup >> /var/log/mhm_backup.log 2>&1
```

---

### 🔐 Sécurité des Backups

⚠️ **Important:**
- Les backups contiennent toutes les données sensibles
- Ne commitez **jamais** les backups sur Git (déjà dans `.gitignore`)
- Stockez les backups dans un endroit sécurisé
- Chiffrez les backups pour la production

**Compresser et chiffrer un backup:**
```bash
# Compresser
tar -czf backup_mhm_db_2025-01-06.tar.gz backups/backup_mhm_db_2025-01-06T14-30-00/

# Chiffrer avec GPG
gpg -c backup_mhm_db_2025-01-06.tar.gz
```

---

## 🆘 Support

Pour toute question ou problème:
1. Vérifiez ce README
2. Consultez les logs d'erreur détaillés du script
3. Contactez l'équipe technique
