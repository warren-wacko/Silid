import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  joinWorkspace,
} from '../services/workspaceService';

export const create = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: 'Workspace name is required' });
      return;
    }

    const workspace = await createWorkspace(name, req.userId as string);

    res.status(201).json({
      message: 'Workspace created successfully',
      workspace,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const getAll = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const workspaces = await getUserWorkspaces(req.userId as string);

    res.status(200).json({ workspaces });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const getById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const workspace = await getWorkspaceById(
      req.params.id as string,
      req.userId as string
    );

    res.status(200).json({ workspace });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const join = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { invite_token } = req.body;

    if (!invite_token) {
      res.status(400).json({ message: 'Invite token is required' });
      return;
    }

    const workspace = await joinWorkspace(invite_token, req.userId as string);

    res.status(200).json({
      message: 'Joined workspace successfully',
      workspace,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};
