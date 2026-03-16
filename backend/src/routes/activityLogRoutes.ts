import { Router } from 'express';
import { getActivity } from '../controllers/activityLogController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/:workspaceId/activity', protect, getActivity);

export default router;
