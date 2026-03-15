import { Router } from 'express';
import {
  create,
  getAll,
  update,
  remove,
} from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/:workspaceId/projects', protect, create);
router.get('/:workspaceId/projects', protect, getAll);
router.put('/:workspaceId/projects/:projectId', protect, update);
router.delete('/:workspaceId/projects/:projectId', protect, remove);

export default router;
