import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  createProject,
  updateProject,
  getProject,
  deleteProject,
} from '../services/projectService';

export const create = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description } = req.body;
    const workspaceId = req.params.workspaceId;

    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    const project = await createProject(
      workspaceId as string,
      title,
      description,
      req.userId as string
    );

    res.status(201).json({
      message: 'Project created successfully',
      project,
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
    const workspaceId = req.params.workspaceId;

    const projects = await getProject(
      workspaceId as string,
      req.userId as string
    );

    res.status(200).json({ projects });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const update = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const projectId = req.params.projectId;
    const workspaceId = req.params.workspaceId;

    const updates = req.body;

    if (!updates.title && !updates.description) {
      res.status(400).json({ message: 'Nothing to update' });
      return;
    }

    const project = await updateProject(
      projectId as string,
      workspaceId as string,
      req.userId as string,
      updates
    );

    res.status(200).json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const remove = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const projectId = req.params.projectId;
    const workspaceId = req.params.workspaceId;

    await deleteProject(
      projectId as string,
      workspaceId as string,
      req.userId as string
    );

    res.status(200).json({
      message: 'Project successfully deleted',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};
