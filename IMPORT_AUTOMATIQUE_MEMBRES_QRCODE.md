# 🚀 Import Automatique : Membres + QR Codes

## ✅ Système Complètement Automatisé !

Ce système permet d'**importer un fichier CSV** qui :
1. ✅ **Crée automatiquement les membres** dans la base de données
2. ✅ **Génère les QR Codes** pour chaque membre
3. ✅ **Envoie les emails** avec les QR Codes automatiquement

**Plus besoin de créer les membres manuellement !**

---

## 📋 Format CSV Requis

### Structure du Fichier

Le CSV doit contenir les colonnes suivantes (dans cet ordre) :

```csv
memberNumber,firstName,lastName,dateOfBirth,email,phone,address,status,memberType,cin,entite,responsabilite,validity
```

### Description des Colonnes

| Colonne | Requis | Description | Exemple |
|---------|--------|-------------|---------|
| **memberNumber** | ✅ Oui | Numéro unique du membre | `M-2022-0001` |
| **firstName** | ✅ Oui | Prénom | `Herilaza` |
| **lastName** | ✅ Oui | Nom de famille | `RANDRIANARISON` |
| **dateOfBirth** | ✅ Oui | Date de naissance (ISO format) | `1990-01-01` |
| **email** | ✅ Oui | Adresse email | `trakotolaza@gmail.com` |
| **phone** | ⬜ Non | Téléphone (format international) | `+261 344892248` |
| **address** | ⬜ Non | Adresse complète | `Madagascar` |
| **status** | ⬜ Non | Statut (défaut: `active`) | `active` |
| **memberType** | ⬜ Non | Type (défaut: `regular`) | `student` |
| **cin** | ⬜ Non | Numéro CIN | `103171006562` |
| **entite** | ⬜ Non | Entité | `Enseignant` |
| **responsabilite** | ⬜ Non | Responsabilité | `SG` |
| **validity** | ⬜ Non | Année de validité | `2025` |

### Exemple de Ligne CSV

```csv
M-2025-0001,"Herilaza","RANDRIANARISON",1990-01-01,trakotolaza@gmail.com,+261 344892248,"Madagascar",active,regular,103171006562,"Enseignant","SG",2025
```

---

## 📁 Fichier CSV Prêt à Utiliser

### Emplacement

```
backend/templates/ekipa-filoha-tantsoroka-feuil1-import-qrcode.csv
```

### Statistiques

- **118 membres** prêts à importer
- **42 membres (36%)** avec emails réels → recevront le QR Code immédiatement
- **76 membres (64%)** avec emails temporaires → à compléter

---

## 🎯 Comment Utiliser le Système

### Étape 1 : Préparer le CSV

**Option A - Utiliser le fichier existant (RAPIDE) :**
```bash
# Le fichier est déjà prêt !
# Emplacement : backend/templates/ekipa-filoha-tantsoroka-feuil1-import-qrcode.csv
```

**Option B - Ajuster l'année de validité :**
```bash
cd backend/templates

# Windows (PowerShell)
(Get-Content ekipa-filoha-tantsoroka-feuil1-import-qrcode.csv) -replace '2022','2025' | Set-Content ekipa-filoha-tantsoroka-feuil1-import-qrcode.csv

# Linux/Mac
sed -i 's/2022/2025/g' ekipa-filoha-tantsoroka-feuil1-import-qrcode.csv
```

**Option C - Compléter les emails manquants :**
1. Ouvrir le CSV dans Excel
2. Rechercher `@mhm.mg` pour trouver les emails temporaires
3. Remplacer par les vrais emails
4. Sauvegarder

---

### Étape 2 : Configurer le SMTP (OBLIGATOIRE)

**Vérifier que les variables SMTP sont configurées dans `backend/.env` :**

```env
# Configuration SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
SMTP_FROM=votre-email@gmail.com
```

**Test SMTP :**
```bash
cd backend
node test-smtp.js
```

---

### Étape 3 : Démarrer le Serveur

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

### Étape 4 : Importer le CSV

#### Via l'Interface Web (RECOMMANDÉ)

1. **Se connecter :**
   ```
   http://localhost:5173/login
   ```

2. **Accéder à la gestion des QR Codes :**
   ```
   http://localhost:5173/admin/qrcodes
   ```
   Ou cliquer sur le bouton **"📱 Gestion QR Codes"** dans le tableau de bord admin

3. **Uploader le fichier CSV :**
   - Cliquer sur **"Importer CSV"**
   - Sélectionner `ekipa-filoha-tantsoroka-feuil1-import-qrcode.csv`
   - Ajuster l'année si nécessaire (ex: `2025`)
   - Cliquer sur **"Importer et Envoyer"**

4. **Suivre la progression :**
   - Le système affiche la progression en temps réel
   - Vous voyez combien de membres sont créés
   - Vous voyez combien d'emails sont envoyés

---

#### Via API (AVANCÉ)

```bash
curl -X POST http://localhost:5000/api/qrcodes/import-csv \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -F "file=@backend/templates/ekipa-filoha-tantsoroka-feuil1-import-qrcode.csv" \
  -F "validity=2025"
```

---

## 📊 Résultats de l'Import

### Ce Qui Se Passe Automatiquement

Pour chaque ligne du CSV :

1. **✅ Vérification :**
   - Le système cherche si le membre existe (par `memberNumber` ou `email`)

2. **✅ Création (si nécessaire) :**
   - Si le membre n'existe pas → **création automatique**
   - Tous les champs sont remplis depuis le CSV

3. **✅ Génération du QR Code :**
   - Un QR Code unique est généré
   - Signature SHA-256 pour la sécurité
   - Le QR Code est sauvegardé en base64

4. **✅ Envoi de l'Email :**
   - Si l'email est valide → **envoi automatique**
   - L'email contient :
     - Le QR Code en pièce jointe
     - Les informations du membre
     - L'année de validité

### Tableau de Bord

Après l'import, vous verrez :

```
Import terminé !
━━━━━━━━━━━━━━━━
📊 Résultats :
  • Total : 118 membres
  • ✅ Créés : 118 nouveaux membres
  • ✅ QR Codes générés : 118
  • ✅ Emails envoyés : 42 (membres avec email réel)
  • ⚠️  En attente : 76 (emails temporaires)
  • 📈 Taux de succès : 100%
```

---

## 🔍 Suivi et Monitoring

### Voir les Batches d'Import

L'interface affiche tous les imports avec :
- Date et heure
- Nombre de membres traités
- Taux de succès
- Détails des erreurs

### Relancer les Envois Échoués

Si certains emails ont échoué :
1. Aller dans l'interface des batches
2. Trouver le batch concerné
3. Cliquer sur **"Relancer les échecs"**

---

## ⚠️ Gestion des Emails Temporaires

### Membres avec Emails Temporaires

Les 76 membres avec `@mhm.mg` ne recevront PAS d'email automatiquement.

**Pour les envoyer plus tard :**

1. **Compléter les emails dans la base de données :**
   - Via l'interface admin : modifier chaque membre
   - Via MongoDB directement

2. **Régénérer et renvoyer :**
   ```bash
   # Option 1 : Via l'interface
   # Aller sur la page du membre → "Régénérer QR Code"

   # Option 2 : Via API
   POST /api/qrcodes/generate/:memberId
   {
     "validity": "2025"
   }
   ```

---

## 🛠️ Script de Préparation CSV

### Convertir un Nouveau Fichier Excel

Si vous avez un nouveau fichier Excel à convertir :

```bash
cd backend

# Étape 1 : Extraire la feuille Excel
node scripts/convert-excel-sheet1-to-csv.js

# Étape 2 : Préparer pour l'import
node scripts/prepare-qrcode-import-sheet1.js
```

**Résultat :**
- `ekipa-filoha-tantsoroka-feuil1.csv` (brut)
- `ekipa-filoha-tantsoroka-feuil1-import-qrcode.csv` (prêt pour import)

---

## 🔐 Sécurité

### Validation des Emails

Le système vérifie automatiquement que les emails sont valides avant l'envoi.

### QR Codes Sécurisés

Chaque QR Code contient :
- Signature SHA-256
- Numéro de membre unique
- Année de validité
- Horodatage de génération

### Logs Détaillés

Tous les imports sont loggés avec :
- Qui a importé
- Quand
- Combien de membres
- Succès / Échecs

---

## 📈 Statistiques

### Via l'Interface

Accéder à : `http://localhost:5173/admin/qrcodes`

Vous verrez :
- Nombre total de membres
- Membres avec QR Code
- Taux de couverture
- Emails envoyés / En attente / Échoués

### Via API

```bash
GET /api/qrcodes/stats
```

---

## ❌ Résolution des Problèmes

### Problème : "Member validation failed"

**Cause :** Champs requis manquants

**Solution :**
1. Vérifier que le CSV contient bien :
   - `firstName`
   - `lastName`
   - `dateOfBirth`
   - `email`
2. Vérifier le format de la date : `YYYY-MM-DD`

---

### Problème : "Email non envoyé"

**Cause :** SMTP non configuré

**Solution :**
1. Vérifier `backend/.env`
2. Tester avec `node test-smtp.js`
3. Vérifier les logs backend

---

### Problème : "Duplicate key error"

**Cause :** Membre existe déjà avec ce `memberNumber` ou `email`

**Solution :**
- Le système va utiliser le membre existant
- Le QR Code sera régénéré
- L'email sera renvoyé

---

## 🎉 Avantages du Système

### Avant (Ancien Système)

1. ❌ Créer chaque membre manuellement
2. ❌ Approuver chaque membre un par un
3. ❌ Générer les QR Codes manuellement
4. ❌ Envoyer les emails un par un
5. ⏱️ **Temps : ~30 min pour 118 membres**

### Maintenant (Nouveau Système)

1. ✅ Upload 1 fichier CSV
2. ✅ Le système fait TOUT automatiquement
3. ⏱️ **Temps : ~2 minutes pour 118 membres**

---

## 📝 Checklist Avant Import

- [ ] Fichier CSV prêt avec tous les champs requis
- [ ] SMTP configuré dans `backend/.env`
- [ ] Test SMTP réussi (`node test-smtp.js`)
- [ ] Backend et Frontend démarrés
- [ ] Connecté en tant qu'admin
- [ ] Année de validité ajustée si nécessaire

---

## 🚀 Import Rapide (3 Commandes)

```bash
# 1. Tester SMTP
cd backend && node test-smtp.js

# 2. Démarrer les serveurs
npm run dev

# 3. Aller sur l'interface et uploader le CSV
# http://localhost:5173/admin/qrcodes
```

---

## 📞 Support

**Fichiers de référence :**
- Ce guide : `IMPORT_AUTOMATIQUE_MEMBRES_QRCODE.md`
- Guide système QR Code : `GUIDE_QRCODE_UTILISATION.md`
- Flux emails : `FLUX_EMAILS_ADHESION.md`
- Test complet : `TEST_ADHESION_QRCODE.md`

---

**Date de création :** 2025-11-24
**Fichier CSV prêt :** `ekipa-filoha-tantsoroka-feuil1-import-qrcode.csv`
**Membres à importer :** 118
**Statut :** ✅ Prêt pour import automatique
