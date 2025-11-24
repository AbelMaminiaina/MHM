# Système de Génération et d'Envoi Automatique de QR Codes

## Vue d'ensemble

Ce système permet de générer automatiquement des QR Codes sécurisés pour les membres de l'association Mizara et de les envoyer par email. Chaque QR Code est unique, valable pour une année spécifique, et protégé par une signature cryptographique SHA-256.

## Caractéristiques

### Sécurité
- **Signature SHA-256** : Chaque QR Code contient une signature cryptographique basée sur :
  - L'ID du membre (memberNumber)
  - Une clé secrète (définie dans les variables d'environnement)
  - L'année de validité
- **Protection anti-fraude** : La signature est vérifiée lors de la lecture du QR Code
- **Expiration annuelle** : Les QR Codes sont valables uniquement pour l'année spécifiée

### Données encodées dans le QR Code

```json
{
  "memberId": "M-2025-0142",
  "name": "Jean Dupont",
  "email": "jean.dupont@email.com",
  "association": "Mizara",
  "validity": "2025",
  "status": "Membre actif",
  "signature": "a1b2c3d4e5f6..."
}
```

### Format des fichiers QR Code
- **Format** : PNG
- **Taille** : 400x400 pixels
- **Niveau de correction d'erreur** : H (haute)
- **Nom du fichier** : `qr_<memberId>.png` (ex: `qr_M-2025-0142.png`)

## Configuration

### Variables d'environnement

Ajoutez la variable suivante dans votre fichier `.env` :

```env
# QR Code Configuration
QR_CODE_SECRET_KEY=your_super_secret_qrcode_key_change_this_in_production
```

**IMPORTANT** : Utilisez une clé secrète forte et unique en production !

## API Endpoints

### 1. Générer un QR Code pour un membre spécifique

```http
POST /api/qrcodes/generate/:memberId
Authorization: Bearer <token>
Content-Type: application/json

{
  "validity": "2025"  // Optionnel, année par défaut = année actuelle
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "QR code generated and sent successfully",
  "data": {
    "success": true,
    "memberId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "memberNumber": "M-2025-0142",
    "email": "jean.dupont@email.com",
    "emailSent": true,
    "validity": "2025"
  }
}
```

### 2. Génération en masse (Bulk)

```http
POST /api/qrcodes/bulk-generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "validity": "2025",           // Optionnel
  "status": "active",           // Optionnel, défaut = "active"
  "memberIds": ["id1", "id2"]   // Optionnel, pour membres spécifiques
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Processed 150 members: 148 successful, 2 failed",
  "data": {
    "processed": 150,
    "successful": 148,
    "failed": 2,
    "validity": "2025",
    "results": [...]
  }
}
```

### 3. Régénérer pour une nouvelle année

```http
POST /api/qrcodes/regenerate-year
Authorization: Bearer <token>
Content-Type: application/json

{
  "year": "2026"
}
```

Cette endpoint régénère automatiquement les QR Codes pour tous les membres actifs avec la nouvelle année.

### 4. Vérifier un QR Code (Public)

```http
POST /api/qrcodes/verify
Content-Type: application/json

{
  "qrData": "{\"memberId\":\"M-2025-0142\",\"name\":\"Jean Dupont\",...}"
}
```

**Réponse** :
```json
{
  "success": true,
  "valid": true,
  "message": "QR code valide",
  "member": {
    "_id": "...",
    "fullName": "Jean Dupont",
    "memberNumber": "M-2025-0142",
    "email": "jean.dupont@email.com",
    "memberType": "regular",
    "status": "active",
    "membershipDate": "2025-01-15T00:00:00.000Z",
    "validity": "2025"
  }
}
```

### 5. Statistiques des QR Codes

```http
GET /api/qrcodes/stats
Authorization: Bearer <token>
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "currentYear": "2025",
    "totalMembers": 200,
    "activeMembers": 180,
    "membersWithQRCodes": 175,
    "membersWithCurrentYearQRCodes": 170,
    "activeMembersWithoutQRCodes": 10,
    "coverage": "87.50",
    "currentYearCoverage": "94.44"
  }
}
```

### 6. Obtenir le QR Code d'un membre

```http
GET /api/qrcodes/member/:memberId
Authorization: Bearer <token>
```

## Email automatique

Lorsqu'un QR Code est généré, un email personnalisé est automatiquement envoyé au membre avec :

- QR Code intégré dans l'email
- QR Code en pièce jointe (PNG)
- Informations du membre
- Badge de validité (année)
- Instructions d'utilisation
- Note de sécurité

### Template d'email

L'email contient :
1. **En-tête** : Bienvenue avec l'année de validité
2. **Informations du membre** : Numéro, nom, email, statut
3. **QR Code** : Image embarquée avec badge de validité
4. **Instructions** : Comment utiliser le QR Code
5. **Note de sécurité** : Rappel sur la signature SHA-256
6. **Pied de page** : Contact de l'association

## Utilisation programmatique

### Import du service

```javascript
import {
  generateAndSendQRCode,
  bulkGenerateAndSendQRCodes,
  regenerateQRCodesForNewYear,
} from './utils/qrCodeService.js';
```

### Générer pour un membre

```javascript
const member = await Member.findById(memberId);
const result = await generateAndSendQRCode(member, '2025');
```

### Génération en masse

```javascript
const result = await bulkGenerateAndSendQRCodes({
  validity: '2025',
  status: 'active',
});
```

### Régénérer pour nouvelle année

```javascript
const result = await regenerateQRCodesForNewYear('2026');
```

## Vérification de signature

La vérification se fait en 3 étapes :

1. **Extraction des données** : Parse du JSON du QR Code
2. **Recalcul de la signature** : SHA-256(memberId + secretKey + validity)
3. **Comparaison** : Vérification que la signature correspond

```javascript
import { verifyQRCode } from './utils/qrCodeGenerator.js';
import Member from './models/Member.js';

const result = await verifyQRCode(qrDataString, Member);

if (result.valid) {
  console.log('QR Code valide!', result.member);
} else {
  console.log('QR Code invalide:', result.message);
}
```

## Cas d'usage

### Scénario 1 : Nouveau membre approuvé
Lorsqu'un nouveau membre est approuvé, un QR Code est automatiquement généré et envoyé.

### Scénario 2 : Renouvellement annuel
En début d'année, utilisez l'endpoint `/regenerate-year` pour générer de nouveaux QR Codes pour tous les membres actifs.

### Scénario 3 : QR Code perdu
Si un membre perd son QR Code, utilisez `/generate/:memberId` pour en générer un nouveau.

### Scénario 4 : Vérification à l'entrée d'un événement
Utilisez `/verify` pour valider le QR Code scanné à l'entrée d'un événement.

## Structure de la base de données

Le modèle `Member` contient un champ `qrCode` :

```javascript
qrCode: {
  code: String,           // Code court (16 premiers caractères de la signature)
  imageUrl: String,       // URL du fichier QR Code
  generatedAt: Date,      // Date de génération
  signature: String,      // Signature SHA-256 complète
  validity: String,       // Année de validité (ex: "2025")
}
```

## Sécurité et bonnes pratiques

1. **Clé secrète** : Changez TOUJOURS la clé par défaut en production
2. **HTTPS** : Utilisez HTTPS pour toutes les communications
3. **Authentification** : Les endpoints de génération nécessitent une authentification admin
4. **Validation** : Le endpoint `/verify` vérifie la signature ET l'année de validité
5. **Logs** : Toutes les opérations sont loggées pour audit

## Dépannage

### QR Code non généré
- Vérifiez que le membre a un email valide
- Vérifiez que le membre a un memberNumber
- Consultez les logs pour les erreurs

### Email non envoyé
- Vérifiez la configuration SMTP dans `.env`
- Vérifiez que l'email du membre est valide
- Consultez les logs pour les erreurs de nodemailer

### Signature invalide
- Vérifiez que la clé secrète n'a pas changé
- Vérifiez que les données du QR Code n'ont pas été modifiées
- Vérifiez l'année de validité

## Tests

Pour tester le système :

1. **Test unitaire de génération** :
```bash
npm test -- qrCodeGenerator.test.js
```

2. **Test d'intégration** :
```bash
# Générer pour un membre de test
curl -X POST http://localhost:5000/api/qrcodes/generate/<memberId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"validity":"2025"}'
```

## Support

Pour toute question ou problème :
- Consultez les logs dans `backend/logs/`
- Vérifiez la documentation Swagger : `/api-docs`
- Contactez l'équipe de développement

## Licence

© 2025 Association Mizara - Tous droits réservés
