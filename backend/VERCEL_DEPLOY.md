# Déploiement Backend sur Vercel

## Variables d'environnement requises

Pour que le backend fonctionne sur Vercel, vous devez configurer les variables d'environnement suivantes dans les paramètres du projet Vercel :

### Variables obligatoires

1. **NODE_ENV**
   ```
   production
   ```

2. **PORT**
   ```
   3000
   ```

3. **MONGO_URI**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/mhm_db?retryWrites=true&w=majority
   ```
   ⚠️ Utilisez MongoDB Atlas pour un déploiement serverless

4. **JWT_SECRET**
   ```
   Votre_clé_secrète_JWT_très_sécurisée_minimum_32_caractères
   ```
   ⚠️ Générez une clé forte et unique

5. **JWT_EXPIRE**
   ```
   30d
   ```

6. **FRONTEND_URL**
   ```
   https://votre-frontend.vercel.app
   ```
   Remplacez par l'URL de votre frontend déployé

### Variables optionnelles (pour l'envoi d'emails)

7. **SMTP_HOST**
   ```
   smtp.gmail.com
   ```

8. **SMTP_PORT**
   ```
   587
   ```

9. **SMTP_SECURE**
   ```
   false
   ```

10. **SMTP_USER**
    ```
    votre-email@gmail.com
    ```

11. **SMTP_PASS**
    ```
    votre-mot-de-passe-app
    ```

12. **EMAIL_FROM**
    ```
    noreply@mhm.mg
    ```

13. **EMAIL_FROM_NAME**
    ```
    Madagasikara Hoan'ny Malagasy
    ```

## Configuration sur Vercel

### Via l'interface web

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Sélectionnez votre projet backend
3. Cliquez sur **Settings** → **Environment Variables**
4. Ajoutez chaque variable une par une :
   - Name : nom de la variable (ex: `MONGO_URI`)
   - Value : valeur de la variable
   - Environment : sélectionnez `Production`, `Preview`, et `Development`
5. Cliquez sur **Save**

### Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Ajouter une variable d'environnement
vercel env add MONGO_URI production
vercel env add JWT_SECRET production
vercel env add FRONTEND_URL production
# ... etc
```

## Redéploiement

Après avoir ajouté les variables d'environnement, redéployez l'application :

```bash
vercel --prod
```

Ou via l'interface web :
1. Allez dans **Deployments**
2. Cliquez sur **Redeploy** sur le dernier déploiement

## Vérification

Une fois déployé, testez l'API :

```bash
curl https://votre-backend.vercel.app/health
```

Vous devriez recevoir :
```json
{
  "success": true,
  "message": "API is running",
  "environment": "production",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Dépannage

### Erreur 500 : FUNCTION_INVOCATION_FAILED

**Cause** : Variables d'environnement manquantes ou incorrectes

**Solution** :
1. Vérifiez que toutes les variables obligatoires sont configurées
2. Vérifiez les logs Vercel : `vercel logs` ou via l'interface web
3. Assurez-vous que MONGO_URI pointe vers MongoDB Atlas (pas localhost)
4. Redéployez après avoir ajouté les variables

### Erreur de connexion MongoDB

**Cause** : MONGO_URI incorrect ou MongoDB Atlas non configuré

**Solution** :
1. Créez un cluster sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Ajoutez l'IP `0.0.0.0/0` dans Network Access (pour Vercel)
3. Créez un utilisateur de base de données
4. Copiez la chaîne de connexion et remplacez `<password>` par votre mot de passe

### Timeout lors du démarrage

**Cause** : Connexion MongoDB trop lente

**Solution** :
- Le timeout est configuré à 5 secondes dans `api/index.js`
- Vérifiez que votre cluster MongoDB Atlas est dans une région proche
- Utilisez un cluster M0 (gratuit) ou supérieur

## Support

Pour plus d'informations :
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation MongoDB Atlas](https://docs.atlas.mongodb.com/)
