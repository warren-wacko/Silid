import { Router } from 'express';
import { create, getAll, update, remove } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/:workspaceId/projects/:projectId/tasks', protect, create);
router.get('/:workspaceId/projects/:projectId/tasks', protect, getAll);
router.put('/:workspaceId/projects/:projectId/tasks/:taskId', protect, update);
router.delete(
  '/:workspaceId/projects/:projectId/tasks/:taskId',
  protect,
  remove
);

export default router;
