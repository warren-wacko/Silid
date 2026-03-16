import { AuthRequest } from '../middleware/authMiddleware';
import { Response } from 'express';
import { getWorkspaceActivity } from '../services/activityLogService';

export const getActivity = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const logs = await getWorkspaceActivity(workspaceId as string, limit);
    res.status(200).json({ logs });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};
