import express from 'express';
import {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  importMembers,
  exportMembers,
  getMemberStats,
} from '../controllers/memberController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadExcel, handleUploadError } from '../middleware/uploadMiddleware.js';
import {
  createMemberValidation,
  updateMemberValidation,
  validate,
} from '../validations/memberValidation.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - dateOfBirth
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré du membre
 *         firstName:
 *           type: string
 *           maxLength: 50
 *           description: Prénom du membre
 *         lastName:
 *           type: string
 *           maxLength: 50
 *           description: Nom du membre
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date de naissance
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             postalCode:
 *               type: string
 *             country:
 *               type: string
 *               default: France
 *             full:
 *               type: string
 *         phone:
 *           type: string
 *           description: Numéro de téléphone
 *         email:
 *           type: string
 *           format: email
 *           description: Email du membre
 *         membershipDate:
 *           type: string
 *           format: date-time
 *           description: Date d'adhésion
 *         status:
 *           type: string
 *           enum: [pending, active, inactive, rejected, suspended]
 *           default: pending
 *           description: Statut du membre
 *         memberType:
 *           type: string
 *           enum: [regular, student, honorary, family]
 *           default: regular
 *           description: Type d'adhésion
 *         emergencyContact:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             phone:
 *               type: string
 *             relationship:
 *               type: string
 *         occupation:
 *           type: string
 *           description: Profession
 *         interests:
 *           type: string
 *           description: Centres d'intérêt
 *         notes:
 *           type: string
 *           description: Notes additionnelles
 *         qrCode:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *             imageUrl:
 *               type: string
 *             generatedAt:
 *               type: string
 *               format: date-time
 *         memberNumber:
 *           type: string
 *           description: Numéro de membre unique
 *         fullName:
 *           type: string
 *           description: Nom complet (virtuel)
 *         age:
 *           type: number
 *           description: Âge calculé (virtuel)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 507f1f77bcf86cd799439011
 *         firstName: Rakoto
 *         lastName: Jean
 *         dateOfBirth: 1990-05-15
 *         email: rakoto.jean@example.mg
 *         phone: +261 34 12 345 67
 *         status: active
 *         memberType: regular
 *         memberNumber: MHM-2024-001
 */

/**
 * All member routes are protected (require authentication)
 */

/**
 * @swagger
 * /api/members/stats:
 *   get:
 *     summary: Obtenir les statistiques des membres
 *     description: Récupère les statistiques globales sur les membres (nombre total, par statut, etc.)
 *     tags: [Members]
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
 *                     active:
 *                       type: number
 *                     pending:
 *                       type: number
 *                     suspended:
 *                       type: number
 *                     byType:
 *                       type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/stats', protect, getMemberStats);

/**
 * @swagger
 * /api/members/export:
 *   get:
 *     summary: Exporter les membres en Excel
 *     description: Exporte la liste complète des membres au format Excel
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fichier Excel généré avec succès
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/export', protect, exportMembers);

/**
 * @swagger
 * /api/members/import:
 *   post:
 *     summary: Importer des membres depuis Excel
 *     description: Importe une liste de membres à partir d'un fichier Excel
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Fichier Excel (.xlsx) contenant les données des membres
 *     responses:
 *       200:
 *         description: Membres importés avec succès
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     imported:
 *                       type: number
 *                     failed:
 *                       type: number
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/import',
  protect,
  uploadExcel,
  handleUploadError,
  importMembers
);

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Obtenir la liste des membres
 *     description: Récupère tous les membres avec pagination et filtres optionnels
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, active, inactive, rejected, suspended]
 *         description: Filtrer par statut
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par nom ou prénom
 *     responses:
 *       200:
 *         description: Liste des membres récupérée avec succès
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
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Member'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   post:
 *     summary: Créer un nouveau membre
 *     description: Ajouter un nouveau membre dans le système
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Rakoto
 *               lastName:
 *                 type: string
 *                 example: Jean
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1990-05-15
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rakoto.jean@example.mg
 *               phone:
 *                 type: string
 *                 example: +261 34 12 345 67
 *               address:
 *                 type: object
 *                 properties:
 *                   full:
 *                     type: string
 *                     example: Lot 123, Antananarivo 101
 *               memberType:
 *                 type: string
 *                 enum: [regular, student, honorary, family]
 *                 default: regular
 *     responses:
 *       201:
 *         description: Membre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Member'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router
  .route('/')
  .get(getMembers) // Public - accessible sans authentification
  .post(protect, validate(createMemberValidation), createMember);

/**
 * @swagger
 * /api/members/{id}:
 *   get:
 *     summary: Obtenir un membre par ID
 *     description: Récupère les détails d'un membre spécifique
 *     tags: [Members]
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
 *         description: Membre récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Member'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   put:
 *     summary: Mettre à jour un membre
 *     description: Modifier les informations d'un membre existant
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du membre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, active, inactive, rejected, suspended]
 *     responses:
 *       200:
 *         description: Membre mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Member'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   delete:
 *     summary: Supprimer un membre
 *     description: Supprimer définitivement un membre du système
 *     tags: [Members]
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
 *         description: Membre supprimé avec succès
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
 *                   example: Membre supprimé avec succès
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router
  .route('/:id')
  .get(protect, getMember)
  .put(protect, validate(updateMemberValidation), updateMember)
  .delete(protect, deleteMember);

export default router;
