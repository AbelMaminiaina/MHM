# Frontend - Système de QR Codes

## 📋 Vue d'ensemble

Le frontend a été mis à jour pour supporter le système complet de QR Codes avec :

✅ **Approbation Individuelle** : Notification du statut QR lors de l'approbation d'un membre
✅ **Import CSV** : Interface pour l'envoi en masse de QR Codes
✅ **Dashboard de Monitoring** : Suivi des batches et statistiques

---

## 🎯 Ce qui est déjà prêt

### 1. Bouton "Approuver" dans AdminDashboard

**Localisation** : `frontend/src/features/dashboard/components/AdminDashboard.tsx:258-264`

Le bouton d'approbation est **déjà fonctionnel** et affiche maintenant le statut du QR Code :

```typescript
// Lorsqu'un admin clique sur "Approuver"
handleApprove(memberId)
  → Appel API : PUT /api/applications/:id/approve
  → Backend génère et envoie QR Code automatiquement
  → Frontend affiche :
      ✅ "QR Code envoyé par email" (si succès)
      ⚠️ "QR Code généré mais email non envoyé" (si échec email)
      ❌ "Erreur lors de la génération du QR Code" (si erreur)
```

**Exemple de notification** :
```
Adhésion de Jean Dupont approuvée avec succès !
✅ QR Code envoyé par email.
```

---

## 🆕 Nouveaux Composants Créés

### 1. Types QR Code

**Fichier** : `frontend/src/features/qrcode/types/qrcode.types.ts`

Définit tous les types TypeScript pour :
- `QRCodeBatch` : Batch d'envoi
- `QRCodeBatchResult` : Résultat individuel
- Réponses API (import CSV, retry, stats, etc.)

### 2. Service QR Code

**Fichier** : `frontend/src/features/qrcode/services/qrcode.service.ts`

Fonctions pour communiquer avec le backend :
- `importCSV(file, validity)` : Import CSV
- `retryBatch(batchId)` : Relancer échecs
- `getBatches()` : Liste des batches
- `getBatchDetails(batchId)` : Détails d'un batch
- `getBatchStats()` : Statistiques globales

### 3. Composant Import CSV

**Fichier** : `frontend/src/features/qrcode/components/QRCodeCSVImport.tsx`

Interface pour :
- Sélection/glisser-déposer fichier CSV
- Spécifier l'année de validité
- Télécharger template CSV
- Lancer l'import et afficher les résultats

**Fonctionnalités** :
- ✅ Drag & drop CSV
- ✅ Validation format fichier
- ✅ Téléchargement template
- ✅ Affichage résultats (succès/échecs)

### 4. Dashboard Batches

**Fichier** : `frontend/src/features/qrcode/components/QRCodeBatchesDashboard.tsx`

Dashboard de monitoring avec :
- Statistiques globales (total batches, envois, taux succès)
- Liste des batches avec progression
- Détails de chaque batch (modal)
- Bouton "Relancer" pour échecs

**Fonctionnalités** :
- ✅ Statistiques en temps réel
- ✅ Liste des batches filtrée
- ✅ Modal détails avec résultats
- ✅ Relance automatique échecs

### 5. Page de Gestion QR Codes

**Fichier** : `frontend/src/features/qrcode/components/QRCodeManagementPage.tsx`

Page complète avec :
- Onglet "Import CSV"
- Onglet "Historique & Statistiques"
- Section aide/guide d'utilisation

---

## 🔧 Intégration dans l'Application

### Étape 1 : Ajouter la route

Dans votre fichier de routing (probablement `App.tsx` ou `routes.tsx`), ajoutez :

```typescript
import { QRCodeManagementPage } from './features/qrcode/components/QRCodeManagementPage';

// Dans vos routes protégées (admin)
<Route
  path="/admin/qrcodes"
  element={<QRCodeManagementPage />}
/>
```

### Étape 2 : Ajouter un lien dans AdminDashboard

Dans `AdminDashboard.tsx`, ajoutez un bouton dans le header :

```typescript
<button
  onClick={() => navigate('/admin/qrcodes')}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
  📤 Gestion QR Codes
</button>
```

### Étape 3 : Mettre à jour les types Member (déjà fait)

Le fichier `frontend/src/features/dashboard/types/member.types.ts` a été mis à jour avec :
- Interface `QRCode` complète (emailStatus, scanCount, etc.)
- Interface `QRCodeStatus` pour la réponse d'approbation
- `MemberResponse` mise à jour

---

## 📂 Structure des Fichiers Créés

```
frontend/src/features/qrcode/
├── types/
│   └── qrcode.types.ts          # Types TypeScript
├── services/
│   └── qrcode.service.ts        # Service API
└── components/
    ├── QRCodeCSVImport.tsx      # Import CSV
    ├── QRCodeBatchesDashboard.tsx  # Dashboard batches
    └── QRCodeManagementPage.tsx # Page complète
```

---

## 🚀 Utilisation

### Pour l'Admin

1. **Approuver un membre** :
   - Aller sur `/admin/dashboard`
   - Cliquer sur "Approuver" pour une demande
   - Voir la notification avec statut QR Code

2. **Import CSV** :
   - Aller sur `/admin/qrcodes`
   - Onglet "Import CSV"
   - Télécharger le template
   - Remplir et uploader
   - Voir le résultat instantané

3. **Monitoring** :
   - Aller sur `/admin/qrcodes`
   - Onglet "Historique & Statistiques"
   - Voir les stats et batches
   - Cliquer "Détails" pour voir résultats
   - Cliquer "Relancer" pour retry échecs

---

## 🎨 Exemples Visuels

### Approbation Membre

```
┌─────────────────────────────────────────┐
│  Demandes d'adhésion en attente         │
├─────────────────────────────────────────┤
│  Jean Dupont                            │
│  jean@email.com                         │
│  [Approuver] [Rejeter]  ← Clic ici     │
└─────────────────────────────────────────┘

↓ Après approbation

┌─────────────────────────────────────────┐
│  Adhésion de Jean Dupont approuvée      │
│  avec succès !                          │
│  ✅ QR Code envoyé par email.          │
└─────────────────────────────────────────┘
```

### Import CSV

```
┌─────────────────────────────────────────┐
│  Import CSV - Envoi en Masse            │
├─────────────────────────────────────────┤
│  Année: [2025]                          │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   📁 Glisser-déposer CSV ici     │  │
│  │   ou cliquer pour sélectionner   │  │
│  └──────────────────────────────────┘  │
│                                         │
│  📄 Format CSV attendu                  │
│  Colonnes: memberId, email, ...        │
│  [Télécharger le modèle CSV]           │
│                                         │
│  [Lancer l'envoi en masse]             │
└─────────────────────────────────────────┘
```

### Dashboard Batches

```
┌─────────────────────────────────────────────────────────┐
│  📦 12  |  ✅ 1,850  |  ❌ 15  |  📈 99.2%             │
│  Batches  Envoyés     Échecs    Taux Succès           │
├─────────────────────────────────────────────────────────┤
│  Batch                   Statut      Progression        │
├─────────────────────────────────────────────────────────┤
│  Import CSV - 2025.csv   ✅ completed  148/150 [98%]   │
│  membres.csv             ⚠️ partial    95/100  [95%]   │
│  renouvellement-2025     ✅ completed  500/500 [100%]  │
│                                                         │
│  [Détails] [Relancer échecs]                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 Tests Recommandés

### Test 1 : Approbation Individuelle
```bash
1. Créer une nouvelle demande d'adhésion
2. Se connecter comme admin
3. Cliquer "Approuver"
4. Vérifier la notification avec statut QR
5. Vérifier l'email reçu avec QR Code
```

### Test 2 : Import CSV
```bash
1. Télécharger le template CSV
2. Ajouter 3-5 membres de test
3. Uploader le fichier
4. Vérifier les résultats
5. Vérifier les emails reçus
```

### Test 3 : Retry Échecs
```bash
1. Créer un batch avec échecs (email invalide)
2. Voir le batch en status "partial"
3. Corriger les emails dans la BD
4. Cliquer "Relancer"
5. Vérifier le nouveau statut
```

---

## 🐛 Dépannage

### Problème : "Unauthorized" lors de l'import CSV

**Solution** : Vérifier que l'utilisateur est bien admin

```typescript
// Dans axiosInstance
const token = localStorage.getItem('token');
headers: { Authorization: `Bearer ${token}` }
```

### Problème : Types non reconnus

**Solution** : Redémarrer le serveur de développement

```bash
npm run dev
```

### Problème : 404 sur /admin/qrcodes

**Solution** : Vérifier que la route est bien ajoutée dans App.tsx

---

## 📝 Checklist d'Intégration

- [ ] ✅ Types mis à jour (`member.types.ts`)
- [ ] ✅ AdminDashboard modifié (affichage statut QR)
- [ ] ✅ Service QR Code créé (`qrcode.service.ts`)
- [ ] ✅ Composants créés (Import, Dashboard, Page)
- [ ] ⬜ Route ajoutée dans App.tsx
- [ ] ⬜ Lien ajouté dans menu admin
- [ ] ⬜ Tests effectués

---

## 🎓 Formation Utilisateurs

### Pour les Admins

**Approuver un membre** :
1. Aller dans "Demandes en attente"
2. Cliquer "Approuver"
3. Le QR Code est envoyé automatiquement

**Envoi en masse** :
1. Préparer fichier CSV (template disponible)
2. Aller dans "Gestion QR Codes"
3. Uploader le CSV
4. Vérifier les résultats
5. Relancer les échecs si nécessaire

---

## 📚 Références

- **Backend API** : `backend/README_QRCODE_SENDING_SYSTEM.md`
- **Types TypeScript** : `frontend/src/features/qrcode/types/qrcode.types.ts`
- **Composants** : `frontend/src/features/qrcode/components/`

---

© 2025 Association Mizara - Documentation Frontend QR Codes
