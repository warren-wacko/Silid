import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  createTask,
  updateTask,
  getTasks,
  deleteTask,
} from '../services/taskService';

export const create = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const workspaceId = req.params.workspaceId;
    const projectId = req.params.projectId;

    const { title, description, assigned_to, status, priority, due_date } =
      req.body;

    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    const task = await createTask(
      workspaceId as string,
      projectId as string,
      title,
      req.userId as string,
      description,
      assigned_to,
      status,
      priority,
      due_date
    );

    res.status(201).json({
      message: 'Task created successfully',
      task,
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
    const projectId = req.params.projectId;

    const tasks = await getTasks(
      projectId as string,
      workspaceId as string,
      req.userId as string
    );

    res.status(200).json({
      tasks,
    });
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
    const workspaceId = req.params.workspaceId;
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    const updates = req.body;

    if (
      !updates.title &&
      !updates.description &&
      !updates.status &&
      !updates.assigned_to &&
      !updates.priority &&
      !updates.due_date
    ) {
      res.status(400).json({ message: 'Nothing to update' });
      return;
    }

    const task = await updateTask(
      workspaceId as string,
      req.userId as string,
      projectId as string,
      taskId as string,
      updates
    );

    res.status(200).json({
      message: 'Task updated successfully',
      task,
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
    const workspaceId = req.params.workspaceId;
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    await deleteTask(
      workspaceId as string,
      req.userId as string,
      projectId as string,
      taskId as string
    );

    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};
