# Guide de Déploiement - Backend HFM sur Vercel avec MongoDB Atlas

Ce guide vous explique comment déployer le backend HFM sur Vercel avec MongoDB Atlas.

## 📋 Prérequis

- Compte [Vercel](https://vercel.com) (gratuit)
- Compte [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit)
- Git installé sur votre machine
- Code backend pushé sur GitHub

---

## 🗄️ Étape 1 : Configuration de MongoDB Atlas

### 1.1 Créer un compte MongoDB Atlas

1. Allez sur https://www.mongodb.com/cloud/atlas
2. Cliquez sur **"Try Free"** ou **"Sign In"** si vous avez déjà un compte
3. Créez votre compte ou connectez-vous

### 1.2 Créer un nouveau cluster

1. Une fois connecté, cliquez sur **"Build a Database"**
2. Choisissez l'option **FREE** (M0)
3. Sélectionnez votre région (choisir la plus proche de vos utilisateurs)
   - Recommandé : **Europe** (Paris ou Frankfurt) ou **US East** (N. Virginia)
4. Donnez un nom à votre cluster : `HFM-cluster`
5. Cliquez sur **"Create Cluster"**

### 1.3 Configurer l'accès à la base de données

#### Créer un utilisateur de base de données

1. Dans le menu latéral, allez dans **"Database Access"**
2. Cliquez sur **"Add New Database User"**
3. Choisissez **"Password"** comme méthode d'authentification
4. Remplissez les informations :
   - **Username** : `HFM_admin` (ou autre nom de votre choix)
   - **Password** : Générez un mot de passe fort (cliquez sur "Autogenerate Secure Password")
   - ⚠️ **IMPORTANT** : Sauvegardez ce mot de passe dans un endroit sûr !
5. Dans **"Database User Privileges"**, sélectionnez **"Read and write to any database"**
6. Cliquez sur **"Add User"**

#### Autoriser l'accès réseau

1. Dans le menu latéral, allez dans **"Network Access"**
2. Cliquez sur **"Add IP Address"**
3. Cliquez sur **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ C'est nécessaire pour Vercel car les IPs sont dynamiques
4. Cliquez sur **"Confirm"**

### 1.4 Obtenir la chaîne de connexion

1. Retournez dans **"Database"** dans le menu latéral
2. Cliquez sur **"Connect"** sur votre cluster
3. Sélectionnez **"Connect your application"**
4. Choisissez **"Driver"** : Node.js
5. Copiez la chaîne de connexion qui ressemble à :
   ```
   mongodb+srv://<username>:<password>@HFM-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Remplacez `<username>` et `<password>` par vos identifiants
7. Ajoutez le nom de la base de données après `.net/` : `HFM_db`

**Exemple de chaîne de connexion finale :**
```
mongodb+srv://mhm_admin:VotreMo%24dePa$$e@mhm-cluster.xxxxx.mongodb.net/mhm_db?retryWrites=true&w=majority
```

⚠️ **IMPORTANT** : Si votre mot de passe contient des caractères spéciaux, vous devez les encoder en URL :
- `@` → `%40`
- `$` → `%24`
- `#` → `%23`
- `%` → `%25`
- etc.

---

## 🚀 Étape 2 : Déploiement sur Vercel

### 2.1 Créer un compte Vercel et connecter GitHub

1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repositories GitHub

### 2.2 Importer votre projet

1. Sur le dashboard Vercel, cliquez sur **"Add New..."** puis **"Project"**
2. Trouvez et sélectionnez votre repository **"HFM"**
3. Cliquez sur **"Import"**

### 2.3 Configurer le projet

1. Dans la section **"Configure Project"** :
   - **Framework Preset** : Other
   - **Root Directory** : Cliquez sur **"Edit"** et sélectionnez `backend`
   - **Build Command** : Laissez vide
   - **Output Directory** : Laissez vide
   - **Install Command** : `npm install`

### 2.4 Configurer les variables d'environnement

1. Dépliez la section **"Environment Variables"**
2. Ajoutez les variables suivantes une par une :

| Name | Value | Description |
|------|-------|-------------|
| `NODE_ENV` | `production` | Environnement de production |
| `MONGO_URI` | `mongodb+srv://...` | Votre chaîne de connexion MongoDB Atlas |
| `JWT_SECRET` | (générer une clé forte) | Clé secrète pour JWT (min 32 caractères) |
| `JWT_EXPIRE` | `30d` | Durée de validité du token |
| `FRONTEND_URL` | `https://votre-frontend.vercel.app` | URL(s) de votre frontend (séparées par des virgules si plusieurs) |
| `PORT` | `3000` | Port (optionnel, géré par Vercel) |
| `LOG_LEVEL` | `info` | Niveau de logs |

**Pour générer une clé JWT_SECRET sécurisée :**
```bash
# Sur Linux/Mac
openssl rand -base64 32

# Ou utilisez un générateur en ligne (assurez-vous qu'il soit fiable)
```

**Pour autoriser plusieurs URLs frontend (CORS) :**
Si vous avez plusieurs domaines (avec et sans www, ou plusieurs environnements), vous pouvez les séparer par des virgules :
```
FRONTEND_URL=https://madagasikarahoanymalagasy.org,https://www.madagasikarahoanymalagasy.org,https://frontend-preview.vercel.app
```

3. Cliquez sur **"Deploy"**

### 2.5 Attendre le déploiement

1. Vercel va :
   - Installer les dépendances (`npm install`)
   - Builder votre application
   - Déployer sur leur réseau CDN
2. Le déploiement prend généralement 1-2 minutes
3. Une fois terminé, vous verrez un message **"Congratulations!"**

### 2.6 Tester votre API

1. Cliquez sur le bouton **"Visit"** ou copiez l'URL de déploiement
2. Votre URL ressemblera à : `https://HFM-backend-xxxxx.vercel.app`
3. Testez les endpoints :
   - **Health Check** : `https://votre-app.vercel.app/health`
   - **API Docs** : `https://votre-app.vercel.app/api-docs`
   - **API Root** : `https://votre-app.vercel.app/`

---

## 🔧 Étape 3 : Configuration du Frontend

Maintenant que votre backend est déployé, vous devez mettre à jour le frontend.

### 3.1 Mettre à jour l'URL de l'API dans le frontend

1. Dans votre projet frontend, ouvrez `.env` ou créez-le :
   ```env
   VITE_API_URL=https://votre-backend.vercel.app/api
   ```

2. Remplacez `https://votre-backend.vercel.app` par votre vraie URL Vercel

### 3.2 Mettre à jour les variables d'environnement Vercel (Backend)

1. Retournez sur votre projet backend dans Vercel
2. Allez dans **Settings** → **Environment Variables**
3. Modifiez `FRONTEND_URL` avec l'URL de votre frontend déployé
4. Redéployez si nécessaire (Settings → Deployments → Redeploy)

---

## ✅ Vérification finale

### Tester la connexion à MongoDB

```bash
# Avec curl ou Postman
curl https://votre-backend.vercel.app/health
```

Réponse attendue :
```json
{
  "success": true,
  "message": "HFM Backend API is running",
  "timestamp": "2024-11-04T..."
}
```

### Tester un endpoint protégé

```bash
# S'inscrire
curl -X POST https://votre-backend.vercel.app/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

---

## 🐛 Dépannage

### Erreur "Cannot connect to MongoDB"

1. Vérifiez que votre IP `0.0.0.0/0` est bien autorisée dans MongoDB Atlas Network Access
2. Vérifiez que votre chaîne de connexion `MONGO_URI` est correcte
3. Vérifiez que le mot de passe est bien encodé en URL

### Erreur "CORS"

1. Vérifiez que `FRONTEND_URL` dans Vercel correspond exactement à l'URL de votre frontend
2. N'oubliez pas le `https://` dans l'URL

### Erreur 500 sur Vercel

1. Allez dans **Vercel Dashboard** → Votre projet → **Logs**
2. Regardez les logs en temps réel pour identifier l'erreur
3. Vérifiez que toutes les variables d'environnement sont correctement définies

### Le déploiement échoue

1. Vérifiez les logs de build dans Vercel
2. Assurez-vous que `package.json` contient toutes les dépendances
3. Vérifiez que `vercel.json` est bien à la racine du dossier `backend`

---

## 📚 Ressources utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Connection Strings](https://www.mongodb.com/docs/manual/reference/connection-string/)

---

## 🔄 Déploiement continu

Vercel est maintenant configuré pour déployer automatiquement :
- **À chaque push sur `main`** → Déploiement en production
- **À chaque pull request** → Preview deployment

Vous pouvez voir tous vos déploiements dans l'onglet **"Deployments"** de votre projet Vercel.

---

## 🎉 Félicitations !

Votre backend HFM est maintenant déployé sur Vercel avec MongoDB Atlas ! 🚀

**URLs importantes à sauvegarder :**
- Backend API : `https://votre-backend.vercel.app`
- API Documentation : `https://votre-backend.vercel.app/api-docs`
- MongoDB Atlas : https://cloud.mongodb.com
