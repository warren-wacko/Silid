import Task, { ITask } from '../models/Task';
import verifyMembership from '../utils/verifyMembership';

export const createTask = async (
  workspaceId: string,
  projectId: string,
  title: string,
  userId: string,
  description?: string | undefined,
  assignedTo?: string | undefined
): Promise<ITask> => {
  await verifyMembership(workspaceId, userId);

  const task = await Task.create({
    workspace_id: workspaceId,
    project_id: projectId,
    created_by: userId,
    title,
    description,
    assigned_to: assignedTo,
  });

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
  }).sort({ createdAt: -1 });

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
};
