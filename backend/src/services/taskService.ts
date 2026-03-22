import Task, { ITask } from '../models/Task';
import verifyMembership from '../utils/verifyMembership';
import { createActivityLog } from './activityLogService';
import {
  emitTaskCreated,
  emitTaskUpdated,
  emitTaskDeleted,
} from '../sockets/events';

export const createTask = async (
  workspaceId: string,
  projectId: string,
  title: string,
  userId: string,
  description?: string | undefined,
  assignedTo?: string | undefined,
  status?: string | undefined,
  priority?: string | undefined,
  due_date?: string | undefined
): Promise<ITask> => {
  await verifyMembership(workspaceId, userId);

  const task = await Task.create({
    workspace_id: workspaceId,
    project_id: projectId,
    created_by: userId,
    title,
    description,
    assigned_to: assignedTo,
    status,
    priority,
    due_date,
  });

  await createActivityLog({
    workspace_id: workspaceId,
    user_id: userId,
    action: 'task.created',
    entity_type: 'task',
    entity_id: task._id.toString(),
  });

  emitTaskCreated(workspaceId, task.toObject());

  return task;
};

export const getTasks = async (
  projectId: string,
  workspaceId: string,
  userId: string
): Promise<ITask[]> => {
  await verifyMembership(workspaceId, userId);

  const tasks = await Task.find({
    project_id: projectId,
    workspace_id: workspaceId,
  })
    .populate('assigned_to', 'name email') // ← add this!
    .sort({ createdAt: -1 });

  return tasks;
};

export const updateTask = async (
  workspaceId: string,
  userId: string,
  projectId: string,
  taskId: string,
  updates: {
    title?: string;
    description?: string;
    assigned_to?: string;
    status?: string;
    priority?: string;
    due_date?: string;
  }
): Promise<ITask> => {
  await verifyMembership(workspaceId, userId);

  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
      project_id: projectId,
      workspace_id: workspaceId,
    },
    updates,
    { new: true }
  );

  if (!task) {
    throw new Error('Task not found');
  }

  await createActivityLog({
    workspace_id: workspaceId,
    user_id: userId,
    action: 'task.updated',
    entity_type: 'task',
    entity_id: taskId,
  });

  emitTaskUpdated(workspaceId, task.toObject());

  return task;
};

export const deleteTask = async (
  workspaceId: string,
  userId: string,
  projectId: string,
  taskId: string
): Promise<void> => {
  await verifyMembership(workspaceId, userId);

  const task = await Task.findOneAndDelete({
    _id: taskId,
    workspace_id: workspaceId,
    project_id: projectId,
  });

  if (!task) {
    throw new Error('Task not found');
  }

  await createActivityLog({
    workspace_id: workspaceId,
    user_id: userId,
    action: 'task.deleted',
    entity_type: 'task',
    entity_id: taskId,
  });

  emitTaskDeleted(workspaceId, taskId);
};
