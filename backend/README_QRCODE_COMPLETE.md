# Système Complet de QR Codes - Association Mizara

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Documentation Détaillée](#documentation-détaillée)
4. [Démarrage Rapide](#démarrage-rapide)
5. [Exemples d'Utilisation](#exemples-dutilisation)
6. [API Reference](#api-reference)

---

## Vue d'ensemble

Système complet de gestion de QR Codes pour l'association Mizara comprenant :

✅ **Génération et Envoi**
- Envoi individuel lors de l'approbation d'un membre
- Envoi en masse par import CSV
- Système de reprise automatique en cas d'échec

✅ **Vérification et Sécurité**
- Signature cryptographique SHA-256
- Vérification anti-fraude
- Validation de l'année et du statut membre
- Suivi du statut email (sent/pending/failed)

✅ **Journalisation et Monitoring**
- Historique complet des scans
- Compteur d'utilisation par QR Code
- Tableau de bord des opérations d'envoi
- Statistiques en temps réel

---

## Architecture

### Modèles de Données

```
Member (Membre)
├── memberNumber (Unique)
├── firstName, lastName
├── email
├── status (pending/active/inactive/suspended)
└── qrCode
    ├── code
    ├── signature
    ├── validity (année)
    ├── emailStatus (sent/pending/failed/not-generated)
    ├── emailSentAt
    ├── scanCount
    └── lastScannedAt

QRCodeScan (Scan)
├── member (ref)
├── scanStatus (valid/expired/forged/invalid/disabled)
├── emailStatus
├── scannedAt
├── location
└── deviceInfo

QRCodeBatch (Lot d'envoi)
├── batchType (csv-import/manual/bulk-regenerate)
├── status (pending/processing/completed/failed/partial)
├── totalMembers
├── successfulSends
├── failedSends
└── results []
```

### Flux de Données

```
┌─────────────────────────────────────────────────────────────┐
│                    GÉNÉRATION & ENVOI                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Interface Admin]                                           │
│         │                                                    │
│         ├─→ Approbation Individuelle                        │
│         │   └─→ POST /api/applications/:id/approve          │
│         │       └─→ generateAndSendQRCode()                 │
│         │           ├─→ Génération signature SHA-256        │
│         │           ├─→ Création image PNG                  │
│         │           └─→ Envoi email + tracking              │
│         │                                                    │
│         └─→ Import CSV                                       │
│             └─→ POST /api/qrcodes/import-csv                │
│                 └─→ QRCodeBatch.create()                    │
│                     └─→ Pour chaque membre:                 │
│                         └─→ generateAndSendQRCode()         │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   VÉRIFICATION & SCAN                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Scanner QR]                                                │
│         │                                                    │
│         └─→ POST /api/qrcodes/verify                        │
│             └─→ verifyQRCode()                              │
│                 ├─→ Validation structure JSON               │
│                 ├─→ Vérification signature                  │
│                 ├─→ Contrôle validité année                 │
│                 ├─→ Vérification statut membre              │
│                 ├─→ Check emailStatus                       │
│                 ├─→ Incrément scanCount                     │
│                 └─→ QRCodeScan.create()                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  MONITORING & DASHBOARD                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  GET /api/qrcodes/dashboard?period=week                     │
│  GET /api/qrcodes/scans?status=valid                        │
│  GET /api/qrcodes/batches                                   │
│  GET /api/qrcodes/batches/stats                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Documentation Détaillée

### 📚 Guides Disponibles

1. **README_QRCODE_SYSTEM.md**
   - Système de génération de base
   - Signature cryptographique
   - Format des données
   - Endpoints de génération

2. **README_QRCODE_VERIFICATION.md**
   - Système de vérification
   - États possibles (valid/expired/forged/etc.)
   - Format de sortie standardisé
   - Journalisation des scans
   - Dashboard de contrôle

3. **README_QRCODE_SENDING_SYSTEM.md** ⭐ (Ce guide)
   - Envoi individuel (approbation membre)
   - Envoi en masse (import CSV)
   - Système de retry
   - Tableau de bord des envois
   - Exemples complets

---

## Démarrage Rapide

### 1. Installation

```bash
cd backend
npm install
```

### 2. Configuration

Créer/modifier `.env` :

```env
# QR Code Secret Key
QR_CODE_SECRET_KEY=your_super_secret_key_change_in_production

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@mizara.mg
```

### 3. Créer les Dossiers

```bash
mkdir -p uploads
mkdir -p public/qrcodes
chmod 755 public/qrcodes
```

### 4. Démarrer le Serveur

```bash
npm run dev
```

---

## Exemples d'Utilisation

### Exemple 1 : Approuver un Membre et Envoyer son QR Code

```javascript
// Frontend Admin - Approbation d'adhésion
const approveMember = async (memberId) => {
  const response = await fetch(`/api/applications/${memberId}/approve`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      notes: 'Documents vérifiés'
    })
  });

  const result = await response.json();

  if (result.success) {
    const { member, qrCodeStatus } = result.data;

    if (qrCodeStatus.emailSent) {
      showNotification(`✅ QR Code envoyé à ${member.email}`);
    } else {
      showWarning(`⚠ QR Code généré mais email non envoyé`);
    }
  }
};
```

### Exemple 2 : Import CSV et Suivi du Batch

```javascript
// Frontend Admin - Import CSV
const importQRCodes = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('validity', '2025');

  const response = await fetch('/api/qrcodes/import-csv', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    },
    body: formData
  });

  const batch = await response.json();

  // Afficher le résultat
  console.log(`
    Batch ID: ${batch.data._id}
    Total: ${batch.data.totalMembers}
    Succès: ${batch.data.successfulSends} ✅
    Échecs: ${batch.data.failedSends} ❌
    Taux de réussite: ${batch.data.successRate}%
  `);

  // Relancer les échecs si nécessaire
  if (batch.data.failedSends > 0) {
    const retryResponse = await fetch(
      `/api/qrcodes/batch/${batch.data._id}/retry`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      }
    );
    const retryResult = await retryResponse.json();
    console.log(`Retry: ${retryResult.message}`);
  }
};
```

### Exemple 3 : Scanner un QR Code à l'Entrée

```javascript
// Frontend Événement - Scan QR Code
const scanQRCode = async (qrData) => {
  const response = await fetch('/api/qrcodes/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      qrData,
      location: 'Entrée Principale',
      eventId: '64f1a2b3c4d5e6f7g8h9i0j1',
      trackScan: true
    })
  });

  const result = await response.json();
  const { memberId, name, status, message, emailStatus } = result.data;

  switch (status) {
    case 'valid':
      showSuccess(`✅ ${name} - Accès autorisé`);
      console.log(`Email: ${emailStatus}, Scans: ${result.data.member.qrCode.scanCount}`);
      break;
    case 'expired':
      showError(`❌ ${message}`);
      break;
    case 'forged':
      showAlert(`🚨 QR falsifié ! Membre: ${name}`);
      break;
    default:
      showError(`❌ ${message}`);
  }
};
```

### Exemple 4 : Dashboard Admin

```javascript
// Frontend Admin - Tableau de Bord
const loadDashboard = async () => {
  // Statistiques de scans
  const scanStats = await fetch('/api/qrcodes/dashboard?period=week', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const scans = await scanStats.json();

  // Statistiques de batches
  const batchStats = await fetch('/api/qrcodes/batches/stats', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const batches = await batchStats.json();

  // Affichage
  return {
    scans: {
      total: scans.data.summary.totalScans,
      valid: scans.data.summary.validScans,
      successRate: scans.data.summary.successRate
    },
    batches: {
      total: batches.data.totalBatches,
      completed: batches.data.completedBatches,
      totalSends: batches.data.totalSends,
      successRate: batches.data.successRate
    }
  };
};
```

---

## API Reference

### 📤 Génération et Envoi

| Endpoint | Méthode | Description | Accès |
|----------|---------|-------------|-------|
| `/api/applications/:id/approve` | PUT | Approuver membre + envoi QR auto | Admin |
| `/api/qrcodes/generate/:memberId` | POST | Générer et envoyer QR individuel | Admin |
| `/api/qrcodes/import-csv` | POST | Import CSV et envoi masse | Admin |
| `/api/qrcodes/bulk-generate` | POST | Génération en masse (sans CSV) | Admin |
| `/api/qrcodes/regenerate-year` | POST | Régénération pour nouvelle année | Admin |

### ✅ Vérification

| Endpoint | Méthode | Description | Accès |
|----------|---------|-------------|-------|
| `/api/qrcodes/verify` | POST | Vérifier un QR Code | Public |

### 📊 Monitoring Scans

| Endpoint | Méthode | Description | Accès |
|----------|---------|-------------|-------|
| `/api/qrcodes/dashboard` | GET | Dashboard scans avec stats | Admin |
| `/api/qrcodes/scans` | GET | Historique scans avec filtres | Admin |
| `/api/qrcodes/member/:id/scans` | GET | Scans d'un membre spécifique | Privé |
| `/api/qrcodes/stats` | GET | Statistiques QR Codes | Admin |

### 📦 Monitoring Batches

| Endpoint | Méthode | Description | Accès |
|----------|---------|-------------|-------|
| `/api/qrcodes/batches` | GET | Liste des batches | Admin |
| `/api/qrcodes/batch/:id` | GET | Détails d'un batch | Admin |
| `/api/qrcodes/batches/stats` | GET | Statistiques des batches | Admin |
| `/api/qrcodes/batch/:id/retry` | POST | Relancer échecs d'un batch | Admin |

---

## Fichiers Importants

### 📁 Structure du Projet

```
backend/
├── src/
│   ├── models/
│   │   ├── Member.js                 # Modèle membre avec qrCode
│   │   ├── QRCodeScan.js            # Journalisation scans
│   │   └── QRCodeBatch.js           # Gestion batches
│   ├── controllers/
│   │   ├── applicationController.js  # Approbation + envoi auto
│   │   └── qrCodeController.js      # Génération, vérification, batches
│   ├── routes/
│   │   └── qrCodeRoutes.js          # Routes API QR Codes
│   └── utils/
│       ├── qrCodeGenerator.js       # Génération + signature
│       └── qrCodeService.js         # Envoi emails + tracking
├── templates/
│   └── qrcode-import-template.csv   # Template CSV
├── uploads/                          # Upload CSV temporaires
├── public/
│   └── qrcodes/                     # Images QR générées
└── README files
    ├── README_QRCODE_SYSTEM.md
    ├── README_QRCODE_VERIFICATION.md
    └── README_QRCODE_SENDING_SYSTEM.md
```

---

## Sécurité

### ✅ Mesures Implémentées

1. **Signature SHA-256** : Chaque QR Code est signé
2. **Clé secrète** : Stockée en variable d'environnement
3. **Validation stricte** : Structure + signature + année + statut
4. **Journalisation complète** : Tous les scans sont enregistrés
5. **Détection fraude** : Alertes sur QR falsifiés
6. **Accès contrôlé** : Endpoints admin protégés par auth

### 🔒 Bonnes Pratiques

```env
# ❌ MAUVAIS
QR_CODE_SECRET_KEY=123456

# ✅ BON
QR_CODE_SECRET_KEY=xK9$mN2#pL7@vD4&qR8!wF6^yT3*zH1
```

---

## Monitoring & Alertes

### Métriques Clés

1. **Taux de réussite d'envoi** : Doit être > 95%
2. **Tentatives de fraude** : Alerter si > 5/jour
3. **QR Codes expirés** : Surveiller approche fin d'année
4. **Emails non envoyés** : Vérifier emailStatus: failed

### Requêtes MongoDB Utiles

```javascript
// Membres avec emails échoués
db.members.find({
  'qrCode.emailStatus': 'failed'
});

// Scans frauduleux aujourd'hui
db.qrcodescans.find({
  scanStatus: 'forged',
  scannedAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
});

// Batches en cours
db.qrcodebatches.find({
  status: 'processing'
});

// Top 10 membres les plus scannés
db.members.find({
  'qrCode.scanCount': { $exists: true }
}).sort({ 'qrCode.scanCount': -1 }).limit(10);
```

---

## Support & Dépannage

### Problèmes Courants

**1. CSV Import échoue**
```bash
# Vérifier l'encodage du fichier
file -i membres.csv

# Convertir en UTF-8 si nécessaire
iconv -f ISO-8859-1 -t UTF-8 membres.csv > membres_utf8.csv
```

**2. QR Code non généré**
```bash
# Vérifier permissions
chmod 755 backend/public/qrcodes/

# Vérifier espace disque
df -h
```

**3. Email non envoyé**
```bash
# Tester SMTP
node backend/test/testEmail.js

# Vérifier logs
tail -f backend/logs/combined.log | grep "email"
```

### Contact

- **Email** : contact@mizara.mg
- **Documentation API** : http://localhost:5000/api-docs
- **Logs** : `backend/logs/`

---

## Changelog

### Version 2.0 (Actuel) - Janvier 2025

✅ **Nouvelles Fonctionnalités**
- Import CSV et envoi en masse
- Système de retry automatique
- Tracking status email (sent/pending/failed)
- Modèle QRCodeBatch
- Dashboard batches
- Envoi automatique lors approbation membre

✅ **Améliorations**
- Journalisation complète des scans
- Compteur d'utilisation par QR Code
- Format de sortie standardisé
- Meilleure gestion des erreurs

### Version 1.0 - Décembre 2024

- Génération QR Codes
- Signature SHA-256
- Vérification basique
- Envoi emails

---

© 2025 Association Mizara - Système Complet de QR Codes
