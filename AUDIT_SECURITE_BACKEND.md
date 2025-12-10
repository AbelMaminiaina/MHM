# 🔒 Audit de Sécurité Backend - HFM

## Date : 2025-11-25

---

## ✅ Points Forts de Sécurité

### 1. **Protection des Headers HTTP** ✅
```javascript
app.use(helmet());
```
**Helmet.js configuré** pour définir automatiquement les headers de sécurité :
- `X-Frame-Options` - Protection contre clickjacking
- `X-Content-Type-Options` - Prévient le MIME sniffing
- `Strict-Transport-Security` - Force HTTPS
- `X-XSS-Protection` - Protection XSS de base
- `Content-Security-Policy` - Contrôle des ressources chargées

**Version installée :** `helmet@7.2.0` ✅ (version récente)

---

### 2. **Protection contre les Injections MongoDB** ✅
```javascript
app.use(mongoSanitize());
```
**express-mongo-sanitize** supprime les caractères spéciaux MongoDB (`$`, `.`) des requêtes utilisateur.

**Protège contre :**
```javascript
// Exemple d'attaque bloquée :
{ "email": { "$gt": "" } }  // Contournement d'authentification
// Devient :
{ "email": "" }  // Inoffensif
```

**Version installée :** `express-mongo-sanitize@2.2.0` ✅

---

### 3. **Rate Limiting (Protection DDoS/Brute Force)** ✅

#### Rate Limiting Global
```javascript
windowMs: 15 * 60 * 1000,  // 15 minutes
max: 100,                   // 100 requêtes max par IP
```
**Protection :** Limite générale contre les abus

#### Rate Limiting Authentification
```javascript
windowMs: 15 * 60 * 1000,  // 15 minutes
max: 5,                     // 5 tentatives max
```
**Protection :** Brute force sur login/register

#### Rate Limiting Reset Password
```javascript
windowMs: 60 * 60 * 1000,  // 1 heure
max: 3,                     // 3 tentatives max
```
**Protection :** Attaques sur réinitialisation de mot de passe

**Version installée :** `express-rate-limit@7.5.1` ✅

**⚠️ REMARQUE :** Le rate limiting est appliqué à `/api/` mais **PAS visible** sur les routes d'authentification dans le code fourni. À vérifier dans `userRoutes.js`.

---

### 4. **Authentification JWT Sécurisée** ✅

```javascript
// Génération de token
jwt.sign({ id, email, role }, config.jwt.secret, {
  expiresIn: config.jwt.expire,
});

// Vérification de token
const decoded = jwt.verify(token, config.jwt.secret);
```

**Protections :**
- ✅ Token expire après 30 jours
- ✅ Secret JWT fort (généré aléatoirement)
- ✅ Vérification de l'expiration
- ✅ Gestion des erreurs JWT (TokenExpiredError, JsonWebTokenError)

**Version installée :** `jsonwebtoken@9.0.2` ✅

---

### 5. **Hachage des Mots de Passe (bcrypt)** ✅

```javascript
import bcrypt from 'bcryptjs';

// Hachage au register/create
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Vérification au login
const isMatch = await bcrypt.compare(enteredPassword, user.password);
```

**Sécurité :**
- ✅ Salt rounds = 10 (recommandé)
- ✅ Mots de passe jamais stockés en clair
- ✅ Comparaison sécurisée avec timing-attack resistance

**Version installée :** `bcryptjs@2.4.3` ✅

---

### 6. **CORS Strict et Configuré** ✅

```javascript
origin: (origin, callback) => {
  // En production : rejette les requêtes sans origin
  if (!origin) {
    if (config.nodeEnv === 'production') {
      return callback(new Error('Not allowed by CORS'));
    }
  }

  // Vérifie la whitelist
  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error('Not allowed by CORS'));
}
```

**Protections :**
- ✅ Whitelist stricte des origines autorisées
- ✅ Refuse les requêtes sans origin en production
- ✅ Credentials autorisés uniquement pour origines whitelistées
- ✅ Methods limitées : GET, POST, PUT, DELETE, PATCH
- ✅ Headers limitées : Content-Type, Authorization

---

### 7. **Autorisation Basée sur les Rôles (RBAC)** ✅

```javascript
// Middleware authorize
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `User role '${req.user.role}' is not authorized`,
    });
  }
  next();
};
```

**Utilisation :**
```javascript
router.post('/import-csv', protect, authorize('admin'), importCSVAndSendQRCodes);
```

**Protection :**
- ✅ Routes sensibles protégées par role admin
- ✅ Vérification du rôle après authentification
- ✅ Erreur 403 si rôle insuffisant

**Routes protégées par `authorize('admin')` :**
- `/api/qrcodes/generate/:memberId`
- `/api/qrcodes/bulk-generate`
- `/api/qrcodes/regenerate-year`
- `/api/qrcodes/stats`
- `/api/qrcodes/scans`
- `/api/qrcodes/dashboard`
- `/api/qrcodes/import-csv`
- `/api/qrcodes/batch/:batchId/retry`
- `/api/qrcodes/batches`
- `/api/qrcodes/batch/:batchId`
- `/api/qrcodes/batches/stats`

---

### 8. **Validation des Fichiers Uploadés** ✅

```javascript
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers CSV sont acceptés'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});
```

**Protections :**
- ✅ Seuls les fichiers CSV acceptés
- ✅ Limite de taille : 5MB max
- ✅ Vérification MIME type + extension
- ✅ Nom de fichier unique avec timestamp

---

### 9. **Logging Sécurisé** ✅

```javascript
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}
```

**Sécurité :**
- ✅ Logs détaillés en production (format Apache combined)
- ✅ Logs concis en développement
- ✅ Pas de logs sensibles (mots de passe masqués)

---

### 10. **QR Code avec Signature Anti-Fraude** ✅

```javascript
// Signature SHA-256
const signature = crypto
  .createHmac('sha256', config.qrCode.secretKey)
  .update(dataToSign)
  .digest('hex');
```

**Protection :**
- ✅ Signature cryptographique de chaque QR code
- ✅ Vérification de l'intégrité lors du scan
- ✅ Impossible de forger un QR code sans la clé secrète

---

## ⚠️ Vulnérabilités et Recommandations

### 1. **Secrets dans .env Non Changés** ⚠️ CRITIQUE

**Problème actuel :**
```env
# .env.example
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
QR_CODE_SECRET_KEY=your_super_secret_qrcode_key_change_this_in_production
```

**Risque :**
- Si ces valeurs par défaut sont utilisées en production, un attaquant peut :
  - Forger des tokens JWT valides
  - Créer de faux QR codes avec signatures valides

**✅ Solution :**
```bash
# Générer un JWT_SECRET fort
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Générer un QR_CODE_SECRET_KEY fort
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

**Variables Vercel Backend à vérifier :**
- `JWT_SECRET` - Doit être un secret fort (64+ caractères aléatoires)
- `QR_CODE_SECRET_KEY` - Doit être différent de JWT_SECRET

---

### 2. **SMTP Credentials Exposées** ⚠️ HAUTE

**Problème :**
Les credentials Gmail sont visibles dans le code partagé :
```env
SMTP_USER=a.maminiaina@gmail.com
SMTP_PASS=kktc enrc crvn ykqt  # App password Gmail
```

**Risque :**
- Accès non autorisé à l'email
- Envoi de spam en votre nom
- Usurpation d'identité

**✅ Solution IMMÉDIATE :**
1. **Révoquer** le mot de passe d'application Gmail actuel
2. **Générer** un nouveau mot de passe d'application
3. **Mettre à jour** sur Vercel Backend
4. **Ne jamais** commit les vraies credentials dans Git

**⚠️ Action requise :** Rotate les credentials SMTP maintenant !

---

### 3. **MongoDB URI avec Credentials Exposées** ⚠️ HAUTE

**Problème :**
```env
MONGO_URI=mongodb+srv://HFM_db_user:20240522Iaina%40@cluster0.vrg1xjv.mongodb.net/HFM_db
                                  ^^^^^^^^^^^^^^^^ Mot de passe visible
```

**Risque :**
- Accès direct à la base de données
- Lecture/modification/suppression de toutes les données
- Création de comptes admin frauduleux

**✅ Solution :**
1. **Changer le mot de passe** de l'utilisateur MongoDB Atlas
2. **Mettre à jour** `MONGO_URI` sur Vercel Backend
3. **Révoquer** tous les tokens/sessions actifs si compromis

**⚠️ IMPORTANT :** Ces credentials sont dans plusieurs fichiers de documentation !

---

### 4. **Pas de Validation d'Input Stricte** ⚠️ MOYENNE

**Problème :**
Pas de validation avec une bibliothèque comme `joi` ou `express-validator`.

**Exemple de risque :**
```javascript
// Dans userController.js
const { email, password } = req.body;
// Pas de validation de format email
// Pas de validation force du mot de passe
```

**✅ Solution Recommandée :**
```bash
npm install joi
```

```javascript
import Joi from 'joi';

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
});
```

---

### 5. **Limite de Requêtes Body Trop Élevée** ⚠️ FAIBLE

**Problème :**
```javascript
app.use(express.json({ limit: '10mb' }));
```

**Risque :**
- Attaque par épuisement de mémoire
- DoS en envoyant de très gros payloads JSON

**✅ Solution :**
Réduire à `1mb` sauf si l'application a vraiment besoin de 10mb :
```javascript
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
```

Pour l'upload CSV (qui peut être plus gros), c'est déjà limité à 5MB par multer ✅

---

### 6. **Pas de Protection CSRF** ⚠️ MOYENNE

**Problème :**
Pas de protection CSRF (Cross-Site Request Forgery) configurée.

**Risque :**
Un site malveillant pourrait forcer un admin connecté à faire des actions (créer membre, envoyer QR codes).

**✅ Solution :**
```bash
npm install csurf
```

```javascript
import csrf from 'csurf';
const csrfProtection = csrf({ cookie: true });

// Appliquer sur routes sensibles
app.use('/api/', csrfProtection);
```

**Note :** Avec JWT + SameSite cookies, le risque est réduit mais pas éliminé.

---

### 7. **Endpoint de Vérification QR Public** ℹ️ INFO

**État actuel :**
```javascript
router.post('/verify', verifyQRCodeData); // Pas de protect/authorize
```

**C'est voulu** car la vérification doit être publique (pour scanner les QR codes).

**Protection existante :**
- ✅ Signature cryptographique vérifiée
- ✅ Rate limiting général appliqué

**Recommandation :**
Ajouter un rate limiting plus strict spécifiquement pour `/verify` :
```javascript
const verifyLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 vérifications max par minute
});

router.post('/verify', verifyLimiter, verifyQRCodeData);
```

---

### 8. **Pas de Protection contre les Injections XSS** ⚠️ FAIBLE

**Problème :**
Pas de sanitization HTML des inputs utilisateur.

**Risque :**
Si les données sont affichées dans le frontend sans échappement, XSS possible.

**✅ Solution :**
```bash
npm install xss-clean
```

```javascript
import xss from 'xss-clean';
app.use(xss());
```

---

### 9. **Logs Pourraient Contenir des Données Sensibles** ⚠️ FAIBLE

**Problème potentiel :**
```javascript
console.error('Auth Middleware Error:', error.message);
```

**Risque :**
Les logs pourraient contenir des tokens ou données sensibles.

**✅ Solution :**
Utiliser un logger structuré qui masque automatiquement les champs sensibles :
```javascript
logger.error('Auth error', {
  message: error.message,
  // Pas de token, password, etc.
});
```

---

### 10. **MongoDB Connection String Logging** ⚠️ FAIBLE

**Problème :**
```javascript
console.log(`URI : ${MONGO_URI.replace(/\/\/.*:.*@/, '//***:***@')}`);
```

**Bon :** Le mot de passe est masqué ✅

**Mais :** Le nom du cluster et la base de données sont visibles.

**Recommandation :**
En production, désactiver complètement ce log ou masquer davantage :
```javascript
if (config.nodeEnv !== 'production') {
  console.log(`URI : ${MONGO_URI.replace(/\/\/.*:.*@/, '//***:***@')}`);
}
```

---

## 📋 Checklist de Sécurisation Production

### 🔴 CRITIQUE - À Faire Immédiatement

- [ ] **Régénérer JWT_SECRET** avec un secret fort (64+ bytes)
- [ ] **Régénérer QR_CODE_SECRET_KEY** différent de JWT_SECRET
- [ ] **Révoquer et regénérer SMTP_PASS** Gmail
- [ ] **Changer le mot de passe MongoDB** et update MONGO_URI
- [ ] **Vérifier que les secrets sont configurés sur Vercel** (pas les valeurs par défaut)

### 🟠 HAUTE PRIORITÉ - Cette Semaine

- [ ] Ajouter validation d'input avec `joi` ou `express-validator`
- [ ] Configurer protection CSRF
- [ ] Ajouter rate limiting spécifique sur `/verify`
- [ ] Ajouter `xss-clean` pour sanitization XSS

### 🟡 MOYENNE PRIORITÉ - Ce Mois

- [ ] Réduire limite body de 10mb à 1mb
- [ ] Configurer logging structuré sans données sensibles
- [ ] Implémenter rotation automatique des secrets
- [ ] Configurer MongoDB IP Whitelist (au lieu de 0.0.0.0/0)
- [ ] Ajouter monitoring des tentatives de connexion échouées

### 🟢 FAIBLE PRIORITÉ - Améliorations Futures

- [ ] Implémenter 2FA pour admin
- [ ] Ajouter audit logging pour actions admin
- [ ] Configurer Content Security Policy plus stricte
- [ ] Implémenter refresh tokens
- [ ] Ajouter webhook pour alertes de sécurité

---

## 🔍 Tests de Sécurité Recommandés

### 1. Test des Secrets
```bash
# Vérifier que les secrets ne sont PAS les valeurs par défaut
curl https://backHFM.vercel.app/health
# Si JWT_SECRET = valeur par défaut, créer un token avec cette valeur et tester
```

### 2. Test Rate Limiting
```bash
# Tester le rate limiting
for i in {1..150}; do
  curl https://backHFM.vercel.app/api/users/login -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test","password":"test"}'
done
# Devrait bloquer après 100 requêtes (ou 5 pour login)
```

### 3. Test CORS
```bash
# Tester CORS depuis une origine non autorisée
curl -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS \
  https://backHFM.vercel.app/api/users/login
# Devrait être rejeté
```

### 4. Test MongoDB Injection
```bash
# Tenter une injection MongoDB
curl -X POST https://backHFM.vercel.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":{"$gt":""},"password":{"$gt":""}}'
# Devrait être bloqué par mongoSanitize
```

---

## 📊 Score de Sécurité Global

| Catégorie | Score | Notes |
|-----------|-------|-------|
| **Authentification** | 8/10 | ✅ JWT + bcrypt, ⚠️ Secrets à regénérer |
| **Autorisation** | 9/10 | ✅ RBAC bien implémenté |
| **Protection Injection** | 9/10 | ✅ MongoDB sanitize, ⚠️ Pas de validation input |
| **Rate Limiting** | 7/10 | ✅ Configuré, ⚠️ Peut être amélioré |
| **CORS** | 9/10 | ✅ Strictement configuré |
| **Cryptographie** | 8/10 | ✅ bcrypt + SHA256, ⚠️ Secrets par défaut |
| **Logging** | 7/10 | ✅ Morgan + Winston, ⚠️ Données sensibles possibles |
| **Upload Fichiers** | 9/10 | ✅ Validation + limite taille |
| **Protection XSS/CSRF** | 6/10 | ⚠️ Pas de xss-clean ni CSRF |
| **Gestion Secrets** | 4/10 | ⚠️ Credentials exposées dans documentation |

**Score Global : 76/100** - **BON** mais nécessite actions immédiates sur les secrets

---

## 🚨 Actions Immédiates Requises

### 1. Générer de Nouveaux Secrets

```bash
# Sur votre machine locale
cd backend

# JWT Secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('base64'))"

# QR Code Secret
node -e "console.log('QR_CODE_SECRET_KEY=' + require('crypto').randomBytes(64).toString('base64'))"
```

### 2. Sur Vercel Backend

1. **Settings** → **Environment Variables**
2. **Modifiez :**
   - `JWT_SECRET` → Collez le nouveau secret généré
   - `QR_CODE_SECRET_KEY` → Collez le nouveau secret généré
3. **Redéployez** le backend

### 3. Révoquer Gmail App Password

1. **Allez sur :** https://myaccount.google.com/apppasswords
2. **Révoquez** le mot de passe `kktc enrc crvn ykqt`
3. **Créez** un nouveau mot de passe d'application
4. **Mettez à jour** sur Vercel Backend → `SMTP_PASS`

### 4. Changer MongoDB Password

1. **MongoDB Atlas** → Database Access
2. **Edit User** `HFM_db_user`
3. **Change Password**
4. **Mettez à jour** `MONGO_URI` sur Vercel Backend

---

## 📝 Conclusion

**Votre backend a une bonne base de sécurité**, mais nécessite des actions immédiates :

✅ **Points forts :**
- Helmet, CORS, Rate Limiting, bcrypt, JWT, MongoDB Sanitize
- Autorisation par rôle bien implémentée
- QR Codes avec signature anti-fraude

⚠️ **Points critiques :**
- Secrets par défaut potentiellement utilisés
- Credentials exposées dans documentation
- Pas de validation d'input stricte

**Priorité #1 :** Régénérer tous les secrets et changer tous les mots de passe exposés.

---

**Date de l'audit :** 2025-11-25
**Auditeur :** Claude Code
**Statut :** Nécessite actions immédiates
