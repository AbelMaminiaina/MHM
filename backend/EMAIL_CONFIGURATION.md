# Configuration des Emails - MHM Backend

## Vue d'ensemble

**Madagasikara Hoan'ny Malagasy (MHM)** - Madagascar pour les Malgaches

Le système d'envoi d'emails est utilisé pour notifier les membres lors de l'approbation de leur adhésion. Un email contenant leur numéro de membre et leur QR code personnel est automatiquement envoyé.

## Configuration

### 1. Variables d'environnement

Ajoutez les variables suivantes dans votre fichier `.env` :

```env
# Email Configuration
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
EMAIL_FROM=noreply@mhm.mg
EMAIL_FROM_NAME=Madagasikara Hoan'ny Malagasy
```

### 2. Configuration pour le développement (Ethereal Email)

Pour tester l'envoi d'emails en développement, utilisez [Ethereal Email](https://ethereal.email) :

1. Allez sur https://ethereal.email
2. Cliquez sur "Create Ethereal Account"
3. Copiez les informations de connexion
4. Mettez à jour votre fichier `.env` avec ces informations

**Exemple :**
```env
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=bernadette.ruecker@ethereal.email
SMTP_PASS=jGmAx7K9HvF2kP3qR8
EMAIL_FROM=noreply@mhm.mg
EMAIL_FROM_NAME=Madagasikara Hoan'ny Malagasy
```

Avec Ethereal, les emails ne sont pas réellement envoyés. Vous pouvez les visualiser via un lien de prévisualisation affiché dans les logs du serveur.

### 3. Configuration pour la production

#### Option A : Gmail

1. Activez la validation en 2 étapes sur votre compte Gmail
2. Générez un mot de passe d'application : https://myaccount.google.com/apppasswords
3. Configurez votre `.env` :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
EMAIL_FROM=votre-email@gmail.com
EMAIL_FROM_NAME=Madagasikara Hoan'ny Malagasy
```

#### Option B : SendGrid

1. Créez un compte sur https://sendgrid.com
2. Générez une clé API
3. Configurez votre `.env` :

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=votre-clé-api-sendgrid
EMAIL_FROM=verified-sender@votre-domaine.com
EMAIL_FROM_NAME=Madagasikara Hoan'ny Malagasy
```

#### Option C : AWS SES

```env
SMTP_HOST=email-smtp.eu-west-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-access-key-id
SMTP_PASS=votre-secret-access-key
EMAIL_FROM=verified-sender@votre-domaine.com
EMAIL_FROM_NAME=Madagasikara Hoan'ny Malagasy
```

## Fonctionnalités

### Email d'approbation d'adhésion

Quand un administrateur approuve une demande d'adhésion via l'endpoint `PUT /api/applications/:id/approve`, le système :

**Organisation : Madagasikara Hoan'ny Malagasy (MHM) - Madagascar pour les Malgaches**

1. ✅ Génère un numéro de membre unique (format: `MHM-YYYY-XXXXX`)
2. ✅ Crée un QR code personnel pour le membre
3. ✅ Met à jour le statut du membre à "active"
4. ✅ Envoie un email de confirmation contenant :
   - Les informations du membre (nom, numéro, type d'adhésion, etc.)
   - Le QR code personnel (intégré dans l'email ET en pièce jointe)
   - Des instructions sur l'utilisation du QR code

### Email de rejet (à implémenter)

Pour envoyer un email lors du rejet d'une adhésion, importez et utilisez la fonction `sendRejectionEmail` dans le contrôleur.

## Template d'email

Le template d'email est responsive et professionnel, comprenant :

- En-tête avec message de bienvenue personnalisé
- Informations détaillées du membre
- QR code intégré dans un cadre stylisé
- Instructions d'utilisation du QR code
- Footer avec informations de contact

## Gestion des erreurs

Si l'envoi d'email échoue, l'approbation du membre n'est pas annulée. Une erreur est loggée dans la console, mais le processus continue normalement. Cela garantit que les problèmes d'email n'empêchent pas l'approbation des membres.

## Test

### Test manuel

1. Démarrez le serveur : `npm run dev`
2. Créez une demande d'adhésion via l'API
3. Approuvez la demande en tant qu'administrateur
4. Vérifiez les logs du serveur pour le lien de prévisualisation (en développement avec Ethereal)
5. Cliquez sur le lien pour voir l'email dans votre navigateur

### Test avec Postman/Thunder Client

**Approuver une adhésion :**
```http
PUT http://localhost:5000/api/applications/:id/approve
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "notes": "Membre approuvé après vérification des documents"
}
```

## Logs

Les logs d'email apparaissent dans la console :

```
Email sent successfully: {
  messageId: '<unique-id@ethereal.email>',
  to: 'membre@example.com',
  subject: 'Bienvenue à MHM - Votre adhésion est approuvée !'
}
Preview URL: https://ethereal.email/message/xxxxx
Approval email sent to membre@example.com
```

## Dépannage

### L'email n'est pas envoyé

1. Vérifiez que les variables d'environnement SMTP sont correctement configurées
2. Vérifiez les logs du serveur pour les erreurs
3. Assurez-vous que le compte SMTP est actif et valide
4. Vérifiez que le port SMTP n'est pas bloqué par un pare-feu

### Gmail bloque les connexions

1. Activez la validation en 2 étapes
2. Utilisez un mot de passe d'application (pas votre mot de passe Gmail)
3. Activez "Accès aux applications moins sécurisées" si nécessaire

### Emails marqués comme spam

1. Configurez SPF, DKIM et DMARC pour votre domaine
2. Utilisez un service professionnel comme SendGrid ou AWS SES
3. Évitez d'utiliser Gmail pour l'envoi en production

## Sécurité

⚠️ **Important :**

- Ne commitez JAMAIS votre fichier `.env` contenant vos identifiants SMTP
- Utilisez des mots de passe d'application (pas vos mots de passe principaux)
- En production, utilisez un service email professionnel
- Limitez le nombre d'emails envoyés pour éviter d'être bloqué pour spam

## Prochaines étapes

- [ ] Implémenter l'envoi d'email pour les rejets d'adhésion
- [ ] Ajouter des emails pour d'autres événements (renouvellement, suspension, etc.)
- [ ] Créer des templates d'email personnalisables
- [ ] Implémenter un système de queue pour les emails (Bull/Redis)
- [ ] Ajouter des statistiques d'envoi d'emails
