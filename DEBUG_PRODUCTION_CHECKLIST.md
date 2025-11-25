# 🔍 Debug Production - Checklist Complète

## Date : 2025-11-25

---

## 📋 Tests à Faire (Dans l'Ordre)

### ✅ Test 1 : Backend Health Check

**Ouvrez votre navigateur** et allez sur :
```
https://backmhm.vercel.app/health
```

**Résultat attendu :**
```json
{
  "success": true,
  "message": "MHM Backend API is running",
  "timestamp": "2025-11-25..."
}
```

**Si ça ne marche pas :**
- ❌ Le backend n'est pas déployé ou a crashé
- Vérifiez les logs Vercel : https://vercel.com/votre-projet-backend/logs

---

### ✅ Test 2 : CORS Configuration

**Ouvrez la console du navigateur** (F12) sur `https://www.madagasikarahoanymalagasy.org` et tapez :

```javascript
fetch('https://backmhm.vercel.app/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Résultat attendu :**
```json
{ "success": true, "message": "MHM Backend API is running" }
```

**Si erreur CORS :**
```
Access to fetch at 'https://backmhm.vercel.app/health' from origin 'https://www.madagasikarahoanymalagasy.org' has been blocked by CORS
```

**→ Solution :** La variable `FRONTEND_URL` n'est pas configurée sur Vercel Backend

---

### ✅ Test 3 : API URL Configuration (Double Slash)

**Dans la console** (F12) sur le site de production :

```javascript
console.log('API URL:', import.meta.env.VITE_API_URL)
```

**Résultat attendu :**
```
API URL: https://backmhm.vercel.app/api
```

**Si undefined ou autre :**
- ❌ `VITE_API_URL` n'est pas configuré sur Vercel Frontend
- ❌ Ou le frontend n'a pas été redéployé après configuration

---

### ✅ Test 4 : Login API Endpoint

**Dans la console** (F12) :

```javascript
fetch('https://backmhm.vercel.app/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@mhm.mg',
    password: 'Admin123!'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Résultats possibles :**

**✅ Succès (200) :**
```json
{
  "success": true,
  "data": {
    "email": "admin@mhm.mg",
    "role": "admin",
    "token": "eyJhbGci..."
  }
}
```
→ **Le backend fonctionne ! Le problème est dans le frontend.**

**❌ 401 Unauthorized :**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```
→ **L'admin n'existe pas ou le mot de passe est incorrect.**

**❌ 404 Not Found :**
```json
{
  "message": "Not Found"
}
```
→ **La route n'existe pas. Le backend n'est pas bien déployé.**

**❌ CORS Error :**
```
Access to fetch ... has been blocked by CORS
```
→ **`FRONTEND_URL` pas configuré sur Vercel Backend.**

---

### ✅ Test 5 : Vérifier MongoDB Connection

**Allez sur MongoDB Atlas** : https://cloud.mongodb.com

1. **Clusters** → Votre cluster → **Metrics**
2. Vérifiez que **Connections** > 0
3. Si 0 connexions :
   - ❌ Le backend ne peut pas se connecter à MongoDB
   - Vérifiez `MONGO_URI` sur Vercel
   - Vérifiez Network Access (IP Whitelist) : Doit contenir `0.0.0.0/0` ou les IPs Vercel

---

### ✅ Test 6 : Vérifier si l'Admin Existe

**MongoDB Atlas** → **Browse Collections** → `mhm_db` → `users`

**Cherchez :**
```json
{ "email": "admin@mhm.mg" }
```

**Si trouvé, vérifiez :**
- ✅ `role: "admin"` est présent
- ✅ `password` commence par `$2a$` ou `$2b$`

**Si non trouvé :**
- ❌ L'admin n'existe pas → Utilisez le script `create-admin-production.js`

---

## 🔧 Solutions par Problème

### Problème : "Invalid email or password" (401)

**Causes possibles :**
1. L'admin n'existe pas dans la base de données
2. Le mot de passe stocké n'est pas correct
3. Mauvaise base de données (le backend regarde dans `test` au lieu de `mhm_db`)

**Solution :**

**A. Vérifier la base de données utilisée :**

Sur Vercel Backend → **Settings** → **Environment Variables**

Vérifiez que `MONGO_URI` se termine par `/mhm_db` :
```
mongodb+srv://...mongodb.net/mhm_db?retryWrites=true
                              ^^^^^^ Doit être mhm_db
```

**B. Créer l'admin :**

**Option 1 - Via script local :**
```bash
cd backend

# Dans .env, mettez temporairement votre MONGO_URI de production
MONGO_URI=mongodb+srv://...mongodb.net/mhm_db?retryWrites=true&w=majority

# Lancez le script
node scripts/create-admin-production.js
```

**Option 2 - Via MongoDB Atlas :**
1. Générez le hash du mot de passe :
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('Admin123!', 10))"
   ```
2. Sur Atlas → Collections → `mhm_db` → `users` → Insert Document
3. Insérez :
   ```json
   {
     "firstName": "Admin",
     "lastName": "MHM",
     "email": "admin@mhm.mg",
     "password": "$2a$10$...le hash généré...",
     "role": "admin",
     "createdAt": { "$date": "2025-11-25T00:00:00.000Z" },
     "updatedAt": { "$date": "2025-11-25T00:00:00.000Z" }
   }
   ```

---

### Problème : CORS Error

**Erreur :**
```
Access to XMLHttpRequest at 'https://backmhm.vercel.app/api/users/login'
from origin 'https://www.madagasikarahoanymalagasy.org'
has been blocked by CORS policy
```

**Solution :**

**Sur Vercel Backend** → Settings → Environment Variables

Ajoutez ou modifiez :
```env
FRONTEND_URL=https://www.madagasikarahoanymalagasy.org,https://madagasikarahoanymalagasy.org
```

**Important :** Incluez les 2 versions (avec et sans `www`)

Puis **redéployez** le backend.

---

### Problème : Double Slash dans URL

**Erreur :**
```
POST https://backmhm.vercel.app/api//users/login
                                     ^^ Double slash
```

**Solution :**

**Sur Vercel Frontend** → Settings → Environment Variables

Vérifiez que `VITE_API_URL` est **SANS slash final** :
```env
VITE_API_URL=https://backmhm.vercel.app/api
                                          ^ PAS de slash final !
```

Puis **redéployez** le frontend.

---

### Problème : 404 Not Found

**Erreur :**
```
POST https://backmhm.vercel.app/api/users/login 404 (Not Found)
```

**Causes :**
1. Les routes ne sont pas enregistrées
2. Le build Vercel a échoué
3. Le fichier `vercel.json` est mal configuré

**Solution :**

**A. Vérifier vercel.json du backend :**

Créez ou vérifiez `backend/vercel.json` :
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

**B. Vérifier les logs Vercel :**
- Vercel → Votre projet backend → **Deployments** → Dernier deployment → **View Function Logs**
- Cherchez les erreurs au démarrage

---

### Problème : MongoDB Connection Failed

**Erreur dans les logs Vercel :**
```
MongooseError: Could not connect to any servers in your MongoDB Atlas cluster
```

**Solutions :**

**A. IP Whitelist :**
1. MongoDB Atlas → **Network Access**
2. Vérifiez qu'il y a une entrée `0.0.0.0/0` (Allow access from anywhere)
3. Ou ajoutez les IPs de Vercel

**B. Connection String :**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mhm_db?retryWrites=true&w=majority
```

Vérifiez :
- ✅ Le username est correct
- ✅ Le password est correct (URL-encoded si caractères spéciaux)
- ✅ Le nom du cluster est correct
- ✅ `/mhm_db` est présent

---

## 📊 Diagnostic Rapide

**Copiez-collez ce script dans la console du navigateur** (F12) sur votre site de production :

```javascript
(async function debug() {
  console.log('🔍 Diagnostic Production MHM\n');

  // Test 1: Backend Health
  try {
    const health = await fetch('https://backmhm.vercel.app/health').then(r => r.json());
    console.log('✅ Backend Health:', health);
  } catch (e) {
    console.error('❌ Backend Health Failed:', e.message);
  }

  // Test 2: Login Endpoint
  try {
    const login = await fetch('https://backmhm.vercel.app/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@mhm.mg', password: 'Admin123!' })
    }).then(r => r.json());
    console.log('✅ Login Response:', login);
  } catch (e) {
    console.error('❌ Login Failed:', e.message);
  }

  // Test 3: Frontend Config
  console.log('📝 Frontend Config:');
  console.log('  VITE_API_URL:', import.meta.env?.VITE_API_URL || 'NOT SET');
})();
```

**Envoyez-moi la sortie de ce script !**

---

## ✅ Checklist Finale

Avant de tester à nouveau :

**Backend Vercel :**
- [ ] Variable `MONGO_URI` configurée (avec `/mhm_db`)
- [ ] Variable `FRONTEND_URL` configurée (les 2 domaines)
- [ ] Variable `JWT_SECRET` configurée
- [ ] MongoDB Atlas Network Access : `0.0.0.0/0` autorisé
- [ ] Admin créé dans MongoDB Atlas
- [ ] Backend redéployé après configuration

**Frontend Vercel :**
- [ ] Variable `VITE_API_URL` configurée (sans slash final)
- [ ] Frontend redéployé après configuration

**Tests :**
- [ ] `/health` répond 200
- [ ] Pas d'erreur CORS
- [ ] Login API retourne 200 (pas 401)
- [ ] Login frontend fonctionne

---

**Une fois ces tests faits, dites-moi quels tests passent et lesquels échouent !**
