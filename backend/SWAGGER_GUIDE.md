# Guide d'utilisation de Swagger - API MHM

## Vue d'ensemble

La documentation Swagger/OpenAPI a été implémentée avec succès pour l'API MHM. Elle fournit une interface interactive pour explorer et tester tous les endpoints de l'API.

## Accès à la documentation

### En développement

1. Démarrez le serveur backend:
```bash
cd backend
npm run dev
```

2. Ouvrez votre navigateur et accédez à:
```
http://localhost:5000/api-docs
```

### En production

```
https://api.mhm.mg/api-docs
```

## Fonctionnalités implémentées

### ✅ Documentation complète des endpoints

#### 1. **Health** - Vérification du serveur
- `GET /health` - Vérifier que l'API est opérationnelle

#### 2. **Users** - Gestion des utilisateurs
- `POST /api/users/register` - Inscription d'un nouvel utilisateur
- `POST /api/users/login` - Connexion utilisateur
- `GET /api/users/me` - Obtenir le profil (protégé)
- `PUT /api/users/me` - Mettre à jour le profil (protégé)

#### 3. **Members** - Gestion des membres
- `GET /api/members` - Liste des membres avec pagination et filtres (protégé)
- `POST /api/members` - Créer un nouveau membre (protégé)
- `GET /api/members/:id` - Détails d'un membre (protégé)
- `PUT /api/members/:id` - Mettre à jour un membre (protégé)
- `DELETE /api/members/:id` - Supprimer un membre (protégé)
- `GET /api/members/stats` - Statistiques des membres (protégé)
- `GET /api/members/export` - Exporter en Excel (protégé)
- `POST /api/members/import` - Importer depuis Excel (protégé)

#### 4. **Applications** - Gestion des candidatures
- `POST /api/applications` - Soumettre une candidature (public)
- `GET /api/applications/stats` - Statistiques (protégé)
- `GET /api/applications/pending` - Candidatures en attente (protégé)
- `GET /api/applications/:id` - Détails d'une candidature (protégé)
- `PUT /api/applications/:id/approve` - Approuver une candidature (protégé)
- `PUT /api/applications/:id/reject` - Rejeter une candidature (protégé)
- `PUT /api/applications/:id/suspend` - Suspendre un membre (protégé)
- `PUT /api/applications/:id/reactivate` - Réactiver un membre (protégé)

### ✅ Schémas de données documentés

- **User** - Modèle utilisateur
- **Member** - Modèle membre avec toutes ses propriétés
- **Application** - Modèle candidature

### ✅ Authentification JWT

La documentation inclut la configuration de l'authentification Bearer Token (JWT):

1. Connectez-vous via `POST /api/users/login`
2. Copiez le token JWT reçu
3. Cliquez sur le bouton "Authorize" en haut à droite
4. Collez le token dans le champ "Value"
5. Tous les endpoints protégés seront maintenant accessibles

## Utilisation de Swagger UI

### Tester un endpoint

1. **Sélectionnez un endpoint** en cliquant dessus
2. Cliquez sur **"Try it out"**
3. **Remplissez les paramètres** requis
4. Cliquez sur **"Execute"**
5. Consultez la **réponse** en bas

### Exemple: Créer un utilisateur

1. Allez sur `POST /api/users/register`
2. Cliquez sur "Try it out"
3. Modifiez le JSON:
```json
{
  "name": "Jean Dupont",
  "email": "jean.dupont@mhm.mg",
  "password": "Password123"
}
```
4. Cliquez sur "Execute"
5. Vous recevrez un token JWT dans la réponse

### Exemple: Tester un endpoint protégé

1. Connectez-vous d'abord pour obtenir un token
2. Cliquez sur "Authorize" (cadenas en haut à droite)
3. Entrez: `votre_token_jwt` (sans "Bearer")
4. Cliquez sur "Authorize" puis "Close"
5. Testez n'importe quel endpoint protégé

## Structure de la documentation

### Configuration principale
**Fichier:** `backend/src/config/swagger.js`
- Définition OpenAPI 3.0.0
- Serveurs (développement/production)
- Schémas de sécurité
- Schémas d'erreurs communs
- Tags pour l'organisation

### Documentation des routes
Les annotations Swagger sont dans:
- `backend/src/routes/userRoutes.js`
- `backend/src/routes/memberRoutes.js`
- `backend/src/routes/applicationRoutes.js`

### Format des annotations

```javascript
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
```

## Bonnes pratiques suivies

### ✅ Spécification OpenAPI 3.0
- Format standard reconnu par l'industrie
- Compatible avec de nombreux outils

### ✅ Documentation détaillée
- Descriptions claires en français
- Exemples pour chaque endpoint
- Schémas de données complets

### ✅ Sécurité
- Documentation de l'authentification JWT
- Indication des endpoints protégés
- Exemples de réponses d'erreur

### ✅ Organisation
- Regroupement par tags (Users, Members, Applications, Health)
- Schémas réutilisables
- Réponses d'erreur standardisées

## Personnalisation

### Modifier l'apparence
Éditez `backend/src/app.js`:
```javascript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'MHM API Documentation',
  customfavIcon: '/assets/favicon.ico'
}));
```

### Ajouter un nouveau endpoint

1. Ajoutez l'annotation dans le fichier de route concerné:
```javascript
/**
 * @swagger
 * /api/nouveau-endpoint:
 *   get:
 *     summary: Description
 *     tags: [TagName]
 *     responses:
 *       200:
 *         description: Succès
 */
router.get('/nouveau-endpoint', controller);
```

2. Redémarrez le serveur - la documentation sera automatiquement mise à jour

## Export de la documentation

### Format JSON
Accédez à l'URL suivante pour obtenir la spec complète en JSON:
```
http://localhost:5000/api-docs-json
```

### Générer un client API
Utilisez des outils comme:
- **Swagger Codegen** - Génère des clients dans différents langages
- **OpenAPI Generator** - Alternative moderne à Swagger Codegen
- **Postman** - Importez la spec OpenAPI

## Dépannage

### La documentation ne s'affiche pas
1. Vérifiez que le serveur tourne
2. Vérifiez les logs pour les erreurs Swagger
3. Assurez-vous que swagger-jsdoc et swagger-ui-express sont installés

### Les endpoints n'apparaissent pas
1. Vérifiez que le chemin dans `apis` de swagger.js est correct
2. Vérifiez la syntaxe des annotations @swagger
3. Redémarrez nodemon

### Erreur 404 sur /api-docs
Vérifiez que l'import et l'utilisation dans app.js sont corrects

## Prochaines étapes suggérées

### Semaine 3-4 (selon BONNES_PRATIQUES.md)

1. **Tests automatisés**
   - Tests unitaires avec Jest
   - Tests d'intégration
   - Tests E2E

2. **CI/CD**
   - GitHub Actions
   - Tests automatiques sur chaque commit
   - Déploiement automatique

3. **Logging avancé**
   - Winston pour les logs structurés
   - Morgan pour les requêtes HTTP
   - Rotation des fichiers de log

4. **Docker**
   - Dockerfile pour le backend
   - Docker Compose avec MongoDB
   - Environnement de développement reproductible

## Ressources

- [OpenAPI Specification 3.0](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
- [Best Practices for API Documentation](https://swagger.io/blog/api-documentation/best-practices-in-api-documentation/)

---

**Implémenté le:** 4 Novembre 2024
**Statut:** ✅ Complété (Semaine 2-3 des bonnes pratiques)
**Version Swagger:** OpenAPI 3.0.0
