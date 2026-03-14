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

router.post('/join', protect, join);
router.post('/', protect, create);
router.get('/', protect, getAll);
router.get('/:id', protect, getById);
router.get('/:id/members', protect, getMembers);

export default router;
