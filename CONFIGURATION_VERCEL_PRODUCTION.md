# 🚀 Configuration Vercel - Production

## Date : 2025-11-25

---

## 📋 Variables d'Environnement Backend (Vercel)

### Configuration à ajouter sur https://vercel.com

Allez dans votre projet backend → **Settings** → **Environment Variables**

### 🔐 Variables Requises :

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mhm_db?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# CORS - IMPORTANT: Ajouter tous les domaines frontend
FRONTEND_URL=https://www.madagasikarahoanymalagasy.org,https://madagasikarahoanymalagasy.org

# Email SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=a.maminiaina@gmail.com
SMTP_PASS=kktc enrc crvn ykqt
EMAIL_FROM=noreply@HFM.mg
EMAIL_FROM_NAME=Madagasikara Hoan'ny Malagasy

# QR Code
QR_CODE_SECRET_KEY=your_production_qrcode_secret_key

# Environment
NODE_ENV=production
PORT=5000
LOG_LEVEL=info
```

---

## 🌐 Variables d'Environnement Frontend (Vercel)

### Configuration à ajouter sur https://vercel.com

Allez dans votre projet frontend → **Settings** → **Environment Variables**

### 🔐 Variables Requises :

```env
# API Backend URL - IMPORTANT: Sans slash final
VITE_API_URL=https://backmhm.vercel.app/api
```

**⚠️ IMPORTANT :**
- **NE PAS** mettre de slash final : ~~`https://backmhm.vercel.app/api/`~~ ❌
- **CORRECT :** `https://backHFM.vercel.app/api` ✅

---

## 🔧 Configuration CORS Backend

### Problème Actuel :

```
Access to XMLHttpRequest at 'https://backmhm.vercel.app/api//users/login'
from origin 'https://www.madagasikarahoanymalagasy.org'
has been blocked by CORS policy
```

### Solution :

1. **Sur Vercel Backend**, ajoutez la variable :
   ```env
   FRONTEND_URL=https://www.madagasikarahoanymalagasy.org,https://madagasikarahoanymalagasy.org
   ```

2. **Le code backend** (`src/app.js`) supporte déjà plusieurs origines :
   ```javascript
   const allowedOrigins = process.env.FRONTEND_URL
     ? process.env.FRONTEND_URL.split(',')
     : ['http://localhost:5173'];

   app.use(cors({
     origin: (origin, callback) => {
       if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     },
     credentials: true,
   }));
   ```

---

## 🐛 Problème du Double Slash

### Avant :

```
POST https://backmhm.vercel.app/api//users/login  ← Double slash
```

### Cause :

La variable `VITE_API_URL` avait un slash final :
```env
VITE_API_URL=https://backmhm.vercel.app/api/  ← Slash final
```

Et le code ajoutait `/users/login`, donnant `/api//users/login`

### Correction Appliquée :

**Frontend (`src/lib/config/env.ts`)** :
```typescript
baseUrl: (import.meta.env.VITE_API_URL || 'http://localhost:3000/api')
  .replace(/\/$/, ''),  // Supprime le slash final
```

Maintenant, peu importe si la variable a un slash final ou non, il sera supprimé.

---

## ✅ Checklist de Déploiement

### Backend Vercel :

- [ ] MongoDB Atlas configuré avec IP whitelisting
- [ ] `MONGO_URI` ajouté aux variables d'environnement
- [ ] `JWT_SECRET` configuré (générez un secret fort)
- [ ] `FRONTEND_URL` contient TOUS les domaines frontend :
  - `https://www.madagasikarahoanymalagasy.org`
  - `https://madagasikarahoanymalagasy.org` (sans www)
- [ ] `SMTP_*` variables configurées pour Gmail
- [ ] `QR_CODE_SECRET_KEY` configuré
- [ ] Redéployé après ajout des variables

### Frontend Vercel :

- [ ] `VITE_API_URL=https://backmhm.vercel.app/api` (sans slash final)
- [ ] Build réussi
- [ ] Redéployé

---

## 🧪 Test de la Configuration

### 1. Test CORS

Ouvrez la console du navigateur sur https://www.madagasikarahoanymalagasy.org et testez :

```javascript
fetch('https://backmhm.vercel.app/health')
  .then(r => r.json())
  .then(console.log)
```

**Résultat attendu :**
```json
{
  "success": true,
  "message": "HFM Backend API is running"
}
```

### 2. Test Login

1. Allez sur https://www.madagasikarahoanymalagasy.org/login
2. Connectez-vous avec `admin@HFM.mg` / `Admin123!`
3. Vérifiez dans **Network** (F12) :
   - URL : `https://backmhm.vercel.app/api/users/login` (1 seul slash)
   - Status : `200 OK`
   - Response contient `{ success: true, data: { role: "admin" } }`

---

## 🔐 Sécurité Production

### Secrets à Générer :

1. **JWT_SECRET** : Générez un secret fort
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
   ```

2. **QR_CODE_SECRET_KEY** : Générez un secret différent
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
   ```

### MongoDB Atlas :

1. Créez un cluster MongoDB Atlas
2. Whitelist Vercel IPs ou utilisez `0.0.0.0/0` (moins sécurisé)
3. Créez un utilisateur avec des permissions appropriées
4. Copiez la connection string dans `MONGO_URI`

---

## 📊 Configuration Réseau

### Domaines :

| Type | URL | CORS |
|------|-----|------|
| Frontend Principal | https://www.madagasikarahoanymalagasy.org | Autorisé |
| Frontend (sans www) | https://madagasikarahoanymalagasy.org | Autorisé |
| Backend API | https://backmhm.vercel.app/api | N/A |

### Headers CORS Attendus :

```
Access-Control-Allow-Origin: https://www.madagasikarahoanymalagasy.org
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 🚨 Résolution des Problèmes

### Erreur : "CORS policy: Redirect is not allowed for a preflight request"

**Cause :** Le backend redirige la requête OPTIONS (preflight) au lieu de la traiter

**Solution :**
1. Vérifiez que `FRONTEND_URL` est configuré sur Vercel
2. Redéployez le backend après modification
3. Videz le cache du navigateur

### Erreur : "Double slash in URL"

**Cause :** `VITE_API_URL` a un slash final

**Solution :**
1. Sur Vercel Frontend, modifiez `VITE_API_URL` sans slash final
2. Redéployez le frontend
3. Le code frontend supprime maintenant automatiquement les slashes finaux

### Erreur : "Invalid login: 535 Authentication failed"

**Cause :** Gmail SMTP mal configuré

**Solution :**
1. Vérifiez que le mot de passe d'application est correct (sans espaces)
2. Vérifiez que l'authentification à 2 facteurs est activée sur Gmail
3. Régénérez un nouveau mot de passe d'application si nécessaire

---

## 📝 Commandes Utiles

### Vérifier les Variables d'Environnement Vercel :

```bash
# Installer Vercel CLI
npm install -g vercel

# Login
vercel login

# Lister les variables d'environnement
vercel env ls

# Ajouter une variable
vercel env add FRONTEND_URL

# Pull les variables en local (pour test)
vercel env pull
```

---

## ✅ Après Configuration

Une fois toutes les variables configurées :

1. **Redéployez le backend** : Vercel → Deployments → Redeploy
2. **Redéployez le frontend** : Vercel → Deployments → Redeploy
3. **Testez le login** sur https://www.madagasikarahoanymalagasy.org/login
4. **Testez l'import CSV** sur https://www.madagasikarahoanymalagasy.org/admin/qrcodes

---

**Date de création :** 2025-11-25
**Domaine Frontend :** https://www.madagasikarahoanymalagasy.org
**Domaine Backend :** https://backmhm.vercel.app
**Statut :** Configuration requise

