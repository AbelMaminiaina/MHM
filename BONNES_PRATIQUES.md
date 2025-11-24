# Bonnes Pratiques à Implémenter - Projet MHM

Ce document liste les bonnes pratiques recommandées pour améliorer la qualité, la sécurité, la maintenabilité et la performance du projet MHM.

## 📋 Table des matières

1. [Tests](#1-tests)
2. [CI/CD](#2-cicd)
3. [Docker & Containerisation](#3-docker--containerisation)
4. [Documentation API](#4-documentation-api)
5. [Logging & Monitoring](#5-logging--monitoring)
6. [Sécurité](#6-sécurité)
7. [Performance & Optimisation](#7-performance--optimisation)
8. [Qualité du Code](#8-qualité-du-code)
9. [Gestion des Bases de Données](#9-gestion-des-bases-de-données)
10. [Environnements](#10-environnements)
11. [Documentation](#11-documentation)
12. [Gestion des Erreurs](#12-gestion-des-erreurs)

---

## 1. Tests

### ❌ État actuel
- Aucun test unitaire
- Aucun test d'intégration
- Aucun test E2E

### ✅ Recommandations

#### 1.1 Tests Unitaires (Jest)

**Installation:**
```bash
npm install --save-dev jest @jest/globals supertest
```

**Configuration:** `backend/jest.config.js`
```javascript
export default {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/**/*.test.js'
  ],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  transform: {},
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

**Exemple de test:** `backend/src/controllers/__tests__/userController.test.js`
```javascript
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';
import connectDB from '../../config/db.js';
import User from '../../models/User.js';

describe('User Controller', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    test('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@mhm.mg',
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.password).toBeUndefined();
    });

    test('should not register user with existing email', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User 2',
          email: 'test@mhm.mg',
          password: 'Password123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
```

**Scripts à ajouter dans `package.json`:**
```json
{
  "scripts": {
    "test": "NODE_OPTIONS=--experimental-vm-modules jest",
    "test:watch": "NODE_OPTIONS=--experimental-vm-modules jest --watch",
    "test:coverage": "NODE_OPTIONS=--experimental-vm-modules jest --coverage"
  }
}
```

#### 1.2 Tests d'Intégration

Créer des tests qui vérifient l'interaction entre plusieurs composants (contrôleurs, modèles, base de données).

#### 1.3 Tests E2E (Playwright ou Cypress)

Pour le frontend, installer Playwright:
```bash
cd frontend
npm install --save-dev @playwright/test
```

---

## 2. CI/CD

### ✅ GitHub Actions

Créer `.github/workflows/ci.yml`:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  backend-test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:latest
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: ./backend
        run: npm ci

      - name: Run linter
        working-directory: ./backend
        run: npm run lint

      - name: Run tests
        working-directory: ./backend
        run: npm test
        env:
          MONGO_URI: mongodb://localhost:27017/mhm_test
          JWT_SECRET: test_secret

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/coverage-final.json

  frontend-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run linter
        working-directory: ./frontend
        run: npm run lint

      - name: Build
        working-directory: ./frontend
        run: npm run build

      - name: Run tests
        working-directory: ./frontend
        run: npm test

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run npm audit
        working-directory: ./backend
        run: npm audit --audit-level=moderate
```

---

## 3. Docker & Containerisation

### ✅ Docker Backend

**Créer `backend/Dockerfile`:**
```dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Create uploads directory
RUN mkdir -p uploads public/qrcodes

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start app
CMD ["npm", "start"]
```

**Créer `backend/.dockerignore`:**
```
node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
coverage
.vscode
.idea
uploads/*
!uploads/.gitkeep
```

### ✅ Docker Compose

**Créer `docker-compose.yml` à la racine:**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: mhm-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: mhm_admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD:-changeme}
      MONGO_INITDB_DATABASE: mhm_db
    volumes:
      - mongodb_data:/data/db
      - ./backend/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    networks:
      - mhm-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: mhm-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 5000
      MONGO_URI: mongodb://mhm_admin:${MONGO_ROOT_PASSWORD:-changeme}@mongodb:27017/mhm_db?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRE: ${JWT_EXPIRE:-30d}
      FRONTEND_URL: http://localhost:5173
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASS: ${SMTP_PASS}
      EMAIL_FROM: ${EMAIL_FROM}
      EMAIL_FROM_NAME: ${EMAIL_FROM_NAME}
    depends_on:
      - mongodb
    volumes:
      - ./backend/uploads:/usr/src/app/uploads
      - ./backend/public/qrcodes:/usr/src/app/public/qrcodes
    networks:
      - mhm-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: mhm-frontend
    restart: unless-stopped
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:5000
    depends_on:
      - backend
    networks:
      - mhm-network

volumes:
  mongodb_data:
    driver: local

networks:
  mhm-network:
    driver: bridge
```

---

## 4. Documentation API

### ✅ Swagger/OpenAPI

**Installation:**
```bash
npm install swagger-jsdoc swagger-ui-express
```

**Configuration:** `backend/src/config/swagger.js`
```javascript
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MHM API Documentation',
      version: '1.0.0',
      description: 'API REST pour Madagasikara Hoan\'ny Malagasy (MHM)',
      contact: {
        name: 'MHM Team',
        email: 'contact@madagasikarahoanymalagasy.org',
        url: 'https://mhm.mg'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.mhm.mg',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

export default swaggerJsdoc(options);
```

**Ajouter dans `app.js`:**
```javascript
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

**Exemple de documentation dans les routes:**
```javascript
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register', registerValidation, registerUser);
```

---

## 5. Logging & Monitoring

### ✅ Winston Logger

**Installation:**
```bash
npm install winston winston-daily-rotate-file
```

**Configuration:** `backend/src/config/logger.js`
```javascript
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Console transport
const consoleTransport = new winston.transports.Console({
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  )
});

// File transport for errors
const errorFileTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxFiles: '14d',
  maxSize: '20m'
});

// File transport for all logs
const combinedFileTransport = new DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  maxSize: '20m'
});

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    consoleTransport,
    errorFileTransport,
    combinedFileTransport
  ]
});

export default logger;
```

**Utilisation:**
```javascript
import logger from './config/logger.js';

// Dans vos contrôleurs
logger.info('User registered', { userId, email });
logger.error('Failed to send email', { error: error.message, userId });
logger.warn('Invalid login attempt', { email, ip });
```

### ✅ Morgan pour les requêtes HTTP

```javascript
import morgan from 'morgan';
import logger from './config/logger.js';

// Stream pour Winston
const stream = {
  write: (message) => logger.http(message.trim())
};

// Middleware Morgan
app.use(morgan('combined', { stream }));
```

### ✅ Monitoring avec PM2

**Installation:**
```bash
npm install -g pm2
```

**Configuration:** `backend/ecosystem.config.js`
```javascript
module.exports = {
  apps: [{
    name: 'mhm-backend',
    script: 'src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
```

**Commandes:**
```bash
pm2 start ecosystem.config.js --env production
pm2 monit
pm2 logs
pm2 restart mhm-backend
```

---

## 6. Sécurité

### ✅ Amélioration de la sécurité

#### 6.1 Helmet Configuration Avancée

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

#### 6.2 Rate Limiting Avancé

```javascript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'redis';

const redisClient = Redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path
    });
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.'
    });
  }
});
```

#### 6.3 Protection CSRF

```bash
npm install csurf
```

```javascript
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

#### 6.4 Validation des Uploads

```javascript
import multer from 'multer';
import path from 'path';

const fileFilter = (req, file, cb) => {
  // Whitelist des extensions autorisées
  const allowedTypes = /jpeg|jpg|png|pdf|xlsx|csv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'));
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter
});
```

#### 6.5 Sanitization des Entrées

```bash
npm install xss-clean
```

```javascript
import xss from 'xss-clean';

app.use(xss());
```

#### 6.6 Secrets Management

Utiliser un gestionnaire de secrets pour la production:
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault
- Google Secret Manager

#### 6.7 Audit de Sécurité Régulier

```bash
# Vérifier les vulnérabilités
npm audit
npm audit fix

# Analyser avec Snyk
npx snyk test
```

---

## 7. Performance & Optimisation

### ✅ Compression

```bash
npm install compression
```

```javascript
import compression from 'compression';

app.use(compression());
```

### ✅ Caching avec Redis

```bash
npm install redis
```

**Configuration:** `backend/src/config/redis.js`
```javascript
import { createClient } from 'redis';
import logger from './logger.js';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('Redis reconnection failed after 10 attempts');
        return new Error('Redis reconnection failed');
      }
      return retries * 100;
    }
  }
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

await redisClient.connect();

export default redisClient;
```

**Middleware de Cache:**
```javascript
import redisClient from '../config/redis.js';

export const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Stocker la réponse originale
      res.sendResponse = res.json;
      res.json = (body) => {
        redisClient.setEx(key, duration, JSON.stringify(body));
        res.sendResponse(body);
      };

      next();
    } catch (error) {
      logger.error('Cache error:', error);
      next();
    }
  };
};
```

**Utilisation:**
```javascript
import { cacheMiddleware } from '../middleware/cache.js';

// Cache pendant 5 minutes
router.get('/stats', cacheMiddleware(300), getApplicationStats);
```

### ✅ Pagination Optimisée

```javascript
export const paginateResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
      const total = await model.countDocuments(req.filter || {});
      const results = await model
        .find(req.filter || {})
        .limit(limit)
        .skip(skip)
        .sort(req.sort || { createdAt: -1 });

      res.paginatedResults = {
        data: results,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit
        }
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
```

### ✅ Database Indexing

```javascript
// Dans vos modèles
memberSchema.index({ email: 1 }, { unique: true });
memberSchema.index({ firstName: 'text', lastName: 'text' });
memberSchema.index({ status: 1, membershipDate: -1 });
memberSchema.index({ 'qrCode.code': 1 }, { unique: true, sparse: true });
```

---

## 8. Qualité du Code

### ✅ ESLint

**Installation:**
```bash
npm install --save-dev eslint eslint-config-airbnb-base eslint-plugin-import
```

**Configuration:** `backend/.eslintrc.json`
```json
{
  "env": {
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": ["airbnb-base"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-console": "off",
    "import/extensions": ["error", "always"],
    "no-underscore-dangle": ["error", { "allow": ["_id"] }]
  }
}
```

### ✅ Prettier

**Installation:**
```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

**Configuration:** `backend/.prettierrc`
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

### ✅ Husky & Lint-Staged

**Installation:**
```bash
npm install --save-dev husky lint-staged
npx husky init
```

**Configuration:** `backend/package.json`
```json
{
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

**Hook:** `backend/.husky/pre-commit`
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

cd backend && npx lint-staged
```

### ✅ Scripts package.json

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "NODE_OPTIONS=--experimental-vm-modules jest",
    "test:watch": "NODE_OPTIONS=--experimental-vm-modules jest --watch",
    "test:coverage": "NODE_OPTIONS=--experimental-vm-modules jest --coverage",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "format": "prettier --write \"src/**/*.js\"",
    "prepare": "cd .. && husky install backend/.husky"
  }
}
```

---

## 9. Gestion des Bases de Données

### ✅ Migrations

Utiliser un outil de migration pour gérer les changements de schéma:

```bash
npm install migrate-mongo
```

**Configuration:** `backend/migrate-mongo-config.js`
```javascript
const config = {
  mongodb: {
    url: process.env.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'esm',
};

export default config;
```

**Créer une migration:**
```bash
npx migrate-mongo create add-member-number-index
```

### ✅ Backups Automatisés

**Script de backup:** `backend/scripts/backup-db.sh`
```bash
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups"
MONGO_URI=$MONGO_URI

mkdir -p $BACKUP_DIR

mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/backup_$DATE"

# Garder seulement les 7 derniers backups
ls -t $BACKUP_DIR | tail -n +8 | xargs -I {} rm -rf "$BACKUP_DIR/{}"

echo "Backup completed: backup_$DATE"
```

**Cron job:**
```bash
# Backup quotidien à 2h du matin
0 2 * * * /path/to/backup-db.sh
```

### ✅ Seeders pour les données de test

**Créer:** `backend/src/seeders/userSeeder.js`
```javascript
import User from '../models/User.js';
import connectDB from '../config/db.js';

const seedUsers = async () => {
  await connectDB();

  const users = [
    {
      name: 'Admin MHM',
      email: 'admin@mhm.mg',
      password: 'Admin123',
      role: 'admin'
    },
    {
      name: 'Test User',
      email: 'user@mhm.mg',
      password: 'User123',
      role: 'user'
    }
  ];

  await User.deleteMany({});
  await User.insertMany(users);

  console.log('✅ Users seeded successfully');
  process.exit(0);
};

seedUsers();
```

---

## 10. Environnements

### ✅ Fichiers d'environnement multiples

```
.env.development
.env.staging
.env.production
.env.test
```

### ✅ Validation des variables d'environnement

```bash
npm install envalid
```

**Configuration:** `backend/src/config/env.js`
```javascript
import { cleanEnv, str, port, email } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  PORT: port({ default: 5000 }),
  MONGO_URI: str(),
  JWT_SECRET: str(),
  JWT_EXPIRE: str({ default: '30d' }),
  SMTP_HOST: str(),
  SMTP_PORT: port(),
  SMTP_USER: str(),
  SMTP_PASS: str(),
  EMAIL_FROM: email(),
  EMAIL_FROM_NAME: str(),
  FRONTEND_URL: str()
});

export default env;
```

---

## 11. Documentation

### ✅ Créer un CONTRIBUTING.md

Documentation pour les contributeurs sur comment contribuer au projet.

### ✅ Créer un CHANGELOG.md

Historique des changements et versions.

### ✅ Améliorer le README.md

- Badges (build status, coverage, version)
- Screenshots
- Démo en ligne
- Guide d'installation détaillé
- Architecture du projet

---

## 12. Gestion des Erreurs

### ✅ Classe d'erreur personnalisée

```javascript
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
```

### ✅ Error Handler Amélioré

```javascript
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      stack: err.stack,
      details: err
    });
  }

  // Production - ne pas exposer les détails
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Erreur de programmation - log et message générique
  logger.error('ERROR 💥', err);
  return res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
};
```

---

## 📊 Priorités d'Implémentation

### 🔴 Priorité Haute (À faire immédiatement)
1. Tests unitaires et d'intégration
2. ESLint & Prettier
3. Logging (Winston)
4. Documentation API (Swagger)
5. Variables d'environnement validées

### 🟡 Priorité Moyenne (Court terme)
6. Docker & Docker Compose
7. CI/CD (GitHub Actions)
8. Caching (Redis)
9. Monitoring (PM2)
10. Migrations de base de données

### 🟢 Priorité Basse (Long terme)
11. Tests E2E
12. Backups automatisés
13. Protection CSRF
14. Audit de sécurité automatisé
15. Performance monitoring avancé

---

## 📚 Ressources Supplémentaires

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [12 Factor App](https://12factor.net/)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Document créé le:** 4 Novembre 2024
**Projet:** Madagasikara Hoan'ny Malagasy (MHM)
**Version:** 1.0.0
