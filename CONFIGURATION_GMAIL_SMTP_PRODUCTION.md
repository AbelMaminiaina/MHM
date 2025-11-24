# 📧 Configuration Gmail SMTP pour Production

## Date : 2025-11-24

---

## 🎯 Objectif

Configurer Gmail SMTP pour envoyer de **VRAIS emails** aux membres avec leurs QR codes.

---

## ⚠️ Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ Un compte Gmail actif (ex: contact@madagasikarahoanymalagasy.org ou votre-email@gmail.com)
- ✅ Authentification à 2 facteurs activée sur ce compte
- ✅ Un mot de passe d'application Gmail généré

---

## 📋 Étape 1 : Créer un Mot de Passe d'Application Gmail

### 1.1 Activer l'Authentification à 2 Facteurs

Si pas encore fait :

1. Allez sur : **https://myaccount.google.com/security**
2. Cherchez **"Validation en deux étapes"**
3. Cliquez sur **"Activer"**
4. Suivez les instructions (SMS, application Google Authenticator, etc.)

### 1.2 Créer le Mot de Passe d'Application

1. Retournez sur : **https://myaccount.google.com/security**
2. Scrollez jusqu'à **"Mots de passe des applications"** (App Passwords)
   - Si vous ne le voyez pas, l'authentification à 2 facteurs n'est pas activée
3. Cliquez sur **"Mots de passe des applications"**
4. Sélectionnez **"Autre (nom personnalisé)"**
5. Nom : `MHM Backend Email System`
6. Cliquez sur **"Générer"**
7. **COPIEZ** le mot de passe de 16 caractères
   - Format : `abcd efgh ijkl mnop`
   - Vous pouvez le copier avec ou sans espaces

⚠️ **IMPORTANT** : Ce mot de passe ne sera affiché qu'une seule fois !

---

## 🔧 Étape 2 : Configuration du Fichier .env

### 2.1 Ouvrir le Fichier

Ouvrez : `backend/.env`

### 2.2 Mettre à Jour la Configuration Email

Remplacez la section **Email Configuration** par :

```env
# Email Configuration - PRODUCTION (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
EMAIL_FROM=noreply@mhm.mg
EMAIL_FROM_NAME=Madagasikara Hoan'ny Malagasy
```

### 2.3 Remplacer les Valeurs

**Remplacez :**
- `votre-email@gmail.com` → Votre vrai email Gmail
- `abcd efgh ijkl mnop` → Votre mot de passe d'application (celui généré à l'étape 1.2)

**Exemple avec de vraies valeurs :**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@madagasikarahoanymalagasy.org
SMTP_PASS=xmkq rfft appl xyzk
EMAIL_FROM=noreply@mhm.mg
EMAIL_FROM_NAME=Madagasikara Hoan'ny Malagasy
```

---

## 🔄 Étape 3 : Redémarrer le Backend

**IMPORTANT** : Le backend doit être redémarré pour charger la nouvelle configuration.

### Dans le terminal où le backend tourne :

1. **Arrêtez** : `Ctrl + C`
2. **Redémarrez** :
   ```bash
   cd backend
   npm run dev
   ```
3. **Attendez** :
   ```
   ✅ MongoDB Connected: localhost
   ✅ Server running on port 5000
   ```

---

## 🧪 Étape 4 : Tester l'Envoi Gmail

### 4.1 Test Rapide

```bash
cd backend
node test-smtp.js
```

**Résultat attendu :**
```
✅ Connexion SMTP réussie !
✅ Email de test envoyé avec succès !
📧 Vérifiez votre boîte de réception !
```

### 4.2 Vérifier l'Email

1. Ouvrez votre Gmail : **https://mail.google.com**
2. Cherchez un email de **"Madagasikara Hoan'ny Malagasy"**
3. Sujet : **"✅ Test SMTP - MHM Backend"**

**Si l'email arrive → Configuration réussie ! ✅**

---

## 📨 Étape 5 : Envoyer les QR Codes aux Membres

### Via l'Interface Admin

1. Allez sur : **http://localhost:5173/admin/qrcodes**
2. Onglet **"Import CSV"**
3. Sélectionnez : `backend/templates/ekipa-filoha-tantsoroka-feuil1-import-qrcode.csv`
4. Année : `2025`
5. Cliquez : **"Lancer l'envoi en masse"**

**Cette fois, les emails seront envoyés aux VRAIES adresses ! 📧**

---

## ⚠️ Limitations Gmail

### Quotas d'Envoi Gmail

Gmail a des limites d'envoi :

- **500 emails par jour** (compte Gmail gratuit)
- **2000 emails par jour** (Google Workspace)

### Si Vous Avez Plus de 500 Membres

**Solutions :**

1. **Google Workspace** (payant, 2000/jour)
2. **SendGrid** (gratuit jusqu'à 100/jour, payant au-delà)
3. **Mailgun** (payant, illimité)
4. **Amazon SES** (payant, très bon marché)

---

## 🔐 Sécurité

### ✅ Bonnes Pratiques

1. **NE JAMAIS** commiter le fichier `.env` sur Git
2. **Gardez** votre mot de passe d'application secret
3. **Utilisez** un email dédié (ex: noreply@mhm.mg)
4. **Révoyez** le mot de passe d'application si compromis

### 🔄 Révoquer un Mot de Passe d'Application

Si compromis :

1. Allez sur : **https://myaccount.google.com/security**
2. **"Mots de passe des applications"**
3. Cliquez sur la **poubelle** à côté du mot de passe
4. Créez-en un nouveau

---

## ❌ Résolution des Problèmes

### Erreur : "Invalid credentials" ou "Username and Password not accepted"

**Causes :**
- Mot de passe d'application incorrect
- Authentification à 2 facteurs pas activée
- Email Gmail incorrect

**Solutions :**
1. Vérifiez que l'authentification à 2 facteurs est activée
2. Générez un nouveau mot de passe d'application
3. Copiez-le sans espaces : `abcdefghijklmnop`
4. Vérifiez `SMTP_USER` dans `.env`

### Erreur : "Daily sending quota exceeded"

**Cause :** Vous avez dépassé la limite de 500 emails/jour

**Solutions :**
1. Attendez 24h
2. Utilisez Google Workspace (2000/jour)
3. Passez à SendGrid ou Amazon SES

### Erreur : "Connection timeout"

**Causes :**
- Firewall bloque le port 587
- Connexion internet instable

**Solutions :**
1. Vérifiez votre connexion internet
2. Vérifiez que le port 587 n'est pas bloqué
3. Essayez le port 465 avec `SMTP_SECURE=true`

---

## 📊 Comparaison : Ethereal vs Gmail

| Critère | Ethereal (Test) | Gmail (Production) |
|---------|----------------|-------------------|
| **Type** | Service de test | Service réel |
| **Destinataires** | ❌ Faux (capturés) | ✅ Vrais |
| **Limite d'envoi** | ♾️ Illimité | 500/jour |
| **Coût** | ✅ Gratuit | ✅ Gratuit (limité) |
| **Usage** | Développement | Production |
| **Emails reçus ?** | ❌ Non | ✅ Oui |

---

## 🚀 Récapitulatif : Passer en Production

### Checklist Complète

- [ ] Compte Gmail avec authentification à 2 facteurs
- [ ] Mot de passe d'application Gmail généré
- [ ] Fichier `backend/.env` mis à jour avec Gmail
- [ ] Backend redémarré
- [ ] Test SMTP réussi (`node test-smtp.js`)
- [ ] Email de test reçu dans Gmail
- [ ] Import CSV testé avec 1-2 membres
- [ ] Vérifier que les membres reçoivent bien les emails

---

## 📝 Exemple de Configuration Finale

```env
# backend/.env - Production

NODE_ENV=production
PORT=5000

# MongoDB
MONGO_URI=mongodb://localhost:27017/mhm_db

# JWT
JWT_SECRET=hDy4+Of2JkRazkEqiF1Pq3qqvxcz6TVfC0tVrbeJySo02VZ+e71WNeV1lLHafSbYrDFJozDbmw8K8IhoSUg5cA==
JWT_EXPIRE=30d

# CORS
FRONTEND_URL=http://localhost:5173

# Email Configuration - PRODUCTION (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@madagasikarahoanymalagasy.org
SMTP_PASS=xmkq rfft appl xyzk
EMAIL_FROM=noreply@mhm.mg
EMAIL_FROM_NAME=Madagasikara Hoan'ny Malagasy
```

---

## 💡 Conseils

### Pour les Tests

Avant d'envoyer à tous les 118 membres :

1. **Testez avec 2-3 membres d'abord**
2. Créez un petit CSV de test avec vos propres emails
3. Vérifiez que :
   - L'email arrive bien
   - Le QR code est attaché
   - Le QR code fonctionne (scannez-le)

### Pour l'Envoi en Masse

1. **Vérifiez la limite quotidienne** (500 emails/jour pour Gmail gratuit)
2. Si > 500 membres, faites l'envoi en plusieurs jours
3. Ou passez à un service professionnel (SendGrid, SES)

---

## 📞 Support

**En cas de problème :**

1. Vérifiez les logs du backend
2. Testez avec `node test-smtp.js`
3. Vérifiez la configuration dans `.env`
4. Consultez : https://support.google.com/accounts/answer/185833

---

**Date de création :** 2025-11-24
**Configuration :** Gmail SMTP pour Production
**Limite d'envoi :** 500 emails/jour (compte Gmail gratuit)
**Statut :** ✅ Prêt pour la production

