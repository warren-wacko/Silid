import Project, { IProject } from '../models/Project';
import verifyMembership from '../utils/verifyMembership';
import { createActivityLog } from './activityLogService';
export const createProject = async (
  workspaceId: string,
  title: string,
  description: string | undefined,
  userId: string
): Promise<IProject> => {
  await verifyMembership(workspaceId, userId);

  const project = await Project.create({
    workspace_id: workspaceId,
    title,
    description,
    created_by: userId,
  });

  await createActivityLog({
    workspace_id: workspaceId,
    user_id: userId,
    action: 'project.created',
    entity_type: 'project',
    entity_id: project._id.toString(),
  });

  return project;
};

export const getProjects = async (
  workspaceId: string,
  userId: string
): Promise<IProject[]> => {
  await verifyMembership(workspaceId, userId);

  const projects = await Project.find({ workspace_id: workspaceId }).sort({
    createdAt: -1,
  });

  return projects;
};

export const updateProject = async (
  projectId: string,
  workspaceId: string,
  userId: string,
  updates: { title?: string; description?: string }
): Promise<IProject> => {
  await verifyMembership(workspaceId, userId);

  const project = await Project.findOneAndUpdate(
    { _id: projectId, workspace_id: workspaceId },
    updates,
    { new: true }
  );

  if (!project) {
    throw new Error('Project not found');
  }

  await createActivityLog({
    workspace_id: workspaceId,
    user_id: userId,
    action: 'project.updated',
    entity_type: 'project',
    entity_id: project._id.toString(),
  });

  return project;
};

export const deleteProject = async (
  projectId: string,
  workspaceId: string,
  userId: string
): Promise<void> => {
  await verifyMembership(workspaceId, userId);

  const project = await Project.findOneAndDelete({
    _id: projectId,
    workspace_id: workspaceId,
  });

  if (!project) {
    throw new Error('Project not found');
  }

  await createActivityLog({
    workspace_id: workspaceId,
    user_id: userId,
    action: 'project.deleted',
    entity_type: 'project',
    entity_id: project._id.toString(),
  });
};
