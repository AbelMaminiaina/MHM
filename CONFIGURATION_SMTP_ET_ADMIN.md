# 🔧 Configuration SMTP et Compte Admin

## 📧 Configuration SMTP (Envoi d'Emails)

Pour que le système puisse envoyer les QR Codes par email, vous devez configurer SMTP.

---

### Option 1 : Gmail (RECOMMANDÉ pour Production)

#### Étape 1 : Activer la Validation en 2 Étapes

1. Allez sur https://myaccount.google.com/security
2. Cliquez sur **"Validation en 2 étapes"**
3. Suivez les instructions pour l'activer

#### Étape 2 : Générer un Mot de Passe d'Application

1. Allez sur https://myaccount.google.com/apppasswords
2. Dans "Sélectionner l'application", choisissez **"Autre (nom personnalisé)"**
3. Tapez : `HFM Application`
4. Cliquez sur **"Générer"**
5. **Copiez le mot de passe** (format : xxxx xxxx xxxx xxxx)

#### Étape 3 : Configurer le Backend

1. Ouvrez le fichier `backend/.env`
2. Modifiez les lignes SMTP :

```env
# Configuration SMTP pour Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
EMAIL_FROM=votre-email@gmail.com
EMAIL_FROM_NAME=Madagasikara Hoan'ny Malagasy
```

**Remplacez :**
- `votre-email@gmail.com` → Votre adresse Gmail
- `xxxx xxxx xxxx xxxx` → Le mot de passe d'application généré (avec ou sans espaces)

#### Étape 4 : Tester la Configuration

```bash
cd backend
node test-smtp.js
```

**Résultat attendu :**
```
✅ SMTP Configuration Test

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Configuration SMTP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Host: smtp.gmail.com
Port: 587
Secure: false
User: votre-email@gmail.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Testing connection...

✅ SMTP connection successful!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📨 Sending test email...

✅ Test email sent successfully!

Message ID: <xxxxx@gmail.com>
To: votre-email@gmail.com
Subject: Test Email - HFM Application

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All tests passed!
Your SMTP configuration is working correctly.
```

---

### Option 2 : Ethereal Email (Test/Développement SEULEMENT)

**Utilisation :** Pour tester sans envoyer de vrais emails.

#### Étape 1 : Créer un Compte Ethereal

1. Allez sur https://ethereal.email
2. Cliquez sur **"Create Ethereal Account"**
3. Copiez les identifiants affichés

#### Étape 2 : Configurer le Backend

```env
# Configuration SMTP pour Ethereal (Test)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=bernadette.ruecker@ethereal.email
SMTP_PASS=jGmAx7K9HvF2kP3qR8
EMAIL_FROM=noreply@HFM.mg
EMAIL_FROM_NAME=Madagasikara Hoan'ny Malagasy
```

**⚠️ IMPORTANT :** Les emails ne sont PAS réellement envoyés avec Ethereal.
Vous recevrez un lien pour les visualiser dans les logs du serveur.

---

### Option 3 : SendGrid (Production Professionnelle)

**Avantages :** Meilleure délivrabilité, statistiques, gestion des bounces.

#### Étape 1 : Créer un Compte SendGrid

1. Allez sur https://sendgrid.com
2. Créez un compte gratuit (100 emails/jour)

#### Étape 2 : Vérifier un Email Expéditeur

1. Allez dans **Settings** → **Sender Authentication**
2. Cliquez sur **"Verify a Single Sender"**
3. Remplissez le formulaire avec votre email
4. Cliquez sur le lien de vérification dans l'email reçu

#### Étape 3 : Créer une Clé API

1. Allez dans **Settings** → **API Keys**
2. Cliquez sur **"Create API Key"**
3. Donnez un nom : `HFM Application`
4. Sélectionnez **"Full Access"**
5. Cliquez sur **"Create & View"**
6. **Copiez la clé API** (format : SG.xxxxxxxxxx)

#### Étape 4 : Configurer le Backend

```env
# Configuration SMTP pour SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxx
EMAIL_FROM=votre-email-verifie@gmail.com
EMAIL_FROM_NAME=Madagasikara Hoan'ny Malagasy
```

---

## 👤 Compte Administrateur

### Créer le Premier Compte Admin

L'application **N'A PAS** de compte admin par défaut pour des raisons de sécurité.

Vous devez créer un compte admin manuellement.

---

### Méthode 1 : Via l'API (RECOMMANDÉ)

#### Étape 1 : Démarrer le Serveur

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Étape 2 : Créer un Utilisateur

**Via Postman, Thunder Client ou curl :**

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "HFM",
    "email": "admin@HFM.mg",
    "password": "Admin123!",
    "role": "admin"
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "Admin",
      "lastName": "HFM",
      "email": "admin@HFM.mg",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Étape 3 : Se Connecter

**Via l'interface web :**
1. Allez sur http://localhost:5173/login
2. Email : `admin@HFM.mg`
3. Mot de passe : `Admin123!`
4. Cliquez sur **"Se connecter"**

---

### Méthode 2 : Via MongoDB Directement

Si vous avez accès à MongoDB, vous pouvez créer un admin directement dans la base de données.

#### Étape 1 : Se Connecter à MongoDB

```bash
# Si MongoDB est local
mongosh mongodb://localhost:27017/mhm_db

# Si MongoDB Atlas
mongosh "mongodb+srv://user:password@cluster.mongodb.net/mhm_db"
```

#### Étape 2 : Créer l'Utilisateur Admin

```javascript
// Dans mongosh
use mhm_db

// Créer un hash du mot de passe (bcrypt)
// Note: Vous devez remplacer le hash ci-dessous par un hash généré avec bcrypt
// Le mot de passe ici est "Admin123!" hashé avec bcrypt (10 rounds)
db.users.insertOne({
  firstName: "Admin",
  lastName: "HFM",
  email: "admin@HFM.mg",
  password: "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW", // Admin123!
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**⚠️ ATTENTION :** Le hash ci-dessus correspond au mot de passe `Admin123!`

---

### Méthode 3 : Via Script Node.js

Créez un script pour générer le hash et créer l'admin.

#### Fichier : `backend/scripts/create-admin.js`

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'admin@HFM.mg';
    const password = 'Admin123!';

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('❌ Admin already exists!');
      process.exit(1);
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'admin
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'HFM',
      email: email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    console.log('🔐 Password:', password);
    console.log('👤 Role: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT: Change this password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
```

#### Exécuter le Script

```bash
cd backend
node scripts/create-admin.js
```

---

## 🔐 Identifiants Admin Recommandés

**Pour la première connexion, utilisez :**

| Champ | Valeur |
|-------|--------|
| **Email** | `admin@HFM.mg` |
| **Mot de passe** | `Admin123!` |
| **Rôle** | `admin` |

**⚠️ IMPORTANT :** Changez ce mot de passe après la première connexion !

---

## ✅ Vérification Complète

### 1. Vérifier SMTP

```bash
cd backend
node test-smtp.js
```

### 2. Vérifier la Connexion

```bash
# Démarrer le backend
cd backend
npm run dev

# Dans un autre terminal, tester l'API
curl http://localhost:5000/health
```

### 3. Vérifier l'Admin

**Se connecter via l'interface :**
1. http://localhost:5173/login
2. Email : `admin@HFM.mg`
3. Mot de passe : `Admin123!`

**Résultat attendu :**
- ✅ Redirection vers le tableau de bord admin
- ✅ Accès aux fonctionnalités admin (gestion membres, QR Codes, etc.)

---

## 🔄 Importer les Membres et Envoyer les QR Codes

Une fois SMTP configuré et l'admin créé :

1. **Se connecter** : http://localhost:5173/login
2. **Aller sur** : http://localhost:5173/admin/qrcodes
3. **Importer le CSV** : `backend/templates/ekipa-filoha-tantsoroka-feuil1-import-qrcode.csv`
4. **Ajuster l'année** : `2025`
5. **Cliquer sur** : "Importer et Envoyer"

**Résultat :**
- ✅ 118 membres créés
- ✅ 118 QR Codes générés
- ✅ 42 emails envoyés (membres avec emails réels)
- ⚠️ 76 en attente (emails temporaires)

---

## ❌ Résolution des Problèmes

### Problème : "Connection refused" lors du test SMTP

**Cause :** Port bloqué ou identifiants incorrects

**Solution :**
1. Vérifiez que le port 587 n'est pas bloqué par un pare-feu
2. Vérifiez que les identifiants SMTP sont corrects
3. Si Gmail, vérifiez que le mot de passe d'application est correct

---

### Problème : "Invalid login" avec Gmail

**Cause :** Validation en 2 étapes non activée ou mauvais mot de passe

**Solution :**
1. Activez la validation en 2 étapes
2. Générez un nouveau mot de passe d'application
3. Utilisez le mot de passe d'application (PAS votre mot de passe Gmail)

---

### Problème : "Email not sent" dans les logs

**Cause :** SMTP mal configuré

**Solution :**
1. Exécutez `node test-smtp.js` pour diagnostiquer
2. Vérifiez le fichier `.env`
3. Vérifiez les logs backend pour plus de détails

---

### Problème : "Invalid credentials" lors de la connexion admin

**Cause :** Utilisateur admin non créé ou mauvais mot de passe

**Solution :**
1. Vérifiez que l'admin a été créé (Méthode 1, 2 ou 3)
2. Vérifiez que l'email est `admin@HFM.mg`
3. Vérifiez que le mot de passe est `Admin123!`
4. Re-créez l'admin si nécessaire

---

## 🔐 Changer le Mot de Passe Admin

### Via l'Interface (Après Connexion)

1. Se connecter en tant qu'admin
2. Aller dans **"Profil"** ou **"Paramètres"**
3. Cliquer sur **"Changer le mot de passe"**
4. Entrer l'ancien mot de passe : `Admin123!`
5. Entrer le nouveau mot de passe
6. Confirmer

### Via MongoDB

```javascript
// Dans mongosh
use HFM_db

// Générer un nouveau hash avec bcrypt (utilisez un script Node.js)
// Puis mettre à jour :
db.users.updateOne(
  { email: "admin@HFM.mg" },
  { $set: { password: "NOUVEAU_HASH_BCRYPT" } }
)
```

---

## 📞 Checklist Finale

Avant d'importer les membres, vérifiez :

- [ ] SMTP configuré dans `backend/.env`
- [ ] Test SMTP réussi (`node test-smtp.js`)
- [ ] Backend démarré (`npm run dev`)
- [ ] Frontend démarré (`npm run dev`)
- [ ] Compte admin créé
- [ ] Connexion admin réussie
- [ ] Accès à la page QR Codes : http://localhost:5173/admin/qrcodes

**Si tous les points sont cochés → Vous pouvez importer le CSV !** 🚀

---

**Date de création :** 2025-11-24
**Fichiers de référence :**
- Configuration : `backend/.env.example`
- Test SMTP : `backend/test-smtp.js`
- Documentation : `IMPORT_AUTOMATIQUE_MEMBRES_QRCODE.md`
