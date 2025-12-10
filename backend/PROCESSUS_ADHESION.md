# Processus d'adhésion HFM

Ce document décrit le processus complet d'adhésion des membres à l'association HFM.

## Vue d'ensemble du processus

```
┌─────────────────┐
│   Candidat      │
│  soumet une     │
│   demande       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Status:      │
│    PENDING      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Administrateur         │
│  examine la demande     │
└───────┬─────────────────┘
        │
        ├──────────┐
        ▼          ▼
   ┌─────────┐  ┌──────────┐
   │ APPROVE │  │  REJECT  │
   └────┬────┘  └────┬─────┘
        │            │
        ▼            ▼
   ┌─────────┐  ┌──────────┐
   │ ACTIVE  │  │ REJECTED │
   └─────────┘  └──────────┘
```

## Statuts des membres

### 1. **PENDING** (En attente)
- Demande soumise mais pas encore examinée
- Le candidat a rempli le formulaire d'adhésion
- En attente de validation par un administrateur

### 2. **ACTIVE** (Actif)
- Membre approuvé et actif
- Peut participer à toutes les activités de l'association
- Reçoit les communications de l'association

### 3. **REJECTED** (Rejeté)
- Demande refusée par l'administrateur
- Raison du rejet enregistrée
- Peut soumettre une nouvelle demande si nécessaire

### 4. **SUSPENDED** (Suspendu)
- Membre temporairement suspendu
- Ne peut pas participer aux activités
- Peut être réactivé par un administrateur

### 5. **INACTIVE** (Inactif)
- Ancien membre qui n'est plus actif
- Peut demander une réactivation

## Types de membres

### 1. **Regular** (Régulier)
Membre standard de l'association

### 2. **Student** (Étudiant)
Pour les étudiants (peut nécessiter une preuve)

### 3. **Honorary** (Honoraire)
Membres d'honneur de l'association

### 4. **Family** (Famille)
Adhésion familiale

## API Endpoints

### 1. Soumettre une demande d'adhésion (Public)

**Endpoint**: `POST /api/applications`

**Description**: Permet à un candidat de soumettre une demande d'adhésion.

**Body**:
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "dateOfBirth": "1990-05-15",
  "address": {
    "street": "12 Rue de la Paix",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France"
  },
  "phone": "0601020304",
  "email": "jean.dupont@email.com",
  "memberType": "regular",
  "emergencyContact": {
    "name": "Marie Dupont",
    "phone": "0607080910",
    "relationship": "Épouse"
  },
  "occupation": "Ingénieur",
  "interests": "Sport, lecture, voyages"
}
```

**Champs requis**:
- `firstName` (prénom)
- `lastName` (nom)
- `dateOfBirth` (date de naissance)
- `address.city` (ville)
- `address.postalCode` (code postal)
- `phone` (téléphone)
- `email` (email unique)
- `emergencyContact` (contact d'urgence complet)

**Réponse**:
```json
{
  "success": true,
  "message": "Demande d'adhésion soumise avec succès. Vous recevrez une réponse prochainement.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Jean Dupont",
    "email": "jean.dupont@email.com",
    "status": "pending",
    "applicationDate": "2024-11-04T10:30:00.000Z"
  }
}
```

### 2. Consulter les demandes en attente (Admin)

**Endpoint**: `GET /api/applications/pending?page=1&limit=10`

**Auth**: Requiert authentification (Bearer token)

**Réponse**:
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "_id": "...",
        "firstName": "Jean",
        "lastName": "Dupont",
        "email": "jean.dupont@email.com",
        "status": "pending",
        "applicationDate": "2024-11-04T10:30:00.000Z",
        "memberType": "regular"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "pages": 2,
      "limit": 10
    }
  }
}
```

### 3. Consulter une demande spécifique (Admin)

**Endpoint**: `GET /api/applications/:id`

**Auth**: Requiert authentification

**Réponse**: Détails complets de la demande incluant toutes les informations du candidat.

### 4. Approuver une demande (Admin)

**Endpoint**: `PUT /api/applications/:id/approve`

**Auth**: Requiert authentification

**Body** (optionnel):
```json
{
  "notes": "Approuvé suite à l'entretien du 04/11/2024"
}
```

**Réponse**:
```json
{
  "success": true,
  "message": "Adhésion de Jean Dupont approuvée avec succès",
  "data": {
    "_id": "...",
    "status": "active",
    "approvedBy": {
      "_id": "...",
      "name": "Admin HFM",
      "email": "admin@HFM.mg"
    },
    "approvalDate": "2024-11-04T11:00:00.000Z",
    "membershipDate": "2024-11-04T11:00:00.000Z"
  }
}
```

### 5. Rejeter une demande (Admin)

**Endpoint**: `PUT /api/applications/:id/reject`

**Auth**: Requiert authentification

**Body**:
```json
{
  "rejectionReason": "Informations incomplètes - coordonnées non vérifiables"
}
```

**Réponse**:
```json
{
  "success": true,
  "message": "Adhésion de Jean Dupont rejetée",
  "data": {
    "_id": "...",
    "status": "rejected",
    "rejectedBy": { ... },
    "rejectionDate": "2024-11-04T11:00:00.000Z",
    "rejectionReason": "Informations incomplètes - coordonnées non vérifiables"
  }
}
```

### 6. Suspendre un membre (Admin)

**Endpoint**: `PUT /api/applications/:id/suspend`

**Auth**: Requiert authentification

**Body** (optionnel):
```json
{
  "reason": "Non-respect du règlement intérieur"
}
```

### 7. Réactiver un membre (Admin)

**Endpoint**: `PUT /api/applications/:id/reactivate`

**Auth**: Requiert authentification

**Body** (optionnel):
```json
{
  "notes": "Réactivation suite à régularisation"
}
```

### 8. Statistiques des adhésions (Admin)

**Endpoint**: `GET /api/applications/stats`

**Auth**: Requiert authentification

**Réponse**:
```json
{
  "success": true,
  "data": {
    "byStatus": {
      "pending": 15,
      "active": 120,
      "inactive": 10,
      "rejected": 5,
      "suspended": 2
    },
    "byType": {
      "regular": 80,
      "student": 30,
      "honorary": 5,
      "family": 5
    },
    "total": 152
  }
}
```

## Workflow administrateur

### Examiner une demande

1. **Connexion administrateur**
   ```bash
   POST /api/users/login
   ```

2. **Récupérer les demandes en attente**
   ```bash
   GET /api/applications/pending
   ```

3. **Consulter les détails d'une demande**
   ```bash
   GET /api/applications/{id}
   ```

4. **Décision**:
   - **Approuver**: `PUT /api/applications/{id}/approve`
   - **Rejeter**: `PUT /api/applications/{id}/reject`

### Gestion des membres existants

1. **Suspendre un membre**:
   ```bash
   PUT /api/applications/{id}/suspend
   ```

2. **Réactiver un membre**:
   ```bash
   PUT /api/applications/{id}/reactivate
   ```

## Exemple de workflow complet

### 1. Un candidat soumet sa demande

```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "dateOfBirth": "1990-05-15",
    "address": {
      "street": "12 Rue de la Paix",
      "city": "Paris",
      "postalCode": "75001"
    },
    "phone": "0601020304",
    "email": "jean.dupont@email.com",
    "memberType": "regular",
    "emergencyContact": {
      "name": "Marie Dupont",
      "phone": "0607080910",
      "relationship": "Épouse"
    }
  }'
```

### 2. L'admin se connecte

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@HFM.mg",
    "password": "AdminPassword123"
  }'
```

Récupérer le token dans la réponse.

### 3. L'admin consulte les demandes

```bash
curl -X GET http://localhost:5000/api/applications/pending \
  -H "Authorization: Bearer {TOKEN}"
```

### 4. L'admin approuve la demande

```bash
curl -X PUT http://localhost:5000/api/applications/{ID}/approve \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Candidature complète et validée"
  }'
```

## Bonnes pratiques

1. **Vérification des informations**:
   - Vérifier que l'email est valide et unique
   - Vérifier les coordonnées du candidat
   - Vérifier le contact d'urgence

2. **Communication**:
   - Informer le candidat de la réception de sa demande
   - Notifier le candidat de la décision (approbation/rejet)
   - Envoyer un email de bienvenue aux nouveaux membres

3. **Documentation**:
   - Documenter les raisons de rejet
   - Ajouter des notes pour chaque décision importante
   - Garder un historique des changements de statut

4. **Sécurité**:
   - Seuls les administrateurs peuvent approuver/rejeter
   - Toutes les actions sont tracées (approvedBy, rejectedBy)
   - Les dates sont automatiquement enregistrées

## Extensions futures

- Système de notification par email
- Génération automatique de cartes de membre
- Processus de renouvellement d'adhésion
- Tableau de bord pour suivre les demandes
- Export des statistiques

## Support

Pour toute question sur le processus d'adhésion, consultez le README.md principal ou contactez l'équipe technique.
