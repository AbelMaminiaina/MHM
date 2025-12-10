# Docker & Docker Compose Documentation

Guide complet pour déployer et développer le projet HFM avec Docker.

## Table des matières

- [Prérequis](#prérequis)
- [Installation rapide](#installation-rapide)
- [Environnements](#environnements)
- [Commandes Docker](#commandes-docker)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## Prérequis

- Docker Engine 20.10+ ([Installation](https://docs.docker.com/engine/install/))
- Docker Compose 2.0+ ([Installation](https://docs.docker.com/compose/install/))
- 4GB RAM minimum disponible pour Docker
- 10GB d'espace disque disponible

## Installation rapide

### Développement

```bash
# 1. Cloner le repository
git clone https://github.com/votre-org/MHM.git
cd HFM

# 2. Copier le fichier d'environnement
cp .env.docker.example .env.docker

# 3. Éditer les variables d'environnement
nano .env.docker  # ou votre éditeur préféré

# 4. Lancer les services en mode développement
docker compose -f docker-compose.dev.yml up -d

# 5. Voir les logs
docker compose -f docker-compose.dev.yml logs -f
```

L'application sera accessible à :
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs
- **MongoDB**: localhost:27017

### Production

```bash
# 1. Copier et configurer les variables d'environnement
cp .env.docker.example .env.docker
nano .env.docker

# 2. Construire et lancer les services
docker compose up -d --build

# 3. Vérifier l'état des services
docker compose ps
```

L'application sera accessible à :
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017 (non exposé en production recommandé)

## Environnements

### Mode Développement

Le mode développement inclut :
- Hot reload automatique (backend et frontend)
- Code source monté comme volume
- Logs détaillés (LOG_LEVEL=debug)
- MongoDB avec données persistantes
- Tous les outils de développement

**Commandes** :
```bash
# Démarrer
docker compose -f docker-compose.dev.yml up -d

# Arrêter
docker compose -f docker-compose.dev.yml down

# Rebuild après changement de dépendances
docker compose -f docker-compose.dev.yml up -d --build

# Voir les logs d'un service spécifique
docker compose -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.dev.yml logs -f frontend
```

### Mode Production

Le mode production inclut :
- Images optimisées multi-stage
- Nginx pour servir le frontend
- Configuration de sécurité renforcée
- Healthchecks configurés
- Utilisateurs non-root dans les conteneurs

**Commandes** :
```bash
# Démarrer
docker compose up -d

# Arrêter
docker compose down

# Mettre à jour les images
docker compose pull
docker compose up -d

# Voir les logs
docker compose logs -f
```

## Commandes Docker

### Services

```bash
# Lister les services en cours d'exécution
docker compose ps

# Démarrer tous les services
docker compose up -d

# Arrêter tous les services
docker compose down

# Redémarrer un service spécifique
docker compose restart backend

# Arrêter et supprimer les volumes (⚠️ perte de données)
docker compose down -v
```

### Logs

```bash
# Voir tous les logs
docker compose logs

# Suivre les logs en temps réel
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb

# Dernières 100 lignes
docker compose logs --tail=100
```

### Exécution de commandes

```bash
# Accéder au shell du backend
docker compose exec backend sh

# Accéder au shell du frontend
docker compose exec frontend sh

# Accéder à MongoDB CLI
docker compose exec mongodb mongosh -u admin -p password123

# Exécuter une commande npm dans le backend
docker compose exec backend npm run lint

# Exécuter les tests
docker compose exec backend npm test
```

### Images et Nettoyage

```bash
# Reconstruire les images
docker compose build

# Reconstruire sans cache
docker compose build --no-cache

# Voir les images Docker
docker images

# Nettoyer les images inutilisées
docker image prune -a

# Nettoyer tout (⚠️ images, conteneurs, volumes)
docker system prune -a --volumes
```

## Configuration

### Variables d'environnement

Créez un fichier `.env.docker` à la racine du projet :

```env
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=secure_password_here
MONGO_DB_NAME=mhm_db
MONGO_PORT=27017

# Backend
BACKEND_PORT=5000

# Frontend
FRONTEND_PORT=3000
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise_minimum_32_caracteres
JWT_EXPIRE=30d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
EMAIL_FROM=noreply@HFM.mg
EMAIL_FROM_NAME=Madagasikara Hoan'ny Malagasy

# Logging
LOG_LEVEL=info

# Vite (Frontend)
VITE_API_URL=http://localhost:5000
```

### Volumes

Les données persistantes sont stockées dans des volumes Docker :

- `mongodb_data` : Base de données MongoDB
- `mongodb_config` : Configuration MongoDB
- `backend_logs` : Logs du backend

**Sauvegarder les données** :
```bash
# Sauvegarder MongoDB
docker compose exec mongodb mongodump --out /backup
docker cp HFM-mongodb:/backup ./mongodb-backup-$(date +%Y%m%d)

# Restaurer MongoDB
docker cp ./mongodb-backup-20240101 mhm-mongodb:/backup
docker compose exec mongodb mongorestore /backup
```

### Réseau

Les services communiquent via un réseau Docker bridge `HFM-network` :

- Backend → MongoDB : `mongodb:27017`
- Frontend → Backend : Via variable d'environnement `VITE_API_URL`

## Healthchecks

Tous les services ont des healthchecks configurés :

```bash
# Vérifier l'état de santé
docker compose ps

# Détails d'un service
docker inspect HFM-backend | grep -A 10 Health
```

**Endpoints de santé** :
- Backend : `http://localhost:5000/health`
- Frontend : `http://localhost:3000/` (via nginx)
- MongoDB : Commande `mongosh ping`

## Architecture des Images

### Backend

```
Multi-stage build :
1. base        → Node.js 20 Alpine
2. deps        → Dépendances production only
3. dev         → Mode développement avec nodemon
4. builder     → Build (si nécessaire)
5. production  → Image finale optimisée
```

**Taille finale** : ~200MB

### Frontend

```
Multi-stage build :
1. builder      → Build avec Node.js + Vite
2. production   → Nginx Alpine avec fichiers statiques
3. development  → Vite dev server
```

**Taille finale** : ~30MB (nginx + static files)

## CI/CD avec GitHub Actions

Le projet inclut des workflows automatisés :

### Backend CI (`backend-ci.yml`)
- Linting (ESLint)
- Tests unitaires
- Build Docker
- Audit de sécurité

### Frontend CI (`frontend-ci.yml`)
- Linting (ESLint)
- Build de production
- Build Docker
- Audit de sécurité

### Docker Deploy (`docker-deploy.yml`)
- Build et push vers GitHub Container Registry
- Déploiement automatique staging/production
- Rollback en cas d'échec
- Notifications Slack

### Pull Request Checks (`pr-checks.yml`)
- Vérification du titre (Semantic PR)
- Analyse de la taille du PR
- Review des dépendances
- Auto-labeling
- Analyse de qualité du code

## Troubleshooting

### Le port est déjà utilisé

```bash
# Trouver le processus utilisant le port
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000

# Changer le port dans .env.docker
BACKEND_PORT=5001
```

### Erreur de connexion MongoDB

```bash
# Vérifier que MongoDB est démarré
docker compose ps mongodb

# Voir les logs MongoDB
docker compose logs mongodb

# Redémarrer MongoDB
docker compose restart mongodb
```

### Le hot reload ne fonctionne pas

```bash
# Vérifier les volumes montés
docker compose -f docker-compose.dev.yml config

# Rebuild complet
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d --build
```

### Nettoyer complètement et recommencer

```bash
# ⚠️ ATTENTION : Supprime toutes les données
docker compose down -v
docker system prune -a --volumes
docker compose up -d --build
```

### Erreur "No space left on device"

```bash
# Nettoyer l'espace Docker
docker system df
docker system prune -a --volumes

# Augmenter l'espace alloué à Docker dans les préférences
```

### Les logs ne s'affichent pas

```bash
# Vérifier que le service tourne
docker compose ps

# Forcer l'affichage des logs
docker compose logs --no-log-prefix -f backend

# Accéder directement au conteneur
docker compose exec backend cat /app/logs/combined-*.log
```

## Bonnes pratiques

1. **Toujours utiliser `.env.docker`** pour les variables d'environnement
2. **Sauvegarder régulièrement** les données MongoDB en production
3. **Ne jamais commiter** les fichiers `.env` ou `.env.docker`
4. **Utiliser des secrets forts** pour JWT_SECRET et MONGO_ROOT_PASSWORD
5. **Monitorer les logs** en production avec `docker compose logs -f`
6. **Mettre à jour régulièrement** les images de base avec `docker compose pull`

## Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation : [docs/](./docs/)
- Contact : support@HFM.mg
