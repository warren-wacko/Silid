import { Router } from 'express';
import { create, getAll, update, remove } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/workspaces/{workspaceId}/projects/{projectId}/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                  type: string
 *               assigned_to:
 *                  type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/:workspaceId/projects/:projectId/tasks', protect, create);

/**
 * @swagger
 * /api/workspaces/{workspaceId}/projects/{projectId}/tasks:
 *   get:
 *     summary: Get all tasks for the project the user belongs in
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks
 *       401:
 *         description: Unauthorized
 */
router.get('/:workspaceId/projects/:projectId/tasks', protect, getAll);

/**
 * @swagger
 * /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                  type: string
 *               assigned_to:
 *                  type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/:workspaceId/projects/:projectId/tasks/:taskId', protect, update);

/**
 * @swagger
 * /api/workspaces/{workspaceId}/projects/{projectId}/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/:workspaceId/projects/:projectId/tasks/:taskId',
  protect,
  remove
);

export default router;
