import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getAnalytics } from '../controllers/analyticsController';

const router = Router();

/**
 * @swagger
 * /api/workspaces/{workspaceId}/analytics:
 *   get:
 *     summary: Get dashboard analytics for the user
 *     tags: [Workspace Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dashboard Analytics
 *       401:
 *         description: Unauthorized
 */
router.get('/:workspaceId/analytics', protect, getAnalytics);

export default router;
