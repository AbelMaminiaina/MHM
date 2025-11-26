# 🔧 Fix Production API URL - localhost au lieu de backmhm.vercel.app

## Problème Identifié

**Erreur :**
```
POST http://localhost:5000/api/qrcodes/import-csv net::ERR_UPLOAD_FILE_CHANGED
```

**Cause :** Le frontend en production utilise `http://localhost:5000` au lieu de `https://backmhm.vercel.app/api`

**Raison :** La variable d'environnement `VITE_API_URL` n'est pas configurée sur Vercel Frontend

---

## ✅ Solution Étape par Étape

### 1. Configurer la Variable d'Environnement sur Vercel Frontend

#### Option A : Via l'Interface Web Vercel (Recommandé)

1. **Allez sur :** https://vercel.com
2. **Sélectionnez** votre projet frontend (celui qui déploie sur `madagasikarahoanymalagasy.org`)
3. **Cliquez sur** "Settings" (en haut)
4. **Cliquez sur** "Environment Variables" dans le menu de gauche
5. **Cliquez sur** "Add New"
6. **Remplissez :**
   ```
   Name  : VITE_API_URL
   Value : https://backmhm.vercel.app/api
   ```
   **Important :** PAS de slash final à la fin !

7. **Sélectionnez :** Production, Preview, Development (cochez les 3)
8. **Cliquez sur** "Save"

#### Option B : Via Vercel CLI

```bash
# Installer Vercel CLI si nécessaire
npm install -g vercel

# Se connecter
vercel login

# Aller dans le dossier frontend
cd frontend

# Ajouter la variable
vercel env add VITE_API_URL

# Quand demandé, entrez :
# Value: https://backmhm.vercel.app/api
# Environment: Production, Preview, Development
```

---

### 2. Redéployer le Frontend

**IMPORTANT :** Les variables d'environnement Vite (`VITE_*`) sont compilées au moment du build. Il faut donc **REDÉPLOYER** le frontend pour qu'elles prennent effet.

#### Via l'Interface Vercel :

1. **Allez sur** votre projet frontend sur Vercel
2. **Cliquez sur** "Deployments" en haut
3. **Trouvez** le dernier deployment
4. **Cliquez sur** les 3 points `...` à droite
5. **Cliquez sur** "Redeploy"
6. **IMPORTANT :** Décochez "Use existing Build Cache"
7. **Cliquez sur** "Redeploy"

#### Via Git Push :

```bash
# Faire un commit vide pour déclencher un redéploiement
git commit --allow-empty -m "Trigger redeploy after env var config"
git push
```

---

### 3. Vérifier la Configuration

Une fois le redéploiement terminé :

#### Test dans la Console du Navigateur

1. **Allez sur :** https://www.madagasikarahoanymalagasy.org
2. **Ouvrez** la console (F12)
3. **Tapez :**
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_URL)
   ```

**Résultat attendu :**
```
API URL: https://backmhm.vercel.app/api
```

**Si vous voyez `undefined` ou `http://localhost:5000/api` :**
→ Le frontend n'a pas encore été redéployé ou la variable n'est pas configurée

---

## 🔍 Diagnostic Complet

### Vérifier le Code Frontend

Le fichier `frontend/src/lib/config/env.ts` contient déjà le bon code :

```typescript
export const env = {
  api: {
    // Remove trailing slash to avoid double slashes in URLs
    baseUrl: (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, ''),
  },
} as const;
```

**Note :** La valeur par défaut est `http://localhost:3000/api`, mais en production, `VITE_API_URL` devrait être défini.

---

## 📋 Checklist de Vérification

Avant de tester à nouveau :

### Backend Vercel (https://backmhm.vercel.app)
- [x] `MONGO_URI` configuré
- [x] `FRONTEND_URL` configuré avec les 2 domaines
- [x] `JWT_SECRET` configuré
- [x] Admin créé dans MongoDB Atlas
- [x] Backend redéployé

### Frontend Vercel (https://www.madagasikarahoanymalagasy.org)
- [ ] `VITE_API_URL=https://backmhm.vercel.app/api` configuré
- [ ] Frontend redéployé **APRÈS** configuration de la variable
- [ ] Build Cache désactivé lors du redéploiement

---

## 🧪 Test Final

Une fois le frontend redéployé, testez l'import CSV :

1. **Connectez-vous** à https://www.madagasikarahoanymalagasy.org/login
2. **Allez** dans Gestion QR Codes
3. **Importez** le CSV
4. **Vérifiez** dans Network (F12) que la requête va vers :
   ```
   POST https://backmhm.vercel.app/api/qrcodes/import-csv
   ```
   Et **PAS** vers `http://localhost:5000`

---

## ⚠️ Note sur les Variables VITE_*

Les variables d'environnement Vite (`VITE_*`) sont différentes des variables backend :

| Type | Quand appliquées | Redéploiement requis |
|------|------------------|----------------------|
| **VITE_*** (Frontend) | Au moment du **BUILD** | ✅ OUI - Obligatoire |
| **Backend vars** | Au **RUNTIME** | ❌ NON - Rechargement auto |

C'est pourquoi vous DEVEZ redéployer le frontend après avoir ajouté `VITE_API_URL`.

---

## 🔗 Liens Utiles

- **Frontend Vercel :** https://vercel.com/votre-projet-frontend
- **Backend Vercel :** https://vercel.com/votre-projet-backend
- **Site Production :** https://www.madagasikarahoanymalagasy.org
- **API Production :** https://backmhm.vercel.app/api

---

## 📞 En Cas de Problème Persistant

Si après redéploiement le problème persiste :

1. **Videz le cache du navigateur** (Ctrl + Shift + Delete)
2. **Rechargez** la page en mode incognito
3. **Vérifiez** que le deployment a bien réussi sur Vercel
4. **Vérifiez** les logs de build pour voir si la variable est bien détectée :
   ```
   Building with environment variables:
   VITE_API_URL=https://backmhm.vercel.app/api
   ```

---

**Date :** 2025-11-25
**Problème :** Frontend production utilise localhost au lieu de l'API de production
**Solution :** Configurer `VITE_API_URL` sur Vercel Frontend et redéployer
