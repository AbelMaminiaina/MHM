# Système de Vérification des QR Codes

## Vue d'ensemble

Ce document décrit le système complet de vérification des QR Codes avec suivi du statut email, journalisation des scans, et tableau de bord de contrôle.

## Caractéristiques

### 1. Vérification Complète

Le système vérifie les QR Codes selon plusieurs critères :

1. **Structure du JSON** : Validation de la présence des champs obligatoires
2. **Signature cryptographique** : Vérification SHA-256 anti-fraude
3. **Validité annuelle** : Contrôle de l'année de validité
4. **Statut du membre** : Vérification que le membre est actif
5. **Statut email** : Vérification que le QR Code a été envoyé par email

### 2. États Possibles

Le système retourne l'un des états suivants :

| État | Description | Emoji |
|------|-------------|-------|
| `valid` | Membre valide et actif | ✅ |
| `valid` (email non confirmé) | Valide mais email non envoyé | ✅ |
| `forged` | QR Code falsifié (signature incorrecte) | ❌ |
| `expired` | Adhésion expirée (année invalide) | ❌ |
| `disabled` | Membre désactivé/suspendu | ❌ |
| `not-found` | Membre non trouvé dans la base | ❌ |
| `invalid` | Structure JSON invalide | ❌ |

### 3. Format de Sortie Standardisé

```json
{
  "success": true,
  "data": {
    "memberId": "M-2025-0142",
    "name": "Jean Dupont",
    "emailStatus": "sent",
    "status": "valid",
    "message": "✅ Membre valide",
    "member": {
      "_id": "...",
      "fullName": "Jean Dupont",
      "memberNumber": "M-2025-0142",
      "email": "jean.dupont@email.com",
      "memberType": "regular",
      "status": "active",
      "membershipDate": "2025-01-15T00:00:00.000Z",
      "validity": "2025",
      "qrCode": {
        "scanCount": 5,
        "lastScannedAt": "2025-01-20T14:30:00.000Z",
        "emailStatus": "sent",
        "emailSentAt": "2025-01-15T10:00:00.000Z"
      }
    }
  }
}
```

## API Endpoints

### 1. Vérifier un QR Code

```http
POST /api/qrcodes/verify
Content-Type: application/json

{
  "qrData": "{\"memberId\":\"M-2025-0142\",\"name\":\"Jean Dupont\",...}",
  "location": "Entrée Événement XYZ",
  "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "trackScan": true
}
```

**Paramètres :**

- `qrData` (requis) : Contenu JSON du QR Code sous forme de chaîne
- `location` (optionnel) : Localisation du scan
- `eventId` (optionnel) : ID de l'événement associé
- `trackScan` (optionnel, défaut: true) : Active/désactive la journalisation

**Réponse :**

```json
{
  "success": true,
  "data": {
    "memberId": "M-2025-0142",
    "name": "Jean Dupont",
    "emailStatus": "sent",
    "status": "valid",
    "message": "✅ Membre valide",
    "member": { ... }
  }
}
```

### 2. Tableau de Bord des Contrôles

```http
GET /api/qrcodes/dashboard?period=week
Authorization: Bearer <admin-token>
```

**Paramètres :**

- `period` : `today`, `week`, `month`, `year` (défaut: `today`)

**Réponse :**

```json
{
  "success": true,
  "data": {
    "period": "week",
    "startDate": "2025-01-14T00:00:00.000Z",
    "summary": {
      "totalScans": 150,
      "validScans": 142,
      "failedScans": 8,
      "successRate": "94.67"
    },
    "scansByStatus": [
      { "status": "valid", "count": 142, "percentage": "94.67" },
      { "status": "expired", "count": 5, "percentage": "3.33" },
      { "status": "forged", "count": 2, "percentage": "1.33" },
      { "status": "not-found", "count": 1, "percentage": "0.67" }
    ],
    "scansByEmailStatus": [
      { "status": "sent", "count": 140, "percentage": "93.33" },
      { "status": "pending", "count": 8, "percentage": "5.33" },
      { "status": "not-found", "count": 2, "percentage": "1.33" }
    ],
    "topScannedMembers": [
      {
        "memberId": "...",
        "memberNumber": "M-2025-0142",
        "fullName": "Jean Dupont",
        "count": 12
      }
    ],
    "scansOverTime": [
      { "_id": "2025-01-14", "count": 25 },
      { "_id": "2025-01-15", "count": 30 },
      { "_id": "2025-01-16", "count": 28 }
    ],
    "recentScans": [ ... ]
  }
}
```

### 3. Historique des Scans

```http
GET /api/qrcodes/scans?status=valid&limit=50&skip=0
Authorization: Bearer <admin-token>
```

**Paramètres de filtrage :**

- `memberId` : Filtrer par ID de membre
- `memberNumber` : Filtrer par numéro de membre
- `status` : Filtrer par statut (valid, expired, forged, etc.)
- `startDate` : Date de début (ISO 8601)
- `endDate` : Date de fin (ISO 8601)
- `limit` : Nombre de résultats (défaut: 50)
- `skip` : Pagination (défaut: 0)
- `sortBy` : Tri (défaut: -scannedAt)

**Réponse :**

```json
{
  "success": true,
  "data": {
    "scans": [
      {
        "_id": "...",
        "member": {
          "firstName": "Jean",
          "lastName": "Dupont",
          "memberNumber": "M-2025-0142"
        },
        "memberNumber": "M-2025-0142",
        "scanStatus": "valid",
        "scanMessage": "✅ Membre valide",
        "emailStatus": "sent",
        "scannedAt": "2025-01-20T14:30:00.000Z",
        "location": "Entrée Événement XYZ",
        "deviceInfo": {
          "userAgent": "Mozilla/5.0...",
          "ipAddress": "192.168.1.100"
        }
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 50,
      "skip": 0,
      "hasMore": true
    }
  }
}
```

### 4. Historique des Scans d'un Membre

```http
GET /api/qrcodes/member/:memberId/scans?limit=20
Authorization: Bearer <token>
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "member": {
      "_id": "...",
      "memberNumber": "M-2025-0142",
      "fullName": "Jean Dupont",
      "email": "jean.dupont@email.com",
      "status": "active"
    },
    "scanStats": {
      "totalScans": 12,
      "lastScannedAt": "2025-01-20T14:30:00.000Z",
      "validScans": 11,
      "recentScans": [ ... ]
    }
  }
}
```

## Journalisation des Scans

Chaque vérification de QR Code est automatiquement enregistrée dans la collection `QRCodeScan` avec les informations suivantes :

```javascript
{
  member: ObjectId,           // Référence au membre
  memberNumber: String,       // Numéro du membre
  scanStatus: String,         // État du scan
  scanMessage: String,        // Message descriptif
  emailStatus: String,        // Statut email
  qrData: Object,            // Données du QR Code
  scannedBy: ObjectId,       // Utilisateur qui a scanné
  scannedAt: Date,           // Date/heure du scan
  location: String,          // Localisation
  eventId: ObjectId,         // Événement associé
  deviceInfo: {
    userAgent: String,
    ipAddress: String
  }
}
```

## Compteur d'Utilisation

Le modèle `Member` inclut maintenant un compteur d'utilisation pour chaque QR Code :

```javascript
qrCode: {
  scanCount: Number,          // Nombre total de scans
  lastScannedAt: Date,        // Dernier scan
  emailStatus: String,        // sent, pending, failed, not-generated
  emailSentAt: Date          // Date d'envoi de l'email
}
```

Le compteur est automatiquement incrémenté à chaque scan lorsque `trackScan: true`.

## Statuts Email

Le système track 4 statuts possibles pour l'email :

| Statut | Description |
|--------|-------------|
| `not-generated` | QR Code pas encore généré |
| `pending` | QR Code généré mais email en cours d'envoi |
| `sent` | Email envoyé avec succès |
| `failed` | Échec d'envoi de l'email |

## Scénarios d'Utilisation

### Scénario 1 : Entrée à un Événement

```javascript
// Scanner le QR Code à l'entrée
const response = await fetch('/api/qrcodes/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    qrData: scannedData,
    location: 'Entrée Principale',
    eventId: '64f1a2b3c4d5e6f7g8h9i0j1',
    trackScan: true
  })
});

const result = await response.json();

if (result.data.status === 'valid') {
  // Autoriser l'entrée
  console.log(`✅ ${result.data.name} - Accès autorisé`);
  console.log(`Email: ${result.data.emailStatus}`);
  console.log(`Scans: ${result.data.member.qrCode.scanCount}`);
} else {
  // Refuser l'entrée
  console.log(`❌ ${result.data.message}`);
}
```

### Scénario 2 : Consultation du Dashboard Admin

```javascript
// Obtenir les statistiques de la semaine
const stats = await fetch('/api/qrcodes/dashboard?period=week', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
});

const data = await stats.json();
console.log(`Taux de réussite: ${data.data.summary.successRate}%`);
console.log(`Total scans: ${data.data.summary.totalScans}`);
console.log(`Scans valides: ${data.data.summary.validScans}`);
```

### Scénario 3 : Audit de Sécurité

```javascript
// Rechercher tous les QR Codes falsifiés
const forgedScans = await fetch(
  '/api/qrcodes/scans?status=forged&startDate=2025-01-01',
  { headers: { 'Authorization': `Bearer ${adminToken}` } }
);

const scans = await forgedScans.json();
console.log(`⚠️ ${scans.data.pagination.total} tentatives de fraude détectées`);
```

## Sécurité

### Protection Anti-Fraude

1. **Signature SHA-256** : Chaque QR Code contient une signature unique
2. **Clé secrète** : Stockée en variable d'environnement (`QR_CODE_SECRET_KEY`)
3. **Journalisation** : Tous les scans sont enregistrés avec IP et user-agent
4. **Expiration annuelle** : Les QR Codes expirent automatiquement

### Bonnes Pratiques

1. ✅ Toujours utiliser HTTPS en production
2. ✅ Changer la clé secrète par défaut
3. ✅ Restreindre l'accès au dashboard aux admins
4. ✅ Monitorer les tentatives de fraude (status: forged)
5. ✅ Régénérer les QR Codes chaque année

## Modèle de Données

### Member (Modifications)

```javascript
qrCode: {
  code: String,
  imageUrl: String,
  generatedAt: Date,
  signature: String,
  validity: String,
  emailStatus: String,        // NOUVEAU
  emailSentAt: Date,          // NOUVEAU
  scanCount: Number,          // NOUVEAU
  lastScannedAt: Date        // NOUVEAU
}
```

### QRCodeScan (Nouveau modèle)

```javascript
{
  member: ObjectId,
  memberNumber: String,
  scanStatus: String,
  scanMessage: String,
  emailStatus: String,
  qrData: Mixed,
  scannedBy: ObjectId,
  scannedAt: Date,
  location: String,
  eventId: ObjectId,
  deviceInfo: {
    userAgent: String,
    ipAddress: String
  }
}
```

## Tests

### Test de Vérification Basique

```bash
curl -X POST http://localhost:5000/api/qrcodes/verify \
  -H "Content-Type: application/json" \
  -d '{
    "qrData": "{\"memberId\":\"M-2025-0142\",\"signature\":\"abc123...\",\"validity\":\"2025\"}"
  }'
```

### Test du Dashboard

```bash
curl http://localhost:5000/api/qrcodes/dashboard?period=week \
  -H "Authorization: Bearer <admin-token>"
```

### Test de l'Historique

```bash
curl "http://localhost:5000/api/qrcodes/scans?status=valid&limit=10" \
  -H "Authorization: Bearer <admin-token>"
```

## Monitoring et Alertes

### Métriques Clés à Surveiller

1. **Taux de réussite** : Doit être > 90%
2. **Tentatives de fraude** : Alerter si > 5 par jour
3. **QR Codes expirés** : Surveiller l'approche de la fin d'année
4. **Emails non envoyés** : Vérifier régulièrement emailStatus: failed

### Requêtes Utiles

```javascript
// Membres avec emails non envoyés
db.members.find({
  'qrCode.emailStatus': { $in: ['pending', 'failed'] }
});

// Scans frauduleux des dernières 24h
db.qrcodescans.find({
  scanStatus: 'forged',
  scannedAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
});

// Top 10 membres les plus scannés
db.members.find({
  'qrCode.scanCount': { $exists: true }
})
.sort({ 'qrCode.scanCount': -1 })
.limit(10);
```

## Support

Pour toute question ou problème :

- Consultez les logs : `backend/logs/`
- Documentation principale : `README_QRCODE_SYSTEM.md`
- API Documentation : `/api-docs`

## Changelog

### Version 2.0 (Actuel)

- ✅ Ajout du suivi du statut email
- ✅ Journalisation complète des scans
- ✅ Tableau de bord de contrôle
- ✅ Compteur d'utilisation par QR Code
- ✅ Format de sortie standardisé
- ✅ Nouveau modèle QRCodeScan
- ✅ Nouveaux endpoints dashboard et scans

### Version 1.0

- ✅ Génération de QR Codes
- ✅ Signature SHA-256
- ✅ Vérification basique
- ✅ Envoi d'emails

---

© 2025 Association Mizara - Système de Vérification QR Code v2.0
