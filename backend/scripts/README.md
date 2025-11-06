# Scripts d'Import et Export de Données

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

## 🆘 Support

Pour toute question ou problème:
1. Vérifiez ce README
2. Consultez les logs d'erreur détaillés du script
3. Contactez l'équipe technique
