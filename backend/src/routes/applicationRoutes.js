import express from 'express';
import {
  submitApplication,
  getPendingApplications,
  getApplication,
  approveApplication,
  rejectApplication,
  suspendMember,
  reactivateMember,
  getApplicationStats,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  membershipApplicationValidation,
  approveMembershipValidation,
  rejectMembershipValidation,
  validate,
} from '../validations/applicationValidation.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - dateOfBirth
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré de la candidature
 *         firstName:
 *           type: string
 *           description: Prénom du candidat
 *         lastName:
 *           type: string
 *           description: Nom du candidat
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date de naissance
 *         email:
 *           type: string
 *           format: email
 *           description: Email du candidat
 *         phone:
 *           type: string
 *           description: Téléphone du candidat
 *         address:
 *           type: object
 *           properties:
 *             full:
 *               type: string
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           default: pending
 *           description: Statut de la candidature
 *         applicationDate:
 *           type: string
 *           format: date-time
 *           description: Date de soumission
 *         approvedBy:
 *           type: string
 *           description: ID de l'utilisateur qui a approuvé
 *         approvalDate:
 *           type: string
 *           format: date-time
 *         rejectedBy:
 *           type: string
 *           description: ID de l'utilisateur qui a rejeté
 *         rejectionDate:
 *           type: string
 *           format: date-time
 *         rejectionReason:
 *           type: string
 *           description: Raison du rejet
 *         memberId:
 *           type: string
 *           description: ID du membre créé (si approuvé)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 507f1f77bcf86cd799439011
 *         firstName: Rabe
 *         lastName: Marie
 *         dateOfBirth: 1995-03-20
 *         email: rabe.marie@example.mg
 *         phone: +261 34 56 789 01
 *         status: pending
 *         applicationDate: 2024-11-04T10:00:00.000Z
 */

/**
 * Public Routes
 */

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Soumettre une candidature d'adhésion
 *     description: Permet à un candidat de soumettre une demande d'adhésion à l'association
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - dateOfBirth
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Rabe
 *               lastName:
 *                 type: string
 *                 example: Marie
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1995-03-20
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rabe.marie@example.mg
 *               phone:
 *                 type: string
 *                 example: +261 34 56 789 01
 *               address:
 *                 type: object
 *                 properties:
 *                   full:
 *                     type: string
 *                     example: Lot 456, Fianarantsoa 301
 *     responses:
 *       201:
 *         description: Candidature soumise avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Candidature soumise avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', validate(membershipApplicationValidation), submitApplication);

/**
 * Protected Routes (require authentication)
 */

/**
 * @swagger
 * /api/applications/stats:
 *   get:
 *     summary: Obtenir les statistiques des candidatures
 *     description: Récupère les statistiques sur les candidatures (total, en attente, approuvées, rejetées)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     pending:
 *                       type: number
 *                     approved:
 *                       type: number
 *                     rejected:
 *                       type: number
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/stats', protect, getApplicationStats);

/**
 * @swagger
 * /api/applications/pending:
 *   get:
 *     summary: Obtenir toutes les candidatures en attente
 *     description: Récupère la liste des candidatures qui n'ont pas encore été traitées
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des candidatures en attente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/pending', protect, getPendingApplications);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Obtenir une candidature par ID
 *     description: Récupère les détails d'une candidature spécifique
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la candidature
 *     responses:
 *       200:
 *         description: Candidature récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', protect, getApplication);

/**
 * @swagger
 * /api/applications/{id}/approve:
 *   put:
 *     summary: Approuver une candidature
 *     description: Approuve une candidature et crée un membre actif dans le système
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la candidature
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberType:
 *                 type: string
 *                 enum: [regular, student, honorary, family]
 *                 default: regular
 *                 description: Type d'adhésion à attribuer
 *     responses:
 *       200:
 *         description: Candidature approuvée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Candidature approuvée et membre créé avec succès
 *                 data:
 *                   type: object
 *                   properties:
 *                     application:
 *                       $ref: '#/components/schemas/Application'
 *                     member:
 *                       $ref: '#/components/schemas/Member'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id/approve', protect, validate(approveMembershipValidation), approveApplication);

/**
 * @swagger
 * /api/applications/{id}/reject:
 *   put:
 *     summary: Rejeter une candidature
 *     description: Rejette une candidature avec une raison
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la candidature
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectionReason
 *             properties:
 *               rejectionReason:
 *                 type: string
 *                 description: Raison du rejet de la candidature
 *                 example: Informations incomplètes
 *     responses:
 *       200:
 *         description: Candidature rejetée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Candidature rejetée avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id/reject', protect, validate(rejectMembershipValidation), rejectApplication);

/**
 * @swagger
 * /api/applications/{id}/suspend:
 *   put:
 *     summary: Suspendre un membre
 *     description: Suspend l'adhésion d'un membre actif
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du membre
 *     responses:
 *       200:
 *         description: Membre suspendu avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Membre suspendu avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Member'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id/suspend', protect, suspendMember);

/**
 * @swagger
 * /api/applications/{id}/reactivate:
 *   put:
 *     summary: Réactiver un membre
 *     description: Réactive l'adhésion d'un membre suspendu
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du membre
 *     responses:
 *       200:
 *         description: Membre réactivé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Membre réactivé avec succès
 *                 data:
 *                   $ref: '#/components/schemas/Member'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id/reactivate', protect, reactivateMember);

export default router;
