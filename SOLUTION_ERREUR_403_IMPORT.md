# 🔧 Solution : Erreur 403 lors de l'Import CSV

## ❌ Problème

Vous obtenez une erreur **403 (Forbidden)** lors de l'import du CSV :
```
Failed to load resource: the server responded with a status of 403 (Forbidden)
:5000/api/qrcodes/import-csv
```

## 🔍 Cause

L'erreur 403 signifie que **vous n'avez pas l'autorisation** d'accéder à cette route.

**Raisons possibles :**
1. ✅ L'admin existe bien dans la base de données
2. ❌ Le token JWT n'est pas valide ou pas envoyé
3. ❌ Vous n'êtes pas connecté correctement
4. ❌ Le rôle "admin" n'est pas reconnu

---

## ✅ Solution Complète

### Étape 1 : Vérifier que Vous Êtes Bien Connecté

1. **Ouvrez la console du navigateur** (F12)
2. **Allez dans l'onglet "Application"** (Chrome) ou "Stockage" (Firefox)
3. **Cherchez "Local Storage"** → `http://localhost:5173`
4. **Vérifiez qu'il y a une clé `auth-storage`**

**Ce que vous devriez voir :**
```json
{
  "state": {
    "user": {
      "email": "admin@HFM.mg",
      "role": "admin",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isAuthenticated": true
  }
}
```

**Si absent ou `isAuthenticated: false` :**
→ Vous devez vous reconnecter !

---

### Étape 2 : Se Déconnecter et Reconnecter

Si vous n'êtes pas correctement connecté :

1. **Effacer le localStorage :**
   - Ouvrez la console (F12)
   - Tapez : `localStorage.clear()`
   - Appuyez sur Entrée

2. **Fermer tous les onglets de l'application**

3. **Redémarrer le frontend** (si nécessaire)
   ```bash
   cd frontend
   npm run dev
   ```

4. **Se reconnecter :**
   - Allez sur : http://localhost:5173/login
   - Email : `admin@HFM.mg`
   - Mot de passe : `Admin123!`
   - Cliquez sur "Se connecter"

5. **Vérifier dans la console** que vous voyez un message de succès

---

### Étape 3 : Vérifier le Token dans les Requêtes

1. **Ouvrez les DevTools** (F12)
2. **Allez dans l'onglet "Network" (Réseau)**
3. **Cliquez sur "Lancer l'envoi en masse"** (pour tester)
4. **Cliquez sur la requête `import-csv` dans la liste**
5. **Regardez les "Request Headers"**

**Vous devriez voir :**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Si absent :**
→ Le token n'est pas envoyé, reconnectez-vous !

---

### Étape 4 : Vérifier le Backend

Assurez-vous que le backend est bien démarré et connecté à MongoDB :

```bash
# Vérifier la santé du backend
curl http://localhost:5000/health

# Résultat attendu :
# {"success":true,"message":"HFM Backend API is running","timestamp":"..."}
```

---

## 🎯 Procédure Complète (Étape par Étape)

### 1. Effacer et Redémarrer

```bash
# Console navigateur (F12)
localStorage.clear()
sessionStorage.clear()
```

### 2. Se Reconnecter

1. http://localhost:5173/login
2. admin@HFM.mg / Admin123!
3. Attendre la redirection vers `/admin/dashboard`

### 3. Vérifier le LocalStorage

Console → Application → Local Storage → `auth-storage`

**Doit contenir :**
```json
{
  "state": {
    "isAuthenticated": true,
    "token": "eyJhbGci..."
  }
}
```

### 4. Aller sur la Page QR Codes

```
http://localhost:5173/admin/qrcodes
```

### 5. Importer le CSV

1. **Onglet "Import CSV"** (déjà sélectionné par défaut)
2. **Année de validité :** Changer `2025` si nécessaire
3. **Glisser-déposer** ou **cliquer pour sélectionner** :
   ```
   backend/templates/ekipa-filoha-tantsoroka-feuil1-import-qrcode.csv
   ```
4. **Cliquer sur** : "Lancer l'envoi en masse"

**⚠️ Le bouton s'appelle "Lancer l'envoi en masse" PAS "Importer et Envoyer" !**

---

## 📸 À Quoi Ressemble l'Interface

```
┌─────────────────────────────────────────────────┐
│  Gestion des QR Codes                           │
│  Envoi en masse et suivi des opérations         │
│                                                  │
│  [📤 Import CSV] [📊 Historique & Statistiques] │
│                                                  │
│  Import CSV - Envoi en Masse                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                  │
│  Année de validité:                              │
│  [2025_________________]                         │
│                                                  │
│  ┌─────────────────────────────────────────┐    │
│  │     📁 Glissez-déposez un fichier CSV   │    │
│  │         ou cliquez pour sélectionner    │    │
│  │         Format CSV, max 5 MB            │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  [  Lancer l'envoi en masse  ] ← CE BOUTON !   │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Autres Vérifications

### Vérifier le JWT Secret

Assurez-vous que le `JWT_SECRET` est le même entre :
- Le backend qui génère le token
- Le backend qui vérifie le token

**Fichier :** `backend/.env`
```env
JWT_SECRET=hDy4+Of2JkRazkEqiF1Pq3qqvxcz6TVfC0tVrbeJySo02VZ+e71WNeV1lLHafSbYrDFJozDbmw8K8IhoSUg5cA==
```

---

### Vérifier l'URL de l'API

**Fichier :** `frontend/.env` ou `frontend/src/config/auth.config.ts`

```env
VITE_API_URL=http://localhost:5000/api
```

**Vérifier que c'est bien ça dans le code :**

```typescript
// frontend/src/config/auth.config.ts
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
};
```

---

## 🐛 Déboguer l'Erreur 403

### Dans la Console Navigateur

1. Ouvrez DevTools (F12)
2. Allez dans **Console**
3. Essayez d'importer le CSV
4. Regardez les erreurs

**Si vous voyez :**
```
User role 'user' is not authorized to access this route
```
→ Le rôle n'est pas "admin", reconnectez-vous

**Si vous voyez :**
```
Not authorized, no token provided
```
→ Le token n'est pas envoyé, effacez le cache et reconnectez-vous

---

## ✅ Checklist de Vérification

Avant d'importer, vérifiez :

- [ ] Backend démarré (`npm run dev` dans backend)
- [ ] Frontend démarré (`npm run dev` dans frontend)
- [ ] Admin existe dans MongoDB (`node scripts/check-admin.js`)
- [ ] Connecté sur http://localhost:5173/login
- [ ] LocalStorage contient `auth-storage` avec `isAuthenticated: true`
- [ ] Sur la page http://localhost:5173/admin/qrcodes
- [ ] Token visible dans les Request Headers (DevTools)
- [ ] SMTP configuré (optionnel pour le test, mais nécessaire pour l'envoi)

---

## 🚀 Test Rapide

Pour tester si le problème est résolu :

1. **Effacer le cache :**
   ```javascript
   localStorage.clear()
   ```

2. **Se connecter :**
   - http://localhost:5173/login
   - admin@HFM.mg / Admin123!

3. **Aller sur :**
   - http://localhost:5173/admin/qrcodes

4. **Ouvrir DevTools (F12) → Network**

5. **Importer un petit CSV de test**

6. **Regarder la requête dans Network :**
   - Si 200 OK → ✅ Ça marche !
   - Si 403 Forbidden → ❌ Problème de token/rôle
   - Si 401 Unauthorized → ❌ Pas connecté

---

## 💡 Solution Définitive

**Si le problème persiste après tous ces tests :**

1. **Arrêter tout** (backend + frontend)
2. **Effacer complètement le cache du navigateur** (Ctrl+Shift+Delete)
3. **Redémarrer MongoDB** (si Windows : `net stop MongoDB && net start MongoDB`)
4. **Redémarrer le backend**
5. **Redémarrer le frontend**
6. **Se reconnecter depuis zéro**

---

## 📞 Points de Vérification Critiques

### 1. Token JWT

```bash
# Console navigateur
localStorage.getItem('auth-storage')
# Doit retourner un objet JSON avec token et user
```

### 2. Rôle Admin

L'utilisateur doit avoir `role: "admin"` dans le token décodé.

Pour vérifier le token, allez sur https://jwt.io et collez le token.

**Vous devriez voir dans le payload :**
```json
{
  "id": "692461335b10b3a6c47559e1",
  "email": "admin@HFM.mg",
  "role": "admin",
  "iat": ...,
  "exp": ...
}
```

---

## ✅ Confirmation que Ça Marche

**Quand l'import réussit, vous verrez :**

```
Import terminé !
━━━━━━━━━━━━━━━━
📊 Résultats :
  • Total : 118 membres
  • ✅ Envoyés : 42
  • ❌ Échecs : 76
  • 📈 Taux : 36%

⚠️ Vous pouvez relancer les échecs depuis le dashboard.
```

**Les 76 échecs sont normaux** car ce sont les membres avec emails temporaires `@HFM.mg`.

---

**Date de création :** 2025-11-24
**Problème :** Erreur 403 sur `/api/qrcodes/import-csv`
**Solution :** Se reconnecter correctement avec l'admin
**Statut :** ✅ Résolvable en 2 minutes
