# 📱 Guide d'Utilisation du Système QR Code

## 🎯 Vue d'ensemble

Le système de génération et d'envoi de QR Codes sécurisés permet de :
- ✅ Envoyer automatiquement un QR Code lors de la validation d'une adhésion
- ✅ Importer un CSV pour envoyer des QR Codes en masse
- ✅ Suivre l'état des envois (envoyé, en attente, erreur)
- ✅ Relancer automatiquement les envois échoués
- ✅ Vérifier l'authenticité des QR Codes avec signature SHA-256

---

## 📋 Table des matières

1. [Envoi Individuel](#1-envoi-individuel-membre-par-membre)
2. [Envoi en Masse par CSV](#2-envoi-en-masse-par-import-csv)
3. [Format du QR Code](#3-format-du-qr-code)
4. [Tableau de Bord](#4-tableau-de-bord)
5. [Configuration Email](#5-configuration-email)
6. [Dépannage](#6-dépannage)

---

## 1️⃣ Envoi Individuel (membre par membre)

### Comment ça marche ?

Lorsqu'un administrateur valide une adhésion, le système **génère et envoie automatiquement** un QR Code par email au nouveau membre.

### Étapes :

1. **Accéder au Dashboard Admin**
   - URL : `/admin/dashboard`
   - Menu : "Applications en attente"

2. **Valider une adhésion**
   - Cliquer sur le bouton **"✅ Approuver"** pour le membre souhaité
   - Confirmer l'action

3. **Résultat automatique**
   Le système va :
   - ✅ Générer un numéro de membre unique (ex: `M-2025-0142`)
   - ✅ Changer le statut à "Actif"
   - ✅ Générer le QR Code avec signature sécurisée
   - ✅ Enregistrer le fichier PNG : `qr_M-2025-0142.png`
   - ✅ Envoyer un email avec le QR Code en pièce jointe
   - ✅ Enregistrer l'état d'envoi

4. **Notification**
   Un message s'affiche avec le résultat :
   ```
   ✅ Adhésion approuvée avec succès !
   ✅ QR Code envoyé par email.
   ```

   Ou en cas de problème :
   ```
   ✅ Adhésion approuvée avec succès !
   ⚠️ QR Code généré mais email non envoyé.
   ```

### États possibles

| État | Icône | Description |
|------|-------|-------------|
| **Envoyé** | ✅ | QR Code généré et email envoyé avec succès |
| **En attente** | ⚠️ | QR Code généré mais email pas encore envoyé |
| **Erreur** | ❌ | Échec de génération ou d'envoi |

---

## 2️⃣ Envoi en Masse par Import CSV

### Accéder à l'interface

1. **Menu principal** → **"Gestion des QR Codes"**
2. Onglet **"📤 Import CSV"**

### Format CSV attendu

#### Colonnes obligatoires :
- `memberId` ou `memberNumber` : Numéro du membre
- `email` : Email du membre

#### Colonnes optionnelles :
- `name` : Nom complet du membre
- `status` : Statut (active, pending, inactive)
- `validity` : Année de validité (ex: 2025)

#### Exemple de fichier CSV :

```csv
memberId,name,email,status,validity
M-2025-0001,Jean Dupont,jean.dupont@email.com,active,2025
M-2025-0002,Marie Martin,marie.martin@email.com,active,2025
M-2025-0003,Pierre Durand,pierre.durand@email.com,active,2025
```

### Télécharger le modèle

Dans l'interface d'import, cliquez sur :
```
📄 Télécharger le modèle CSV
```

### Procédure d'import

1. **Préparer le fichier CSV**
   - Remplir les colonnes requises
   - Vérifier que tous les membres existent dans la base de données
   - Maximum 5 MB

2. **Sélectionner l'année de validité**
   - Par défaut : année en cours
   - Exemple : `2025`

3. **Importer le fichier**
   - Cliquer sur **"Cliquez pour sélectionner"**
   - Ou **glisser-déposer** le fichier CSV

4. **Lancer l'envoi**
   - Bouton : **"Lancer l'envoi en masse"**
   - Confirmer l'action

5. **Suivi en temps réel**
   Le système va :
   - ✅ Parser le fichier CSV
   - ✅ Créer un batch avec tracking
   - ✅ Pour chaque membre :
     - Vérifier qu'il existe dans la base
     - Générer le QR Code
     - Envoyer l'email
     - Enregistrer le résultat

6. **Résultat final**
   Un rapport complet s'affiche :
   ```
   Import terminé !
   ━━━━━━━━━━━━━━━━
   📊 Résultats :
     • Total : 150 membres
     • ✅ Envoyés : 145
     • ❌ Échecs : 5
     • 📈 Taux : 96.67%

   ⚠️ Vous pouvez relancer les échecs depuis le dashboard.
   ```

### Système de reprise automatique

En cas d'échecs :

1. **Accéder au Dashboard**
   - Onglet **"📊 Historique & Statistiques"**

2. **Voir les batches**
   - Liste de tous les imports
   - Statut : `completed`, `partial`, `failed`

3. **Relancer les échecs**
   - Cliquer sur **"🔄 Relancer les échecs"**
   - Le système va automatiquement :
     - Identifier les envois échoués
     - Retenter l'envoi
     - Mettre à jour les statistiques

---

## 3️⃣ Format du QR Code

### Structure JSON

Chaque QR Code contient un JSON signé avec SHA-256 :

```json
{
  "memberId": "M-2025-0142",
  "name": "Jean Dupont",
  "email": "jean.dupont@email.com",
  "association": "Mizara",
  "validity": "2025",
  "status": "Membre actif",
  "signature": "a3f5b2c8d9e1f4a7b6c5d8e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0"
}
```

### Signature anti-fraude

La signature est générée avec :
```
SHA-256(memberId + secretKey + validity)
```

**Caractéristiques de sécurité :**
- ✅ Impossible à falsifier sans la clé secrète
- ✅ Vérifie l'authenticité du QR Code
- ✅ Validité limitée à une année
- ✅ Détection automatique des QR Codes frauduleux

### Fichier image généré

- **Format** : PNG
- **Nom** : `qr_<memberId>.png`
- **Exemple** : `qr_M-2025-0142.png`
- **Taille** : 400x400 pixels
- **Stockage** : `backend/public/qrcodes/`

---

## 4️⃣ Tableau de Bord

### Statistiques disponibles

#### Vue globale
- Total de membres
- Membres avec QR Code
- Couverture (%)
- QR Codes pour l'année en cours

#### Historique des batches
- Date et heure de traitement
- Type : `csv-import`, `manual`, `bulk-regenerate`
- Statut : `pending`, `processing`, `completed`, `partial`, `failed`
- Nombre total de membres
- Envois réussis / échoués
- Taux de réussite

#### Détails d'un batch
- Liste complète des membres traités
- Statut individuel de chaque envoi
- Raison de l'échec (si applicable)
- Possibilité de retry

---

## 5️⃣ Configuration Email

### Fichier de configuration

Éditer le fichier `backend/.env` :

```env
# Configuration Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
EMAIL_FROM=noreply@mizara.mg
EMAIL_FROM_NAME=Association Mizara

# Clé secrète pour QR Code (SHA-256)
QR_CODE_SECRET_KEY=votre_cle_secrete_super_longue_et_aleatoire_minimum_32_caracteres
```

### Configuration Gmail (recommandée)

1. **Activer l'authentification à 2 facteurs** sur votre compte Gmail

2. **Créer un mot de passe d'application**
   - Compte Google → Sécurité
   - "Mots de passe des applications"
   - Sélectionner "Autre (nom personnalisé)"
   - Copier le mot de passe généré

3. **Configurer dans `.env`**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=votre-email@gmail.com
   SMTP_PASS=mot_de_passe_application
   ```

### Autres fournisseurs SMTP

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=votre_api_key_sendgrid
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=votre_username_mailgun
SMTP_PASS=votre_password_mailgun
```

### Test en développement

Pour tester sans envoyer de vrais emails, utilisez **Ethereal Email** :

1. Créer un compte test sur https://ethereal.email
2. Copier les identifiants SMTP
3. Configurer dans `.env` :
   ```env
   SMTP_HOST=smtp.ethereal.email
   SMTP_PORT=587
   SMTP_USER=nom-utilisateur-ethereal
   SMTP_PASS=mot-de-passe-ethereal
   ```
4. Les emails seront capturés et visibles sur le site Ethereal

---

## 6️⃣ Dépannage

### ❌ Email non envoyé

**Symptôme** : QR Code généré mais email non envoyé

**Solutions** :
1. Vérifier la configuration SMTP dans `.env`
2. Tester la connexion SMTP :
   ```bash
   cd backend
   npm run test:email
   ```
3. Vérifier les logs serveur :
   ```bash
   tail -f backend/logs/combined.log
   ```
4. Relancer l'envoi depuis le dashboard

### ❌ QR Code invalide

**Symptôme** : Message "QR falsifié" lors du scan

**Solutions** :
1. Vérifier que `QR_CODE_SECRET_KEY` est identique sur tous les serveurs
2. Régénérer le QR Code pour l'année en cours
3. Vérifier que l'année du QR Code correspond à l'année actuelle

### ❌ Membre non trouvé dans CSV

**Symptôme** : Erreur "Membre non trouvé dans la base de données"

**Solutions** :
1. Vérifier que le `memberId` existe bien dans la base
2. Vérifier l'orthographe exacte du numéro de membre
3. S'assurer que le membre a été créé avant l'import

### ⚠️ Import CSV bloqué

**Symptôme** : L'import ne démarre pas

**Solutions** :
1. Vérifier que le fichier est bien au format CSV
2. Vérifier la taille (maximum 5 MB)
3. Vérifier que les colonnes obligatoires sont présentes
4. Télécharger et utiliser le modèle CSV fourni

### 🔒 Erreur de permission

**Symptôme** : Impossible d'accéder à la page QR Code

**Solutions** :
1. Vérifier que l'utilisateur est connecté
2. Vérifier que l'utilisateur a le rôle `admin`
3. Se reconnecter si nécessaire

---

## 📊 Flux complet du système

### Envoi Individuel

```
Admin clique "Approuver"
         ↓
applicationController.approveApplication()
         ↓
Génère memberNumber (ex: M-2025-0142)
         ↓
Change statut → "active"
         ↓
generateAndSendQRCode(member, "2025")
         ↓
generateMemberQRCode()
    • Crée JSON avec signature SHA-256
    • Génère image PNG
         ↓
saveQRCodeToFile()
    • Sauvegarde : qr_M-2025-0142.png
         ↓
sendQRCodeEmail()
    • Email avec template HTML
    • QR Code en pièce jointe
         ↓
Mise à jour membre.qrCode
    • emailStatus: "sent" | "failed"
    • emailSentAt: Date
         ↓
✅ Confirmation à l'admin
```

### Envoi en Masse

```
Admin upload CSV
         ↓
importCSVAndSendQRCodes()
         ↓
Créer QRCodeBatch
    • status: "pending"
    • totalMembers: count
         ↓
Parser CSV ligne par ligne
         ↓
Pour chaque membre:
    ├─ Trouver dans DB
    ├─ generateAndSendQRCode()
    ├─ Enregistrer résultat
    └─ Mettre à jour batch
         ↓
Batch status → "completed" | "partial"
         ↓
✅ Rapport final avec statistiques
```

---

## 📧 Template Email

L'email envoyé contient :

### Sujet
```
Votre QR Code Membre 2025 - Association Mizara
```

### Contenu
- Message de bienvenue personnalisé
- Informations du membre (numéro, nom, email, statut)
- QR Code personnalisé (image intégrée + pièce jointe)
- Signature de sécurité (16 premiers caractères)
- Instructions d'utilisation
- Note de sécurité SHA-256

### Pièce jointe
- Fichier : `qr_<memberNumber>.png`
- Format : PNG, 400x400px
- Intégration : Content-ID "qrcode"

---

## 🎯 Points clés à retenir

1. ✅ **Envoi automatique** lors de la validation d'adhésion
2. ✅ **Import CSV** pour envoi en masse avec suivi complet
3. ✅ **Signature SHA-256** pour éviter la fraude
4. ✅ **Tracking des statuts** : sent, pending, failed
5. ✅ **Système de retry** automatique pour les échecs
6. ✅ **QR Code valable** uniquement pour l'année spécifiée
7. ✅ **Template email HTML** professionnel et responsive
8. ✅ **Dashboard complet** pour le suivi et les statistiques

---

## 🔗 Ressources

- **API Documentation** : `/api-docs`
- **Code source backend** : `backend/src/controllers/qrCodeController.js`
- **Code source frontend** : `frontend/src/features/qrcode/`
- **Configuration email** : `backend/.env.example`

---

## 📞 Support

En cas de problème :
1. Consulter les logs : `backend/logs/`
2. Vérifier la configuration : `backend/.env`
3. Tester la connexion SMTP
4. Contacter l'équipe technique avec :
   - Message d'erreur exact
   - Logs du serveur
   - Configuration SMTP (sans mot de passe)

---

**Dernière mise à jour** : 2025-11-23
**Version** : 1.0.0
**Auteur** : Équipe Technique HFM
