import { Router } from 'express';
import {
  create,
  getAll,
  getById,
  join,
  getMembers,
} from '../controllers/workspaceController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/workspaces:
 *   post:
 *     summary: Create a new workspace
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, create);

/**
 * @swagger
 * /api/workspaces:
 *   get:
 *     summary: Get all workspaces for logged in user
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workspaces
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, getAll);

/**
 * @swagger
 * /api/workspaces/{id}:
 *   get:
 *     summary: Get workspace by ID
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace details
 *       404:
 *         description: Workspace not found
 */
router.get('/:id', protect, getById);

/**
 * @swagger
 * /api/workspaces/{id}/members:
 *   get:
 *     summary: Get workspace members
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of members
 *       401:
 *         description: Unauthorized
 */
router.get('/:id/members', protect, getMembers);

router.post('/join', protect, join);

export default router;
