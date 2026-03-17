import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  generateShareToken,
  getSharedWorkSpace,
} from '../services/shareService';

export const generateToken = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId;

    if (!workspaceId) {
      res.status(400).json({ message: 'Workspace does not exist' });
      return;
    }

    const share_token = await generateShareToken(
      workspaceId as string,
      req.userId as string
    );

    res.status(200).json({ share_token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const getShared = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const shareToken = req.params.shareToken;

    if (!shareToken) {
      res.status(400).json({ message: 'Share Token does not exist' });
      return;
    }

    const data = await getSharedWorkSpace(shareToken as string);

    res.status(200).json({ data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};
