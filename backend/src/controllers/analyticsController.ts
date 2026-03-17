import { AuthRequest } from '../middleware/authMiddleware';
import { Response } from 'express';
import { getWorkspaceAnalytics } from '../services/analyticsService';
import verifyMembership from '../utils/verifyMembership';

export const getAnalytics = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId;

    await verifyMembership(workspaceId as string, req.userId as string);

    const analytics = await getWorkspaceAnalytics(workspaceId as string);

    res.status(200).json({ analytics });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};
