import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { generateToken, getShared } from '../controllers/shareController';

const router = Router();

router.post('/:workspaceId/share', protect, generateToken);
router.get('/:shareToken', getShared);

export default router;
