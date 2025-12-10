# ✅ Vérification Admin en Production

## Problème : 401 Unauthorized lors du login

L'erreur `POST https://backHFM.vercel.app/api/users/login 401 (Unauthorized)` signifie que :
1. ❌ L'admin n'existe pas dans la base de données de production
2. ❌ Le mot de passe est incorrect
3. ❌ L'email est incorrect

---

## 🔍 Solution 1 : Vérifier si l'Admin Existe

### Option A : Via MongoDB Compass (Recommandé)

1. **Téléchargez MongoDB Compass** : https://www.mongodb.com/try/download/compass
2. **Connectez-vous** avec votre URI MongoDB Atlas
3. **Naviguez** vers la base de données `HFM_db`
4. **Ouvrez** la collection `users`
5. **Cherchez** l'utilisateur avec `email: "admin@HFM.mg"`

**Si l'admin n'existe pas :**
- Passez à la Solution 2 pour créer l'admin

**Si l'admin existe :**
- Vérifiez que `role: "admin"` est présent
- Vérifiez que le mot de passe est bien hashé (commence par `$2a$` ou `$2b$`)

---

### Option B : Via MongoDB Atlas Web

1. **Allez sur** : https://cloud.mongodb.com
2. **Connectez-vous** à votre compte
3. **Clusters** → Votre cluster → **Browse Collections**
4. **Base de données** : `HFM_db`
5. **Collection** : `users`
6. **Cherchez** : `{ "email": "admin@HFM.mg" }`

---

## 🔧 Solution 2 : Créer l'Admin en Production

### Méthode 1 : Via Script de Création (Recommandé)

1. **Créez un script temporaire** pour créer l'admin en production :

**Créez le fichier** : `backend/scripts/create-admin-production.js`

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Remplacez par votre MONGO_URI de production
const MONGO_URI = 'mongodb+srv://username:password@cluster.mongodb.net/HFM_db?retryWrites=true&w=majority';

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  console.log('\n🔧 Création de l\'admin en PRODUCTION\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    console.log('🔄 Connexion à MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: 'admin@HFM.mg' });

    if (existingAdmin) {
      console.log('⚠️  L\'admin existe déjà !');
      console.log('  📧 Email :', existingAdmin.email);
      console.log('  🔑 Rôle  :', existingAdmin.role);
      console.log('  🆔 ID    :', existingAdmin._id);
      console.log('\nSi vous voulez réinitialiser le mot de passe, supprimez d\'abord l\'admin.');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hasher le mot de passe
    const password = 'Admin123!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'admin
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'HFM',
      email: 'admin@HFM.mg',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin créé avec succès !\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 Informations de connexion :\n');
    console.log('  📧 Email       : admin@HFM.mg');
    console.log('  🔑 Mot de passe: Admin123!');
    console.log('  👤 Nom         : Admin HFM');
    console.log('  🆔 ID          :', admin._id);
    console.log('  🔐 Rôle        : admin');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Vous pouvez maintenant vous connecter sur :');
    console.log('   https://www.madagasikarahoanymalagasy.org/login\n');

    await mongoose.connection.close();
    console.log('✅ Déconnexion de MongoDB\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

createAdmin();
```

2. **Exécutez le script** :

```bash
cd backend
node scripts/create-admin-production.js
```

---

### Méthode 2 : Via MongoDB Atlas Shell

1. **Sur MongoDB Atlas** : Clusters → **Connect** → **MongoDB Shell**
2. **Installez** `mongosh` si nécessaire
3. **Connectez-vous** :
   ```bash
   mongosh "mongodb+srv://cluster.mongodb.net/HFM_db" --username votre-username
   ```
4. **Créez l'admin** (avec mot de passe hashé) :

```javascript
use HFM_db

// Générer le hash du mot de passe avec bcrypt
// Vous devez le générer localement d'abord avec Node.js:
// const bcrypt = require('bcryptjs');
// bcrypt.hashSync('Admin123!', 10);

db.users.insertOne({
  firstName: "Admin",
  lastName: "HFM",
  email: "admin@HFM.mg",
  password: "$2a$10$YourHashedPasswordHere",  // Remplacez par le hash généré
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

### Méthode 3 : Via Endpoint de Création (Temporaire)

**⚠️ ATTENTION : Cette méthode expose temporairement un endpoint non sécurisé**

1. **Créez temporairement** un endpoint dans `backend/src/routes/userRoutes.js` :

```javascript
// TEMPORAIRE - À SUPPRIMER APRÈS CRÉATION DE L'ADMIN
router.post('/create-admin-temp', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@HFM.mg' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'HFM',
      email: 'admin@HFM.mg',
      password: hashedPassword,
      role: 'admin',
    });

    res.json({ success: true, admin: { email: admin.email, role: admin.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

2. **Déployez** sur Vercel
3. **Appelez** l'endpoint :
   ```bash
   curl -X POST https://backHFM.vercel.app/api/users/create-admin-temp
   ```
4. **SUPPRIMEZ** l'endpoint immédiatement après

---

## 🔐 Générer le Hash du Mot de Passe Localement

Si vous avez besoin de générer le hash du mot de passe `Admin123!` :

```bash
cd backend
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('Admin123!', 10));"
```

**Exemple de sortie :**
```
$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJ
```

Copiez ce hash et utilisez-le dans MongoDB.

---

## ✅ Vérification Post-Création

Après avoir créé l'admin, testez :

1. **Via l'API directement** :
   ```bash
   curl -X POST https://backHFM.vercel.app/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@HFM.mg","password":"Admin123!"}'
   ```

   **Résultat attendu :**
   ```json
   {
     "success": true,
     "data": {
       "email": "admin@HFM.mg",
       "role": "admin",
       "token": "eyJhbGci..."
     }
   }
   ```

2. **Via le frontend** :
   - Allez sur : https://www.madagasikarahoanymalagasy.org/login
   - Email : `admin@HFM.mg`
   - Password : `Admin123!`
   - Devrait vous rediriger vers le dashboard

---

## 🐛 Autres Causes Possibles du 401

### 1. Problème de Hash du Mot de Passe

**Vérifiez** que le mot de passe stocké commence par `$2a$` ou `$2b$` :

```javascript
// Dans MongoDB
db.users.findOne({ email: "admin@HFM.mg" })
// Le champ password doit ressembler à :
// "$2a$10$abc..."
```

### 2. Mauvaise Base de Données

**Vérifiez** que `MONGO_URI` sur Vercel pointe vers la bonne base de données :
- Doit se terminer par `/HFM_db`
- Pas `/test` ou autre

### 3. Backend Cache

Parfois Vercel cache l'ancien code :
1. Allez sur Vercel → Deployments
2. Trouvez le dernier deployment
3. Cliquez sur **"Redeploy"**
4. Cochez **"Use existing Build Cache"** = OFF

---

## 📞 Besoin d'Aide ?

Si le problème persiste après avoir créé l'admin :

1. **Vérifiez les logs Vercel** :
   - Vercel → Votre projet → **Functions**
   - Cherchez les erreurs de login

2. **Testez en local** :
   ```bash
   cd backend
   # Changez temporairement MONGO_URI dans .env vers votre Atlas
   npm run dev
   # Testez le login
   ```

3. **Vérifiez que bcrypt est installé** :
   ```bash
   cd backend
   npm list bcryptjs
   ```

---

**Date de création :** 2025-11-25
**Problème :** 401 Unauthorized au login
**Cause probable :** Admin n'existe pas en production
**Solution :** Créer l'admin avec le script `create-admin-production.js`
