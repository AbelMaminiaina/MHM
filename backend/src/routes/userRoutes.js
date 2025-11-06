import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { registerValidation, loginValidation, validate } from '../validations/userValidation.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré de l'utilisateur
 *         name:
 *           type: string
 *           description: Nom complet de l'utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: Email de l'utilisateur (unique)
 *         password:
 *           type: string
 *           format: password
 *           description: Mot de passe hashé
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 *           description: Rôle de l'utilisateur
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 507f1f77bcf86cd799439011
 *         name: Jean Dupont
 *         email: jean.dupont@mhm.mg
 *         role: user
 *         createdAt: 2024-11-04T10:00:00.000Z
 *         updatedAt: 2024-11-04T10:00:00.000Z
 */

/**
 * Public Routes (no authentication required)
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Créer un nouveau compte utilisateur dans le système
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
 *                 description: Nom complet de l'utilisateur
 *                 example: Jean Dupont
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email unique
 *                 example: jean.dupont@mhm.mg
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Mot de passe (minimum 6 caractères)
 *                 example: Password123
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT token pour l'authentification
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/register', authLimiter, validate(registerValidation), registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion utilisateur
 *     description: Authentifier un utilisateur et obtenir un token JWT
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email de l'utilisateur
 *                 example: jean.dupont@mhm.mg
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe de l'utilisateur
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT token pour l'authentification
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Email ou mot de passe invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/login', authLimiter, validate(loginValidation), loginUser);

/**
 * Protected Routes (authentication required)
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Obtenir le profil de l'utilisateur connecté
 *     description: Récupère les informations du profil de l'utilisateur authentifié
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/me', protect, getUserProfile);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Mettre à jour le profil utilisateur
 *     description: Modifier les informations du profil de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom complet
 *                 example: Jean Martin
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nouvelle adresse email
 *                 example: jean.martin@mhm.mg
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Nouveau mot de passe (optionnel)
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/me', protect, updateUserProfile);

export default router;
